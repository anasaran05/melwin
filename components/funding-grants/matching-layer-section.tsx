'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Plus,
  X,
  ArrowRight,
  ArrowUpRight,
  Building,
  PieChart,
  TrendingUp,
  ShieldCheck,
  Globe2,
  Sparkles
} from 'lucide-react'

// Reusable interactive flicker letter box
const GLYPHS = ['✦', '●', '▲', '§', '0', '9', 'X', '★', '8', '?', '#', '₹', '$', '€', '✓', '↓']

function MatchFlickerLetter({
  char,
  className = ''
}: {
  char: string
  className?: string
}) {
  const [displayChar, setDisplayChar] = useState(char)
  const [isFlickering, setIsFlickering] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true)
        triggerFlicker()
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={triggerFlicker}
      className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 select-none py-4 sm:py-6 md:py-8 ${
        isHovered
          ? 'bg-[#111111] text-white'
          : 'bg-[#f7f7f2] text-black hover:bg-[#eaeae2]'
      } ${className}`}
    >
      <span
        className={`font-black tracking-tighter leading-none transition-transform duration-100 ${
          isFlickering ? 'scale-110 text-emerald-400' : 'scale-100 text-black'
        } ${isHovered && !isFlickering ? 'text-white' : ''} text-3xl sm:text-5xl md:text-6xl lg:text-7xl`}
      >
        {displayChar}
      </span>
      {isHovered && (
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      )}
    </div>
  )
}

interface MatchmakingCardData {
  id: string
  themeBg: string
  textColor: string
  subtextColor: string
  accentBg: string
  btnBg: string
  tag: string
  title: string
  summary: string
  features: string[]
  statsHighlight: string
  statsLabel: string
  iconEmoji: string
}

const matchmakingCards: MatchmakingCardData[] = [
  {
    id: 'm1',
    themeBg: 'bg-[#d8687a]',
    textColor: 'text-white',
    subtextColor: 'text-rose-100',
    accentBg: 'bg-white/20 text-white border-white/30',
    btnBg: 'bg-white text-[#d8687a] hover:bg-rose-50',
    tag: 'Pre-Vetted Deal Flow',
    title: 'Curated Deal Flow for High-Conviction Angels',
    summary: 'Investors receive structured deal memos, verified unit economics, and cap table audits instead of cold, unsolicited pitch decks.',
    features: [
      'Institutional standard 3-page deal memo',
      'Verified customer retention & pilot contracts',
      'Clean cap table structuring & SAFE notes'
    ],
    statsHighlight: '100+',
    statsLabel: 'Active Angel & Micro-VC Network',
    iconEmoji: '💼'
  },
  {
    id: 'm2',
    themeBg: 'bg-[#d96620]',
    textColor: 'text-white',
    subtextColor: 'text-amber-100',
    accentBg: 'bg-white/20 text-white border-white/30',
    btnBg: 'bg-white text-[#d96620] hover:bg-amber-50',
    tag: 'Co-Investment Syndicates',
    title: 'Co-Investment Syndicates & Matching Capital',
    summary: 'Combine government non-dilutive grants with angel co-investment checks to reach 18–24 months of runway with minimal dilution.',
    features: [
      'Grant-backed angel co-investment rounds',
      '18 to 24-month runway optimization',
      'Zero early equity dilution strategies'
    ],
    statsHighlight: '₹2.5 Cr',
    statsLabel: 'Max Check Size Syndicated',
    iconEmoji: '📈'
  },
  {
    id: 'm3',
    themeBg: 'bg-[#4e2a9b]',
    textColor: 'text-white',
    subtextColor: 'text-purple-100',
    accentBg: 'bg-white/20 text-white border-white/30',
    btnBg: 'bg-white text-[#4e2a9b] hover:bg-purple-50',
    tag: 'Cross-Border Capital',
    title: 'Cross-Border Capital Syndication & Global Inroads',
    summary: 'Direct inroads to capital pools, incubators, and family offices across UAE / GCC, Singapore, and Europe for ventures scaling internationally.',
    features: [
      'UAE / GCC family office connections',
      'Singapore & Southeast Asia market entry',
      'Global accelerator demo day preparation'
    ],
    statsHighlight: 'Global',
    statsLabel: 'UAE, Singapore & US Hubs',
    iconEmoji: '🌍'
  },
  {
    id: 'm4',
    themeBg: 'bg-[#0c6b4b]',
    textColor: 'text-white',
    subtextColor: 'text-emerald-100',
    accentBg: 'bg-white/20 text-white border-white/30',
    btnBg: 'bg-white text-[#0c6b4b] hover:bg-emerald-50',
    tag: 'Direct Founder Desk',
    title: 'Zero Equity Friction & Speed to Term Sheet',
    summary: 'Fast-track founder-to-investor introductions with pre-aligned valuations and term sheet templates to close rounds in weeks, not months.',
    features: [
      'Pre-aligned valuation benchmarks',
      'Direct partner-level pitch dry-runs',
      'Accelerated 3-week closing cycle'
    ],
    statsHighlight: '3 Weeks',
    statsLabel: 'Average Term Sheet Cycle',
    iconEmoji: '⚡'
  }
]

export function MatchingLayerSection() {
  const [activeModalCard, setActiveModalCard] = useState<MatchmakingCardData | null>(null)

  return (
    <section className="w-full bg-[#f4f4f0] text-black border-t-2 border-black relative">
      
      {/* 1. MODULAR LETTERBOX HEADER ROW (Spelling ↓ M A T C H I N G like the BUNDLES reference) */}
      <div className="w-full border-b-2 border-black">
        <div className="grid grid-cols-9 divide-x-2 divide-black">
          <MatchFlickerLetter char="↓" className="col-span-1" />
          <MatchFlickerLetter char="M" className="col-span-1" />
          <MatchFlickerLetter char="A" className="col-span-1" />
          <MatchFlickerLetter char="T" className="col-span-1" />
          <MatchFlickerLetter char="C" className="col-span-1" />
          <MatchFlickerLetter char="H" className="col-span-1" />
          <MatchFlickerLetter char="I" className="col-span-1" />
          <MatchFlickerLetter char="N" className="col-span-1" />
          <MatchFlickerLetter char="G" className="col-span-1" />
        </div>
      </div>

      {/* Sub-Header Banner Strip */}
      <div className="px-6 py-4 sm:px-12 sm:py-6 bg-[#f7f7f2] border-b-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-neutral-800">
            NEXT-GEN MATCHMAKING LAYER &bull; FOUNDER & INVESTOR SYNDICATE
          </span>
        </div>
        <span className="text-xs font-mono text-neutral-500">
          Scroll down to explore investor matching avenue &darr;
        </span>
      </div>

      {/* 2. 50/50 HALF-WIDTH VERTICAL FEATURE CARDS (Matching the Screenshot Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
        {matchmakingCards.map((card) => (
          <div
            key={card.id}
            className={`${card.themeBg} ${card.textColor} p-8 sm:p-12 md:p-14 min-h-[520px] sm:min-h-[600px] flex flex-col justify-between relative overflow-hidden group border-b-2 border-black last:border-b-0 md:last:border-b-2`}
          >
            {/* Subtle Geometric Background Watermark */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center"
              style={{
                backgroundImage: `radial-gradient(circle at 70% 60%, rgba(255,255,255,0.08) 0%, transparent 60%), radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 0%, transparent 50%)`
              }}
            >
              <div className="w-[28rem] h-[28rem] rounded-full border border-current opacity-20" />
              <div className="absolute w-[18rem] h-[18rem] rounded-full border border-current opacity-25" />
            </div>

            {/* Top Row: Tag + Plus Button */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-mono tracking-tight">{card.tag}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalCard(card)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${card.btnBg} flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 shrink-0`}
                  title="View Details"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] pt-2">
                {card.title}
              </h3>
            </div>

            {/* Center Visual Emblem Box */}
            <div className="relative z-10 py-6 my-auto flex flex-col items-center justify-center text-center">
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-white/95 text-black shadow-2xl p-6 border-2 border-black flex flex-col justify-between transform group-hover:scale-105 transition-transform duration-500">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                    SYNDICATE TRACK
                  </span>
                  <span className="text-2xl">{card.iconEmoji}</span>
                </div>

                <div className="text-center my-auto space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    {card.statsLabel}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight">
                    {card.statsHighlight}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] font-mono font-bold text-neutral-600">
                  <span>DR. MELWIN DESK</span>
                  <span className="text-emerald-600 font-bold">&bull; ACTIVE</span>
                </div>
              </div>

              <p className={`text-xs sm:text-sm md:text-base ${card.subtextColor} max-w-md mx-auto pt-5 line-clamp-2 leading-relaxed font-medium`}>
                {card.summary}
              </p>
            </div>

            {/* Bottom Action Footer */}
            <div className="relative z-10 pt-4 border-t border-current/20 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveModalCard(card)}
                className={`text-xs font-bold px-4 py-2.5 rounded-full ${card.accentBg} hover:bg-white/30 transition-all`}
              >
                Learn Process
              </button>

              <a
                href="#apply"
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-full ${card.btnBg} shadow-md transition-all hover:scale-105 active:scale-95`}
              >
                <span>Connect with Desk</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {activeModalCard && (
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
                      {activeModalCard.tag}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-black mt-1">
                      {activeModalCard.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModalCard(null)}
                    className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-black transition-colors shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 py-6 overflow-y-auto max-h-[50vh] pr-1">
                  <div className="bg-[#f8f8f6] p-4 rounded-2xl border border-black/5 text-xs font-mono flex items-center justify-between">
                    <div>
                      <span className="text-neutral-500 block">Focus Metric:</span>
                      <span className="font-bold text-emerald-700 text-sm">{activeModalCard.statsHighlight}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-500 block">Deliverable:</span>
                      <span className="font-bold text-neutral-900">{activeModalCard.statsLabel}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                      Layer Overview
                    </h4>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {activeModalCard.summary}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                      Core Pillars & Execution
                    </h4>
                    <div className="space-y-2">
                      {activeModalCard.features.map((item, i) => (
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
                  onClick={() => setActiveModalCard(null)}
                  className="w-full sm:w-auto text-xs font-bold text-neutral-500 hover:text-black py-2"
                >
                  Close Window
                </button>

                <a
                  href="#apply"
                  onClick={() => setActiveModalCard(null)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-full font-bold text-xs transition-all shadow-md"
                >
                  <span>Request Investor Matchmaking</span>
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
