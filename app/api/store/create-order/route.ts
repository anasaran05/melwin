import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabasePublicAdminClient } from '@/lib/supabase/admin'
import { createCashfreeOrder } from '@/lib/cashfree'
import { fulfillPublicStoreOrder, fetchStoreProductBySlug } from '@/lib/supabase/store'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      items: rawItems,
      productId,
      returnUrl,
    } = body

    if (!customerEmail || !customerEmail.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required for checkout.' },
        { status: 400 }
      )
    }

    const email = customerEmail.toLowerCase().trim()
    const name = customerName?.trim() || 'Store Customer'
    const phone = customerPhone?.trim() || '9999999999'

    // 1. Identify currently authenticated user & check BMF membership discount
    let userId: string | null = null
    let isBmfMember = false

    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        userId = user.id
        // Check if member in bmf_members
        const { data: member } = await supabase
          .from('bmf_members')
          .select('membership_tier, membership_status, role')
          .eq('user_id', user.id)
          .maybeSingle()

        if (
          member?.role === 'admin' ||
          (member?.membership_tier === 'premium' && member?.membership_status === 'active')
        ) {
          isBmfMember = true
        }
      }
    } catch (_) {}

    const publicAdmin = getSupabasePublicAdminClient()

    // 2. Resolve items and calculate real amount
    let itemsToProcess: Array<{ id: string; slug: string; title: string; price: number }> = []

    if (Array.isArray(rawItems) && rawItems.length > 0) {
      itemsToProcess = rawItems
    } else if (productId) {
      // Lookup single product by ID or slug
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId)
      let query = publicAdmin.from('store_products').select('*')
      if (isUuid) {
        query = query.eq('id', productId)
      } else {
        query = query.eq('slug', productId)
      }

      const { data: prod } = await query.maybeSingle()
      if (prod) {
        let finalPrice = Number(prod.sale_price ?? prod.regular_price ?? 999)
        if (isBmfMember && prod.bmf_discount_percent > 0) {
          finalPrice = Math.round(finalPrice * (1 - prod.bmf_discount_percent / 100))
        }
        if (prod.is_free_public || (isBmfMember && prod.is_free_for_bmf)) {
          finalPrice = 0
        }

        itemsToProcess.push({
          id: prod.id,
          slug: prod.slug,
          title: prod.title,
          price: finalPrice,
        })
      } else {
        itemsToProcess.push({
          id: productId,
          slug: productId,
          title: 'Digital Asset',
          price: 999,
        })
      }
    }

    if (itemsToProcess.length === 0) {
      return NextResponse.json({ error: 'No items selected for checkout.' }, { status: 400 })
    }

    const totalAmount = itemsToProcess.reduce((sum, item) => sum + (Number(item.price) || 0), 0)

    // 3. Free Asset Claim (₹0) - Instant unlock without creating orders or sending emails
    if (totalAmount === 0) {
      for (const item of itemsToProcess) {
        let resolvedId = item.id
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id)) {
          const { data: foundProd } = await publicAdmin
            .from('store_products')
            .select('id')
            .eq('slug', item.slug || item.id)
            .maybeSingle()
          if (foundProd?.id) resolvedId = foundProd.id
        }

        const { data: existing } = await publicAdmin
          .from('store_purchases')
          .select('id')
          .eq('product_id', resolvedId)
          .eq('customer_email', email)
          .maybeSingle()

        if (existing) {
          await publicAdmin
            .from('store_purchases')
            .update({
              access_status: 'active',
              amount_paid: 0,
            })
            .eq('id', existing.id)
        } else {
          await publicAdmin.from('store_purchases').insert({
            user_id: userId,
            customer_email: email,
            product_id: resolvedId,
            order_id: null,
            amount_paid: 0,
            access_status: 'active',
            channel: 'public_store',
          })
        }
      }

      return NextResponse.json({
        success: true,
        isFree: true,
        message: 'Asset unlocked! Redirecting to your library...',
        redirectUrl: '/store/purchases?status=claimed',
      })
    }

    // 4. Paid Orders Only - Generate Real Order ID & Order Note
    const randomSuffix = Math.random().toString(36).substring(2, 7)
    const timestamp = Math.floor(Date.now() / 1000)
    const orderId = `store_ord_${timestamp}_${randomSuffix}`

    const orderItemsJson = itemsToProcess.map((item) => ({
      product_id: item.id,
      slug: item.slug,
      title: item.title,
      price: item.price,
    }))

    const firstProductTitle = itemsToProcess[0]?.title || 'Digital Asset'

    // 4. Paid Orders Note
    const orderNote =
      itemsToProcess.length > 1
        ? `Store Bundle (${itemsToProcess.length} Items): ${firstProductTitle}`
        : `Store Asset: ${firstProductTitle}`

    // 5. Initiate Cashfree Order
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://melwin.in'
    const effectiveReturnUrl =
      returnUrl ||
      `${appUrl}/store/purchases?order_id={order_id}&status=success`

    const cfResponse = await createCashfreeOrder({
      orderId,
      orderAmount: totalAmount,
      orderCurrency: 'INR',
      customerDetails: {
        customer_id: userId || `store_cust_${email.replace(/[^a-z0-9]/gi, '_')}`,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
      },
      orderNote,
      returnUrl: effectiveReturnUrl,
      notifyUrl: `${appUrl}/api/webhooks/cashfree`,
      metadata: {
        order_type: 'store_product',
        source: 'public_store',
        product_ids: itemsToProcess.map((i) => i.id).join(','),
        product_title: firstProductTitle,
        customer_email: email,
        user_id: userId || '',
      },
    })

    // Record order in database
    await publicAdmin.from('store_orders').insert({
      order_id: orderId,
      user_id: userId,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      order_amount: totalAmount,
      currency: 'INR',
      payment_gateway: 'cashfree',
      payment_session_id: cfResponse.payment_session_id,
      status: 'created',
      items: orderItemsJson,
      channel: 'public_store',
      is_bmf_member: isBmfMember,
      metadata: {
        item_count: itemsToProcess.length,
        first_product_title: firstProductTitle,
      },
    })

    return NextResponse.json({
      success: true,
      orderId: cfResponse.order_id,
      paymentSessionId: cfResponse.payment_session_id,
      amount: totalAmount,
      currency: 'INR',
    })
  } catch (error: any) {
    console.error('[API /api/store/create-order] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment session.' },
      { status: 500 }
    )
  }
}
