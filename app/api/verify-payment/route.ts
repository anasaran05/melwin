import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      email,
      phone,
      slot_preference,
      intake_notes,
    } = await request.json()

    // Verify signature
    const key_secret = process.env.RAZORPAY_KEY_SECRET || ''
    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto.createHmac('sha256', key_secret).update(body).digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid signature', success: false },
        { status: 400 }
      )
    }

    // Log booking (since no Supabase integration)
    console.log('[API] Booking confirmed:', {
      razorpay_payment_id,
      razorpay_order_id,
      name,
      email,
      phone,
      slot_preference,
      intake_notes,
      timestamp: new Date().toISOString(),
    })

    // Send Discord webhook notification (if configured)
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (discordWebhookUrl) {
      try {
        await fetch(discordWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [
              {
                title: '🗓️ New Booking',
                color: 13223852, // Gold color
                fields: [
                  { name: 'Name', value: name, inline: true },
                  { name: 'Email', value: email, inline: true },
                  { name: 'Phone', value: phone, inline: true },
                  { name: 'Preferred Slot', value: slot_preference, inline: false },
                  { name: 'Payment ID', value: razorpay_payment_id, inline: true },
                  { name: 'Amount', value: '₹1,299', inline: true },
                  { name: 'Intake Notes', value: intake_notes || 'N/A', inline: false },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        })
      } catch (webhookError) {
        console.error('[API] Discord webhook failed:', webhookError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and booking confirmed',
    })
  } catch (error) {
    console.error('[API] Payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment', success: false },
      { status: 500 }
    )
  }
}
