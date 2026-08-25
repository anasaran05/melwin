import { Resend } from 'resend'

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'BMF Admissions <contact@buildwithmelwin.com>'

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
              <p style="margin: 0; font-weight: 600; color: #a1a1aa;">Dr. Melwin Vincent &bull; BMF Founders Admissions Office</p>
              <p style="margin: 4px 0 0 0;">Networking, Investments, Opportunities. All in one place.</p>
              <p style="margin: 12px 0 0 0; font-size: 10px; color: #52525b; line-height: 1.5;">
                This is an automated transactional notification &bull; Please do not reply directly to this address.<br />
                For questions or support, contact <a href="mailto:support@buildwithmelwin.com" style="color: #71717a; text-decoration: underline;">support@buildwithmelwin.com</a>
              </p>
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
              <p style="margin: 0; font-weight: 600; color: #a1a1aa;">Dr. Melwin Vincent &bull; BMF Founders Admissions Office</p>
              <p style="margin: 4px 0 0 0;">Networking, Investments, Opportunities. All in one place.</p>
              <p style="margin: 12px 0 0 0; font-size: 10px; color: #52525b; line-height: 1.5;">
                This is an automated transactional notification &bull; Please do not reply directly to this address.<br />
                For questions or support, contact <a href="mailto:support@buildwithmelwin.com" style="color: #71717a; text-decoration: underline;">support@buildwithmelwin.com</a>
              </p>
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
              <p style="margin: 0; font-weight: 600; color: #a1a1aa;">Dr. Melwin Vincent &bull; BMF Founders Club Events</p>
              <p style="margin: 4px 0 0 0;">Strictly Capped & Curated for Maximum Signal.</p>
              <p style="margin: 12px 0 0 0; font-size: 10px; color: #52525b; line-height: 1.5;">
                This is an automated transactional notification &bull; Please do not reply directly to this address.<br />
                For event inquiries or support, contact <a href="mailto:support@buildwithmelwin.com" style="color: #71717a; text-decoration: underline;">support@buildwithmelwin.com</a>
              </p>
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
              <p style="margin: 0; font-weight: 600; color: #a1a1aa;">BMF Founders Club &bull; High-Signal Warm Introductions</p>
              <p style="margin: 4px 0 0 0;">Networking, Investments, Opportunities. All in one place.</p>
              <p style="margin: 12px 0 0 0; font-size: 10px; color: #52525b; line-height: 1.5;">
                This is an automated transactional notification &bull; Please do not reply directly to this address.<br />
                To respond to this introduction, use your dashboard or contact <a href="mailto:support@buildwithmelwin.com" style="color: #71717a; text-decoration: underline;">support@buildwithmelwin.com</a>
              </p>
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
  founderRole?: string | null
  founderPhone?: string | null
  requesterEmail: string
  requesterName: string
  requesterCompany?: string | null
  requesterRole?: string | null
  requesterPhone?: string | null
  requesterLinkedin?: string | null
  purpose: string
  message: string
  dashboardUrl?: string
}

export async function sendMutualWarmIntroEmail({
  founderEmail,
  founderName,
  founderCompany,
  founderRole,
  founderPhone,
  requesterEmail,
  requesterName,
  requesterCompany,
  requesterRole,
  requesterPhone,
  requesterLinkedin,
  purpose,
  message,
  dashboardUrl = 'https://buildwithmelwin.com/bmf-club/dashboard?tab=intros',
}: SendMutualWarmIntroParams): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const resend = getResendClient()
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Warm Introduction • BMF Club</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
              background-color: #09090b; 
              color: #ffffff; 
              margin: 0; 
              padding: 36px 16px; 
              -webkit-font-smoothing: antialiased;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: #141417; 
              border: 1px solid rgba(255,255,255,0.12); 
              border-radius: 24px; 
              padding: 36px 28px; 
              box-shadow: 0 20px 40px rgba(0,0,0,0.6);
            }
            .brand-header {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 24px;
            }
            .badge { 
              display: inline-block; 
              font-size: 11px; 
              font-weight: 700; 
              text-transform: uppercase; 
              letter-spacing: 0.12em; 
              color: #10b981; 
              background: rgba(16,185,129,0.12); 
              border: 1px solid rgba(16,185,129,0.25);
              padding: 6px 14px; 
              border-radius: 100px; 
              margin-bottom: 20px; 
            }
            h1 { 
              font-size: 24px; 
              font-weight: 900; 
              line-height: 1.25; 
              margin: 0 0 12px 0; 
              color: #ffffff; 
              letter-spacing: -0.02em;
            }
            p.lead { 
              font-size: 14px; 
              line-height: 1.6; 
              color: #a1a1aa; 
              margin: 0 0 24px 0; 
            }
            .card-table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              margin: 20px 0;
            }
            .founder-box {
              background: rgba(255,255,255,0.03);
              border: 1px solid rgba(255,255,255,0.08);
              border-radius: 16px;
              padding: 18px 16px;
              vertical-align: top;
            }
            .box-tag {
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.12em;
              color: #38bdf8;
              margin: 0 0 6px 0;
            }
            .founder-name {
              font-size: 16px;
              font-weight: 800;
              color: #ffffff;
              margin: 0 0 4px 0;
            }
            .founder-sub {
              font-size: 12px;
              color: #d4d4d8;
              margin: 0 0 10px 0;
              line-height: 1.4;
            }
            .contact-item {
              font-size: 12px;
              color: #a1a1aa;
              margin: 4px 0 0 0;
            }
            .contact-item a {
              color: #38bdf8;
              text-decoration: none;
            }
            .quote-box { 
              background: rgba(255,255,255,0.03); 
              border-left: 3px solid #38bdf8; 
              border-radius: 0 14px 14px 0; 
              padding: 16px 20px; 
              margin: 24px 0; 
            }
            .purpose-badge {
              display: inline-block;
              font-size: 11px;
              font-weight: 700;
              color: #fbbf24;
              background: rgba(251,191,36,0.12);
              padding: 2px 8px;
              border-radius: 6px;
              margin-bottom: 8px;
            }
            .cta-section {
              text-align: center;
              margin: 32px 0 16px 0;
              padding-top: 20px;
              border-top: 1px solid rgba(255,255,255,0.08);
            }
            .btn { 
              display: inline-block; 
              background: #ffffff; 
              color: #000000 !important; 
              font-weight: 800; 
              font-size: 13px; 
              text-decoration: none; 
              padding: 14px 32px; 
              border-radius: 100px; 
              box-shadow: 0 4px 14px rgba(255,255,255,0.15);
              transition: all 0.2s ease;
            }
            .footer { 
              font-size: 11px; 
              color: #71717a; 
              text-align: center; 
              margin-top: 32px; 
              border-top: 1px solid rgba(255,255,255,0.06); 
              padding-top: 24px; 
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            
            <!-- BMF Club Logo & Header -->
            <div style="margin-bottom: 20px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <img src="https://img.icons8.com/stickers/500/verified-badge.png" width="28" height="28" alt="BMF Club" style="display: block; margin-right: 8px;" />
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 15px; font-weight: 900; letter-spacing: 0.08em; color: #ffffff; text-transform: uppercase;">BMF FOUNDERS CLUB</span>
                  </td>
                </tr>
              </table>
            </div>

            <span class="badge">✨ Warm Intro Approved &bull; Connected</span>
            <h1>${founderName}, meet ${requesterName}! 🤝</h1>
            <p class="lead">We are thrilled to officially connect you both through the <strong>BMF Founders Syndicate</strong> network.</p>
            
            <!-- Dual Profile Information Table -->
            <table class="card-table" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <!-- Target Founder Box -->
                <td class="founder-box" width="48%">
                  <div class="box-tag">Target Founder</div>
                  <div class="founder-name">${founderName}</div>
                  <div class="founder-sub">${founderRole ? `${founderRole} &bull; ` : ''}<strong>${founderCompany}</strong></div>
                  
                  <div class="contact-item">
                    📧 <a href="mailto:${founderEmail}">${founderEmail}</a>
                  </div>
                  ${founderPhone ? `<div class="contact-item">📱 <a href="tel:${founderPhone}">${founderPhone}</a></div>` : ''}
                </td>

                <td width="4%">&nbsp;</td>

                <!-- Requester Founder Box -->
                <td class="founder-box" width="48%">
                  <div class="box-tag">Requester</div>
                  <div class="founder-name">${requesterName}</div>
                  <div class="founder-sub">${requesterRole ? `${requesterRole} &bull; ` : ''}<strong>${requesterCompany || 'Independent'}</strong></div>
                  
                  <div class="contact-item">
                    📧 <a href="mailto:${requesterEmail}">${requesterEmail}</a>
                  </div>
                  ${requesterPhone ? `<div class="contact-item">📱 <a href="tel:${requesterPhone}">${requesterPhone}</a></div>` : ''}
                  ${requesterLinkedin ? `<div class="contact-item">🔗 <a href="${requesterLinkedin.startsWith('http') ? requesterLinkedin : `https://${requesterLinkedin}`}" target="_blank">LinkedIn Profile</a></div>` : ''}
                </td>
              </tr>
            </table>

            <!-- Context & Purpose Note -->
            <div class="quote-box">
              <div class="purpose-badge">🎯 Purpose: ${purpose}</div>
              <p style="margin: 4px 0 0 0; color: #ffffff; font-size: 13px; font-style: italic; line-height: 1.5;">"${message}"</p>
            </div>

            <!-- Next Steps & Dashboard Action -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0 0 8px 0; color: #ffffff; font-weight: 700; font-size: 13px;">👉 How to connect:</p>
              <ul style="color: #a1a1aa; font-size: 12px; margin: 0; padding-left: 18px; line-height: 1.6;">
                <li>Hit <strong>Reply All</strong> on this email to start your conversation immediately.</li>
                <li>Connect via WhatsApp / phone if preferred.</li>
                <li>Track and review all your introductions in your <strong>BMF Founder Dashboard</strong>.</li>
              </ul>
            </div>

            <div class="cta-section">
              <a href="${dashboardUrl}" class="btn">View in Member Dashboard &rarr;</a>
            </div>

            <div class="footer">
              <p style="margin: 0; font-weight: 600; color: #a1a1aa;">Dr. Melwin Vincent &bull; BMF Founders Admissions Office</p>
              <p style="margin: 4px 0 0 0;">Networking, Investments, Opportunities. All in one place.</p>
              <p style="margin: 12px 0 0 0; font-size: 10px; color: #52525b; line-height: 1.5;">
                This is an automated transactional intro notification. To connect with each other, please hit <strong>Reply All</strong>.<br />
                For concierge assistance or support, contact <a href="mailto:support@buildwithmelwin.com" style="color: #71717a; text-decoration: underline;">support@buildwithmelwin.com</a>
              </p>
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
              <p style="margin: 0; font-weight: 600; color: #a1a1aa;">BMF Founders Club Admissions & Concierge</p>
              <p style="margin: 4px 0 0 0;">Networking, Investments, Opportunities. All in one place.</p>
              <p style="margin: 12px 0 0 0; font-size: 10px; color: #52525b; line-height: 1.5;">
                This is an automated transactional confirmation &bull; Please do not reply directly to this address.<br />
                For questions or assistance, contact <a href="mailto:support@buildwithmelwin.com" style="color: #71717a; text-decoration: underline;">support@buildwithmelwin.com</a>
              </p>
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


