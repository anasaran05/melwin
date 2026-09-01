import QRCode from 'qrcode'
import { BmfMember } from '@/lib/supabase/bmf-members'
import { normalizeR2Url, getFounderFallbackAvatar } from '@/lib/image-utils'
import { getCardTheme } from '@/lib/card-themes'

/**
 * Returns the absolute or relative showcase link for a founder.
 */
export function getFounderShowcaseUrl(member: BmfMember, baseUrl?: string): string {
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://buildwithmelwin.com')
  const identifier = member.id || 'bmf-1'
  return `${origin}/bmf-club/showcase/${encodeURIComponent(identifier)}`
}

/**
 * Generates a data URL for the QR code encoding the showcase URL.
 */
export async function generateFounderQrDataUrl(
  member: BmfMember,
  options?: { width?: number; margin?: number; darkColor?: string; lightColor?: string; baseUrl?: string }
): Promise<string> {
  const url = getFounderShowcaseUrl(member, options?.baseUrl)
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: options?.width || 360,
      margin: options?.margin ?? 1,
      color: {
        dark: options?.darkColor || '#000000',
        light: options?.lightColor || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
    return dataUrl
  } catch (err) {
    console.error('Error generating founder QR code:', err)
    return ''
  }
}

/**
 * Loads an image from a URL as an HTMLImageElement with crossOrigin support and proxy fallback.
 */
async function loadImage(src: string): Promise<HTMLImageElement> {
  if (!src || src.trim() === '') {
    throw new Error('Empty image source')
  }

  // If already data URL or blob URL, load directly
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load data/blob image'))
      img.src = src
    })
  }

  // Construct candidates in priority:
  // 1. Through our Next.js image proxy /api/proxy-image?url=... (guaranteed CORS allow-origin: *)
  // 2. Direct URL with anonymous crossOrigin
  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`
  const candidates = [proxyUrl, src]

  for (const candidate of candidates) {
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image()
        image.crossOrigin = 'anonymous'
        image.onload = () => resolve(image)
        image.onerror = (e) => reject(e)
        image.src = candidate
      })
      if (img.naturalWidth > 0 || img.width > 0) {
        return img
      }
    } catch {
      // Continue to next candidate
    }
  }

  throw new Error(`Failed to load image from all sources: ${src}`)
}

/**
 * Helper to draw rounded rectangle on Canvas
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

/**
 * Renders a high-res (800x1200) official Founder Pass Card onto an offscreen canvas and returns PNG Data URL.
 */
export async function generateHighResFounderCardPng(
  member: BmfMember,
  baseUrl?: string
): Promise<string> {
  if (typeof window === 'undefined') return ''

  const width = 800
  const height = 1200
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const isFeatured = Boolean(member.is_featured)

  // 1. Draw Card Outer Background
  ctx.fillStyle = '#0a0a0c'
  ctx.fillRect(0, 0, width, height)

  // Subtle radial gradient in the background
  const radialBg = ctx.createRadialGradient(width / 2, height / 3, 50, width / 2, height / 2, width)
  radialBg.addColorStop(0, '#131916')
  radialBg.addColorStop(0.6, '#0d0f12')
  radialBg.addColorStop(1, '#050507')
  ctx.fillStyle = radialBg
  ctx.fillRect(0, 0, width, height)

  // 2. Outer Border & Luxury Chamfer
  ctx.strokeStyle = isFeatured ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.12)'
  ctx.lineWidth = 4
  drawRoundedRect(ctx, 24, 24, width - 48, height - 48, 36)
  ctx.stroke()

  // 3. Inner Card Glow Container
  drawRoundedRect(ctx, 36, 36, width - 72, height - 72, 28)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
  ctx.lineWidth = 2
  ctx.stroke()

  // 4. Header Bar: BMF CLUB FOUNDER PASS
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 22px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('BMF CLUB', 64, 90)

  ctx.fillStyle = isFeatured ? '#10b981' : '#9ca3af'
  ctx.font = '600 16px monospace'
  ctx.fillText(isFeatured ? '★ SPOTLIGHT FOUNDER' : '• FOUNDING MEMBER', 64, 118)

  // Verified Badge / Seal (Top Right)
  ctx.textAlign = 'right'
  ctx.fillStyle = '#1d9bf0'
  ctx.font = 'bold 15px sans-serif'
  ctx.fillText('VERIFIED PASS', width - 64, 90)

  ctx.fillStyle = '#6b7280'
  ctx.font = '13px monospace'
  ctx.fillText(`ID: ${member.id?.toUpperCase().slice(0, 12) || 'BMF-EXEC'}`, width - 64, 114)

  // Horizontal Divider Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(64, 140)
  ctx.lineTo(width - 64, 140)
  ctx.stroke()

  // 5. Founder Portrait Photo
  const portraitX = 64
  const portraitY = 170
  const portraitW = width - 128
  const portraitH = 460

  ctx.save()
  drawRoundedRect(ctx, portraitX, portraitY, portraitW, portraitH, 24)
  ctx.clip()

  // Draw portrait placeholder background
  ctx.fillStyle = '#17171a'
  ctx.fillRect(portraitX, portraitY, portraitW, portraitH)

  let avatarUrl = member.avatar_url ? normalizeR2Url(member.avatar_url) : ''
  if (!avatarUrl || avatarUrl.trim() === '') {
    avatarUrl = getFounderFallbackAvatar(member.full_name)
  }

  try {
    const avatarImg = await loadImage(avatarUrl)
    const imgRatio = avatarImg.width / avatarImg.height
    const targetRatio = portraitW / portraitH
    let drawW = portraitW
    let drawH = portraitH
    let offsetX = portraitX
    let offsetY = portraitY

    if (imgRatio > targetRatio) {
      drawW = portraitH * imgRatio
      offsetX = portraitX - (drawW - portraitW) / 2
    } else {
      drawH = portraitW / imgRatio
      offsetY = portraitY - (drawH - portraitH) / 2
    }

    ctx.drawImage(avatarImg, offsetX, offsetY, drawW, drawH)
  } catch (err) {
    console.warn('Canvas image fallback due to error:', err)
    ctx.fillStyle = '#1a1f1d'
    ctx.fillRect(portraitX, portraitY, portraitW, portraitH)
    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 90px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(member.full_name?.charAt(0) || 'F', portraitX + portraitW / 2, portraitY + portraitH / 2 + 30)
  }

  // Portrait Vignette Gradient
  const vignette = ctx.createLinearGradient(portraitX, portraitY + portraitH - 180, portraitX, portraitY + portraitH)
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.95)')
  ctx.fillStyle = vignette
  ctx.fillRect(portraitX, portraitY, portraitW, portraitH)

  ctx.restore()

  // 6. Founder Name & Verified Mark
  ctx.textAlign = 'left'
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 36px sans-serif'
  ctx.fillText(member.full_name, 64, 690)

  // Role
  ctx.fillStyle = '#f3f4f6'
  ctx.font = '600 20px sans-serif'
  ctx.fillText(member.role, 64, 725)

  // Company Name & Category
  ctx.fillStyle = isFeatured ? '#34d399' : '#93c5fd'
  ctx.font = 'bold 20px monospace'
  ctx.fillText(member.company_name || 'Stealth Venture', 64, 760)

  if (member.category) {
    ctx.fillStyle = '#9ca3af'
    ctx.font = '16px monospace'
    ctx.fillText(`Sector: ${member.category}`, 64, 792)
  }

  // 6.5 Draw Company Logo on the Right Side (Above QR Code)
  const companyLogoUrl = member.company_logo ? normalizeR2Url(member.company_logo) : ''
  if (companyLogoUrl && companyLogoUrl.trim() !== '') {
    try {
      const logoImg = await loadImage(companyLogoUrl)
      const logoBoxSize = 92
      const logoBoxX = width - 64 - logoBoxSize
      const logoBoxY = 680

      ctx.save()
      // Crisp white pill container for logo
      ctx.fillStyle = '#ffffff'
      drawRoundedRect(ctx, logoBoxX, logoBoxY, logoBoxSize, logoBoxSize, 20)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Inner clip for logo
      drawRoundedRect(ctx, logoBoxX + 6, logoBoxY + 6, logoBoxSize - 12, logoBoxSize - 12, 16)
      ctx.clip()

      // Calculate containment aspect ratio
      const logoRatio = logoImg.width / logoImg.height
      let drawLW = logoBoxSize - 16
      let drawLH = logoBoxSize - 16
      let logoOffsetX = logoBoxX + 8
      let logoOffsetY = logoBoxY + 8

      if (logoRatio > 1) {
        drawLH = (logoBoxSize - 16) / logoRatio
        logoOffsetY = logoBoxY + 8 + (logoBoxSize - 16 - drawLH) / 2
      } else {
        drawLW = (logoBoxSize - 16) * logoRatio
        logoOffsetX = logoBoxX + 8 + (logoBoxSize - 16 - drawLW) / 2
      }

      ctx.drawImage(logoImg, logoOffsetX, logoOffsetY, drawLW, drawLH)
      ctx.restore()
    } catch (logoErr) {
      console.warn('Canvas company logo load fallback:', logoErr)
    }
  }

  // Traction / Stage Badges
  if (member.stage || member.metrics) {
    const badgeY = 825
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    drawRoundedRect(ctx, 64, badgeY, width - 128, 54, 14)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = '#34d399'
    ctx.font = 'bold 16px monospace'
    ctx.fillText(member.metrics ? `⚡ ${member.metrics}` : `★ ${member.stage}`, 84, badgeY + 34)

    if (member.location) {
      ctx.textAlign = 'right'
      ctx.fillStyle = '#9ca3af'
      ctx.font = '15px sans-serif'
      ctx.fillText(`📍 ${member.location}`, width - 84, badgeY + 34)
    }
  }

  // 7. Bottom Section: QR Code + BMF Club Verified Emblem
  const qrSize = 176
  const qrX = width - 64 - qrSize
  const qrY = 924

  // Draw QR Code Container
  try {
    const qrDataUrl = await generateFounderQrDataUrl(member, {
      width: qrSize,
      margin: 1,
      baseUrl,
      darkColor: '#000000',
      lightColor: '#ffffff',
    })
    if (qrDataUrl) {
      const qrImg = await loadImage(qrDataUrl)
      ctx.save()
      ctx.fillStyle = '#ffffff'
      drawRoundedRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 18)
      ctx.fill()
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
      ctx.restore()
    }
  } catch (err) {
    console.error('Error drawing QR code on canvas:', err)
  }

  // Bottom Left: BMF Club Verified Emblem & Identity
  const bottomBadgeX = 64
  const bottomBadgeY = 932
  const badgeSize = 54

  // Draw Official BMF Club Logo Badge (/bwm-logo.jpg)
  try {
    const bwmLogoImg = await loadImage('/bwm-logo.jpg')
    ctx.save()
    drawRoundedRect(ctx, bottomBadgeX, bottomBadgeY, badgeSize, badgeSize, 14)
    ctx.clip()
    ctx.drawImage(bwmLogoImg, bottomBadgeX, bottomBadgeY, badgeSize, badgeSize)
    ctx.restore()

    // Outer subtle border
    ctx.save()
    drawRoundedRect(ctx, bottomBadgeX, bottomBadgeY, badgeSize, badgeSize, 14)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.restore()
  } catch (err) {
    // Fallback: Emerald Icon Badge
    ctx.save()
    drawRoundedRect(ctx, bottomBadgeX, bottomBadgeY, badgeSize, badgeSize, 14)
    ctx.fillStyle = '#10b981'
    ctx.fill()

    ctx.fillStyle = '#000000'
    ctx.font = '900 26px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('M', bottomBadgeX + badgeSize / 2, bottomBadgeY + badgeSize / 2 + 1)
    ctx.restore()
  }

  // Verified Checkmark Icon beside BMF Club Title
  const textStartX = bottomBadgeX + badgeSize + 14

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  // Line 1: BMF CLUB + Verified Checkmark
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 22px sans-serif'
  ctx.fillText('BMF CLUB', textStartX, bottomBadgeY + 22)

  // Draw Verified Checkmark Badge Icon
  const bmfTextWidth = ctx.measureText('BMF CLUB').width
  const checkX = textStartX + bmfTextWidth + 10
  const checkY = bottomBadgeY + 7
  const checkR = 10

  ctx.save()
  ctx.beginPath()
  ctx.arc(checkX + checkR, checkY + checkR, checkR, 0, Math.PI * 2)
  ctx.fillStyle = '#1d9bf0'
  ctx.fill()

  // Draw white checkmark inside circle
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(checkX + checkR - 4, checkY + checkR)
  ctx.lineTo(checkX + checkR - 1, checkY + checkR + 3)
  ctx.lineTo(checkX + checkR + 4, checkY + checkR - 3)
  ctx.stroke()
  ctx.restore()

  // Line 2: Executive Syndicate Founder Pass
  ctx.fillStyle = '#9ca3af'
  ctx.font = '600 14px sans-serif'
  ctx.fillText('Executive Syndicate Founder Pass', textStartX, bottomBadgeY + 46)

  // Line 3: Actionable Instruction
  ctx.fillStyle = '#cbd5e1'
  ctx.font = '13px sans-serif'
  ctx.fillText('Scan QR with phone camera to open verified showcase', 64, bottomBadgeY + 84)

  // Line 4: Clean Web Domain
  ctx.fillStyle = '#10b981'
  ctx.font = 'bold 13px monospace'
  ctx.fillText('buildwithmelwin.com/bmf-club', 64, bottomBadgeY + 108)

  // Card Footer Signature
  ctx.fillStyle = '#4b5563'
  ctx.font = '12px monospace'
  ctx.fillText('ISSUED BY BMF CLUB EXECUTIVE SYNDICATE • 2026', 64, 1120)

  return canvas.toDataURL('image/png')
}

/**
 * Triggers native browser download of the data URL.
 */
export function downloadDataUrlAsFile(dataUrl: string, filename: string) {
  if (typeof window === 'undefined') return
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
