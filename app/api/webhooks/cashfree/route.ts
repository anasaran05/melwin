import { NextRequest, NextResponse } from 'next/server'
import { verifyCashfreeWebhookSignature } from '@/lib/cashfree'
import { fulfillPaidPremiumOrder } from '@/lib/supabase/bmf-orders'

export const dynamic = 'force-dynamic'

/**
 * GET handler: Allows healthcheck and reachability checks to confirm endpoint is active
 */
export async function GET() {
  return NextResponse.json(
    { status: 'OK', message: 'Cashfree webhook endpoint is active' },
    { status: 200 }
  )
}

/**
 * HEAD handler: Responds to reachability checks with 200 OK
 */
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature =
      request.headers.get('x-webhook-signature') ||
      request.headers.get('x-cf-signature') ||
      request.headers.get('signature') ||
      ''
    const timestamp =
      request.headers.get('x-webhook-timestamp') ||
      request.headers.get('x-cf-signature-timestamp') ||
      request.headers.get('timestamp') ||
      ''

    // 1. Acknowledge empty bodies or ping checks immediately with 200 OK
    if (!rawBody || rawBody.trim() === '' || rawBody === '{}') {
      return NextResponse.json(
        { status: 'OK', message: 'Cashfree webhook endpoint active' },
        { status: 200 }
      )
    }

    let payload: any = {}
    try {
      payload = JSON.parse(rawBody)
    } catch {
      // Non-JSON ping
      return NextResponse.json(
        { status: 'OK', message: 'Ping received' },
        { status: 200 }
      )
    }

    const eventType = String(payload.type || payload.event || '').toUpperCase()
    const data = payload.data || {}
    const order = data.order || {}
    const payment = data.payment || {}
    const orderId = order.order_id || payload.order_id

    // 2. Acknowledge Cashfree dashboard test pings immediately with 200 OK
    const isTestPing =
      eventType === 'TEST' ||
      eventType.includes('TEST') ||
      payload.test === true ||
      payload.data?.message?.toLowerCase().includes('test') ||
      rawBody.toLowerCase().includes('"test"') ||
      !orderId

    if (isTestPing) {
      console.log('[Cashfree Webhook] Test event or reachability check acknowledged:', eventType || 'TEST')
      return NextResponse.json(
        { status: 'OK', message: 'Test webhook received successfully' },
        { status: 200 }
      )
    }

    // 3. Verify Cashfree Webhook Signature for real transactions
    const isValid = verifyCashfreeWebhookSignature(rawBody, timestamp, signature)

    if (!isValid) {
      console.error('[Cashfree Webhook] Invalid signature detected. Timestamp:', timestamp)
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const cfPaymentId = payment.cf_payment_id || String(payment.payment_id || '')
    const paymentStatus = payment.payment_status || (eventType.includes('SUCCESS') ? 'SUCCESS' : '')
    const amount = payment.payment_amount || order.order_amount || 799

    console.log(`[Cashfree Webhook] Received ${eventType} for order: ${orderId}, status: ${paymentStatus}`)

    // 4. Check for Payment Success and Fulfill
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

      console.log(`[Cashfree Webhook] Successfully processed and fulfilled: ${orderId}`)
    }

    return NextResponse.json({ status: 'OK', received: true })
  } catch (error: any) {
    console.error('[Cashfree Webhook] Error processing webhook:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
