'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BmfMember } from '@/lib/supabase/bmf-members'
import { normalizeR2Url, getFounderFallbackAvatar } from '@/lib/image-utils'
import { RequestIntroModal } from '@/components/bmf-club/request-intro-modal'
import { 
  Linkedin, 
  Twitter, 
  Globe, 
  MapPin, 
  Users, 
  TrendingUp, 
  ArrowUpRight,
  Building2,
  Sparkles
} from 'lucide-react'

interface MemberFlipCardProps {
  member: BmfMember
  onRequestIntro?: (member: BmfMember) => void
}

function formatMemberSince(dateStr?: string) {
  if (!dateStr) return 'Aug 2026'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return 'Aug 2026'
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return 'Aug 2026'
  }
}

export function MemberFlipCard({ member, onRequestIntro }: MemberFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false)
  const hasAvatar = Boolean(
    member.avatar_url &&
    typeof member.avatar_url === 'string' &&
    member.avatar_url.trim() !== ''
  )
  const avatarFallback = getFounderFallbackAvatar(member.full_name)
  const avatarUrl = hasAvatar ? normalizeR2Url(member.avatar_url) : ''
  const isCustomLogo = Boolean(
    member.company_logo &&
    typeof member.company_logo === 'string' &&
    member.company_logo.trim() !== '' &&
    !member.company_logo.includes('images.unsplash.com') &&
    !member.company_logo.includes('api.dicebear.com')
  )
  const logoUrl = isCustomLogo ? normalizeR2Url(member.company_logo) : ''

  return (
    <div
      className="group relative w-[155px] sm:w-[210px] md:w-[220px] h-[225px] sm:h-[315px] [perspective:1200px] cursor-pointer select-none shrink-0 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped((prev) => !prev)}
      role="button"
      tabIndex={0}
      aria-label={`Profile card for ${member.full_name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setIsFlipped((prev) => !prev)
        }
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.9, 0.3, 1] }}
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        className="w-full h-full relative rounded-xl sm:rounded-2xl shadow-xl [transform-style:preserve-3d]"
      >
        {/* ======================================================================= */}
        {/* 1. FRONT FACE: Full-bleed Photo or Clean Empty Obsidian State */}
        {/* ======================================================================= */}
        <div 
          className={`absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl overflow-hidden [backface-visibility:hidden] [webkit-backface-visibility:hidden] ${
            hasAvatar 
              ? 'bg-neutral-900' 
              : 'bg-gradient-to-b from-[#18181b] via-[#101012] to-[#09090b]'
          }`}
          style={{ transform: 'rotateY(0deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {hasAvatar ? (
            <>
              {/* Full-bleed Portrait Image */}
              <img
                src={avatarUrl}
                alt={member.full_name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = avatarFallback
                }}
              />

              {/* Top & Bottom Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20 pointer-events-none" />
            </>
          ) : (
            /* Clean Empty Silhouette when not yet uploaded */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pb-14 text-center pointer-events-none">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center shadow-lg mb-2 group-hover:scale-105 transition-transform">
                <span className="text-lg sm:text-2xl font-black text-neutral-400">
                  {member.full_name ? member.full_name.charAt(0).toUpperCase() : 'F'}
                </span>
              </div>
              <span className="text-[8.5px] sm:text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                Photo Empty
              </span>
            </div>
          )}

          {/* Top-Right Corner: Company Logo (Original Aspect Ratio, No Placeholder Box) */}
          {logoUrl && (
            <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-20 pointer-events-none flex items-center justify-end">
              <img
                src={logoUrl}
                alt={member.company_name || 'Company Logo'}
                className="max-h-7 sm:max-h-9 max-w-[60px] sm:max-w-[80px] w-auto h-auto object-contain drop-shadow-md rounded-xs"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Bottom Inside Text: Member Name, Role, and Company Name (3 lines) */}
          <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3.5 z-10 flex flex-col justify-end space-y-0.5 text-left">
            {/* Line 1: Full Name & Verified Badge */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <h3 className="text-xs sm:text-lg font-black tracking-tight text-white drop-shadow-md leading-tight truncate">
                {member.full_name}
              </h3>
              {member.is_featured && (
                <img 
                  src="https://img.icons8.com/stickers/500/verified-badge.png" 
                  alt="Featured Verified Founder" 
                  className="w-3 h-3 sm:w-4 sm:h-4 object-contain shrink-0 drop-shadow-sm"
                />
              )}
            </div>

            {/* Line 2: Role */}
            <div className="pt-0.2 sm:pt-0.5">
              <span className="text-[8.5px] sm:text-[10px] text-neutral-300 font-mono tracking-wide block truncate">
                {member.role}
              </span>
            </div>

            {/* Line 3: Company Name */}
            {member.company_name?.trim() && (
              <div>
                <span className="text-[8.5px] sm:text-[10px] text-neutral-400 font-mono tracking-wide block truncate drop-shadow-xs">
                  {member.company_name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 2. BACK FACE: Role, Company Logo, Description, Metrics, Social Links   */}
        {/* ======================================================================= */}
        <div 
          className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl p-2 sm:p-3.5 [backface-visibility:hidden] [webkit-backface-visibility:hidden] bg-[#121215] text-white border border-white/10 flex flex-col justify-between overflow-hidden"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {/* Top Bar: Company Identity & Category */}
          <div className="space-y-1 sm:space-y-2 text-left">
            <div className="flex items-center justify-between gap-1 sm:gap-1.5">
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={member.company_name}
                    className="w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg object-cover border border-white/20 shadow-xs bg-neutral-800 shrink-0"
                  />
                ) : (
                  <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center text-white font-bold shrink-0">
                    <Building2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-neutral-300" />
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-[10px] sm:text-xs font-bold text-white leading-tight truncate">
                    {member.company_name}
                  </h4>
                  <span className="text-[8.5px] sm:text-[10px] text-emerald-400 font-mono block truncate">
                    {member.role}
                  </span>
                </div>
              </div>

              {member.category?.trim() && (
                <span className="text-[7px] sm:text-[8.5px] font-mono font-semibold tracking-wide bg-white/10 text-neutral-200 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-full border border-white/10 shrink-0 max-w-[60px] sm:max-w-[85px] truncate">
                  {member.category}
                </span>
              )}
            </div>

            {/* Description: What they do */}
            {(member.description?.trim() || member.tagline?.trim()) && (
              <p className="text-[8px] sm:text-[10px] text-neutral-300 leading-tight sm:leading-snug line-clamp-2">
                {member.description?.trim() || member.tagline?.trim()}
              </p>
            )}

            {/* Key Traction & Metrics Container (Optional) */}
            {(member.stage?.trim() || member.metrics?.trim()) && (
              <div className="bg-neutral-900/90 rounded-md sm:rounded-lg p-1 sm:p-2 border border-white/10 space-y-0.5 sm:space-y-1">
                {member.stage?.trim() && (
                  <div className="flex items-center justify-between text-[8px] sm:text-[10px]">
                    <span className="text-neutral-400 font-mono text-[7px] sm:text-[9px] flex items-center gap-0.5 sm:gap-1">
                      <Sparkles className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 text-amber-400 shrink-0" />
                      Stage
                    </span>
                    <span className="font-bold text-white text-[7.5px] sm:text-[10px] truncate max-w-[60%] text-right">{member.stage}</span>
                  </div>
                )}

                {member.metrics?.trim() && (
                  <div className="flex items-center justify-between text-[8px] sm:text-[10px]">
                    <span className="text-neutral-400 font-mono text-[7px] sm:text-[9px] flex items-center gap-0.5 sm:gap-1">
                      <TrendingUp className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 text-emerald-400 shrink-0" />
                      Traction
                    </span>
                    <span className="font-bold text-emerald-400 text-[7.5px] sm:text-[10px] truncate max-w-[60%] text-right">{member.metrics}</span>
                  </div>
                )}
              </div>
            )}

            {/* Location & Team Size Meta (Optional) */}
            {(member.location?.trim() || member.team_size?.trim()) && (
              <div className="flex items-center justify-between text-[7.5px] sm:text-[9.5px] font-mono text-neutral-400 pt-0.2">
                {member.location?.trim() ? (
                  <span className="flex items-center gap-0.5 sm:gap-1 truncate max-w-[50%]">
                    <MapPin className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 text-neutral-500 shrink-0" />
                    {member.location}
                  </span>
                ) : <span />}
                {member.team_size?.trim() && (
                  <span className="flex items-center gap-0.5 sm:gap-1 truncate max-w-[45%]">
                    <Users className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 text-neutral-500 shrink-0" />
                    {member.team_size}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom Actions & Member Since Meta */}
          <div className="pt-1 sm:pt-2 flex flex-col gap-1 sm:gap-2">
            {/* Actions Above Line: Social Profiles & Intro Button */}
            <div className="flex items-center justify-between gap-1 sm:gap-1.5">
              <div className="flex items-center gap-0.5 sm:gap-1 min-w-0">
                {member.linkedin_url?.trim() && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-4.5 h-4.5 sm:w-6 sm:h-6 rounded-full bg-neutral-800 hover:bg-[#0A66C2] text-white flex items-center justify-center transition-colors border border-white/10 shrink-0"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                  </a>
                )}
                {member.twitter_url?.trim() && (
                  <a
                    href={member.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-4.5 h-4.5 sm:w-6 sm:h-6 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors border border-white/10 shrink-0"
                    aria-label="Twitter/X Profile"
                  >
                    <Twitter className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                  </a>
                )}
                {member.website_url?.trim() && (
                  <a
                    href={member.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-4.5 h-4.5 sm:w-6 sm:h-6 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors border border-white/10 shrink-0"
                    aria-label="Company Website"
                  >
                    <Globe className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onRequestIntro) {
                    onRequestIntro(member)
                  } else {
                    setIsIntroModalOpen(true)
                  }
                }}
                className="inline-flex items-center gap-0.5 sm:gap-1 bg-white hover:bg-neutral-200 text-black px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
              >
                <span>Approach</span>
                <ArrowUpRight className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5" />
              </button>
            </div>

            {/* Bottom Line Divider & Member Since Text alone */}
            <div className="border-t border-neutral-800/80 pt-0.5 sm:pt-1.5 flex items-center justify-center text-center text-[7.5px] sm:text-[9px] font-mono text-neutral-400">
              <span>Member since {formatMemberSince(member.created_at)}</span>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Warm Intro Request Modal */}
      {!onRequestIntro && (
        <RequestIntroModal
          isOpen={isIntroModalOpen}
          onClose={() => setIsIntroModalOpen(false)}
          member={member}
        />
      )}
    </div>
  )
}
