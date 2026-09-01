'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  QrCode, 
  Sparkles, 
  ExternalLink,
  Loader2,
  CheckCircle2,
  Send,
  Linkedin,
  Twitter
} from 'lucide-react'
import { BmfMember, isProfileEligibleForShowcase, getProfileMissingFields } from '@/lib/supabase/bmf-members'
import { normalizeR2Url } from '@/lib/image-utils'
import { 
  getFounderShowcaseUrl, 
  generateFounderQrDataUrl, 
  generateHighResFounderCardPng, 
  downloadDataUrlAsFile 
} from '@/lib/qr-card-generator'
import { getCardTheme } from '@/lib/card-themes'

interface ShareFounderCardModalProps {
  isOpen: boolean
  onClose: () => void
  member: BmfMember | null
  isOwnCard?: boolean
  currentUserId?: string
  currentUserEmail?: string
}

const IconWhatsApp = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" {...props}>
    <title>WhatsApp</title>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export function ShareFounderCardModal({ 
  isOpen, 
  onClose, 
  member,
  isOwnCard = false,
  currentUserId,
  currentUserEmail
}: ShareFounderCardModalProps) {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isGeneratingDownload, setIsGeneratingDownload] = useState(false)
  const [showQrExpanded, setShowQrExpanded] = useState(false)
  const [localIsOwn, setLocalIsOwn] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && member?.email) {
      const storedEmail = localStorage.getItem('bmf_current_user_email')
      if (storedEmail && storedEmail.trim().toLowerCase() === member.email.trim().toLowerCase()) {
        setLocalIsOwn(true)
      }
    }
  }, [member])

  useEffect(() => {
    if (!isOpen || !member) return
    let active = true

    async function loadQr() {
      if (!member) return
      const qr = await generateFounderQrDataUrl(member, { width: 300, margin: 1 })
      if (active && qr) {
        setQrCodeUrl(qr)
      }
    }

    loadQr()
    return () => {
      active = false
    }
  }, [isOpen, member])

  if (!mounted || !isOpen || !member) return null

  const effectiveIsOwnCard = Boolean(
    isOwnCard ||
    localIsOwn ||
    (currentUserId && member.user_id && currentUserId === member.user_id) ||
    (currentUserId && member.id && currentUserId === member.id) ||
    (currentUserEmail && member.email && currentUserEmail.trim().toLowerCase() === member.email.trim().toLowerCase())
  )

  const isEligible = isProfileEligibleForShowcase(member)
  const missingFields = getProfileMissingFields(member)

  const showcaseUrl = getFounderShowcaseUrl(member)
  const isFeatured = Boolean(member.is_featured)
  const cardTheme = isFeatured ? getCardTheme(member.card_theme) : getCardTheme('obsidian')

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(showcaseUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch {
      // Fallback
    }
  }

  const handleShareWhatsApp = () => {
    const text = effectiveIsOwnCard
      ? `🌟 Discover my official BMF Club Founder Pass & Showcase Profile:\n${showcaseUrl}\n\nJoin the elite founder syndicate at buildwithmelwin.com/bmf-club`
      : `🌟 Check out ${member.full_name}'s official BMF Club Founder Pass (${member.role} at ${member.company_name}):\n${showcaseUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(showcaseUrl)}`, '_blank')
  }

  const handleShareTwitter = () => {
    const text = effectiveIsOwnCard
      ? `Proud to share my verified Founder Pass inside the @BuildWithMelwin BMF Club Syndicate!`
      : `Check out ${member.full_name}'s Founder Pass inside the @BuildWithMelwin BMF Club Syndicate!`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(showcaseUrl)}`, '_blank')
  }

  const handleDownloadCard = async () => {
    if (!effectiveIsOwnCard) return
    try {
      setIsGeneratingDownload(true)
      const pngDataUrl = await generateHighResFounderCardPng(member)
      if (pngDataUrl) {
        const slugName = member.full_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        downloadDataUrlAsFile(pngDataUrl, `bmf-founder-pass-${slugName}.png`)
      }
    } catch (err) {
      console.error('Failed to generate high-res card:', err)
    } finally {
      setIsGeneratingDownload(false)
    }
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${member.full_name} | BMF Club Founder Pass`,
          text: `${member.role} at ${member.company_name}. Verified Member of BMF Executive Syndicate.`,
          url: showcaseUrl,
        })
      } catch {
        // User cancelled or not supported
      }
    } else {
      handleCopyLink()
    }
  }

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-[#0e0f13] border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl text-white overflow-hidden"
        >
          {/* Ambient Glow */}
          <div 
            className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: `radial-gradient(circle, ${cardTheme.previewColor}, transparent 70%)` }}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-1.5 pr-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Share2 className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Share Founder Pass
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400">
              {effectiveIsOwnCard 
                ? 'Share your interactive pass with dynamic preview cards and embedded verification.' 
                : `Share ${member.full_name}’s interactive pass with dynamic preview cards and embedded verification.`}
            </p>
          </div>

          {/* Incomplete Profile Alert for Owner */}
          {effectiveIsOwnCard && !isEligible && (
            <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-200 block">Profile Incomplete</strong>
                <span>Please complete your {missingFields.join(', ')} in the Dashboard to unlock full card downloads & public showcase verification.</span>
              </div>
            </div>
          )}

          {/* Card Summary Badge */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {member.avatar_url ? (
                <img
                  src={normalizeR2Url(member.avatar_url)}
                  alt={member.full_name}
                  className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center text-lg font-black text-emerald-400 shrink-0">
                  {member.full_name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white truncate">
                    {member.full_name}
                  </h3>
                  {isFeatured && (
                    <span className="text-xs text-sky-400 shrink-0">★</span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 truncate">
                  {member.role} • {member.company_name}
                </p>
                <span className="inline-block mt-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {member.category || 'DeepTech & AI'}
                </span>
              </div>
            </div>

            {/* Embedded QR Mini Thumbnail */}
            {qrCodeUrl && (
              <button
                type="button"
                onClick={() => setShowQrExpanded(!showQrExpanded)}
                className="w-12 h-12 p-1 bg-white rounded-xl shadow-md shrink-0 hover:scale-105 transition-transform cursor-pointer"
                title="View Full QR Code"
              >
                <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
              </button>
            )}
          </div>

          {/* QR Code Expanded View (Toggleable) */}
          {showQrExpanded && qrCodeUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-2xl bg-white text-black text-center space-y-2 flex flex-col items-center"
            >
              <img src={qrCodeUrl} alt="Founder QR Code" className="w-40 h-40 object-contain rounded-lg" />
              <p className="text-xs font-bold text-neutral-800">
                Scan with phone camera to open verified showcase profile
              </p>
            </motion.div>
          )}

          {/* Social Share Grid */}
          <div className="mt-4 space-y-2.5">
            <div className="grid grid-cols-3 gap-2.5">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <IconWhatsApp className="w-5 h-5" />
                <span className="text-xs font-bold">WhatsApp</span>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                onClick={handleShareLinkedIn}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-[#60a5fa] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Linkedin className="w-5 h-5" />
                <span className="text-xs font-bold">LinkedIn</span>
              </button>

              {/* Twitter / X */}
              <button
                type="button"
                onClick={handleShareTwitter}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/20 text-white transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Twitter className="w-5 h-5" />
                <span className="text-xs font-bold">Twitter / X</span>
              </button>
            </div>
          </div>

          {/* Showcase Link */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                Direct Showcase Link
              </label>
              {copied && (
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Link copied!
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/10">
              <input
                type="text"
                readOnly
                value={showcaseUrl}
                onClick={handleCopyLink}
                title="Click to copy link"
                className="bg-transparent text-xs text-neutral-300 px-3 py-1.5 w-full outline-none font-mono select-all cursor-pointer hover:text-white transition-colors"
              />
              <a
                href={showcaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 shadow-sm"
              >
                <span>See Showcase</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Action Row: Owner-Only Download Pass or More Options */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
            {effectiveIsOwnCard ? (
              <button
                type="button"
                onClick={handleDownloadCard}
                disabled={isGeneratingDownload || !isEligible}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-black px-5 py-3 rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {isGeneratingDownload ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Generating High-Res Pass...</span>
                  </>
                ) : !isEligible ? (
                  <>
                    <Sparkles className="w-4 h-4 text-neutral-500" />
                    <span>Complete Profile to Download Pass</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Pass with QR (PNG)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all active:scale-95 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Showcase Link Copied!' : 'Copy Showcase Link'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-2xl text-xs font-bold border border-white/10 transition-all active:scale-95 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>More Options</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}
