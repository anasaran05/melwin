/**
 * Admin Notification Dispatcher for BMF Club
 * Routes real-time notifications to Telegram Bot / Group and Discord Webhook
 */

export interface IntroRequestNotificationPayload {
  requestId: string
  requesterName: string
  requesterEmail: string
  requesterPhone?: string | null
  requesterCompany?: string | null
  requesterRole?: string | null
  targetMemberName: string
  targetMemberCompany: string
  targetMemberEmail: string
  purpose: string
  message: string
}

export interface IntroResponseNotificationPayload {
  requestId: string
  targetMemberName: string
  targetMemberCompany: string
  requesterName: string
  requesterEmail: string
  action: 'accepted' | 'declined'
  responseNote?: string | null
}

function escapeHtml(text: string): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN || process.env.BMF_TELEGRAM_BOT_TOKEN
  const chatId = 
    process.env.TELEGRAM_FOUNDER_INTRO_CHAT_ID || 
    process.env.TELEGRAM_CHAT_ID_FOUNDER_INTRO || 
    process.env.TELEGRAM_CHAT_ID || 
    process.env.BMF_TELEGRAM_CHAT_ID
  return { token, chatId }
}

function getDiscordWebhookUrl() {
  return (
    process.env.DISCORD_WEBHOOK_URL_FOUNDER_INTRO ||
    process.env.DISCORD_WEBHOOK_URL_founder_intro ||
    process.env.DISCORD_WEBHOOK_URL ||
    process.env.BMF_DISCORD_WEBHOOK_URL
  )
}

/**
 * Dispatches real-time alerts to Telegram and Discord when a new warm intro is requested
 */
export async function sendAdminIntroRequestAlert(payload: IntroRequestNotificationPayload) {
  const tasks: Promise<any>[] = []

  // 1. Telegram Dispatch (HTML Mode for 100% Reliability)
  const { token: telegramBotToken, chatId: telegramChatId } = getTelegramConfig()

  if (telegramBotToken && telegramChatId) {
    const telegramHtml = [
      `🤝 <b>NEW BMF CLUB INTRO REQUEST</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 <b>Requester:</b> ${escapeHtml(payload.requesterName)} ${payload.requesterRole ? `(${escapeHtml(payload.requesterRole)})` : ''}`,
      `🏢 <b>Company:</b> ${escapeHtml(payload.requesterCompany || 'Not specified')}`,
      `📧 <b>Email:</b> <code>${escapeHtml(payload.requesterEmail)}</code>`,
      `📱 <b>WhatsApp:</b> <code>${escapeHtml(payload.requesterPhone || 'Not provided')}</code>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🎯 <b>Target Founder:</b> <b>${escapeHtml(payload.targetMemberName)}</b> (${escapeHtml(payload.targetMemberCompany)})`,
      `🏷️ <b>Purpose:</b> <b>${escapeHtml(payload.purpose)}</b>`,
      `💬 <b>Pitch / Message:</b>`,
      `<i>"${escapeHtml(payload.message)}"</i>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🔗 <a href="https://buildwithmelwin.com/dashboard/manager/bmf-review">Open Admin Master Console</a>`,
    ].join('\n')

    tasks.push(
      (async () => {
        try {
          const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: telegramHtml,
              parse_mode: 'HTML',
              disable_web_page_preview: true,
            }),
          })
          if (!res.ok) {
            const errData = await res.text()
            console.error('[Telegram Intro Alert Error Response]:', res.status, errData)
          }
        } catch (err) {
          console.error('[Telegram Intro Alert Network Error]:', err)
        }
      })()
    )
  } else {
    console.warn('[Telegram Intro Alert Warning]: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment variables.')
  }

  // 2. Discord Webhook Dispatch
  const discordWebhookUrl = getDiscordWebhookUrl()

  if (discordWebhookUrl) {
    const discordEmbed = {
      username: 'BMF Club Concierge',
      avatar_url: 'https://img.icons8.com/stickers/500/verified-badge.png',
      embeds: [
        {
          title: '🤝 New Founder Intro Request',
          description: `**${payload.requesterName}** has requested a warm introduction to **${payload.targetMemberName}** (${payload.targetMemberCompany}).`,
          color: 0x10b981, // Emerald Green
          fields: [
            {
              name: '👤 Requester Details',
              value: `**Name:** ${payload.requesterName}\n**Role/Co:** ${payload.requesterRole || 'Founder'} @ ${payload.requesterCompany || 'Independent'}\n**Email:** ${payload.requesterEmail}\n**WhatsApp:** ${payload.requesterPhone || 'N/A'}`,
              inline: true,
            },
            {
              name: '🎯 Target Founder',
              value: `**Founder:** ${payload.targetMemberName}\n**Company:** ${payload.targetMemberCompany}\n**Email:** ${payload.targetMemberEmail}`,
              inline: true,
            },
            {
              name: '🏷️ Purpose & Objective',
              value: `**${payload.purpose}**`,
              inline: false,
            },
            {
              name: '💬 Note / Context',
              value: `>>> ${payload.message}`,
              inline: false,
            },
          ],
          footer: {
            text: 'BMF Club Founder Network • Real-time Deal Flow',
          },
          timestamp: new Date().toISOString(),
        },
      ],
    }

    tasks.push(
      fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordEmbed),
      }).catch((err) => console.error('[Discord Intro Alert Error]:', err))
    )
  }

  await Promise.allSettled(tasks)
}

/**
 * Dispatches real-time alerts to Telegram and Discord when a founder accepts or declines an intro
 */
export async function sendAdminIntroResponseAlert(payload: IntroResponseNotificationPayload) {
  const tasks: Promise<any>[] = []

  const isAccepted = payload.action === 'accepted'
  const emoji = isAccepted ? '🎉' : '❌'
  const actionLabel = isAccepted ? 'ACCEPTED & CONNECTED' : 'DECLINED / PASSED'

  // 1. Telegram Dispatch
  const { token: telegramBotToken, chatId: telegramChatId } = getTelegramConfig()

  if (telegramBotToken && telegramChatId) {
    const telegramHtml = [
      `${emoji} <b>INTRO UPDATE: ${actionLabel}</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🎯 <b>Target Founder:</b> <b>${escapeHtml(payload.targetMemberName)}</b> (${escapeHtml(payload.targetMemberCompany)})`,
      `👤 <b>Requester:</b> ${escapeHtml(payload.requesterName)} (<code>${escapeHtml(payload.requesterEmail)}</code>)`,
      `📝 <b>Status:</b> <b>${actionLabel}</b>`,
      payload.responseNote ? `💬 <b>Note:</b> <i>"${escapeHtml(payload.responseNote)}"</i>` : '',
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      isAccepted ? `✨ <b>Action:</b> Mutual warm introduction email automatically dispatched via Resend!` : '',
    ].filter(Boolean).join('\n')

    tasks.push(
      (async () => {
        try {
          const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: telegramHtml,
              parse_mode: 'HTML',
              disable_web_page_preview: true,
            }),
          })
          if (!res.ok) {
            const errData = await res.text()
            console.error('[Telegram Response Alert Error Response]:', res.status, errData)
          }
        } catch (err) {
          console.error('[Telegram Response Alert Network Error]:', err)
        }
      })()
    )
  }

  // 2. Discord Webhook Dispatch
  const discordWebhookUrl = getDiscordWebhookUrl()

  if (discordWebhookUrl) {
    const discordEmbed = {
      username: 'BMF Club Concierge',
      embeds: [
        {
          title: `${emoji} Intro Request ${isAccepted ? 'Accepted' : 'Declined'}`,
          description: `**${payload.targetMemberName}** (${payload.targetMemberCompany}) has **${actionLabel}** the introduction request from **${payload.requesterName}**.`,
          color: isAccepted ? 0x3b82f6 : 0xef4444,
          fields: [
            {
              name: '🎯 Target Founder',
              value: `${payload.targetMemberName} (${payload.targetMemberCompany})`,
              inline: true,
            },
            {
              name: '👤 Requester',
              value: `${payload.requesterName} (${payload.requesterEmail})`,
              inline: true,
            },
          ],
          footer: {
            text: isAccepted ? 'Emails exchanged successfully via Resend' : 'Request closed cleanly',
          },
          timestamp: new Date().toISOString(),
        },
      ],
    }

    tasks.push(
      fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordEmbed),
      }).catch((err) => console.error('[Discord Response Alert Error]:', err))
    )
  }

  await Promise.allSettled(tasks)
}

export interface StorePurchaseNotificationPayload {
  orderId: string
  productId?: string | null
  productTitle: string
  amount: number
  currency?: string
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  downloadUrl?: string | null
  paymentMethod?: string | null
  cfPaymentId?: string | null
  discountAppliedPercent?: number
}

/**
 * Dispatches real-time alerts to Telegram and Discord when a digital asset is purchased in the BMF Store
 */
export async function sendStorePurchaseAlert(payload: StorePurchaseNotificationPayload): Promise<{
  telegram: boolean
  discord: boolean
}> {
  const tasks: Promise<any>[] = []
  let telegramSent = false
  let discordSent = false

  // 1. Telegram Dispatch (HTML Mode for 100% Reliable Parsing)
  const { token: telegramBotToken, chatId: telegramChatId } = getTelegramConfig()

  if (telegramBotToken && telegramChatId) {
    const safeTitle = escapeHtml(payload.productTitle)
    const safeName = escapeHtml(payload.customerName)
    const safeEmail = escapeHtml(payload.customerEmail)
    const safePhone = escapeHtml(payload.customerPhone || 'N/A')
    const safeOrderId = escapeHtml(payload.orderId)
    const safeGateway = escapeHtml(payload.paymentMethod ? `Cashfree (${payload.paymentMethod})` : 'Cashfree PG')
    const safeAssetUrl = payload.downloadUrl ? escapeHtml(payload.downloadUrl) : ''

    const telegramHtml = [
      `🛍️ <b>NEW BMF STORE PURCHASE!</b> 💰`,
      ``,
      `📦 <b>Product:</b> ${safeTitle}`,
      `💵 <b>Amount Paid:</b> ₹${payload.amount}${payload.discountAppliedPercent ? ` (${payload.discountAppliedPercent}% off)` : ''}`,
      `👤 <b>Customer:</b> ${safeName}`,
      `📧 <b>Email:</b> ${safeEmail}`,
      `📱 <b>Phone:</b> ${safePhone}`,
      `🧾 <b>Order ID:</b> <code>${safeOrderId}</code>`,
      `💳 <b>Payment Gateway:</b> ${safeGateway}`,
      safeAssetUrl ? `🔗 <b>Asset Download:</b> <a href="${safeAssetUrl}">Click Here</a>` : `🔗 <b>Fulfillment:</b> Unlocked in Member Dashboard`,
      ``,
      `⚡ <i>Instant digital fulfillment active.</i>`
    ].join('\n')

    tasks.push(
      (async () => {
        try {
          const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: telegramHtml,
              parse_mode: 'HTML',
              disable_web_page_preview: true,
            }),
          })
          if (res.ok) {
            telegramSent = true
          } else {
            const errData = await res.text()
            console.error('[Telegram Store Purchase Alert Error]:', res.status, errData)
          }
        } catch (err) {
          console.error('[Telegram Store Purchase Alert Network Error]:', err)
        }
      })()
    )
  } else {
    console.warn('[Telegram Alert Notice]: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID')
  }

  // 2. Discord Webhook Dispatch
  const discordWebhookUrl = getDiscordWebhookUrl()

  if (discordWebhookUrl) {
    const fields: any[] = [
      { name: '📦 Product', value: payload.productTitle, inline: false },
      { name: '💰 Amount Paid', value: `₹${payload.amount}`, inline: true },
      { name: '👤 Customer', value: payload.customerName || 'BMF Founder', inline: true },
      { name: '📧 Email', value: payload.customerEmail, inline: true },
      { name: '📱 Phone', value: payload.customerPhone || 'N/A', inline: true },
      { name: '🧾 Order ID', value: `\`${payload.orderId}\``, inline: false },
    ]

    if (payload.downloadUrl) {
      fields.push({
        name: '🔗 Download Asset',
        value: `[Open Document](${payload.downloadUrl})`,
        inline: false,
      })
    }

    const discordEmbed = {
      username: 'BMF Club Store Bot',
      embeds: [
        {
          title: '🛍️ New Store Purchase Unlocked!',
          description: `**${payload.customerName || 'A customer'}** just bought **${payload.productTitle}** for **₹${payload.amount}**!`,
          color: 0x10b981, // Emerald green
          fields,
          footer: {
            text: 'BMF Digital Assets • Cashfree Gateway',
          },
          timestamp: new Date().toISOString(),
        },
      ],
    }

    tasks.push(
      (async () => {
        try {
          const res = await fetch(discordWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordEmbed),
          })
          if (res.ok) {
            discordSent = true
          } else {
            console.error('[Discord Store Purchase Alert Error]:', res.status)
          }
        } catch (err) {
          console.error('[Discord Store Purchase Alert Error]:', err)
        }
      })()
    )
  }

  await Promise.allSettled(tasks)
  return { telegram: telegramSent, discord: discordSent }
}

export interface WebinarRegistrationAlertPayload {
  orderId: string
  eventId: string
  eventTitle: string
  ticketCode: string
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  amount: number
  paymentMethod?: string | null
  cfPaymentId?: string | null
  formCode?: string | null
}

/**
 * Dispatches real-time alerts to Telegram and Discord when an attendee signs up for a webinar / event
 */
export async function sendWebinarRegistrationAlert(payload: WebinarRegistrationAlertPayload): Promise<{
  telegram: boolean
  discord: boolean
}> {
  const tasks: Promise<any>[] = []
  let telegramSent = false
  let discordSent = false

  const { token: telegramBotToken, chatId: telegramChatId } = getTelegramConfig()

  if (telegramBotToken && telegramChatId) {
    const safeTitle = escapeHtml(payload.eventTitle)
    const safeName = escapeHtml(payload.customerName)
    const safeEmail = escapeHtml(payload.customerEmail)
    const safePhone = escapeHtml(payload.customerPhone || 'N/A')
    const safeOrderId = escapeHtml(payload.orderId)
    const safeTicketCode = escapeHtml(payload.ticketCode)
    const safeGateway = escapeHtml(payload.paymentMethod ? `Cashfree (${payload.paymentMethod})` : 'Cashfree Payment Form')

    const telegramHtml = [
      `🎟️ <b>NEW WEBINAR / EVENT REGISTRATION!</b> 🚀`,
      ``,
      `🎯 <b>Event:</b> ${safeTitle}`,
      `🎫 <b>Ticket Code:</b> <code>${safeTicketCode}</code>`,
      `💵 <b>Amount Paid:</b> ₹${payload.amount}`,
      `👤 <b>Attendee:</b> ${safeName}`,
      `📧 <b>Email:</b> ${safeEmail}`,
      `📱 <b>Phone:</b> ${safePhone}`,
      `🧾 <b>Order ID:</b> <code>${safeOrderId}</code>`,
      `💳 <b>Gateway:</b> ${safeGateway}`,
      payload.formCode ? `📝 <b>Form Code:</b> <code>${escapeHtml(payload.formCode)}</code>` : '',
      ``,
      `⚡ <i>Automated RSVP confirmation email dispatched.</i>`
    ].filter(Boolean).join('\n')

    tasks.push(
      (async () => {
        try {
          const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: telegramHtml,
              parse_mode: 'HTML',
              disable_web_page_preview: true,
            }),
          })
          if (res.ok) telegramSent = true
        } catch (err) {
          console.error('[Telegram Webinar Alert Network Error]:', err)
        }
      })()
    )
  }

  const discordWebhookUrl = getDiscordWebhookUrl()
  if (discordWebhookUrl) {
    const fields: any[] = [
      { name: '🎯 Event / Webinar', value: payload.eventTitle, inline: false },
      { name: '🎫 Ticket Code', value: `\`${payload.ticketCode}\``, inline: true },
      { name: '💰 Amount Paid', value: `₹${payload.amount}`, inline: true },
      { name: '👤 Attendee', value: payload.customerName || 'Attendee', inline: true },
      { name: '📧 Email', value: payload.customerEmail, inline: true },
      { name: '📱 Phone', value: payload.customerPhone || 'N/A', inline: true },
      { name: '🧾 Order ID', value: `\`${payload.orderId}\``, inline: false },
    ]

    const discordEmbed = {
      username: 'BMF Events Bot',
      embeds: [
        {
          title: '🎟️ New Webinar Registration Confirmed!',
          description: `**${payload.customerName}** registered for **${payload.eventTitle}**!`,
          color: 0x6366f1, // Indigo
          fields,
          footer: {
            text: 'BMF Events • Cashfree Payment Forms',
          },
          timestamp: new Date().toISOString(),
        },
      ],
    }

    tasks.push(
      fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordEmbed),
      }).then(() => { discordSent = true }).catch((err) => console.error('[Discord Webinar Alert Error]:', err))
    )
  }

  await Promise.allSettled(tasks)
  return { telegram: telegramSent, discord: discordSent }
}

export interface MembershipPurchaseAlertPayload {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  amount: number
  tier: string
  billingCycle: string
  paymentMethod?: string | null
  cfPaymentId?: string | null
}

/**
 * Dispatches real-time alerts to Telegram and Discord when a founder joins BMF Club Premium
 */
export async function sendMembershipPurchaseAlert(payload: MembershipPurchaseAlertPayload): Promise<{
  telegram: boolean
  discord: boolean
}> {
  const tasks: Promise<any>[] = []
  let telegramSent = false
  let discordSent = false

  const { token: telegramBotToken, chatId: telegramChatId } = getTelegramConfig()

  if (telegramBotToken && telegramChatId) {
    const safeName = escapeHtml(payload.customerName)
    const safeEmail = escapeHtml(payload.customerEmail)
    const safePhone = escapeHtml(payload.customerPhone || 'N/A')
    const safeOrderId = escapeHtml(payload.orderId)
    const safeGateway = escapeHtml(payload.paymentMethod ? `Cashfree (${payload.paymentMethod})` : 'Cashfree PG')

    const telegramHtml = [
      `🌟 <b>NEW BMF CLUB PREMIUM MEMBER!</b> 👑`,
      ``,
      `👤 <b>Founder:</b> ${safeName}`,
      `📧 <b>Email:</b> ${safeEmail}`,
      `📱 <b>Phone:</b> ${safePhone}`,
      `💵 <b>Amount:</b> ₹${payload.amount} (${payload.billingCycle})`,
      `🏷️ <b>Tier:</b> ${payload.tier.toUpperCase()}`,
      `🧾 <b>Order ID:</b> <code>${safeOrderId}</code>`,
      `💳 <b>Payment Gateway:</b> ${safeGateway}`,
      ``,
      `⚡ <i>Obsidian Executive Pass & Featured Founder status activated.</i>`
    ].join('\n')

    tasks.push(
      (async () => {
        try {
          const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: telegramHtml,
              parse_mode: 'HTML',
              disable_web_page_preview: true,
            }),
          })
          if (res.ok) telegramSent = true
        } catch (err) {
          console.error('[Telegram Membership Alert Network Error]:', err)
        }
      })()
    )
  }

  const discordWebhookUrl = getDiscordWebhookUrl()
  if (discordWebhookUrl) {
    const fields: any[] = [
      { name: '👑 Membership Tier', value: payload.tier.toUpperCase(), inline: true },
      { name: '💰 Amount Paid', value: `₹${payload.amount} (${payload.billingCycle})`, inline: true },
      { name: '👤 Founder', value: payload.customerName || 'Founder', inline: true },
      { name: '📧 Email', value: payload.customerEmail, inline: true },
      { name: '📱 Phone', value: payload.customerPhone || 'N/A', inline: true },
      { name: '🧾 Order ID', value: `\`${payload.orderId}\``, inline: false },
    ]

    const discordEmbed = {
      username: 'BMF Club VIP Bot',
      embeds: [
        {
          title: '🌟 New Founder Upgraded to Premium Member!',
          description: `**${payload.customerName}** has joined the BMF Club as a **${payload.tier.toUpperCase()}** member!`,
          color: 0xf59e0b, // Amber Gold
          fields,
          footer: {
            text: 'BMF Club VIP • Cashfree Gateway',
          },
          timestamp: new Date().toISOString(),
        },
      ],
    }

    tasks.push(
      fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordEmbed),
      }).then(() => { discordSent = true }).catch((err) => console.error('[Discord Membership Alert Error]:', err))
    )
  }

  await Promise.allSettled(tasks)
  return { telegram: telegramSent, discord: discordSent }
}

