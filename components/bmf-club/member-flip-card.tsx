'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BmfMember } from '@/lib/supabase/bmf-members'
import { 
  CheckCircle2, 
  Linkedin, 
  Twitter, 
  Globe, 
  MapPin, 
  Users, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react'

interface MemberFlipCardProps {
  member: BmfMember
}

export function MemberFlipCard({ member }: MemberFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="group relative w-full h-[395px] [perspective:1400px] cursor-pointer select-none"
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
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        className="w-full h-full relative [transform-style:preserve-3d] rounded-2xl shadow-md hover:shadow-xl transition-shadow"
      >
        {/* ======================================================================= */}
        {/* 1. FRONT FACE: Full-bleed Photo + Verified Badge + Inside Name Text Only */}
        {/* ======================================================================= */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden [backface-visibility:hidden] border border-black/10 bg-neutral-900"
          style={{ transform: 'rotateY(0deg)' }}
        >
          {/* Full-bleed Portrait Image */}
          <img
            src={member.avatar_url}
            alt={member.full_name}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Top & Bottom Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/30 pointer-events-none" />

          {/* Bottom Inside Text: Member Name & Role */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 flex flex-col justify-end space-y-1 text-left">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md leading-tight">
                {member.full_name}
              </h3>
              {member.is_verified && (
                <img 
                  src="https://img.icons8.com/stickers/500/verified-badge.png" 
                  alt="Verified Badge" 
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain shrink-0 drop-shadow-sm"
                />
              )}
            </div>

            <div className="pt-0.5">
              <span className="text-[11px] text-neutral-300 font-mono tracking-wide">
                {member.role}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 2. BACK FACE: Role, Company Logo, Description, Metrics, Social Links   */}
        {/* ======================================================================= */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl p-4 sm:p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#141414] text-white border border-neutral-800 flex flex-col justify-between overflow-y-auto"
        >
          {/* Top Bar: Company Identity & Category */}
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {member.company_logo ? (
                  <img
                    src={member.company_logo}
                    alt={member.company_name}
                    className="w-8 h-8 rounded-xl object-cover border border-white/20 shadow-xs bg-neutral-800 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center text-white font-bold shrink-0">
                    <Building2 className="w-4 h-4 text-neutral-300" />
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-white leading-tight truncate">
                    {member.company_name}
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-mono font-medium block truncate">
                    {member.role}
                  </span>
                </div>
              </div>

              <span className="text-[9px] font-mono font-bold tracking-wider bg-white/10 text-neutral-200 px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                {member.category}
              </span>
            </div>

            {/* Description: What they do */}
            <div className="pt-0.5">
              <p className="text-[11px] text-neutral-300 leading-relaxed font-normal line-clamp-3">
                {member.description || member.tagline}
              </p>
            </div>

            {/* Key Traction & Metrics Container */}
            <div className="bg-neutral-900/90 rounded-xl p-2.5 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400 font-mono text-[10px] flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  Stage
                </span>
                <span className="font-bold text-white text-[11px] truncate max-w-[55%] text-right">{member.stage}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400 font-mono text-[10px] flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                  Traction
                </span>
                <span className="font-bold text-emerald-400 text-[11px] truncate max-w-[55%] text-right">{member.metrics}</span>
              </div>
            </div>

            {/* Location & Team Size Meta */}
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-0.5">
              <span className="flex items-center gap-1 truncate max-w-[50%]">
                <MapPin className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                {member.location}
              </span>
              <span className="flex items-center gap-1 truncate max-w-[45%]">
                <Users className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                {member.team_size}
              </span>
            </div>
          </div>

          {/* Bottom Actions: Social Profiles & Direct Connect */}
          <div className="pt-3 border-t border-neutral-800">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-[#0A66C2] text-white flex items-center justify-center transition-colors border border-white/10"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-3 h-3" />
                  </a>
                )}
                {member.twitter_url && (
                  <a
                    href={member.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors border border-white/10"
                    aria-label="Twitter/X Profile"
                  >
                    <Twitter className="w-3 h-3" />
                  </a>
                )}
                {member.website_url && (
                  <a
                    href={member.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors border border-white/10"
                    aria-label="Company Website"
                  >
                    <Globe className="w-3 h-3" />
                  </a>
                )}
              </div>

              <a
                href="#apply"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 bg-white hover:bg-neutral-200 text-black px-3 py-1 rounded-full text-[11px] font-bold transition-all shadow-xs"
              >
                <span>Intro</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
