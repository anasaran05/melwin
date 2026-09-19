import { NextRequest, NextResponse } from 'next/server'
import { verifyCashfreeWebhookSignature } from '@/lib/cashfree'
import { fulfillPaidPremiumOrder } from '@/lib/supabase/bmf-orders'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-webhook-signature') || ''
    const timestamp = request.headers.get('x-webhook-timestamp') || ''

    // 1. Verify Cashfree Webhook Signature
    const isValid = verifyCashfreeWebhookSignature(rawBody, timestamp, signature)

    if (!isValid) {
      console.error('[Cashfree Webhook] Invalid signature detected. Timestamp:', timestamp)
      // Allow bypass in local development if specifically configured, else reject
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
      }
    }

    // 2. Parse Event Payload
    const payload = JSON.parse(rawBody)
    const eventType = payload.type || payload.event || ''
    const data = payload.data || {}
    const order = data.order || {}
    const payment = data.payment || {}

    const orderId = order.order_id || payload.order_id
    const cfPaymentId = payment.cf_payment_id || String(payment.payment_id || '')
    const paymentStatus = payment.payment_status || (eventType.includes('SUCCESS') ? 'SUCCESS' : '')
    const amount = payment.payment_amount || order.order_amount || 799

    console.log(`[Cashfree Webhook] Received ${eventType} for order: ${orderId}, status: ${paymentStatus}`)

    // 3. Check for Payment Success
    const isSuccess =
      eventType === 'PAYMENT_SUCCESS_WEBHOOK' ||
      eventType === 'ORDER_PAID_SUCCESS' ||
      paymentStatus === 'SUCCESS'

    if (isSuccess && orderId) {
      const fulfillmentResult = await fulfillPaidPremiumOrder({
        orderId,
        cfPaymentId: cfPaymentId || `cf_${Date.now()}`,
        paymentMethod: JSON.stringify(payment.payment_method || {}),
        amount,
        bankReference: payment.bank_reference,
        rawPayload: payload,
      })

      if (!fulfillmentResult.success) {
        console.error('[Cashfree Webhook] Order fulfillment error:', fulfillmentResult.error)
        return NextResponse.json({ error: fulfillmentResult.error }, { status: 500 })
      }

      console.log(`[Cashfree Webhook] Successfully processed and upgraded: ${orderId}`)
    }

    return NextResponse.json({ status: 'ok', received: true })
  } catch (error: any) {
    console.error('[Cashfree Webhook] Error processing webhook:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
