import { NextResponse } from 'next/server'
import { getSupabasePublicAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const publicAdmin = getSupabasePublicAdminClient()

    let orders: any[] = []

    // 1. Fetch from store_orders
    const { data: storeOrders, error: storeErr } = await publicAdmin
      .from('store_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (!storeErr && storeOrders) {
      orders = storeOrders
    }

    // 2. Fetch product orders from bmf_orders as fallback / legacy supplement
    const { data: bmfOrders } = await publicAdmin
      .from('bmf_orders')
      .select('*')
      .in('order_type', ['product', 'store_product'])
      .order('created_at', { ascending: false })

    if (bmfOrders && bmfOrders.length > 0) {
      const existingIds = new Set(orders.map((o) => o.order_id))
      bmfOrders.forEach((bo) => {
        if (!existingIds.has(bo.order_id)) {
          orders.push({
            id: bo.id,
            order_id: bo.order_id,
            user_id: bo.user_id,
            customer_name: bo.customer_name || 'Customer',
            customer_email: bo.customer_email || 'guest@customer.com',
            customer_phone: bo.customer_phone || null,
            order_amount: Number(bo.amount || 0),
            currency: bo.currency || 'INR',
            status: bo.status || 'paid',
            channel: 'bmf_club',
            created_at: bo.created_at,
            items: bo.metadata?.product_title ? [{ title: bo.metadata.product_title }] : [],
          })
        }
      })
    }

    // Sort combined orders by created_at descending
    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // Metrics
    const paidOrders = orders.filter((o) => o.status === 'paid')
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.order_amount) || 0), 0)

    return NextResponse.json({
      success: true,
      totalRevenue,
      orderCount: orders.length,
      paidOrderCount: paidOrders.length,
      orders,
    })
  } catch (error: any) {
    console.error('[API /api/store/admin-orders] Error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch admin orders' },
      { status: 500 }
    )
  }
}
