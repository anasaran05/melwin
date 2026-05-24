import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...inquiryData } = body

    // Validate type
    if (!type || !['brand_collab', 'career_advice', 'consultation', 'consultation_booking'].includes(type)) {
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

    // Insert into Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (supabaseUrl && supabaseKey) {
      const { createClient } = require('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      let mappedName = ''
      let mappedEmail = ''
      let mappedMessage = ''

      if (type === 'brand_collab') {
        mappedName = inquiryData.company_name || 'Unknown Company'
        mappedEmail = inquiryData.contact_email || ''
        mappedMessage = `Objective: ${inquiryData.objective || 'N/A'} | Budget: ${inquiryData.budget_tier || 'N/A'} | URL: ${inquiryData.platform_url || 'N/A'} | City: ${inquiryData.city || 'N/A'} | State: ${inquiryData.state || 'N/A'}`
      } else if (type === 'career_advice') {
        mappedName = inquiryData.name || 'Unknown'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Background: ${inquiryData.background || 'N/A'} | Situation: ${inquiryData.message || 'N/A'} | City: ${inquiryData.city || 'N/A'} | State: ${inquiryData.state || 'N/A'}`
      } else if (type === 'consultation_booking') {
        const typeMap: Record<string, string> = { general: 'General', professional: 'Professional', consult_melwin: 'Consult with Melwin' }
        const cType = typeMap[inquiryData.consultation_type] || inquiryData.consultation_type || 'N/A'
        mappedName = inquiryData.name || 'Unknown'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Type: ${cType} | Phone: ${inquiryData.phone || 'N/A'} | Slot: ${inquiryData.slot_preference || 'N/A'} | Notes: ${inquiryData.intake_notes || 'N/A'} | City: ${inquiryData.city || 'N/A'} | State: ${inquiryData.state || 'N/A'}`
      } else {
        mappedName = inquiryData.name || 'Unknown'
        mappedEmail = inquiryData.email || ''
        mappedMessage = inquiryData.message || ''
      }

      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([
          {
            name: mappedName,
            email: mappedEmail,
            type: type,
            message: mappedMessage,
            status: 'new'
          }
        ])

      if (supabaseError) {
        console.error('[API] Supabase insert error:', supabaseError)
      } else {
        console.log('[API] Inserted lead into Supabase')
      }
    }

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
            { name: 'City', value: inquiryData.city || 'N/A', inline: true },
            { name: 'State', value: inquiryData.state || 'N/A', inline: true },
          ]
        } else if (type === 'career_advice') {
          title = '💼 Career Repositioning Request'
          fields = [
            { name: 'Name', value: inquiryData.name, inline: true },
            { name: 'Email', value: inquiryData.email, inline: true },
            { name: 'Background', value: inquiryData.background, inline: true },
            { name: 'Situation', value: inquiryData.message, inline: false },
            { name: 'City', value: inquiryData.city || 'N/A', inline: true },
            { name: 'State', value: inquiryData.state || 'N/A', inline: true },
          ]
        } else if (type === 'consultation_booking') {
          const typeMap: Record<string, string> = { general: 'General', professional: 'Professional', consult_melwin: 'Consult with Melwin' }
          title = '🗓️ Consultation Booking Request'
          fields = [
            { name: 'Name', value: inquiryData.name, inline: true },
            { name: 'Email', value: inquiryData.email, inline: true },
            { name: 'Phone', value: inquiryData.phone, inline: true },
            { name: 'Type', value: typeMap[inquiryData.consultation_type] || inquiryData.consultation_type || 'N/A', inline: true },
            { name: 'Preferred Slot', value: inquiryData.slot_preference, inline: true },
            { name: 'Notes', value: inquiryData.intake_notes || 'N/A', inline: false },
            { name: 'City', value: inquiryData.city || 'N/A', inline: true },
            { name: 'State', value: inquiryData.state || 'N/A', inline: true },
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

    // Send Telegram notification
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID

    if (telegramBotToken && telegramChatId) {
      try {
        let text = ''
        
        if (type === 'brand_collab') {
          text = `🤝 <b>Brand Partnership Inquiry</b>\n\n` +
                 `<b>Company:</b> ${inquiryData.company_name}\n` +
                 `<b>Contact Email:</b> ${inquiryData.contact_email}\n` +
                 `<b>Platform URL:</b> ${inquiryData.platform_url || 'N/A'}\n` +
                 `<b>Budget Tier:</b> ${inquiryData.budget_tier || 'N/A'}\n` +
                 `<b>Objective:</b> ${inquiryData.objective || 'N/A'}\n` +
                 `<b>City:</b> ${inquiryData.city || 'N/A'}\n` +
                 `<b>State:</b> ${inquiryData.state || 'N/A'}`
        } else if (type === 'career_advice') {
          text = `💼 <b>Career Repositioning Request</b>\n\n` +
                 `<b>Name:</b> ${inquiryData.name}\n` +
                 `<b>Email:</b> ${inquiryData.email}\n` +
                 `<b>Background:</b> ${inquiryData.background || 'N/A'}\n` +
                 `<b>Situation:</b> ${inquiryData.message || 'N/A'}\n` +
                 `<b>City:</b> ${inquiryData.city || 'N/A'}\n` +
                 `<b>State:</b> ${inquiryData.state || 'N/A'}`
        } else if (type === 'consultation') {
           text = `🗓️ <b>Consultation Inquiry</b>\n\n` +
                 `<b>Name:</b> ${inquiryData.name || 'N/A'}\n` +
                 `<b>Email:</b> ${inquiryData.email || 'N/A'}\n` +
                 `<b>Message:</b> ${inquiryData.message || 'N/A'}`
        } else if (type === 'consultation_booking') {
           const typeMap: Record<string, string> = { general: 'General', professional: 'Professional', consult_melwin: 'Consult with Melwin' }
           const cType = typeMap[inquiryData.consultation_type] || inquiryData.consultation_type || 'N/A'
           text = `🗓️ <b>Consultation Booking Request</b>\n\n` +
                  `<b>Name:</b> ${inquiryData.name || 'N/A'}\n` +
                  `<b>Email:</b> ${inquiryData.email || 'N/A'}\n` +
                  `<b>Phone:</b> ${inquiryData.phone || 'N/A'}\n` +
                  `<b>Type:</b> ${cType}\n` +
                  `<b>Preferred Slot:</b> ${inquiryData.slot_preference || 'N/A'}\n` +
                  `<b>Notes:</b> ${inquiryData.intake_notes || 'N/A'}\n` +
                  `<b>City:</b> ${inquiryData.city || 'N/A'}\n` +
                  `<b>State:</b> ${inquiryData.state || 'N/A'}`
        }

        if (text) {
          const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: text,
              parse_mode: 'HTML'
            }),
          })
          
          if (!res.ok) {
             console.error('[API] Telegram error:', await res.text())
          }
        }
      } catch (telegramError) {
        console.error('[API] Telegram notification failed:', telegramError)
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
