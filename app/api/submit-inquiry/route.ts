import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...inquiryData } = body

    // Validate type
    if (!type || !['brand_collab', 'career_advice', 'consultation', 'consultation_booking', 'invite_melwin', 'agency_lead', 'atom_se', 'founders_club', 'bmf_club', 'funding_grants', 'digital_growth', 'business_services', 'talent_profile', 'talent_job_post', 'startup_academy', 'export_import'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid inquiry type' },
        { status: 400 }
      )
    }

    // Log inquiry
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
        mappedMessage = `Objective: ${inquiryData.objective || 'N/A'} | Budget: ${inquiryData.budget_tier || 'N/A'} | URL: ${inquiryData.platform_url || 'N/A'} | Mobile: ${inquiryData.mobile_number || 'N/A'} | City: ${inquiryData.city || 'N/A'} | State: ${inquiryData.state || 'N/A'}`
      } else if (type === 'career_advice') {
        const sessionTierMap: Record<string, string> = { consult_melwin: 'Consult with Melwin', regular: 'Regular Consultation' }
        const sTier = sessionTierMap[inquiryData.session_tier] || inquiryData.session_tier || 'N/A'
        mappedName = inquiryData.name || 'Unknown'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Session Tier: ${sTier} | Background: ${inquiryData.background || 'N/A'} | Situation: ${inquiryData.message || 'N/A'} | Mobile: ${inquiryData.mobile_number || 'N/A'} | City: ${inquiryData.city || 'N/A'} | State: ${inquiryData.state || 'N/A'}`
      } else if (type === 'consultation_booking') {
        const typeMap: Record<string, string> = { general: 'General', professional: 'Professional', consult_melwin: 'Consult with Melwin' }
        const cType = typeMap[inquiryData.consultation_type] || inquiryData.consultation_type || 'N/A'
        mappedName = inquiryData.name || 'Unknown'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Type: ${cType} | Phone: ${inquiryData.phone || 'N/A'} | Slot: ${inquiryData.slot_preference || 'N/A'} | Notes: ${inquiryData.intake_notes || 'N/A'} | City: ${inquiryData.city || 'N/A'} | State: ${inquiryData.state || 'N/A'}`
      } else if (type === 'invite_melwin') {
        mappedName = inquiryData.name || 'Unknown'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Institution/Event: ${inquiryData.institution_event || 'N/A'} | Mobile: ${inquiryData.mobile_number || 'N/A'} | Details: ${inquiryData.message || 'N/A'}`
      } else if (type === 'agency_lead') {
        mappedName = inquiryData.name || 'Unknown'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Plan: ${inquiryData.plan || 'N/A'} | Phone: ${inquiryData.phone || 'N/A'} | Company: ${inquiryData.company || 'N/A'} | Notes: ${inquiryData.message || 'N/A'}`
      } else if (type === 'atom_se') {
        mappedName = inquiryData.name || 'Unknown'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Service: ${inquiryData.service || 'N/A'} | Phone: ${inquiryData.phone || 'N/A'} | Company: ${inquiryData.company || 'N/A'} | Notes: ${inquiryData.message || 'N/A'}`
      } else if (type === 'founders_club' || type === 'bmf_club') {
        mappedName = inquiryData.name || 'Unknown'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Venture/Company: ${inquiryData.company || 'N/A'} | Stage: ${inquiryData.stage || 'N/A'} | Phone: ${inquiryData.phone || 'N/A'} | City: ${inquiryData.city || 'N/A'} | Bio/Links: ${inquiryData.message || 'N/A'}`
      } else if (type === 'funding_grants') {
        mappedName = inquiryData.name || 'Unknown'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Company: ${inquiryData.company || 'N/A'} | Track: ${inquiryData.track || 'N/A'} | Sector: ${inquiryData.sector || 'N/A'} | Deck/URL: ${inquiryData.deck_url || 'N/A'} | Phone: ${inquiryData.phone || 'N/A'} | Summary: ${inquiryData.message || 'N/A'}`
      } else if (type === 'digital_growth') {
        mappedName = inquiryData.name || 'Unknown'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Service: ${inquiryData.service || 'N/A'} | Brand: ${inquiryData.company || 'N/A'} | Budget: ${inquiryData.budget || 'N/A'} | Phone: ${inquiryData.phone || 'N/A'} | Goals: ${inquiryData.message || 'N/A'}`
      } else if (type === 'business_services') {
        mappedName = inquiryData.name || 'Unknown'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Service Needed: ${inquiryData.service || 'N/A'} | Business Name: ${inquiryData.company || 'N/A'} | City: ${inquiryData.city || 'N/A'} | Phone: ${inquiryData.phone || 'N/A'} | Details: ${inquiryData.message || 'N/A'}`
      } else if (type === 'talent_profile') {
        mappedName = inquiryData.name || 'Unknown Candidate'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Role: ${inquiryData.role || 'N/A'} | Experience: ${inquiryData.experience || 'N/A'} | Work Preference: ${inquiryData.work_type || 'N/A'} | Portfolio/Resume: ${inquiryData.portfolio_url || 'N/A'} | Skills: ${inquiryData.skills || 'N/A'} | Phone: ${inquiryData.phone || 'N/A'} | Bio: ${inquiryData.message || 'N/A'}`
      } else if (type === 'talent_job_post') {
        mappedName = inquiryData.name || 'Hiring Manager'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Company: ${inquiryData.company || 'N/A'} | Role: ${inquiryData.job_title || 'N/A'} | Type: ${inquiryData.job_type || 'N/A'} | Location: ${inquiryData.location || 'N/A'} | Compensation: ${inquiryData.salary || 'N/A'} | Phone: ${inquiryData.phone || 'N/A'} | Job Details: ${inquiryData.message || 'N/A'}`
      } else if (type === 'startup_academy') {
        mappedName = inquiryData.name || 'Student/Learner'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Track: ${inquiryData.track || 'N/A'} | Current Stage: ${inquiryData.stage || 'N/A'} | Phone: ${inquiryData.phone || 'N/A'} | Background: ${inquiryData.message || 'N/A'}`
      } else if (type === 'export_import') {
        mappedName = inquiryData.name || 'Exporter/Importer'
        mappedEmail = inquiryData.email || ''
        mappedMessage = `Product Category: ${inquiryData.product || 'N/A'} | Operation: ${inquiryData.operation_type || 'N/A'} | Destination/Source Country: ${inquiryData.country || 'N/A'} | IEC Code Status: ${inquiryData.iec_status || 'N/A'} | Phone: ${inquiryData.phone || 'N/A'} | Details: ${inquiryData.message || 'N/A'}`
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

    // Send Discord webhook notification
    const discordWebhookUrl = type === 'atom_se'
      ? (process.env.ATOM_SE_DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1542076272929415168/tub8-8WiueReq7UNLM5POx6AER62trQ6v-VwtBX6Hoxht5YUBhahopYcFfF7APuDWv6U')
      : process.env.DISCORD_WEBHOOK_URL

    if (discordWebhookUrl) {
      try {
        let title = ''
        let fields: any[] = []

        if (type === 'brand_collab') {
          title = '🤝 Brand Partnership Inquiry'
          fields = [
            { name: 'Company', value: inquiryData.company_name || 'N/A', inline: true },
            { name: 'Contact Email', value: inquiryData.contact_email || 'N/A', inline: true },
            { name: 'Mobile Number', value: inquiryData.mobile_number || 'N/A', inline: true },
            { name: 'Platform URL', value: inquiryData.platform_url || 'N/A', inline: false },
            { name: 'Budget Tier', value: inquiryData.budget_tier || 'N/A', inline: true },
            { name: 'Objective', value: inquiryData.objective || 'N/A', inline: false },
            { name: 'City', value: inquiryData.city || 'N/A', inline: true },
            { name: 'State', value: inquiryData.state || 'N/A', inline: true },
          ]
        } else if (type === 'career_advice') {
          const sessionTierMap: Record<string, string> = { consult_melwin: 'Consult with Melwin (₹2,999)', regular: 'Regular Consultation (₹1,499)' }
          title = '💼 Career Guidance Request'
          fields = [
            { name: 'Name', value: inquiryData.name || 'N/A', inline: true },
            { name: 'Email', value: inquiryData.email || 'N/A', inline: true },
            { name: 'Mobile Number', value: inquiryData.mobile_number || 'N/A', inline: true },
            { name: 'Background', value: inquiryData.background || 'N/A', inline: true },
            { name: 'Session Tier', value: sessionTierMap[inquiryData.session_tier] || inquiryData.session_tier || 'N/A', inline: true },
            { name: 'Situation', value: inquiryData.message || 'N/A', inline: false },
            { name: 'City', value: inquiryData.city || 'N/A', inline: true },
            { name: 'State', value: inquiryData.state || 'N/A', inline: true },
          ]
        } else if (type === 'consultation_booking') {
          const typeMap: Record<string, string> = { general: 'General', professional: 'Professional', consult_melwin: 'Consult with Melwin' }
          title = '🗓️ Consultation Booking Request'
          fields = [
            { name: 'Name', value: inquiryData.name || 'N/A', inline: true },
            { name: 'Email', value: inquiryData.email || 'N/A', inline: true },
            { name: 'Phone', value: inquiryData.phone || 'N/A', inline: true },
            { name: 'Type', value: typeMap[inquiryData.consultation_type] || inquiryData.consultation_type || 'N/A', inline: true },
            { name: 'Preferred Slot', value: inquiryData.slot_preference || 'N/A', inline: true },
            { name: 'Notes', value: inquiryData.intake_notes || 'N/A', inline: false },
            { name: 'City', value: inquiryData.city || 'N/A', inline: true },
            { name: 'State', value: inquiryData.state || 'N/A', inline: true },
          ]
        } else if (type === 'invite_melwin') {
          title = '🎤 Invite Melwin Request'
          fields = [
            { name: 'Name', value: inquiryData.name || 'N/A', inline: true },
            { name: 'Email', value: inquiryData.email || 'N/A', inline: true },
            { name: 'Mobile Number', value: inquiryData.mobile_number || 'N/A', inline: true },
            { name: 'Organization/institution', value: inquiryData.institution_event || 'N/A', inline: true },
            { name: 'Tell us about the event', value: inquiryData.message || 'N/A', inline: false },
          ]
        } else if (type === 'agency_lead') {
          title = '🚀 Agency Retainer Inquiry'
          fields = [
            { name: 'Full Name', value: inquiryData.name || 'N/A', inline: true },
            { name: 'Work Email', value: inquiryData.email || 'N/A', inline: true },
            { name: 'Phone / WhatsApp', value: inquiryData.phone || 'N/A', inline: true },
            { name: 'Company', value: inquiryData.company || 'N/A', inline: true },
            { name: 'Retainer Plan', value: inquiryData.plan || 'N/A', inline: false },
            { name: 'Notes / Goals', value: inquiryData.message || 'N/A', inline: false },
          ]
        } else if (type === 'atom_se') {
          title = '⚡ Atom SE Project Inquiry'
          fields = [
            { name: 'Full Name', value: inquiryData.name || 'N/A', inline: true },
            { name: 'Email Address', value: inquiryData.email || 'N/A', inline: true },
            { name: 'Phone / WhatsApp', value: inquiryData.phone || 'N/A', inline: true },
            { name: 'Business / Company', value: inquiryData.company || 'N/A', inline: true },
            { name: 'Service Needed', value: inquiryData.service || 'N/A', inline: false },
            { name: 'Project Notes', value: inquiryData.message || 'N/A', inline: false },
          ]
        } else if (type === 'founders_club' || type === 'bmf_club') {
          title = '👥 BMF Club Application'
          fields = [
            { name: 'Founder Name', value: inquiryData.name || 'N/A', inline: true },
            { name: 'Email', value: inquiryData.email || 'N/A', inline: true },
            { name: 'Phone / WhatsApp', value: inquiryData.phone || 'N/A', inline: true },
            { name: 'Company / Startup', value: inquiryData.company || 'N/A', inline: true },
            { name: 'Stage', value: inquiryData.stage || 'N/A', inline: true },
            { name: 'City / Location', value: inquiryData.city || 'N/A', inline: true },
            { name: 'Founder Bio / Links', value: inquiryData.message || 'N/A', inline: false },
          ]
        } else if (type === 'funding_grants') {
          title = '💰 Funding & Grants Advisory Request'
          fields = [
            { name: 'Founder Name', value: inquiryData.name || 'N/A', inline: true },
            { name: 'Email', value: inquiryData.email || 'N/A', inline: true },
            { name: 'Phone / WhatsApp', value: inquiryData.phone || 'N/A', inline: true },
            { name: 'Company / Startup', value: inquiryData.company || 'N/A', inline: true },
            { name: 'Support Track', value: inquiryData.track || 'N/A', inline: true },
            { name: 'Industry Sector', value: inquiryData.sector || 'N/A', inline: true },
            { name: 'Pitch Deck / Website', value: inquiryData.deck_url || 'N/A', inline: false },
            { name: 'Venture Summary', value: inquiryData.message || 'N/A', inline: false },
          ]
        } else if (type === 'digital_growth') {
          title = '📈 Digital Growth & Marketing Inquiry'
          fields = [
            { name: 'Full Name', value: inquiryData.name || 'N/A', inline: true },
            { name: 'Email Address', value: inquiryData.email || 'N/A', inline: true },
            { name: 'Phone / WhatsApp', value: inquiryData.phone || 'N/A', inline: true },
            { name: 'Brand / Company', value: inquiryData.company || 'N/A', inline: true },
            { name: 'Growth Service', value: inquiryData.service || 'N/A', inline: true },
            { name: 'Budget Tier', value: inquiryData.budget || 'N/A', inline: true },
            { name: 'Goals / Notes', value: inquiryData.message || 'N/A', inline: false },
          ]
        } else if (type === 'business_services') {
          title = '🧾 Business & Legal Services Inquiry'
          fields = [
            { name: 'Full Name', value: inquiryData.name || 'N/A', inline: true },
            { name: 'Email Address', value: inquiryData.email || 'N/A', inline: true },
            { name: 'Phone / WhatsApp', value: inquiryData.phone || 'N/A', inline: true },
            { name: 'Business Name', value: inquiryData.company || 'N/A', inline: true },
            { name: 'Service Needed', value: inquiryData.service || 'N/A', inline: true },
            { name: 'City / Location', value: inquiryData.city || 'N/A', inline: true },
            { name: 'Requirement Details', value: inquiryData.message || 'N/A', inline: false },
          ]
        } else if (type === 'talent_profile') {
          title = '💼 New Talent Portfolio Profile (Free Marketplace)'
          fields = [
            { name: 'Candidate Name', value: inquiryData.name || 'N/A', inline: true },
            { name: 'Email Address', value: inquiryData.email || 'N/A', inline: true },
            { name: 'Phone / WhatsApp', value: inquiryData.phone || 'N/A', inline: true },
            { name: 'Target Role', value: inquiryData.role || 'N/A', inline: true },
            { name: 'Work Type', value: inquiryData.work_type || 'N/A', inline: true },
            { name: 'Experience', value: inquiryData.experience || 'N/A', inline: true },
            { name: 'Portfolio / GitHub / Resume', value: inquiryData.portfolio_url || 'N/A', inline: false },
            { name: 'Top Skills', value: inquiryData.skills || 'N/A', inline: false },
            { name: 'Candidate Bio', value: inquiryData.message || 'N/A', inline: false },
          ]
        } else if (type === 'talent_job_post') {
          title = '📢 Startup Job Opening Posted (Free Marketplace)'
          fields = [
            { name: 'Hiring Contact', value: inquiryData.name || 'N/A', inline: true },
            { name: 'Contact Email', value: inquiryData.email || 'N/A', inline: true },
            { name: 'Phone / WhatsApp', value: inquiryData.phone || 'N/A', inline: true },
            { name: 'Company Name', value: inquiryData.company || 'N/A', inline: true },
            { name: 'Job Title', value: inquiryData.job_title || 'N/A', inline: true },
            { name: 'Job Type', value: inquiryData.job_type || 'N/A', inline: true },
            { name: 'Location', value: inquiryData.location || 'N/A', inline: true },
            { name: 'Salary / Stipend', value: inquiryData.salary || 'N/A', inline: true },
            { name: 'Job Description', value: inquiryData.message || 'N/A', inline: false },
          ]
        } else if (type === 'startup_academy') {
          title = '🎓 Startup Academy Registration'
          fields = [
            { name: 'Student Name', value: inquiryData.name || 'N/A', inline: true },
            { name: 'Email Address', value: inquiryData.email || 'N/A', inline: true },
            { name: 'Phone / WhatsApp', value: inquiryData.phone || 'N/A', inline: true },
            { name: 'Course Track', value: inquiryData.track || 'N/A', inline: true },
            { name: 'Current Stage', value: inquiryData.stage || 'N/A', inline: true },
            { name: 'Learning Goals', value: inquiryData.message || 'N/A', inline: false },
          ]
        } else if (type === 'export_import') {
          title = '🚢 Export & Import Trade Inquiry'
          fields = [
            { name: 'Trader / Business Name', value: inquiryData.name || 'N/A', inline: true },
            { name: 'Email Address', value: inquiryData.email || 'N/A', inline: true },
            { name: 'Phone / WhatsApp', value: inquiryData.phone || 'N/A', inline: true },
            { name: 'Operation', value: inquiryData.operation_type || 'N/A', inline: true },
            { name: 'Product Category', value: inquiryData.product || 'N/A', inline: true },
            { name: 'Target Country', value: inquiryData.country || 'N/A', inline: true },
            { name: 'IEC Code Status', value: inquiryData.iec_status || 'N/A', inline: true },
            { name: 'Trade Details', value: inquiryData.message || 'N/A', inline: false },
          ]
        }

        await fetch(discordWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [
              {
                title,
                color: 16340792, // Vibrant coral orange
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
    const telegramChatId = type === 'atom_se'
      ? (process.env.ATOM_SE_TELEGRAM_CHAT_ID || '-5320775646')
      : process.env.TELEGRAM_CHAT_ID

    if (telegramBotToken && telegramChatId) {
      try {
        let text = ''
        
        if (type === 'brand_collab') {
          text = `🤝 <b>Brand Partnership Inquiry</b>\n\n` +
                 `<b>Company:</b> ${inquiryData.company_name}\n` +
                 `<b>Contact Email:</b> ${inquiryData.contact_email}\n` +
                 `<b>Mobile Number:</b> ${inquiryData.mobile_number || 'N/A'}\n` +
                 `<b>Platform URL:</b> ${inquiryData.platform_url || 'N/A'}\n` +
                 `<b>Budget Tier:</b> ${inquiryData.budget_tier || 'N/A'}\n` +
                 `<b>Objective:</b> ${inquiryData.objective || 'N/A'}\n` +
                 `<b>City:</b> ${inquiryData.city || 'N/A'}\n` +
                 `<b>State:</b> ${inquiryData.state || 'N/A'}`
        } else if (type === 'career_advice') {
          const sessionTierMap: Record<string, string> = { consult_melwin: 'Consult with Melwin (₹2,999)', regular: 'Regular Consultation (₹1,499)' }
          text = `💼 <b>Career Guidance Request</b>\n\n` +
                 `<b>Name:</b> ${inquiryData.name}\n` +
                 `<b>Email:</b> ${inquiryData.email}\n` +
                 `<b>Mobile Number:</b> ${inquiryData.mobile_number || 'N/A'}\n` +
                 `<b>Background:</b> ${inquiryData.background || 'N/A'}\n` +
                 `<b>Session Tier:</b> ${sessionTierMap[inquiryData.session_tier] || inquiryData.session_tier || 'N/A'}\n` +
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
        } else if (type === 'invite_melwin') {
           text = `🎤 <b>Invite Melwin Request</b>\n\n` +
                  `<b>Name:</b> ${inquiryData.name || 'N/A'}\n` +
                  `<b>Email:</b> ${inquiryData.email || 'N/A'}\n` +
                  `<b>Mobile:</b> ${inquiryData.mobile_number || 'N/A'}\n` +
                  `<b>Organization/institution:</b> ${inquiryData.institution_event || 'N/A'}\n` +
                  `<b>Details:</b> ${inquiryData.message || 'N/A'}`
        } else if (type === 'agency_lead') {
           text = `🚀 <b>Agency Retainer Inquiry</b>\n\n` +
                  `<b>Name:</b> ${inquiryData.name || 'N/A'}\n` +
                  `<b>Email:</b> ${inquiryData.email || 'N/A'}\n` +
                  `<b>Phone:</b> ${inquiryData.phone || 'N/A'}\n` +
                  `<b>Company:</b> ${inquiryData.company || 'N/A'}\n` +
                  `<b>Plan:</b> ${inquiryData.plan || 'N/A'}\n` +
                  `<b>Notes:</b> ${inquiryData.message || 'N/A'}`
        } else if (type === 'atom_se') {
           text = `⚡ <b>Atom SE Project Inquiry</b>\n\n` +
                  `<b>Name:</b> ${inquiryData.name || 'N/A'}\n` +
                  `<b>Email:</b> ${inquiryData.email || 'N/A'}\n` +
                  `<b>Phone:</b> ${inquiryData.phone || 'N/A'}\n` +
                  `<b>Company:</b> ${inquiryData.company || 'N/A'}\n` +
                  `<b>Service:</b> ${inquiryData.service || 'N/A'}\n` +
                  `<b>Notes:</b> ${inquiryData.message || 'N/A'}`
        } else if (type === 'founders_club' || type === 'bmf_club') {
           text = `<b>BMF Club Application</b>\n\n` +
                  `<b>Name:</b> ${inquiryData.name || 'N/A'}\n` +
                  `<b>Email:</b> ${inquiryData.email || 'N/A'}\n` +
                  `<b>Phone:</b> ${inquiryData.phone || 'N/A'}\n` +
                  `<b>Company:</b> ${inquiryData.company || 'N/A'}\n` +
                  `<b>Stage:</b> ${inquiryData.stage || 'N/A'}\n` +
                  `<b>City:</b> ${inquiryData.city || 'N/A'}\n` +
                  `<b>Bio / Links:</b> ${inquiryData.message || 'N/A'}`
        } else if (type === 'funding_grants') {
           text = `💰 <b>Funding & Grants Inquiry</b>\n\n` +
                  `<b>Name:</b> ${inquiryData.name || 'N/A'}\n` +
                  `<b>Email:</b> ${inquiryData.email || 'N/A'}\n` +
                  `<b>Phone:</b> ${inquiryData.phone || 'N/A'}\n` +
                  `<b>Company:</b> ${inquiryData.company || 'N/A'}\n` +
                  `<b>Track:</b> ${inquiryData.track || 'N/A'}\n` +
                  `<b>Sector:</b> ${inquiryData.sector || 'N/A'}\n` +
                  `<b>Pitch Deck / URL:</b> ${inquiryData.deck_url || 'N/A'}\n` +
                  `<b>Summary:</b> ${inquiryData.message || 'N/A'}`
        } else if (type === 'digital_growth') {
           text = `📈 <b>Digital Growth Inquiry</b>\n\n` +
                  `<b>Name:</b> ${inquiryData.name || 'N/A'}\n` +
                  `<b>Email:</b> ${inquiryData.email || 'N/A'}\n` +
                  `<b>Phone:</b> ${inquiryData.phone || 'N/A'}\n` +
                  `<b>Brand:</b> ${inquiryData.company || 'N/A'}\n` +
                  `<b>Service:</b> ${inquiryData.service || 'N/A'}\n` +
                  `<b>Budget:</b> ${inquiryData.budget || 'N/A'}\n` +
                  `<b>Goals:</b> ${inquiryData.message || 'N/A'}`
        } else if (type === 'business_services') {
           text = `🧾 <b>Business & Legal Services Inquiry</b>\n\n` +
                  `<b>Name:</b> ${inquiryData.name || 'N/A'}\n` +
                  `<b>Email:</b> ${inquiryData.email || 'N/A'}\n` +
                  `<b>Phone:</b> ${inquiryData.phone || 'N/A'}\n` +
                  `<b>Business:</b> ${inquiryData.company || 'N/A'}\n` +
                  `<b>Service:</b> ${inquiryData.service || 'N/A'}\n` +
                  `<b>City:</b> ${inquiryData.city || 'N/A'}\n` +
                  `<b>Details:</b> ${inquiryData.message || 'N/A'}`
        } else if (type === 'talent_profile') {
           text = `💼 <b>New Talent Portfolio Created (Free Marketplace)</b>\n\n` +
                  `<b>Candidate:</b> ${inquiryData.name || 'N/A'}\n` +
                  `<b>Email:</b> ${inquiryData.email || 'N/A'}\n` +
                  `<b>Phone:</b> ${inquiryData.phone || 'N/A'}\n` +
                  `<b>Role:</b> ${inquiryData.role || 'N/A'}\n` +
                  `<b>Work Type:</b> ${inquiryData.work_type || 'N/A'}\n` +
                  `<b>Experience:</b> ${inquiryData.experience || 'N/A'}\n` +
                  `<b>Skills:</b> ${inquiryData.skills || 'N/A'}\n` +
                  `<b>Portfolio:</b> ${inquiryData.portfolio_url || 'N/A'}\n` +
                  `<b>Bio:</b> ${inquiryData.message || 'N/A'}`
        } else if (type === 'talent_job_post') {
           text = `📢 <b>Startup Job Opening Posted (Free Marketplace)</b>\n\n` +
                  `<b>Hiring Manager:</b> ${inquiryData.name || 'N/A'}\n` +
                  `<b>Email:</b> ${inquiryData.email || 'N/A'}\n` +
                  `<b>Phone:</b> ${inquiryData.phone || 'N/A'}\n` +
                  `<b>Company:</b> ${inquiryData.company || 'N/A'}\n` +
                  `<b>Job Title:</b> ${inquiryData.job_title || 'N/A'}\n` +
                  `<b>Type:</b> ${inquiryData.job_type || 'N/A'}\n` +
                  `<b>Location:</b> ${inquiryData.location || 'N/A'}\n` +
                  `<b>Salary / Stipend:</b> ${inquiryData.salary || 'N/A'}\n` +
                  `<b>Details:</b> ${inquiryData.message || 'N/A'}`
        } else if (type === 'startup_academy') {
           text = `🎓 <b>Startup Academy Registration (Build From 0)</b>\n\n` +
                  `<b>Student Name:</b> ${inquiryData.name || 'N/A'}\n` +
                  `<b>Email:</b> ${inquiryData.email || 'N/A'}\n` +
                  `<b>Phone:</b> ${inquiryData.phone || 'N/A'}\n` +
                  `<b>Track:</b> ${inquiryData.track || 'N/A'}\n` +
                  `<b>Current Stage:</b> ${inquiryData.stage || 'N/A'}\n` +
                  `<b>Learning Goals:</b> ${inquiryData.message || 'N/A'}`
        } else if (type === 'export_import') {
           text = `🚢 <b>Export & Import Trade Inquiry</b>\n\n` +
                  `<b>Trader Name:</b> ${inquiryData.name || 'N/A'}\n` +
                  `<b>Email:</b> ${inquiryData.email || 'N/A'}\n` +
                  `<b>Phone:</b> ${inquiryData.phone || 'N/A'}\n` +
                  `<b>Operation:</b> ${inquiryData.operation_type || 'N/A'}\n` +
                  `<b>Product:</b> ${inquiryData.product || 'N/A'}\n` +
                  `<b>Target Country:</b> ${inquiryData.country || 'N/A'}\n` +
                  `<b>IEC Status:</b> ${inquiryData.iec_status || 'N/A'}\n` +
                  `<b>Details:</b> ${inquiryData.message || 'N/A'}`
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
