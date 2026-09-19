import { NextRequest, NextResponse } from 'next/server'
import { getCashfreeOrder, getCashfreeOrderPayments } from '@/lib/cashfree'
import { fulfillPaidPremiumOrder } from '@/lib/supabase/bmf-orders'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // 1. Fetch current order status directly from Cashfree PG
    const cfOrder = await getCashfreeOrder(orderId)
    console.log(`[Verify Order] Order status for ${orderId}:`, cfOrder.order_status)

    // 2. Also fetch payments to get transaction details
    const payments = await getCashfreeOrderPayments(orderId)
    const successfulPayment = payments.find((p) => p.payment_status === 'SUCCESS')

    const isPaid = cfOrder.order_status === 'PAID' || !!successfulPayment

    if (isPaid) {
      // 3. Fulfill the order and activate Premium status in DB
      const result = await fulfillPaidPremiumOrder({
        orderId,
        cfPaymentId: successfulPayment?.cf_payment_id || `cf_${Date.now()}`,
        paymentMethod: JSON.stringify(successfulPayment?.payment_method || {}),
        amount: successfulPayment?.payment_amount || cfOrder.order_amount || 799,
        bankReference: successfulPayment?.bank_reference,
        rawPayload: { order: cfOrder, payments },
      })

      return NextResponse.json({
        success: true,
        status: 'PAID',
        isPremium: (result as any).purchasedProduct ? false : true,
        purchasedProduct: (result as any).purchasedProduct || null,
        orderId,
        upgradedUser: result.upgradedUser,
      })
    }

    return NextResponse.json({
      success: false,
      status: cfOrder.order_status,
      isPremium: false,
      message: 'Payment is not completed yet',
    })
  } catch (error: any) {
    console.error('[Verify Order] Verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify Cashfree order' },
      { status: 500 }
    )
  }
}
