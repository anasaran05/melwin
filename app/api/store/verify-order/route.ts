import { NextRequest, NextResponse } from 'next/server'
import { getCashfreeOrder, getCashfreeOrderPayments } from '@/lib/cashfree'
import { fulfillPublicStoreOrder } from '@/lib/supabase/store'
import { getSupabasePublicAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // 1. Check local order status first (fast-path for free claims & already fulfilled orders)
    const publicAdmin = getSupabasePublicAdminClient()
    const { data: storeOrder } = await publicAdmin
      .from('store_orders')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle()

    if (storeOrder && (storeOrder.status === 'paid' || storeOrder.payment_gateway === 'free_claim')) {
      return NextResponse.json({
        success: true,
        orderId,
        status: 'PAID',
        amount: storeOrder.order_amount,
        customerEmail: storeOrder.customer_email,
      })
    }

    // 2. Fetch order details from Cashfree directly
    const cfOrder = await getCashfreeOrder(orderId)
    const isPaid = cfOrder.order_status === 'PAID'

    if (!isPaid) {
      return NextResponse.json({
        success: false,
        status: cfOrder.order_status,
        message: `Order status is currently ${cfOrder.order_status}.`,
      })
    }

    // 2. Fetch payments to get transaction reference
    let cfPaymentId: string | undefined
    let paymentMethod: string | undefined
    let bankReference: string | undefined

    try {
      const payments = await getCashfreeOrderPayments(orderId)
      const successfulPayment = payments.find((p) => p.payment_status === 'SUCCESS') || payments[0]
      if (successfulPayment) {
        cfPaymentId = String(successfulPayment.cf_payment_id)
        paymentMethod = successfulPayment.payment_method ? JSON.stringify(successfulPayment.payment_method) : undefined
        bankReference = successfulPayment.bank_reference
      }
    } catch (_) {}

    // 3. Fulfill public store order idempotently
    const fulfillment = await fulfillPublicStoreOrder({
      orderId,
      cfPaymentId,
      paymentMethod,
      amount: cfOrder.order_amount,
      bankReference,
    })

    if (!fulfillment.success) {
      console.warn('[Verify Order API] Fulfillment warning:', fulfillment.error)
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: 'PAID',
      amount: cfOrder.order_amount,
      customerEmail: cfOrder.customer_details?.customer_email,
    })
  } catch (error: any) {
    console.error('[API /api/store/verify-order] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify store order.' },
      { status: 500 }
    )
  }
}
