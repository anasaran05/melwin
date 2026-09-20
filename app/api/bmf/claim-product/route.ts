import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient, getSupabasePublicAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * GET: Fetch purchases for a user by user_id or email
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')

    if (!userId && !email) {
      return NextResponse.json({ success: true, purchases: [] })
    }

    const admin = getSupabaseAdminClient()
    const publicAdmin = getSupabasePublicAdminClient()

    let rawPurchases: any[] = []
    let queryError: any = null

    // Helper to query purchases table without complex embedded join
    const fetchPurchases = async (client: any) => {
      let q = client
        .from('bmf_product_purchases')
        .select('*')
        .eq('access_status', 'active')

      if (userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        if (email) {
          q = q.or(`user_id.eq.${userId},customer_email.eq.${email}`)
        } else {
          q = q.eq('user_id', userId)
        }
      } else if (email) {
        q = q.eq('customer_email', email)
      }

      return await q.order('created_at', { ascending: false })
    }

    // Try schema client first
    const { data: adminData, error: adminErr } = await fetchPurchases(admin)
    if (!adminErr && adminData) {
      rawPurchases = adminData
    } else {
      queryError = adminErr
      // Fallback to public client
      const { data: pubData, error: pubErr } = await fetchPurchases(publicAdmin)
      if (!pubErr && pubData) {
        rawPurchases = pubData
      } else if (pubErr) {
        queryError = pubErr
      }
    }

    if (queryError && rawPurchases.length === 0) {
      console.warn('[Get Purchases] Query notice:', queryError)
    }

    // Attach product details for each purchase
    if (rawPurchases.length > 0) {
      const productIds = Array.from(new Set(rawPurchases.map((p) => p.product_id).filter(Boolean)))
      
      let productsMap = new Map<string, any>()
      if (productIds.length > 0) {
        let { data: productsList } = await admin
          .from('bmf_products')
          .select('*')
          .in('id', productIds)

        if (!productsList || productsList.length === 0) {
          const { data: pubProdList } = await publicAdmin
            .from('bmf_products')
            .select('*')
            .in('id', productIds)
          productsList = pubProdList
        }

        if (productsList) {
          productsList.forEach((prod) => productsMap.set(prod.id, prod))
        }
      }

      const purchasesWithProduct = rawPurchases.map((p) => ({
        ...p,
        product: productsMap.get(p.product_id) || null,
      }))

      return NextResponse.json({ success: true, purchases: purchasesWithProduct })
    }

    return NextResponse.json({ success: true, purchases: [] })
  } catch (err: any) {
    console.error('[Get Purchases] Exception:', err)
    return NextResponse.json({ success: false, error: err.message, purchases: [] })
  }
}

/**
 * POST: Claim or record a purchase in bmf_club.bmf_product_purchases
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      productId,
      productSlug,
      userId,
      customerEmail,
      amountPaid = 0,
      discountPercent = 100,
      orderId,
    } = body

    if (!productId && !productSlug) {
      return NextResponse.json({ success: false, error: 'Product ID or Slug is required' }, { status: 400 })
    }

    const email = customerEmail || 'founder@bmf.club'
    const admin = getSupabaseAdminClient()
    const publicAdmin = getSupabasePublicAdminClient()

    // 1. Resolve product UUID from bmf_products
    let resolvedProductId: string | null = null
    let productDetails: any = null

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId || '')

    // Find product by id or slug
    if (isUuid) {
      const { data: byId } = await admin.from('bmf_products').select('*').eq('id', productId).maybeSingle()
      if (byId) {
        resolvedProductId = byId.id
        productDetails = byId
      }
    }

    if (!resolvedProductId) {
      const targetSlug = productSlug || productId
      const { data: bySlug } = await admin.from('bmf_products').select('*').eq('slug', targetSlug).maybeSingle()
      if (bySlug) {
        resolvedProductId = bySlug.id
        productDetails = bySlug
      } else {
        const { data: pubBySlug } = await publicAdmin.from('bmf_products').select('*').eq('slug', targetSlug).maybeSingle()
        if (pubBySlug) {
          resolvedProductId = pubBySlug.id
          productDetails = pubBySlug
        }
      }
    }

    // If product is still not found in database, insert it into bmf_products
    if (!resolvedProductId) {
      try {
        const insertProduct = {
          slug: productSlug || productId,
          title: body.title || productSlug || 'BMF Digital Asset',
          description: body.description || 'Exclusive founder blueprint',
          category: body.category || 'Growth',
          product_type: body.product_type || 'pdf',
          format_badge: body.format_badge || 'PDF Guide',
          regular_price: Number(amountPaid) || 0,
          premium_discount_percent: 50,
          asset_url: body.asset_url || body.downloadUrl || null,
          is_published: true,
        }

        const { data: newProd, error: newProdErr } = await admin
          .from('bmf_products')
          .insert(insertProduct)
          .select()
          .maybeSingle()

        if (newProd) {
          resolvedProductId = newProd.id
          productDetails = newProd
        } else {
          console.warn('[Claim Product POST] auto-insert product error:', newProdErr)
        }
      } catch (insertErr) {
        console.warn('[Claim Product POST] auto-insert product exception:', insertErr)
      }
    }

    if (!resolvedProductId) {
      return NextResponse.json(
        { success: false, error: 'Could not resolve product in database' },
        { status: 400 }
      )
    }

    // 2. Check if purchase already exists to prevent duplicate inserts and backfill order_id if missing
    let existingQuery = admin
      .from('bmf_product_purchases')
      .select('*')
      .eq('product_id', resolvedProductId)

    if (userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      existingQuery = existingQuery.or(`user_id.eq.${userId},customer_email.eq.${email}`)
    } else {
      existingQuery = existingQuery.eq('customer_email', email)
    }

    const { data: existingPurchase } = await existingQuery.maybeSingle()

    if (existingPurchase) {
      if (orderId && !existingPurchase.order_id) {
        await admin
          .from('bmf_product_purchases')
          .update({
            order_id: orderId,
            amount_paid: Number(amountPaid) || 0,
            discount_applied_percent: Number(discountPercent) || 0,
          })
          .eq('id', existingPurchase.id)
      }
      return NextResponse.json({
        success: true,
        purchase: { ...existingPurchase, order_id: orderId || existingPurchase.order_id, product: productDetails },
        message: 'Purchase already recorded in database',
      })
    }

    // 4. Insert purchase record into bmf_product_purchases
    const purchasePayload: any = {
      customer_email: email,
      product_id: resolvedProductId,
      amount_paid: Number(amountPaid) || 0,
      discount_applied_percent: Number(discountPercent) || 0,
      access_status: 'active',
    }

    if (userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      purchasePayload.user_id = userId
    }
    if (orderId) {
      purchasePayload.order_id = orderId
    }

    console.log('[Claim Product POST] Inserting purchase:', purchasePayload)

    let { data: insertedData, error: insertError } = await admin
      .from('bmf_product_purchases')
      .insert(purchasePayload)
      .select('*')
      .maybeSingle()

    if (insertError) {
      console.warn('[Claim Product POST] Admin insert error, trying public view:', insertError)
      const { data: pubInserted, error: pubInsertErr } = await publicAdmin
        .from('bmf_product_purchases')
        .insert(purchasePayload)
        .select('*')
        .maybeSingle()

      if (pubInsertErr) {
        console.error('[Claim Product POST] Public insert also failed:', pubInsertErr)
        return NextResponse.json(
          { success: false, error: pubInsertErr.message || insertError.message },
          { status: 500 }
        )
      }
      insertedData = pubInserted
    }

    console.log('[Claim Product POST] Successfully inserted purchase record:', insertedData)

    return NextResponse.json({
      success: true,
      purchase: { ...insertedData, product: productDetails },
      message: 'Product claimed and saved to database successfully',
    })
  } catch (err: any) {
    console.error('[Claim Product POST] Fatal Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
