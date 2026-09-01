'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Linkedin, 
  Twitter, 
  Globe, 
  MapPin, 
  Users, 
  TrendingUp, 
  ArrowUpRight,
  Building2,
  Sparkles,
  Calendar,
  Layers,
  Send,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Check
} from 'lucide-react'
import { BmfMember } from '@/lib/supabase/bmf-members'
import { normalizeR2Url, getFounderFallbackAvatar } from '@/lib/image-utils'
import { getCardTheme } from '@/lib/card-themes'
import { ShareFounderCardModal } from '@/components/bmf-club/share-founder-card-modal'

interface FounderProfileModalProps {
  isOpen: boolean
  onClose: () => void
  member: BmfMember | null
  onApproach?: (member: BmfMember) => void
  isOwnCard?: boolean
}

function formatMemberSince(dateStr?: string) {
  if (!dateStr) return 'Aug 2026'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return 'Aug 2026'
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  } catch {
    return 'Aug 2026'
  }
}

export function FounderProfileModal({
  isOpen,
  onClose,
  member,
  onApproach,
  isOwnCard = false
}: FounderProfileModalProps) {
  const [mounted, setMounted] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!mounted || !member) return null

  const isFeatured = Boolean(member.is_featured)
  const cardTheme = isFeatured ? getCardTheme(member.card_theme) : getCardTheme('obsidian')

  const hasAvatar = Boolean(
    member.avatar_url &&
    typeof member.avatar_url === 'string' &&
    member.avatar_url.trim() !== ''
  )
  const avatarFallback = getFounderFallbackAvatar(member.full_name)
  let avatarUrl = hasAvatar ? normalizeR2Url(member.avatar_url) : ''
  if (avatarUrl && avatarUrl.includes('images.unsplash.com') && !avatarUrl.includes('w=')) {
    avatarUrl = `${avatarUrl}&w=800&q=85&auto=format`
  }

  const isCustomLogo = Boolean(
    member.company_logo &&
    typeof member.company_logo === 'string' &&
    member.company_logo.trim() !== '' &&
    !member.company_logo.includes('images.unsplash.com') &&
    !member.company_logo.includes('api.dicebear.com')
  )
  const logoUrl = isCustomLogo ? normalizeR2Url(member.company_logo) : ''

  const handleOpenShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsShareModalOpen(true)
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl ${cardTheme.bgClasses} text-white border ${cardTheme.borderClasses} shadow-2xl overflow-hidden z-10`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="founder-modal-name"
          >
            {/* Ambient theme glow */}
            <div 
              className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-25 blur-3xl pointer-events-none"
              style={{ background: cardTheme.previewColor }}
            />
            <div 
              className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
              style={{ background: cardTheme.previewColor }}
            />

            {/* Header controls (Close & Share) */}
            <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenShare}
                title="Share founder profile"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-all border border-white/10 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={onClose}
                title="Close modal"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-all border border-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-7 md:px-8 pt-6 sm:pt-7 pb-6 space-y-6">
              
              {/* 1. HERO IDENTITY SECTION */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-1">
                {/* Large Portrait / Avatar with Companion Company Logo */}
                <div className="relative shrink-0">
                  <div 
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-neutral-900 border-2 shadow-2xl flex items-center justify-center relative"
                    style={{ borderColor: isFeatured ? `${cardTheme.previewColor}80` : 'rgba(255,255,255,0.2)' }}
                  >
                    {hasAvatar ? (
                      <img
                        src={avatarUrl}
                        alt={member.full_name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.currentTarget.src = avatarFallback
                        }}
                      />
                    ) : (
                      <span className={`text-3xl sm:text-4xl font-black ${isFeatured ? cardTheme.accentTextColor : 'text-neutral-400'}`}>
                        {member.full_name ? member.full_name.charAt(0).toUpperCase() : 'F'}
                      </span>
                    )}
                  </div>

                  {/* Prominent Company Logo Companion Badge */}
                  {logoUrl ? (
                    <div 
                      className="absolute -bottom-2 -right-2 sm:-bottom-2.5 sm:-right-2.5 w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-[#121215] border-2 border-white/25 shadow-2xl p-1 sm:p-1.5 flex items-center justify-center z-20 transition-transform hover:scale-110"
                      title={member.company_name || 'Company Logo'}
                    >
                      <img
                        src={logoUrl}
                        alt={member.company_name || 'Company Logo'}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  ) : isFeatured ? (
                    <div 
                      className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-[#111111] border border-white/20 shadow-md flex items-center justify-center z-20"
                      title="Verified Spotlight Founder"
                    >
                      <svg 
                        viewBox="0 0 24 24" 
                        aria-label="Verified Spotlight Founder" 
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[#1d9bf0] fill-current"
                      >
                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.75 4.75l-4-4 1.41-1.41 2.59 2.58 6.59-6.58 1.41 1.41-8 8z" />
                      </svg>
                    </div>
                  ) : null}
                </div>

                {/* Name, Role, Company & Badges */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 id="founder-modal-name" className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                      <span>{member.full_name}</span>
                    </h3>

                    {/* Verified Blue Badge when logo is showing on avatar */}
                    {isFeatured && (
                      <svg 
                        viewBox="0 0 24 24" 
                        aria-label="Verified Spotlight Founder" 
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[#1d9bf0] fill-current shrink-0"
                      >
                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.75 4.75l-4-4 1.41-1.41 2.59 2.58 6.59-6.58 1.41 1.41-8 8z" />
                      </svg>
                    )}
                    
                    {isFeatured ? (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Spotlight Founder</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Verified Member</span>
                      </span>
                    )}
                  </div>

                  {/* Role & Company with Logo */}
                  <div className="flex items-center gap-2 text-sm sm:text-base text-neutral-300 flex-wrap">
                    <span className="font-semibold text-white">{member.role}</span>
                    {member.company_name?.trim() && (
                      <>
                        <span className="text-neutral-500">•</span>
                        <span className={`${cardTheme.accentTextColor} font-bold flex items-center gap-1.5`}>
                          {logoUrl && (
                            <img
                              src={logoUrl}
                              alt=""
                              className="w-4 h-4 sm:w-5 sm:h-5 object-contain rounded-xs"
                            />
                          )}
                          <span>{member.company_name}</span>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Badges & Category */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {member.category?.trim() && (
                      <span className={`text-xs font-mono font-semibold ${cardTheme.categoryBadgeClasses} px-2.5 py-1 rounded-lg border flex items-center gap-1`}>
                        <Layers className="w-3 h-3" />
                        <span>{member.category}</span>
                      </span>
                    )}
                    
                    <span className="text-xs font-mono text-neutral-400 flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      <span>Member since {formatMemberSince(member.created_at)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. VENTURE & BIO OVERVIEW */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                    About Founder & Venture
                  </span>
                </div>

                {member.tagline?.trim() && (
                  <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                    {member.tagline}
                  </p>
                )}

                {member.description?.trim() ? (
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                    {member.description}
                  </p>
                ) : (
                  !member.tagline?.trim() && (
                    <p className="text-xs text-neutral-400 italic">
                      Building high-impact venture in {member.category || 'tech'}.
                    </p>
                  )
                )}
              </div>

              {/* 3. KEY METRICS & TRACTION GRID */}
              {(member.stage?.trim() || member.metrics?.trim() || member.location?.trim() || member.team_size?.trim()) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Stage */}
                  {member.stage?.trim() && (
                    <div className={`${cardTheme.metricBgClasses} border rounded-xl p-3.5 space-y-1`}>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Venture Stage
                      </span>
                      <p className="text-sm font-bold text-white">
                        {member.stage}
                      </p>
                    </div>
                  )}

                  {/* Traction / Milestones */}
                  {member.metrics?.trim() && (
                    <div className={`${cardTheme.metricBgClasses} border rounded-xl p-3.5 space-y-1`}>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        Key Traction & Metrics
                      </span>
                      <p className="text-sm font-bold text-emerald-400">
                        {member.metrics}
                      </p>
                    </div>
                  )}

                  {/* Location */}
                  {member.location?.trim() && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        Headquarters / Location
                      </span>
                      <p className="text-sm font-medium text-white">
                        {member.location}
                      </p>
                    </div>
                  )}

                  {/* Team Size */}
                  {member.team_size?.trim() && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        Team Strength
                      </span>
                      <p className="text-sm font-medium text-white">
                        {member.team_size} {member.team_size.toLowerCase().includes('member') || member.team_size.toLowerCase().includes('people') ? '' : 'Members'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 4. SOCIAL & EXTERNAL PROFILES */}
              {(member.linkedin_url?.trim() || member.twitter_url?.trim() || member.website_url?.trim()) && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
                    Verified Links & Channels
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {member.linkedin_url?.trim() && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0A66C2]/20 hover:bg-[#0A66C2] text-[#70b5f9] hover:text-white border border-[#0A66C2]/40 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LinkedIn Profile</span>
                        <ArrowUpRight className="w-3 h-3 opacity-70" />
                      </a>
                    )}

                    {member.twitter_url?.trim() && (
                      <a
                        href={member.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                        <span>Twitter / X</span>
                        <ArrowUpRight className="w-3 h-3 opacity-70" />
                      </a>
                    )}

                    {member.website_url?.trim() && (
                      <a
                        href={member.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Company Website</span>
                        <ArrowUpRight className="w-3 h-3 opacity-70" />
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* 5. FOOTER STICKY ACTION BAR */}
            <div className="border-t border-white/10 bg-black/40 backdrop-blur-xl px-5 sm:px-7 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-neutral-400 hidden sm:block">
                <span>Want to connect with {member.full_name}?</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                >
                  Close
                </button>

                {isOwnCard ? (
                  <Link
                    href="/bmf-club/dashboard"
                    onClick={onClose}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shadow-lg active:scale-95 cursor-pointer"
                  >
                    <span>Edit Profile in Dashboard</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      if (onApproach) {
                        onApproach(member)
                      }
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shadow-lg active:scale-95 cursor-pointer group"
                  >
                    <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    <span>Approach Founder</span>
                  </button>
                )}
              </div>
            </div>

          </motion.div>

          {/* Share Founder Card Modal */}
          <ShareFounderCardModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            member={member}
            isOwnCard={isOwnCard}
          />
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
