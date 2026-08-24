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
