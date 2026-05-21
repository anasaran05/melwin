import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...inquiryData } = body

    // Validate type
    if (!type || !['brand_collab', 'career_advice', 'consultation'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid inquiry type' },
        { status: 400 }
      )
    }

    // Log inquiry (since no Supabase integration)
    console.log(`[API] ${type} inquiry received:`, {
      ...inquiryData,
      timestamp: new Date().toISOString(),
    })

    // Send Discord webhook notification (if configured)
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (discordWebhookUrl) {
      try {
        let title = ''
        let fields: any[] = []

        if (type === 'brand_collab') {
          title = '🤝 Brand Partnership Inquiry'
          fields = [
            { name: 'Company', value: inquiryData.company_name, inline: true },
            { name: 'Contact Email', value: inquiryData.contact_email, inline: true },
            { name: 'Platform URL', value: inquiryData.platform_url, inline: false },
            { name: 'Budget Tier', value: inquiryData.budget_tier, inline: true },
            { name: 'Objective', value: inquiryData.objective, inline: false },
          ]
        } else if (type === 'career_advice') {
          title = '💼 Career Repositioning Request'
          fields = [
            { name: 'Name', value: inquiryData.name, inline: true },
            { name: 'Email', value: inquiryData.email, inline: true },
            { name: 'Background', value: inquiryData.background, inline: true },
            { name: 'Situation', value: inquiryData.message, inline: false },
          ]
        }

        await fetch(discordWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [
              {
                title,
                color: 13223852, // Gold color
                fields,
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
      message: 'Inquiry submitted successfully',
    })
  } catch (error) {
    console.error('[API] Inquiry submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}
