import { NextRequest, NextResponse } from 'next/server'
import { verifyCashfreeWebhookSignature, detectCashfreePaymentType } from '@/lib/cashfree'
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

    // 4. Classify payment payload using the multi-type detector
    const detected = detectCashfreePaymentType(payload)
    console.log(`[Cashfree Webhook] Classified event: ${eventType} as [${detected.category.toUpperCase()}] for Order: ${detected.orderId}, Amount: ₹${detected.amount}`)

    const isSuccess =
      eventType === 'PAYMENT_SUCCESS_WEBHOOK' ||
      eventType === 'ORDER_PAID_SUCCESS' ||
      detected.paymentStatus === 'SUCCESS'

    // 5. Handle non-success events (e.g. failed, cancelled, dropped) gracefully without fulfilling
    if (!isSuccess) {
      console.log(`[Cashfree Webhook] Non-success status [${detected.paymentStatus}] for order: ${detected.orderId}. Acknowledged without fulfillment.`)
      return NextResponse.json({ status: 'OK', message: `Event ${eventType} acknowledged with non-success status` })
    }

    // 6. Fulfill according to payment type with strict idempotency
    const fulfillmentResult = await fulfillPaidPremiumOrder({
      orderId: detected.orderId,
      cfPaymentId: detected.cfPaymentId,
      paymentMethod: detected.paymentMethod,
      amount: detected.amount,
      bankReference: detected.bankReference,
      rawPayload: payload,
    })

    if (!fulfillmentResult.success) {
      console.error('[Cashfree Webhook] Fulfillment error:', fulfillmentResult.error)
      return NextResponse.json({ error: fulfillmentResult.error }, { status: 500 })
    }

    console.log(`[Cashfree Webhook] Successfully processed [${detected.category.toUpperCase()}] for order ${detected.orderId}`)
    return NextResponse.json({
      status: 'OK',
      received: true,
      category: detected.category,
      orderId: detected.orderId,
    })
  } catch (error: any) {
    console.error('[Cashfree Webhook] Error processing webhook:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
