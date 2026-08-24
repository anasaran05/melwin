import { Resend } from 'resend'

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'BMF Admissions <admissions@dr-melwin.com>'

export interface SendApprovalEmailParams {
  to: string
  founderName: string
  companyName: string
  showcaseUrl?: string
}

export interface SendRevisionEmailParams {
  to: string
  founderName: string
  companyName: string
  feedback: string
  studioUrl?: string
}

export async function sendShowcaseApprovedEmail({
  to,
  founderName,
  companyName,
  showcaseUrl = 'https://dr-melwin.com/bmf-club',
}: SendApprovalEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const resend = getResendClient()
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #ffffff; margin: 0; padding: 40px 20px; }
            .card { max-width: 580px; margin: 0 auto; background: #141417; border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 36px 32px; }
            .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #38bdf8; background: rgba(56,189,248,0.15); padding: 4px 12px; border-radius: 100px; margin-bottom: 20px; }
            h1 { font-size: 26px; font-weight: 900; line-height: 1.2; margin: 0 0 16px 0; color: #ffffff; }
            p { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 20px 0; }
            .highlight-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; margin: 24px 0; }
            .btn { display: inline-block; background: #ffffff; color: #000000; font-weight: 800; font-size: 13px; text-decoration: none; padding: 14px 28px; border-radius: 100px; margin-top: 10px; }
            .footer { font-size: 11px; color: #71717a; text-align: center; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">BMF Founders Club &bull; Showcase Approved</span>
            <h1>Congratulations, ${founderName}! 🎉</h1>
            <p>Your showcase profile for <strong>${companyName}</strong> has been officially vetted, approved, and published live to the global <strong>BMF Club Member Directory</strong>.</p>
            
            <div class="highlight-box">
              <p style="margin: 0; color: #ffffff; font-weight: 600;">✨ What happens now?</p>
              <ul style="color: #a1a1aa; font-size: 13px; margin: 10px 0 0 0; padding-left: 18px; line-height: 1.6;">
                <li>Your verified 3D card is live to accredited investors & tier-1 founders.</li>
                <li>You can post startup job openings for free on the <strong>Jobs & Talent Hub</strong>.</li>
                <li>You have priority invitations to closed-door masterminds & retreats.</li>
              </ul>
            </div>

            <p>View your live showcase card in the directory:</p>
            <a href="${showcaseUrl}" class="btn">View Live Showcase Directory &rarr;</a>

            <div class="footer">
              <p style="margin: 0;">Dr. Melwin Vincent &bull; BMF Founders Admissions Office</p>
              <p style="margin: 4px 0 0 0;">Where High-Conviction Builders Connect.</p>
            </div>
          </div>
        </body>
      </html>
    `

    if (!resend) {
      console.log(`[Resend Mock Email Dispatch to ${to}]: Showcase Approved for ${founderName} (${companyName})`)
      return { success: true, id: 'mock-approval-email-id' }
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `🎉 Approved: ${companyName} is now featured in the BMF Club Directory!`,
      html,
    })

    if (error) {
      console.error('[Resend Error]:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err: any) {
    console.error('[Email Send Error]:', err)
    return { success: false, error: err.message || 'Failed to dispatch email' }
  }
}

export async function sendShowcaseRevisionEmail({
  to,
  founderName,
  companyName,
  feedback,
  studioUrl = 'https://dr-melwin.com/bmf-club/login',
}: SendRevisionEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const resend = getResendClient()
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #ffffff; margin: 0; padding: 40px 20px; }
            .card { max-width: 580px; margin: 0 auto; background: #141417; border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 36px 32px; }
            .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #fbbf24; background: rgba(251,191,36,0.15); padding: 4px 12px; border-radius: 100px; margin-bottom: 20px; }
            h1 { font-size: 24px; font-weight: 900; line-height: 1.2; margin: 0 0 16px 0; color: #ffffff; }
            p { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 20px 0; }
            .feedback-box { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); border-radius: 16px; padding: 20px; margin: 24px 0; }
            .btn { display: inline-block; background: #ffffff; color: #000000; font-weight: 800; font-size: 13px; text-decoration: none; padding: 14px 28px; border-radius: 100px; margin-top: 10px; }
            .footer { font-size: 11px; color: #71717a; text-align: center; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">BMF Founders Club &bull; Admissions Feedback</span>
            <h1>Update on your Showcase Application</h1>
            <p>Dear ${founderName},</p>
            <p>Thank you for submitting <strong>${companyName}</strong> for the BMF Club showcase directory. The admissions committee has reviewed your submission.</p>
            
            <div class="feedback-box">
              <p style="margin: 0 0 6px 0; color: #f87171; font-weight: 700; font-size: 13px;">Admissions Feedback / Required Updates:</p>
              <p style="margin: 0; color: #fecaca; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">${feedback}</p>
            </div>

            <p>Please log in to your Member Studio, update the required fields, and re-submit your profile for expedited re-review.</p>
            <a href="${studioUrl}" class="btn">Update My Showcase Profile &rarr;</a>

            <div class="footer">
              <p style="margin: 0;">Dr. Melwin Vincent &bull; BMF Founders Admissions Office</p>
              <p style="margin: 4px 0 0 0;">Where High-Conviction Builders Connect.</p>
            </div>
          </div>
        </body>
      </html>
    `

    if (!resend) {
      console.log(`[Resend Mock Email Dispatch to ${to}]: Showcase Revision/Rejection for ${founderName} (${companyName}) with feedback: "${feedback}"`)
      return { success: true, id: 'mock-revision-email-id' }
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Update regarding your BMF Club showcase: ${companyName}`,
      html,
    })

    if (error) {
      console.error('[Resend Error]:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err: any) {
    console.error('[Email Send Error]:', err)
    return { success: false, error: err.message || 'Failed to dispatch email' }
  }
}

export interface SendEventRsvpEmailParams {
  to: string
  attendeeName: string
  eventTitle: string
  eventDate: string
  location: string
  status: 'pending' | 'approved' | 'waitlisted'
  ticketCode?: string
}

export async function sendEventRsvpConfirmationEmail({
  to,
  attendeeName,
  eventTitle,
  eventDate,
  location,
  status,
  ticketCode,
}: SendEventRsvpEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const resend = getResendClient()
    const isWaitlist = status === 'waitlisted'
    const isApproved = status === 'approved'

    const badgeText = isApproved
      ? 'RSVP Confirmed & Approved'
      : isWaitlist
      ? 'Waitlist Registered (Capacity Reached)'
      : 'Application Received (Pending Review)'

    const badgeColor = isApproved ? '#10b981' : isWaitlist ? '#f59e0b' : '#38bdf8'
    const badgeBg = isApproved ? 'rgba(16,185,129,0.15)' : isWaitlist ? 'rgba(245,158,11,0.15)' : 'rgba(56,189,248,0.15)'

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #ffffff; margin: 0; padding: 40px 20px; }
            .card { max-width: 580px; margin: 0 auto; background: #141417; border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 36px 32px; }
            .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: ${badgeColor}; background: ${badgeBg}; padding: 4px 12px; border-radius: 100px; margin-bottom: 20px; }
            h1 { font-size: 24px; font-weight: 900; line-height: 1.2; margin: 0 0 16px 0; color: #ffffff; }
            p { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 20px 0; }
            .event-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; margin: 24px 0; }
            .ticket { font-family: monospace; font-size: 14px; color: #38bdf8; font-weight: bold; background: rgba(56,189,248,0.1); padding: 6px 12px; border-radius: 8px; display: inline-block; margin-top: 8px; }
            .footer { font-size: 11px; color: #71717a; text-align: center; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">BMF Events &bull; ${badgeText}</span>
            <h1>Hello, ${attendeeName}!</h1>
            <p>${isApproved ? 'Your seat has been officially confirmed!' : isWaitlist ? 'You have been placed on the priority waitlist as the initial seat capacity is full.' : 'We have received your registration application for the upcoming gathering.'}</p>
            
            <div class="event-box">
              <h3 style="margin: 0 0 8px 0; color: #ffffff; font-size: 16px;">${eventTitle}</h3>
              <p style="margin: 0; color: #d4d4d8; font-size: 13px;">🗓️ Date: <strong>${eventDate}</strong></p>
              <p style="margin: 4px 0 0 0; color: #d4d4d8; font-size: 13px;">📍 Venue: <strong>${location}</strong></p>
              ${ticketCode ? `<div style="margin-top: 12px;"><span class="ticket">Pass Code: ${ticketCode}</span></div>` : ''}
            </div>

            <div class="footer">
              <p style="margin: 0;">Dr. Melwin Vincent &bull; BMF Founders Club Events</p>
              <p style="margin: 4px 0 0 0;">Strictly Capped & Curated for Maximum Signal.</p>
            </div>
          </div>
        </body>
      </html>
    `

    if (!resend) {
      console.log(`[Resend Mock Email Dispatch to ${to}]: Event RSVP ${status} for ${attendeeName} (${eventTitle})`)
      return { success: true, id: 'mock-event-email-id' }
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${isApproved ? '🎟️ Confirmed Seat' : isWaitlist ? '⏳ Waitlist Status' : '📋 RSVP Received'}: ${eventTitle}`,
      html,
    })

    if (error) {
      console.error('[Resend Error]:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err: any) {
    console.error('[Email Send Error]:', err)
    return { success: false, error: err.message || 'Failed to dispatch email' }
  }
}

/* ========================================================================= */
/* WARM INTRO SYSTEM EMAIL DISPATCHERS                                       */
/* ========================================================================= */

export interface SendNewIntroRequestParams {
  to: string
  targetFounderName: string
  requesterName: string
  requesterCompany?: string | null
  requesterRole?: string | null
  purpose: string
  message: string
  dashboardUrl?: string
}

export async function sendNewIntroRequestEmail({
  to,
  targetFounderName,
  requesterName,
  requesterCompany,
  requesterRole,
  purpose,
  message,
  dashboardUrl = 'https://buildwithmelwin.com/bmf-club/dashboard',
}: SendNewIntroRequestParams): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const resend = getResendClient()
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #ffffff; margin: 0; padding: 40px 20px; }
            .card { max-width: 580px; margin: 0 auto; background: #141417; border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 36px 32px; }
            .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #10b981; background: rgba(16,185,129,0.15); padding: 4px 12px; border-radius: 100px; margin-bottom: 20px; }
            h1 { font-size: 24px; font-weight: 900; line-height: 1.2; margin: 0 0 16px 0; color: #ffffff; }
            p { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 20px 0; }
            .quote-box { background: rgba(255,255,255,0.04); border-left: 3px solid #10b981; border-radius: 0 14px 14px 0; padding: 16px 20px; margin: 20px 0; }
            .btn { display: inline-block; background: #ffffff; color: #000000; font-weight: 800; font-size: 13px; text-decoration: none; padding: 14px 28px; border-radius: 100px; margin-top: 12px; }
            .footer { font-size: 11px; color: #71717a; text-align: center; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">🤝 BMF Warm Intro Request</span>
            <h1>Hi ${targetFounderName},</h1>
            <p><strong>${requesterName}</strong> ${requesterRole ? `(${requesterRole})` : ''} ${requesterCompany ? `at <strong>${requesterCompany}</strong>` : ''} has requested an introduction to you regarding <strong>${purpose}</strong>.</p>
            
            <div class="quote-box">
              <p style="margin: 0 0 6px 0; color: #71717a; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em;">Context / Note from ${requesterName}:</p>
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-style: italic; line-height: 1.5;">"${message}"</p>
            </div>

            <p style="color: #d4d4d8; font-size: 13px;">To protect your inbox, your email remains private until you choose to connect. Review and accept this request in your founder studio:</p>
            <a href="${dashboardUrl}" class="btn">Review & Accept in Dashboard &rarr;</a>

            <div class="footer">
              <p style="margin: 0;">BMF Founders Club &bull; High-Signal Warm Introductions</p>
              <p style="margin: 4px 0 0 0;">Where High-Conviction Builders Connect.</p>
            </div>
          </div>
        </body>
      </html>
    `

    if (!resend) {
      console.log(`[Resend Mock Email Dispatch to ${to}]: New Intro Request from ${requesterName} to ${targetFounderName}`)
      return { success: true, id: 'mock-intro-request-id' }
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `🤝 ${requesterName} requested an intro with you (BMF Club)`,
      html,
    })

    if (error) {
      console.error('[Resend Error]:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err: any) {
    console.error('[Email Send Error]:', err)
    return { success: false, error: err.message || 'Failed to dispatch email' }
  }
}

export interface SendMutualWarmIntroParams {
  founderEmail: string
  founderName: string
  founderCompany: string
  founderPhone?: string | null
  requesterEmail: string
  requesterName: string
  requesterCompany?: string | null
  requesterPhone?: string | null
  purpose: string
  message: string
}

export async function sendMutualWarmIntroEmail({
  founderEmail,
  founderName,
  founderCompany,
  founderPhone,
  requesterEmail,
  requesterName,
  requesterCompany,
  requesterPhone,
  purpose,
  message,
}: SendMutualWarmIntroParams): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const resend = getResendClient()
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #ffffff; margin: 0; padding: 40px 20px; }
            .card { max-width: 600px; margin: 0 auto; background: #141417; border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 36px 32px; }
            .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #38bdf8; background: rgba(56,189,248,0.15); padding: 4px 12px; border-radius: 100px; margin-bottom: 20px; }
            h1 { font-size: 24px; font-weight: 900; line-height: 1.2; margin: 0 0 16px 0; color: #ffffff; }
            p { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 20px 0; }
            .profile-grid { display: table; width: 100%; margin: 20px 0; }
            .profile-col { display: table-cell; width: 50%; vertical-align: top; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px; }
            .profile-col:first-child { margin-right: 10px; }
            .quote-box { background: rgba(255,255,255,0.04); border-left: 3px solid #38bdf8; border-radius: 0 14px 14px 0; padding: 16px 20px; margin: 20px 0; }
            .footer { font-size: 11px; color: #71717a; text-align: center; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">✨ BMF Club &bull; Warm Introduction</span>
            <h1>${founderName}, meet ${requesterName}! 🤝</h1>
            <p>It's our pleasure to connect you both through the <strong>BMF Founders Network</strong> regarding <strong>${purpose}</strong>.</p>
            
            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
              <tr>
                <td width="48%" style="vertical-align: top; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px;">
                  <p style="margin: 0 0 4px 0; font-size: 11px; color: #38bdf8; text-transform: uppercase; font-weight: bold;">Founder</p>
                  <h4 style="margin: 0 0 6px 0; font-size: 16px; color: #ffffff;">${founderName}</h4>
                  <p style="margin: 0 0 4px 0; font-size: 13px; color: #d4d4d8;">🏢 ${founderCompany}</p>
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: #a1a1aa;">📧 <a href="mailto:${founderEmail}" style="color: #38bdf8; text-decoration: none;">${founderEmail}</a></p>
                  ${founderPhone ? `<p style="margin: 0; font-size: 12px; color: #a1a1aa;">📱 ${founderPhone}</p>` : ''}
                </td>
                <td width="4%"></td>
                <td width="48%" style="vertical-align: top; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px;">
                  <p style="margin: 0 0 4px 0; font-size: 11px; color: #38bdf8; text-transform: uppercase; font-weight: bold;">Requester</p>
                  <h4 style="margin: 0 0 6px 0; font-size: 16px; color: #ffffff;">${requesterName}</h4>
                  <p style="margin: 0 0 4px 0; font-size: 13px; color: #d4d4d8;">🏢 ${requesterCompany || 'Independent'}</p>
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: #a1a1aa;">📧 <a href="mailto:${requesterEmail}" style="color: #38bdf8; text-decoration: none;">${requesterEmail}</a></p>
                  ${requesterPhone ? `<p style="margin: 0; font-size: 12px; color: #a1a1aa;">📱 ${requesterPhone}</p>` : ''}
                </td>
              </tr>
            </table>

            <div class="quote-box">
              <p style="margin: 0 0 6px 0; color: #71717a; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em;">Original Context:</p>
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-style: italic; line-height: 1.5;">"${message}"</p>
            </div>

            <p style="color: #ffffff; font-weight: 600; font-size: 14px; margin-top: 24px;">👉 Next Steps:</p>
            <p style="color: #a1a1aa; font-size: 13px; margin: 0 0 8px 0;">Feel free to hit <strong>Reply All</strong> on this email or connect directly on WhatsApp to continue the conversation.</p>

            <div class="footer">
              <p style="margin: 0;">BMF Founders Club &bull; High-Signal Network</p>
              <p style="margin: 4px 0 0 0;">Where High-Conviction Builders Connect.</p>
            </div>
          </div>
        </body>
      </html>
    `

    if (!resend) {
      console.log(`[Resend Mock Email Dispatch]: Mutual Warm Intro between ${founderEmail} and ${requesterEmail}`)
      return { success: true, id: 'mock-mutual-intro-id' }
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [founderEmail, requesterEmail],
      replyTo: [founderEmail, requesterEmail],
      subject: `🤝 Warm Intro: ${requesterName} <> ${founderName} (BMF Club)`,
      html,
    })

    if (error) {
      console.error('[Resend Error]:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err: any) {
    console.error('[Email Send Error]:', err)
    return { success: false, error: err.message || 'Failed to dispatch email' }
  }
}

export interface SendIntroConfirmationParams {
  to: string
  requesterName: string
  targetFounderName: string
  targetFounderCompany: string
}

export async function sendIntroRequestConfirmationEmail({
  to,
  requesterName,
  targetFounderName,
  targetFounderCompany,
}: SendIntroConfirmationParams): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const resend = getResendClient()
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #ffffff; margin: 0; padding: 40px 20px; }
            .card { max-width: 580px; margin: 0 auto; background: #141417; border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 36px 32px; }
            .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #38bdf8; background: rgba(56,189,248,0.15); padding: 4px 12px; border-radius: 100px; margin-bottom: 20px; }
            h1 { font-size: 24px; font-weight: 900; line-height: 1.2; margin: 0 0 16px 0; color: #ffffff; }
            p { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 20px 0; }
            .footer { font-size: 11px; color: #71717a; text-align: center; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">📨 Intro Request Sent</span>
            <h1>Hello, ${requesterName}!</h1>
            <p>Your introduction request to <strong>${targetFounderName}</strong> (${targetFounderCompany}) has been safely delivered.</p>
            <p>Once ${targetFounderName} accepts, we will send an introduction email connecting both of you directly so you can sync up.</p>
            
            <div class="footer">
              <p style="margin: 0;">BMF Founders Club Admissions & Concierge</p>
              <p style="margin: 4px 0 0 0;">Where High-Conviction Builders Connect.</p>
            </div>
          </div>
        </body>
      </html>
    `

    if (!resend) {
      console.log(`[Resend Mock Email Dispatch to ${to}]: Intro confirmation for request to ${targetFounderName}`)
      return { success: true, id: 'mock-intro-confirm-id' }
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `📨 Intro request sent to ${targetFounderName} (BMF Club)`,
      html,
    })

    if (error) {
      console.error('[Resend Error]:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err: any) {
    console.error('[Email Send Error]:', err)
    return { success: false, error: err.message || 'Failed to dispatch email' }
  }
}


