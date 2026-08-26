'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Plus,
  X,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  RefreshCw
} from 'lucide-react'

export interface GrantItem {
  id: string
  title: string
  agency: string
  grantAmount: string
  stage: string
  sector: string
  type: string
  description: string
  keyEligibility: string[]
  badgeColor?: string
  statusBadge?: string
  fundingLabel?: string
  supportDetails?: string
}

interface GrantsHorizontalScrollProps {
  grants: GrantItem[]
}

// Styled color palette for the 50vw half-screen cards (matching the high-fashion editorial reference)
const cardThemes = [
  {
    bg: 'bg-[#2142e8]',
    textColor: 'text-white',
    subtextColor: 'text-blue-100',
    accentBg: 'bg-white/15 text-white border-white/25',
    btnBg: 'bg-white text-[#2142e8] hover:bg-blue-50',
    badgeColor: 'bg-white/20 text-white',
    patternColor: 'rgba(255, 255, 255, 0.08)',
    tag: 'DPIIT / Govt of India',
    iconEmoji: '🇮🇳'
  },
  {
    bg: 'bg-[#e8a817]',
    textColor: 'text-[#111111]',
    subtextColor: 'text-[#333333]',
    accentBg: 'bg-black/10 text-black border-black/15',
    btnBg: 'bg-[#111111] text-white hover:bg-black',
    badgeColor: 'bg-black/10 text-black',
    patternColor: 'rgba(0, 0, 0, 0.06)',
    tag: 'BIRAC / Biotechnology Dept',
    iconEmoji: '🧬'
  },
  {
    bg: 'bg-[#0d7d54]',
    textColor: 'text-white',
    subtextColor: 'text-emerald-100',
    accentBg: 'bg-white/15 text-white border-white/25',
    btnBg: 'bg-white text-[#0d7d54] hover:bg-emerald-50',
    badgeColor: 'bg-white/20 text-white',
    patternColor: 'rgba(255, 255, 255, 0.08)',
    tag: 'Ministry of Electronics & IT',
    iconEmoji: '💻'
  },
  {
    bg: 'bg-[#cc2b3e]',
    textColor: 'text-white',
    subtextColor: 'text-rose-100',
    accentBg: 'bg-white/15 text-white border-white/25',
    btnBg: 'bg-white text-[#cc2b3e] hover:bg-rose-50',
    badgeColor: 'bg-white/20 text-white',
    patternColor: 'rgba(255, 255, 255, 0.08)',
    tag: 'Ministry of MSME',
    iconEmoji: '🏭'
  },
  {
    bg: 'bg-[#582cb0]',
    textColor: 'text-white',
    subtextColor: 'text-purple-100',
    accentBg: 'bg-white/15 text-white border-white/25',
    btnBg: 'bg-white text-[#582cb0] hover:bg-purple-50',
    badgeColor: 'bg-white/20 text-white',
    patternColor: 'rgba(255, 255, 255, 0.08)',
    tag: 'YC, Techstars & Global VCs',
    iconEmoji: '🚀'
  },
  {
    bg: 'bg-[#141414]',
    textColor: 'text-white',
    subtextColor: 'text-neutral-300',
    accentBg: 'bg-white/10 text-white border-white/20',
    btnBg: 'bg-white text-black hover:bg-neutral-200',
    badgeColor: 'bg-white/15 text-white',
    patternColor: 'rgba(255, 255, 255, 0.05)',
    tag: 'Angels',
    iconEmoji: '🤝'
  }
]

// Interactive Letter Box with rapid typographic flicker/scramble on hover
const GLYPHS = ['✦', '●', '▲', '§', '0', '9', 'X', '★', '8', '?', '#', '₹', '$', '€', '✓', '→']

function FlickerLetterBox({
  char,
  className = '',
  badgeType = null
}: {
  char: string
  className?: string
  badgeType?: 'pinwheel' | 'tulip' | 'dotmatrix' | null
}) {
  const [displayChar, setDisplayChar] = useState(char)
  const [isFlickering, setIsFlickering] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [currentBadge, setCurrentBadge] = useState(badgeType)

  const triggerFlicker = () => {
    setIsFlickering(true)
    let iterations = 0
    const maxIterations = 8
    const interval = setInterval(() => {
      if (iterations >= maxIterations) {
        clearInterval(interval)
        setDisplayChar(char)
        setIsFlickering(false)
      } else {
        const randomGlyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        setDisplayChar(randomGlyph)
        iterations++
      }
    }, 45)
  }

  // Handle hover cycle for badges & character flicker
  const handleMouseEnter = () => {
    setIsHovered(true)
    triggerFlicker()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={triggerFlicker}
      className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 select-none overflow-hidden ${
        isHovered
          ? 'bg-[#111111] text-white'
          : 'bg-[#f7f7f2] text-black hover:bg-[#eaeae2]'
      } ${className}`}
    >
      {/* Show graphic emblem badge ONLY during hover when active */}
      {isHovered && currentBadge === 'pinwheel' ? (
        <div className="w-full h-full bg-[#1b8fa8] flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f48fb1] flex items-center justify-center relative animate-spin-slow">
            {/* 8 Petals Pinwheel */}
            <div className="absolute w-2 h-12 bg-white rounded-full transform rotate-0" />
            <div className="absolute w-2 h-12 bg-[#880e4f] rounded-full transform rotate-45" />
            <div className="absolute w-2 h-12 bg-white rounded-full transform rotate-90" />
            <div className="absolute w-2 h-12 bg-[#880e4f] rounded-full transform rotate-135" />
            <div className="w-4 h-4 rounded-full bg-[#1b8fa8] z-10" />
          </div>
        </div>
      ) : isHovered && currentBadge === 'tulip' ? (
        <div className="w-full h-full bg-[#c5c5c5] flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#cc2b3e] flex items-center justify-center relative overflow-hidden shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#f5b041] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#0d7d54]" />
            </div>
          </div>
        </div>
      ) : isHovered && currentBadge === 'dotmatrix' ? (
        <div className="w-full h-full bg-[#cc2b3e] flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f4d03f] flex items-center justify-center shadow-md border border-black/20">
            <div className="grid grid-cols-3 gap-1">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-black" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <span
          className={`font-black tracking-tighter leading-none transition-transform duration-100 ${
            isFlickering ? 'scale-110 text-emerald-400' : 'scale-100 text-black'
          } ${isHovered && !isFlickering ? 'text-white' : ''} text-2xl sm:text-6xl md:text-7xl lg:text-8xl`}
        >
          {displayChar}
        </span>
      )}

      {/* Subtle indicator dot on hover */}
      {isHovered && (
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      )}
    </div>
  )
}

export function GrantsHorizontalScroll({ grants }: GrantsHorizontalScrollProps) {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const [activeModalGrant, setActiveModalGrant] = useState<GrantItem | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  })

  // Map vertical scroll progress (0 to 1) to horizontal translation
  // Desktop: Intro (100vw) + 6 cards (50vw each = 300vw) + Outro card (50vw) = 450vw total -> distance: -350vw
  // Mobile: Intro (100vw) + 6 cards (88vw each = 528vw) + Outro card (88vw) = 716vw total -> distance: -616vw
  const x = useTransform(scrollYProgress, [0, 1], ['0vw', isMobile ? '-616vw' : '-350vw'])
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section 
      ref={targetRef} 
      id="schemes" 
      className="relative h-[480vh] bg-[#f4f4f0]"
    >
      {/* Sticky 100vh Fullscreen Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between bg-[#f4f4f0] select-none z-10">
        
        {/* Horizontal Moving Track */}
        <div className="relative w-full h-full flex items-stretch overflow-hidden">
          <motion.div 
            style={{ x }} 
            className="flex h-full will-change-transform items-stretch"
          >
            
            {/* 1. MODULAR EDITORIAL LETTERBOX INTRO BLOCK (100% Full Viewport Screen on Arrival) */}
            <div className="w-[100vw] h-full shrink-0 bg-[#f7f7f2] flex flex-col justify-between border-r-2 border-black overflow-hidden relative">
              
              {/* TOP ROW GRID (7 Columns Total: 1 + 1 + 1 + 1 + 3 = 7) */}
              <div className="grid grid-cols-7 h-1/2 border-b-2 border-black divide-x-2 divide-black">
                {/* Arrow Box */}
                <FlickerLetterBox char="→" className="col-span-1" />

                {/* Letter G */}
                <FlickerLetterBox char="G" className="col-span-1" />

                {/* Letter R (with pinwheel badge variant) */}
                <FlickerLetterBox char="R" badgeType="pinwheel" className="col-span-1" />

                {/* Letter A */}
                <FlickerLetterBox char="A" className="col-span-1" />

                {/* Landscape Photo Cell (spans 3 columns) */}
                <div className="col-span-3 relative bg-[#6cb4ee] overflow-hidden group">
                  <Image 
                    src="/grants.webp" 
                    alt="Non-Dilutive Government Grants & Schemes" 
                    fill 
                    className="object-contain group-hover:scale-105 transition-transform duration-700 p-2" 
                  />
                  <div className="absolute inset-0 bg-black/10 flex items-end justify-start p-4 pointer-events-none">
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-white uppercase tracking-wider bg-black/70 px-2.5 py-1 rounded">
                      Government Grants &bull; 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW GRID (7 Columns Total: 2 + 1 + 1 + 1 + 1 + 1 = 7) */}
              <div className="grid grid-cols-7 h-1/2 divide-x-2 divide-black">
                
                {/* Tall Portrait Photo on Left spanning 2 columns */}
                <div className="col-span-2 relative bg-[#ecefe6] overflow-hidden group">
                  <Image 
                    src="/funding.webp" 
                    alt="Capital Growth & Seed Funding" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-6 pointer-events-none">
                    <span className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                      Capital Pools & Angels
                    </span>
                    <span className="text-[11px] sm:text-xs text-neutral-200">
                      Non-Dilutive Growth Strategy
                    </span>
                  </div>
                </div>

                {/* Letter N */}
                <FlickerLetterBox char="N" className="col-span-1" />

                {/* Letter T (with dotmatrix badge variant) */}
                <FlickerLetterBox char="T" badgeType="dotmatrix" className="col-span-1" />

                {/* Letter S (with tulip badge variant) */}
                <FlickerLetterBox char="S" badgeType="tulip" className="col-span-1" />

                {/* ₹ Symbol Box */}
                <FlickerLetterBox char="₹" className="col-span-1" />

                {/* ✦ Star Symbol Box */}
                <FlickerLetterBox char="✦" className="col-span-1" />

              </div>

            </div>

            {/* 2. HALF-SCREEN SCHEME CARDS (50vw width, full viewport height) */}
            {grants.map((grant, index) => {
              const theme = cardThemes[index % cardThemes.length]

              return (
                <div
                  key={grant.id}
                  className={`w-[88vw] sm:w-[50vw] h-full shrink-0 ${theme.bg} ${theme.textColor} p-4 sm:p-8 md:p-14 flex flex-col justify-between border-r-2 border-black relative overflow-hidden group`}
                >
                  {/* Subtle Geometric Background Watermark */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center"
                    style={{
                      backgroundImage: `radial-gradient(circle at 70% 60%, ${theme.patternColor} 0%, transparent 60%), radial-gradient(circle at 20% 30%, ${theme.patternColor} 0%, transparent 50%)`
                    }}
                  >
                    <div className="w-[30rem] h-[30rem] rounded-full border border-current opacity-15" />
                    <div className="absolute w-[20rem] h-[20rem] rounded-full border border-current opacity-20" />
                  </div>

                  {/* Top Header Row of Card */}
                  <div className="relative z-10 space-y-2 sm:space-y-4">
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      {/* Checkmark Tag */}
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span className="font-mono tracking-tight line-clamp-1">{grant.type} &bull; {grant.stage}</span>
                      </div>

                      {/* + Expansion Button */}
                      <button
                        type="button"
                        onClick={() => setActiveModalGrant(grant)}
                        className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full ${theme.btnBg} flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 shrink-0`}
                        title="View Detailed Eligibility & Guidelines"
                      >
                        <Plus className="w-4 h-4 sm:w-6 sm:h-6" />
                      </button>
                    </div>

                    {/* Giant Headline Title */}
                    <div className="pt-1 sm:pt-2">
                      <h3 className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight leading-[1.1]">
                        {grant.title}
                      </h3>
                      <div className="pt-1.5 sm:pt-2 flex items-center gap-2">
                        <span className={`inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider ${theme.badgeColor} border border-current/20`}>
                          {grant.agency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center Visual & Key Grant Highlight */}
                  <div className="relative z-10 py-2 sm:py-3 my-auto flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2">
                    
                    {/* Visual 3D Representation Box */}
                    <div className="relative w-48 h-60 sm:w-60 sm:h-72 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      {/* Stylized Badge Box / Grant Voucher Emblem */}
                      <div className="w-44 h-56 sm:w-56 sm:h-68 rounded-2xl bg-white/95 text-black shadow-2xl p-3.5 sm:p-5 border-2 border-black flex flex-col justify-between transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 overflow-hidden">
                        
                        {/* Voucher Top Header */}
                        <div className="flex justify-between items-start gap-2 border-b border-neutral-100 pb-1.5 sm:pb-2">
                          <span className="text-[9px] sm:text-[11px] font-mono font-bold uppercase text-neutral-500 line-clamp-1 text-left">
                            {grant.sector}
                          </span>
                          <span className="text-base sm:text-lg shrink-0">{theme.iconEmoji}</span>
                        </div>

                        {/* Voucher Center Highlight */}
                        <div className="text-center my-auto py-1 space-y-1">
                          <span className="text-[8px] sm:text-[10px] font-mono uppercase tracking-widest text-neutral-400 block truncate">
                            {grant.fundingLabel || 'Typical / Potential Funding'}
                          </span>
                          <div className={`text-black tracking-tight leading-snug line-clamp-4 ${
                            grant.grantAmount.length <= 25
                              ? 'text-lg sm:text-2xl font-black'
                              : grant.grantAmount.length <= 48
                              ? 'text-xs sm:text-base font-extrabold'
                              : 'text-[11px] sm:text-sm font-bold'
                          }`}>
                            {grant.grantAmount}
                          </div>
                        </div>

                        {/* Voucher Bottom Status */}
                        <div className="pt-1.5 sm:pt-2 border-t border-neutral-200 flex items-center justify-center text-[8px] sm:text-[10px] font-mono font-bold text-neutral-600 truncate text-center tracking-tight">
                          <span className="truncate">{grant.statusBadge || `GOVT SCHEME #${String(index + 1).padStart(2, '0')} • ACTIVE`}</span>
                        </div>
                      </div>
                    </div>

                    <p className={`text-xs sm:text-sm md:text-base ${theme.subtextColor} max-w-md mx-auto pt-1 sm:pt-2 line-clamp-2 leading-relaxed font-medium`}>
                      {grant.description}
                    </p>
                  </div>

                  {/* Bottom Action Section */}
                  <div className="relative z-10 pt-3 sm:pt-4 border-t border-current/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
                    <div className="text-xs font-mono">
                      <span className="font-bold text-[10px] sm:text-[11px] leading-snug block max-w-xs">
                        {grant.supportDetails || `Support: ${grant.grantAmount}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveModalGrant(grant)}
                        className={`text-[11px] sm:text-xs font-bold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full ${theme.accentBg} hover:bg-white/30 transition-all text-center flex-1 sm:flex-none`}
                      >
                        Details & Checklist
                      </button>

                      <a
                        href="#apply"
                        className={`inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full ${theme.btnBg} shadow-md transition-all hover:scale-105 active:scale-95 flex-1 sm:flex-none`}
                      >
                        <span>Apply</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                </div>
              )
            })}

            {/* 3. OUTRO HALF-SCREEN ADVISORY CARD */}
            <div className="w-[88vw] sm:w-[50vw] h-full shrink-0 bg-[#f7f7f2] text-black p-5 sm:p-10 md:p-16 flex flex-col justify-between border-r-2 border-black relative overflow-hidden">
              <div className="space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-black text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Custom Dossier Structuring</span>
                </div>

                <h3 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-black leading-tight">
                  Need a Comprehensive Capital Audit?
                </h3>

                <p className="text-xs sm:text-sm md:text-base text-neutral-600 leading-relaxed max-w-md">
                  Dr. Melwin’s team evaluates your IP, technology readiness level (TRL), and corporate structuring to map you to every available government grant and angel co-investment pool.
                </p>

                <div className="space-y-2 sm:space-y-3 pt-1 sm:pt-2">
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-neutral-800">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                    <span>SISFS, BIRAC BIG & MeitY SAMRIDH Proposal Filing</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-neutral-800">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                    <span>Host Incubator & Evaluation Board Defense</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-neutral-800">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                    <span>exploring grant and private investment options with consideration for founder dilution.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 sm:pt-8">
                <a
                  href="#apply"
                  className="w-full inline-flex items-center justify-center gap-2 sm:gap-3 bg-black hover:bg-neutral-800 text-white px-6 sm:px-8 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-base transition-all shadow-xl hover:scale-[1.02]"
                >
                  <span>Submit Venture for Grant Review</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>

          </motion.div>
        </div>

        {/* BOTTOM CONTROLS (Positioned within the sticky frame) */}

        {/* Bottom Right Scroll Cue with Red Arrow Block */}
        <div className="absolute bottom-6 right-6 z-30 pointer-events-auto flex items-center gap-3">
          <span className="text-xs font-mono font-bold tracking-wider text-black bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-black/10 shadow-xs hidden sm:inline-block">
            Scroll More &darr;
          </span>
          <div className="w-10 h-10 rounded-xl bg-[#cc2b3e] text-white flex items-center justify-center shadow-lg border border-black/20">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* DETAILED GRANT INFO MODAL (Triggered when clicking + on any card) */}
      <AnimatePresence>
        {activeModalGrant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white text-[#111111] rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl border border-black/10 relative overflow-hidden max-h-[90vh] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                      {activeModalGrant.agency}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-black mt-1">
                      {activeModalGrant.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModalGrant(null)}
                    className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-black transition-colors shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 py-6 overflow-y-auto max-h-[50vh] pr-1">
                  <div className="grid grid-cols-2 gap-3 bg-[#f8f8f6] p-4 rounded-2xl border border-black/5 text-xs font-mono">
                    <div>
                      <span className="text-neutral-500 block">{activeModalGrant.fundingLabel || 'Typical / Potential Funding'}:</span>
                      <span className="font-bold text-emerald-700 text-sm">{activeModalGrant.grantAmount}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Nature:</span>
                      <span className="font-bold text-neutral-900 text-sm">{activeModalGrant.type}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Ideal Stage:</span>
                      <span className="font-bold text-neutral-900">{activeModalGrant.stage}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Target Sector:</span>
                      <span className="font-bold text-neutral-900">{activeModalGrant.sector}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                      Scheme Overview
                    </h4>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {activeModalGrant.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                      Mandatory Eligibility Checklist
                    </h4>
                    <div className="space-y-2">
                      {activeModalGrant.keyEligibility.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalGrant(null)}
                  className="w-full sm:w-auto text-xs font-bold text-neutral-500 hover:text-black py-2"
                >
                  Close Window
                </button>

                <a
                  href="#apply"
                  onClick={() => setActiveModalGrant(null)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-full font-bold text-xs transition-all shadow-md"
                >
                  <span>Submit Pitch for This Scheme</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
