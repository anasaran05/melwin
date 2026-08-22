'use client'

import React, { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { BmfCard, CARD_TIERS, CardTier } from '@/lib/supabase/bmf-cards'
import { QrCode, RotateCw } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

interface ExecutiveMetalCardProps {
  card: BmfCard
  onFlip?: (isFlipped: boolean) => void
  showControls?: boolean
  className?: string
}

export function ExecutiveMetalCard({
  card,
  onFlip,
  showControls = true,
  className = '',
}: ExecutiveMetalCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // 3D Tilt Spring Values
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [14, -14])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-18, 18])
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const toggleFlip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const nextState = !isFlipped
    setIsFlipped(nextState)
    if (onFlip) onFlip(nextState)
  }

  const tierMeta = CARD_TIERS[card.card_tier] || CARD_TIERS.obsidian

  // Tier-specific luxury surface styling
  const getTierSurface = () => {
    switch (card.card_tier) {
      case 'titanium':
        return {
          bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 45%, #0284c7 100%)',
          border: 'border-cyan-500/40',
          glow: 'rgba(6,182,212,0.25)',
          accentText: 'text-cyan-300',
          lineColor: 'rgba(56, 189, 248, 0.15)',
          passBadge: 'TITANIUM PASS',
        }
      case 'gold':
        return {
          bg: 'linear-gradient(135deg, #78350f 0%, #451a03 25%, #b45309 65%, #f59e0b 100%)',
          border: 'border-amber-400/50',
          glow: 'rgba(245,158,11,0.3)',
          accentText: 'text-amber-200',
          lineColor: 'rgba(245, 158, 11, 0.2)',
          passBadge: 'GOLD PASS',
        }
      case 'diamond':
        return {
          bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4338ca 70%, #06b6d4 100%)',
          border: 'border-indigo-400/50',
          glow: 'rgba(168,85,247,0.3)',
          accentText: 'text-indigo-200',
          lineColor: 'rgba(168, 85, 247, 0.2)',
          passBadge: 'DIAMOND PASS',
        }
      case 'quantum':
        return {
          bg: 'linear-gradient(135deg, #022c22 0%, #064e3b 40%, #047857 75%, #10b981 100%)',
          border: 'border-emerald-500/50',
          glow: 'rgba(16,185,129,0.35)',
          accentText: 'text-emerald-300',
          lineColor: 'rgba(16, 185, 129, 0.2)',
          passBadge: 'QUANTUM PASS',
        }
      case 'obsidian':
      default:
        return {
          bg: 'linear-gradient(135deg, #18181b 0%, #09090b 45%, #1c1917 100%)',
          border: 'border-white/20',
          glow: 'rgba(255,255,255,0.15)',
          accentText: 'text-neutral-200',
          lineColor: 'rgba(255, 255, 255, 0.08)',
          passBadge: 'OBSIDIAN PASS',
        }
    }
  }

  const surface = getTierSurface()

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* 3D Interactive Card Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => toggleFlip()}
        className="w-[340px] sm:w-[380px] h-[215px] sm:h-[240px] [perspective:1400px] cursor-pointer relative"
      >
        <motion.div
          style={{
            rotateX: isFlipped ? 0 : rotateX,
            rotateY: isFlipped ? 180 : rotateY,
            transformStyle: 'preserve-3d',
          }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="w-full h-full relative rounded-2xl shadow-2xl transition-shadow duration-300 hover:shadow-cyan-500/10"
        >
          {/* ================================================================= */}
          {/* FRONT FACE: BMF CLUB CARD (Minimalist Luxury Vertical Branding) */}
          {/* ================================================================= */}
          <div
            style={{
              background: surface.bg,
              transform: 'rotateY(0deg)',
              backfaceVisibility: 'hidden',
            }}
            className={`absolute inset-0 w-full h-full rounded-2xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden border ${surface.border} shadow-2xl backdrop-blur-xl`}
          >
            {/* Dynamic Holographic Light Glare */}
            <motion.div
              style={{
                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.25) 0%, transparent 60%)`,
              }}
              className="absolute inset-0 pointer-events-none rounded-2xl z-20 mix-blend-overlay"
            />

            {/* Geometric Luxury Line Art Watermark */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              viewBox="0 0 380 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="340" cy="40" r="120" stroke={surface.lineColor} strokeWidth="1" />
              <circle cx="340" cy="40" r="160" stroke={surface.lineColor} strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="40" cy="200" r="100" stroke={surface.lineColor} strokeWidth="1" />
              <path d="M-20 180 L200 -40" stroke={surface.lineColor} strokeWidth="1" />
              <path d="M80 260 L300 40" stroke={surface.lineColor} strokeWidth="1" />
              <rect x="220" y="70" width="80" height="80" transform="rotate(45 220 70)" stroke={surface.lineColor} strokeWidth="1" />
            </svg>

            {/* Lottie Animation: Catch the Fish */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden pr-6 sm:pr-8">
              <div className="w-[170px] h-[170px] sm:w-[200px] sm:h-[200px] opacity-90 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                <DotLottieReact
                  src="/assets/Catch the Fish.lottie"
                  loop
                  autoplay
                />
              </div>
            </div>

            {/* RIGHT SIDE: USER NAME ALONE (Tilted Vertically) */}
            <div className="absolute right-4 sm:right-5 top-0 bottom-0 z-20 pointer-events-none flex items-center justify-center [writing-mode:vertical-rl] rotate-180">
              <span className="font-serif italic font-medium text-xs sm:text-sm tracking-[0.25em] text-white/90 uppercase select-none drop-shadow-sm whitespace-nowrap">
                {card.card_holder_name}
              </span>
            </div>

            {/* BOTTOM LEFT: BMF CLUB CARD TEXT */}
            <div className="relative z-20 text-left mt-auto">
              <span className="font-mono font-black text-[10px] sm:text-[11px] tracking-[0.3em] text-white/70 uppercase select-none block drop-shadow-sm">
                BMF CLUB CARD
              </span>
            </div>

          </div>

          {/* ================================================================= */}
          {/* BACK FACE: Card Number, High-Conviction Quote, NFC & Verification */}
          {/* ================================================================= */}
          <div
            style={{
              background: surface.bg,
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
            }}
            className={`absolute inset-0 w-full h-full rounded-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden border ${surface.border} shadow-2xl backdrop-blur-xl`}
          >
            {/* Top Pass Band */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-[9px] font-mono tracking-[0.28em] text-white/70 uppercase font-bold">
                BMF CLUB FOUNDER PASS
              </span>
            </div>

            {/* Central High-Conviction Syndicate Quote */}
            <div className="text-center px-4 sm:px-6 my-auto">
              <p className="text-xs sm:text-[13px] font-serif italic text-neutral-100 leading-relaxed tracking-wide drop-shadow-sm">
                &ldquo;Where high-conviction builders connect. Built for those who relentlessly construct the future.&rdquo;
              </p>
            </div>

            {/* Bottom Pass Information & QR Access */}
            <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-neutral-400">
              <div className="space-y-0.5 text-left">
                <p>PASS ID: <span className="text-white font-bold">{card.nfc_uid}</span></p>
                <p>CONCIERGE: <span className="text-neutral-300">concierge@bmf.club</span></p>
              </div>

              <div className="flex flex-col items-center">
                <QrCode className="w-7 h-7 text-white/90" />
                <span className="text-[7px] text-neutral-500 uppercase mt-0.5">VIP VERIFY</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Interactive Flip Control */}
      {showControls && (
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={toggleFlip}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-medium text-neutral-300 hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'View Front Side' : 'View Back Side (Quote & Pass ID)'}</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default ExecutiveMetalCard
