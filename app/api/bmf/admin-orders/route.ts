import { NextResponse } from 'next/server'
import { getSupabaseAdminClient, getSupabasePublicAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const admin = getSupabaseAdminClient()
    const publicAdmin = getSupabasePublicAdminClient()

    let rawOrders: any[] = []
    let fetchError: any = null

    // 1. Fetch Orders from bmf_orders
    const { data: schemaOrders, error: schemaErr } = await admin
      .from('bmf_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (!schemaErr && schemaOrders) {
      rawOrders = schemaOrders
    } else {
      fetchError = schemaErr
      const { data: pubOrders, error: pubErr } = await publicAdmin
        .from('bmf_orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (!pubErr && pubOrders) {
        rawOrders = pubOrders
      } else if (pubErr) {
        fetchError = pubErr
      }
    }

    if (fetchError && rawOrders.length === 0) {
      console.warn('[API /api/bmf/admin-orders] Error fetching orders:', fetchError.message)
    }

    // 2. Fetch all products to join titles and asset links
    let productsMap: Record<string, any> = {}
    try {
      const { data: prods } = await admin.from('bmf_products').select('id, slug, title, category, format_badge, asset_url')
      if (prods && Array.isArray(prods)) {
        prods.forEach((p) => {
          if (p.id) productsMap[p.id] = p
          if (p.slug) productsMap[p.slug] = p
        })
      }
    } catch (_) {
      try {
        const { data: pubProds } = await publicAdmin.from('bmf_products').select('id, slug, title, category, format_badge, asset_url')
        if (pubProds && Array.isArray(pubProds)) {
          pubProds.forEach((p) => {
            if (p.id) productsMap[p.id] = p
            if (p.slug) productsMap[p.slug] = p
          })
        }
      } catch (_) {}
    }

    // 3. Map orders with resolved details
    const orders = rawOrders.map((ord) => {
      const matchedProd = ord.product_id ? productsMap[ord.product_id] : null
      const productTitle = ord.metadata?.product_title || matchedProd?.title || (ord.order_type === 'membership' ? 'BMF Premium Membership' : 'Digital Asset')
      const productCategory = matchedProd?.category || (ord.order_type === 'membership' ? 'Membership' : 'Resource')
      const assetUrl = ord.metadata?.asset_url || matchedProd?.asset_url || null

      return {
        id: ord.id,
        orderId: ord.order_id,
        orderType: ord.order_type || 'membership',
        productId: ord.product_id || null,
        productTitle,
        productCategory,
        assetUrl,
        planTier: ord.plan_tier,
        amount: Number(ord.amount || 0),
        currency: ord.currency || 'INR',
        status: ord.status || 'created',
        paymentGateway: ord.payment_gateway || 'cashfree',
        paymentSessionId: ord.payment_session_id || null,
        customerName: ord.customer_name || 'BMF Founder',
        customerEmail: ord.customer_email || 'guest@customer.com',
        customerPhone: ord.customer_phone || null,
        userId: ord.user_id || null,
        metadata: ord.metadata || {},
        createdAt: ord.created_at,
        updatedAt: ord.updated_at,
      }
    })

    // 4. Compute Live Key Performance Indicators
    let totalGrossRevenue = 0
    let totalPaidOrders = 0
    let totalPendingOrders = 0
    let totalProductOrders = 0
    let totalMembershipOrders = 0
    const uniqueEmails = new Set<string>()

    orders.forEach((o) => {
      if (o.status === 'paid') {
        totalGrossRevenue += o.amount
        totalPaidOrders++
      } else if (o.status === 'created' || o.status === 'pending') {
        totalPendingOrders++
      }

      if (o.orderType === 'product') {
        totalProductOrders++
      } else {
        totalMembershipOrders++
      }

      if (o.customerEmail && o.customerEmail !== 'guest@customer.com') {
        uniqueEmails.add(o.customerEmail.toLowerCase())
      }
    })

    const metrics = {
      totalGrossRevenue,
      totalOrders: orders.length,
      totalPaidOrders,
      totalPendingOrders,
      totalProductOrders,
      totalMembershipOrders,
      uniqueCustomers: uniqueEmails.size,
    }

    return NextResponse.json({
      success: true,
      metrics,
      orders,
    })
  } catch (err: any) {
    console.error('[API /api/bmf/admin-orders] Unexpected error:', err)
    return NextResponse.json(
      { success: false, error: err.message, metrics: null, orders: [] },
      { status: 500 }
    )
  }
}
