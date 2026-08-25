export interface CardTheme {
  id: string
  name: string
  tagline: string
  badgeLabel: string
  previewColor: string
  // CSS class configurations
  bgClasses: string
  borderClasses: string
  glowClasses: string
  accentTextColor: string
  categoryBadgeClasses: string
  metricBgClasses: string
}

export const LUXURY_CARD_THEMES: Record<string, CardTheme> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Noir',
    tagline: 'Classic Minimalist Dark',
    badgeLabel: 'Standard',
    previewColor: '#121215',
    bgClasses: 'bg-[#121215]',
    borderClasses: 'border-white/10',
    glowClasses: 'shadow-black/50',
    accentTextColor: 'text-emerald-400',
    categoryBadgeClasses: 'bg-white/10 text-neutral-200 border-white/10',
    metricBgClasses: 'bg-neutral-900/80 border-white/5',
  },
  gold_prestige: {
    id: 'gold_prestige',
    name: 'Gold Prestige',
    tagline: 'Executive Gold & Dark Amber',
    badgeLabel: 'VIP Elite',
    previewColor: '#eab308',
    bgClasses: 'bg-gradient-to-br from-[#1a1408] via-[#120f06] to-[#261c08]',
    borderClasses: 'border-amber-500/40 shadow-[0_0_20px_rgba(234,179,8,0.15)]',
    glowClasses: 'shadow-amber-500/10',
    accentTextColor: 'text-amber-400',
    categoryBadgeClasses: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    metricBgClasses: 'bg-amber-950/40 border-amber-500/20',
  },
  midnight_sapphire: {
    id: 'midnight_sapphire',
    name: 'Midnight Sapphire',
    tagline: 'Cosmic Royal Blue & Cyan',
    badgeLabel: 'Executive',
    previewColor: '#3b82f6',
    bgClasses: 'bg-gradient-to-br from-[#081226] via-[#060c18] to-[#0d1d3d]',
    borderClasses: 'border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    glowClasses: 'shadow-blue-500/10',
    accentTextColor: 'text-cyan-400',
    categoryBadgeClasses: 'bg-blue-500/20 text-cyan-300 border-blue-500/40',
    metricBgClasses: 'bg-blue-950/40 border-blue-500/20',
  },
  royal_amethyst: {
    id: 'royal_amethyst',
    name: 'Royal Amethyst',
    tagline: 'Imperial Violet & Magenta',
    badgeLabel: 'Spotlight',
    previewColor: '#a855f7',
    bgClasses: 'bg-gradient-to-br from-[#1c0a2a] via-[#100618] to-[#2c0e42]',
    borderClasses: 'border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]',
    glowClasses: 'shadow-purple-500/10',
    accentTextColor: 'text-fuchsia-400',
    categoryBadgeClasses: 'bg-purple-500/20 text-fuchsia-300 border-purple-500/40',
    metricBgClasses: 'bg-purple-950/40 border-purple-500/20',
  },
  emerald_matrix: {
    id: 'emerald_matrix',
    name: 'Emerald Matrix',
    tagline: 'Deep Jade & Cyber Mint',
    badgeLabel: 'Syndicate',
    previewColor: '#10b981',
    bgClasses: 'bg-gradient-to-br from-[#061c12] via-[#04120c] to-[#0a2c1d]',
    borderClasses: 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    glowClasses: 'shadow-emerald-500/10',
    accentTextColor: 'text-emerald-400',
    categoryBadgeClasses: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    metricBgClasses: 'bg-emerald-950/40 border-emerald-500/20',
  },
  sunset_rose: {
    id: 'sunset_rose',
    name: 'Sunset Rose Gold',
    tagline: 'Velvet Copper & Coral',
    badgeLabel: 'Premium',
    previewColor: '#f43f5e',
    bgClasses: 'bg-gradient-to-br from-[#240c16] via-[#14060c] to-[#361220]',
    borderClasses: 'border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]',
    glowClasses: 'shadow-rose-500/10',
    accentTextColor: 'text-rose-400',
    categoryBadgeClasses: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    metricBgClasses: 'bg-rose-950/40 border-rose-500/20',
  },
  titanium_carbon: {
    id: 'titanium_carbon',
    name: 'Titanium Carbon',
    tagline: 'Metallic Platinum & Slate',
    badgeLabel: 'Founder Pro',
    previewColor: '#94a3b8',
    bgClasses: 'bg-gradient-to-br from-[#1e2229] via-[#121418] to-[#282d36]',
    borderClasses: 'border-slate-400/30 shadow-[0_0_20px_rgba(148,163,184,0.1)]',
    glowClasses: 'shadow-slate-500/10',
    accentTextColor: 'text-slate-300',
    categoryBadgeClasses: 'bg-slate-500/20 text-slate-200 border-slate-400/30',
    metricBgClasses: 'bg-slate-900/60 border-slate-400/20',
  },
}

export function getCardTheme(themeId?: string | null): CardTheme {
  if (!themeId) return LUXURY_CARD_THEMES.obsidian
  return LUXURY_CARD_THEMES[themeId] || LUXURY_CARD_THEMES.obsidian
}
