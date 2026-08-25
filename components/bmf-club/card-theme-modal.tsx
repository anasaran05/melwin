'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Lock, Check, Crown, Palette, Layers, Eye } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { LUXURY_CARD_THEMES, CardTheme, getCardTheme } from '@/lib/card-themes'
import { MemberFlipCard } from '@/components/bmf-club/member-flip-card'
import { BmfMember } from '@/lib/supabase/bmf-members'

interface CardThemeModalProps {
  isOpen: boolean
  onClose: () => void
  isFeatured: boolean
  currentTheme?: string
  memberPreview?: BmfMember
  onSelectTheme: (themeId: string) => void
}

export function CardThemeModal({
  isOpen,
  onClose,
  isFeatured,
  currentTheme = 'obsidian',
  memberPreview,
  onSelectTheme,
}: CardThemeModalProps) {
  const [selectedThemeId, setSelectedThemeId] = useState(currentTheme || 'obsidian')
  const [hoveredThemeId, setHoveredThemeId] = useState<string | null>(null)
  const themesList = Object.values(LUXURY_CARD_THEMES)

  // Synchronize when currentTheme changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedThemeId(currentTheme || 'obsidian')
      setHoveredThemeId(null)
    }
  }, [isOpen, currentTheme])

  if (!isOpen) return null

  const activeThemeId = hoveredThemeId || selectedThemeId
  const activeTheme = getCardTheme(activeThemeId)

  // Construct preview member with the currently active/hovered theme
  const previewData: BmfMember = memberPreview
    ? {
        ...memberPreview,
        is_featured: isFeatured,
        card_theme: activeThemeId,
      }
    : {
        id: 'preview-founder',
        full_name: 'Founder Name',
        role: 'Founder & CEO',
        company_name: 'Venture Studio',
        avatar_url: '',
        company_logo: '',
        category: 'AI & Tech',
        tagline: 'Building next-generation executive intelligence.',
        description: 'Building next-generation executive intelligence.',
        stage: 'Series A',
        metrics: '$2.4M ARR',
        location: 'Bangalore / Global',
        team_size: '15+ Team',
        is_verified: true,
        is_approved: true,
        is_featured: isFeatured,
        card_theme: activeThemeId,
        created_at: new Date().toISOString(),
      }

  const handleApply = () => {
    onSelectTheme(selectedThemeId)
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 text-left">
        {/* Deep Backdrop Blur with Ambient Lighting */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full ${
            isFeatured ? 'max-w-5xl' : 'max-w-lg'
          } bg-gradient-to-b from-[#15151c] via-[#0f0f14] to-[#09090c] border border-amber-500/25 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(234,179,8,0.1)] overflow-hidden z-10 flex flex-col max-h-[92vh]`}
        >
          {/* Subtle Top Gold Light Bar */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-4.5 border-b border-white/10 bg-neutral-950/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-transparent border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <Palette className="w-5 h-5 drop-shadow-sm" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>Executive Card Theme</span>
                  {isFeatured ? (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full shadow-xs">
                      VIP Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300/90 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Locked
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {isFeatured 
                    ? 'Select and preview luxury palettes for your founder card in real time'
                    : 'Exclusive founder card back themes and custom gradient palettes'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1">
            {!isFeatured ? (
              /* Ultra-Luxury Bespoke Coming Soon Showcase */
              <div className="text-center py-4 px-2 max-w-md mx-auto flex flex-col items-center relative">
                
                {/* Ambient Golden Aura */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-transparent blur-3xl pointer-events-none" />

                {/* Pedestal Container for Lottie */}
                <div className="relative w-full max-w-[340px] rounded-3xl bg-neutral-950/70 border border-white/10 p-5 shadow-2xl backdrop-blur-md overflow-hidden mb-6 flex flex-col items-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-black/60 pointer-events-none" />
                  
                  {/* Subtle Corner Accents */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-amber-500/40 rounded-tl" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-amber-500/40 rounded-tr" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-amber-500/40 rounded-bl" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-amber-500/40 rounded-br" />

                  <div className="relative w-48 h-36 sm:w-56 sm:h-40 flex items-center justify-center z-10">
                    <DotLottieReact
                      src="/assets/Coming Soon, no Background.json"
                      loop
                      autoplay
                      className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                    />
                  </div>

                  <div className="mt-2 z-10">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300/80 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full">
                      ● Under Active Development
                    </span>
                  </div>
                </div>

                {/* Typography Header */}
                <div className="space-y-1.5 mb-6 z-10">
                  <h4 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                    Coming Soon
                  </h4>
                  <p className="text-xs text-neutral-400 font-mono tracking-wide">
                    Executive Card Palettes & Luxury Reverse Customization
                  </p>
                </div>

                {/* Luxury Action Button */}
                <div className="z-10 w-full max-w-[280px]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black tracking-wider uppercase shadow-[0_0_25px_rgba(234,179,8,0.25)] transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-black text-black" />
                    <span>Close Preview</span>
                  </button>
                </div>

              </div>
            ) : (
              /* Unlocked VIP Theme Studio (Split View: Live Preview + Theme Grid) */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT: Live Interactive Card Preview Model */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 sm:p-6 rounded-3xl bg-neutral-950/70 border border-neutral-800/80 shadow-2xl relative overflow-hidden">
                  
                  {/* Dynamic Theme Ambient Aura / Radial Fade */}
                  <div
                    className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
                    style={{
                      backgroundColor: activeTheme.previewColor,
                    }}
                  />

                  {/* Header Indicator */}
                  <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-4 z-10">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Live 3D Preview</span>
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Interactive
                    </span>
                  </div>

                  {/* Interactive Flip Card */}
                  <div className="py-2 z-10 flex justify-center w-full">
                    <div className="w-[195px] sm:w-[210px] drop-shadow-2xl">
                      <MemberFlipCard member={previewData} />
                    </div>
                  </div>

                  {/* Hint & Current Theme Pill */}
                  <div className="w-full mt-4 pt-3 border-t border-white/10 z-10 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-white/10 text-xs shadow-inner">
                      <div
                        className="w-2.5 h-2.5 rounded-full border border-white/40 shadow-sm animate-pulse"
                        style={{ backgroundColor: activeTheme.previewColor }}
                      />
                      <span className="font-bold text-white text-xs">{activeTheme.name}</span>
                      <span className={`text-[10px] font-mono ${activeTheme.accentTextColor}`}>
                        • {activeTheme.tagline}
                      </span>
                    </div>

                    <p className="text-[10px] text-neutral-400 text-center font-mono">
                      💡 Hover or click card to inspect the reverse side
                    </p>
                  </div>
                </div>

                {/* RIGHT: Theme Selection Grid */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      Select Luxury Palette ({themesList.length} Options)
                    </span>
                    {hoveredThemeId && hoveredThemeId !== selectedThemeId && (
                      <span className="text-[10px] font-mono text-amber-400 animate-pulse">
                        Hover Previewing
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                    {themesList.map((theme: CardTheme) => {
                      const isSelected = selectedThemeId === theme.id
                      const isHovered = hoveredThemeId === theme.id
                      return (
                        <div
                          key={theme.id}
                          onClick={() => setSelectedThemeId(theme.id)}
                          onMouseEnter={() => setHoveredThemeId(theme.id)}
                          onMouseLeave={() => setHoveredThemeId(null)}
                          className={`relative p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border text-left overflow-hidden ${
                            theme.bgClasses
                          } ${
                            isSelected
                              ? 'border-white ring-2 ring-white/50 shadow-xl scale-[1.02]'
                              : isHovered
                              ? 'border-white/40 shadow-lg scale-[1.01]'
                              : 'border-white/15 hover:border-white/30'
                          }`}
                        >
                          {/* Theme Identity */}
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                                style={{ backgroundColor: theme.previewColor }}
                              />
                              <span className="text-xs font-bold text-white">{theme.name}</span>
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center shadow-md">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </div>

                          <p className="text-[10.5px] text-neutral-300 font-mono mb-2.5">
                            {theme.tagline}
                          </p>

                          <div className="flex items-center justify-between text-[9.5px] font-mono">
                            <span className={`px-2 py-0.5 rounded-full border ${theme.categoryBadgeClasses}`}>
                              {theme.badgeLabel}
                            </span>
                            <span className={`${theme.accentTextColor} font-semibold`}>
                              {theme.id === 'gold_prestige' ? '👑 Presidential' : 'Luxury Gradient'}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Footer Actions (When Unlocked) */}
          {isFeatured && (
            <div className="px-5 py-4 sm:px-6 sm:py-4 border-t border-white/10 bg-neutral-900/60 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
                Selected palette updates card preview and directory card
              </span>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply & Save Theme</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

