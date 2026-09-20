import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCashfreeOrder } from '@/lib/cashfree'
import { saveBmfOrder, checkExistingActivePurchase, findRecentPendingOrder } from '@/lib/supabase/bmf-orders'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      orderType = 'membership',
      productId,
      productTitle: initialProductTitle,
      productPrice: initialProductPrice,
      planTier = 'premium',
      billingCycle = 'annual',
      redirectUrl,
    } = body

    // 1. Identify currently authenticated user if session exists
    let userId: string | null = null
    let userEmail: string | null = null
    let isPremium = false

    const supabase = await createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        userId = user.id
        userEmail = user.email || null

        // Check if member holds active premium
        const { data: member } = await supabase
          .from('bmf_members')
          .select('role, is_featured, full_name, membership_tier, membership_status')
          .eq('user_id', user.id)
          .maybeSingle()

        if (
          (member && member.membership_tier === 'premium' && member.membership_status === 'active') ||
          member?.role === 'admin' ||
          member?.is_featured === true ||
          member?.full_name?.toLowerCase().includes('melwin')
        ) {
          isPremium = true
        }
      }
    } catch (authErr) {
      console.warn('[API Create Order] Session check skipped or guest user:', authErr)
    }

    const email = customerEmail || userEmail
    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required to proceed with checkout.' },
        { status: 400 }
      )
    }

    let orderAmount = 799.00
    let orderNote = 'BMF Club Premium Membership (1 Year Access)'
    let finalProductTitle = initialProductTitle || 'BMF Digital Asset'
    const randomSuffix = Math.random().toString(36).substring(2, 7)
    const timestamp = Math.floor(Date.now() / 1000)
    let orderId = `bmf_prem_${timestamp}_${randomSuffix}`

    if (orderType === 'product') {
      orderId = `bmf_prod_${timestamp}_${randomSuffix}`

      // Fetch product details from DB if productId is provided
      if (productId) {
        const { data: product } = await supabase
          .from('bmf_products')
          .select('*')
          .eq('id', productId)
          .maybeSingle()

        if (product) {
          finalProductTitle = product.title
          const reg = Number(product.regular_price ?? product.price_inr ?? 1999)
          orderAmount = isNaN(reg) || reg <= 0 ? 1999 : reg
        } else if (initialProductPrice) {
          const parsed = Number(initialProductPrice)
          orderAmount = isNaN(parsed) || parsed <= 0 ? 1999 : parsed
        } else {
          orderAmount = 1999.00
        }
      } else if (initialProductPrice) {
        const parsed = Number(initialProductPrice)
        orderAmount = isNaN(parsed) || parsed <= 0 ? 1999 : parsed
      } else {
        orderAmount = 1999.00
      }

      orderNote = `BMF Store: ${finalProductTitle}`
    } else {
      orderAmount = 799.00
      orderNote = 'BMF Club Premium Membership (1 Year Access)'
    }

    // 2. Prevent redundant purchase if user already owns this active product
    if (orderType === 'product' && productId) {
      const purchaseCheck = await checkExistingActivePurchase({
        userId,
        customerEmail: email,
        productId,
      })

      if (purchaseCheck.alreadyPurchased) {
        return NextResponse.json({
          success: true,
          alreadyPurchased: true,
          orderId: purchaseCheck.orderId || null,
          message: 'Asset already purchased and active.',
        })
      }
    }

    // 3. Deduplication: Check if there is an active pending order created within the last 15 minutes
    const existingRecentOrder = await findRecentPendingOrder({
      userId,
      customerEmail: email,
      orderType: orderType === 'product' ? 'product' : 'membership',
      productId: productId || null,
      amount: orderAmount,
      withinMinutes: 15,
    })

    if (existingRecentOrder && existingRecentOrder.payment_session_id) {
      console.log(`[API Create Order] Reusing 15-minute active pending order: ${existingRecentOrder.order_id}`)
      return NextResponse.json({
        success: true,
        reused: true,
        orderId: existingRecentOrder.order_id,
        paymentSessionId: existingRecentOrder.payment_session_id,
        amount: existingRecentOrder.amount,
        currency: existingRecentOrder.currency || 'INR',
        environment: process.env.CASHFREE_ENVIRONMENT || process.env.NEXT_PUBLIC_CASHFREE_ENV || 'production',
      })
    }

    const appOrigin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin || 'https://melwin.in'
    const returnUrl = redirectUrl || (
      orderType === 'product'
        ? `${appOrigin}/bmf-club/dashboard?tab=purchases&order_id={order_id}&status=success&product_id=${productId || ''}`
        : `${appOrigin}/bmf-club/pricing?order_id={order_id}&status=success`
    )
    const notifyUrl = `${appOrigin}/api/webhooks/cashfree`

    // 4. Call Cashfree PG Order API
    const cashfreeOrder = await createCashfreeOrder({
      orderId,
      orderAmount,
      orderCurrency: 'INR',
      customerDetails: {
        customer_id: userId ? `usr_${userId.replace(/-/g, '').slice(0, 16)}` : `gst_${timestamp}_${randomSuffix}`,
        customer_name: customerName || 'BMF Club Founder',
        customer_email: email,
        customer_phone: customerPhone || '9999999999',
      },
      returnUrl,
      notifyUrl,
      orderNote,
      metadata: {
        order_type: orderType,
        product_id: productId || '',
        product_title: finalProductTitle,
        plan: planTier,
        billing_cycle: billingCycle,
        user_id: userId || '',
        is_premium_discount: isPremium ? 'true' : 'false',
      },
    })

    if (!cashfreeOrder.payment_session_id) {
      throw new Error('Cashfree did not return a valid payment_session_id.')
    }

    // 3. Store order in database
    await saveBmfOrder({
      order_id: orderId,
      user_id: userId,
      plan_tier: 'premium',
      billing_cycle: 'annual',
      amount: orderAmount,
      currency: 'INR',
      payment_gateway: 'cashfree',
      payment_session_id: cashfreeOrder.payment_session_id,
      status: 'created',
      customer_name: customerName || 'BMF Club Founder',
      customer_email: email,
      customer_phone: customerPhone,
      order_type: orderType === 'product' ? 'product' : 'membership',
      product_id: productId || null,
      metadata: {
        cf_order_id: cashfreeOrder.cf_order_id,
        product_title: finalProductTitle,
        is_premium_discount: isPremium,
      },
    })

    return NextResponse.json({
      success: true,
      orderId: orderId,
      paymentSessionId: cashfreeOrder.payment_session_id,
      amount: orderAmount,
      currency: 'INR',
      environment: process.env.CASHFREE_ENVIRONMENT || process.env.NEXT_PUBLIC_CASHFREE_ENV || 'production',
    })
  } catch (error: any) {
    console.error('[API Create Order] Failed:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to initiate Cashfree payment session',
      },
      { status: 500 }
    )
  }
}
