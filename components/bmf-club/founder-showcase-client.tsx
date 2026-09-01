'use client'

import React, { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BmfMember, 
  sortBmfMembers, 
  normalizeCategory, 
  BMF_STANDARD_CATEGORIES,
  fetchBmfMembers,
  getSupabaseBrowserClient
} from '@/lib/supabase/bmf-members'
import { normalizeR2Url } from '@/lib/image-utils'
import { MemberFlipCard } from '@/components/bmf-club/member-flip-card'
import { ShareFounderCardModal } from '@/components/bmf-club/share-founder-card-modal'
import { RequestIntroModal } from '@/components/bmf-club/request-intro-modal'
import { getCardTheme } from '@/lib/card-themes'
import { Footer } from '@/components/footer'
import { 
  Share2, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  MapPin, 
  Users, 
  Building2, 
  Globe, 
  Linkedin, 
  Twitter, 
  ArrowLeft, 
  ArrowRight, 
  Layers, 
  Search, 
  Compass, 
  Handshake,
  QrCode,
  ShieldCheck,
  LayoutDashboard,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface FounderShowcaseClientProps {
  initialMember: BmfMember
  allMembers: BmfMember[]
  currentUserId?: string
  currentUserEmail?: string
}

export function FounderShowcaseClient({
  initialMember,
  allMembers,
  currentUserId,
  currentUserEmail,
}: FounderShowcaseClientProps) {
  const router = useRouter()
  const [activeFounder, setActiveFounder] = useState<BmfMember>(initialMember)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false)
  const [isAboutExpanded, setIsAboutExpanded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Auth State for dynamic Join Free / Dashboard button
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(currentUserId || currentUserEmail))
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    let isSubscribed = true
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user && isSubscribed) {
            setIsLoggedIn(true)
            setAuthLoading(false)
            return
          }
          supabase.auth.onAuthStateChange((_event, session) => {
            if (isSubscribed) {
              setIsLoggedIn(!!session?.user)
              setAuthLoading(false)
            }
          })
        }
        if (typeof window !== 'undefined') {
          const storedEmail = localStorage.getItem('bmf_current_user_email')
          if (storedEmail && isSubscribed) {
            setIsLoggedIn(true)
          }
        }
      } catch (err) {
        console.error('Error checking auth in FounderShowcaseClient:', err)
      } finally {
        if (isSubscribed) {
          setAuthLoading(false)
        }
      }
    }
    checkAuth()
    return () => {
      isSubscribed = false
    }
  }, [])

  // Sync active founder if initialMember changes from server
  useEffect(() => {
    if (initialMember && initialMember.id !== activeFounder.id) {
      setActiveFounder(initialMember)
    }
  }, [initialMember])

  const isFeatured = Boolean(activeFounder.is_featured)
  const cardTheme = isFeatured ? getCardTheme(activeFounder.card_theme) : getCardTheme('obsidian')

  // Smooth Interactive Swap when clicking a peer card
  const handleSwapFounder = (clickedMember: BmfMember) => {
    setActiveFounder(clickedMember)
    setIsAboutExpanded(false)
    // Update URL seamlessly in browser history
    if (typeof window !== 'undefined') {
      const newUrl = `/bmf-club/showcase/${encodeURIComponent(clickedMember.id)}`
      window.history.pushState(null, '', newUrl)
    }
  }

  // Filter peer founders in the bottom section
  const normActiveCat = normalizeCategory(activeFounder.category)
  
  const filteredPeers = allMembers.filter((m) => {
    if (m.id === activeFounder.id) return false
    
    // Category match
    if (selectedCategory !== 'All') {
      const norm = normalizeCategory(m.category)
      if (norm !== selectedCategory && m.category !== selectedCategory) return false
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        m.full_name.toLowerCase().includes(q) ||
        m.company_name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        (m.description && m.description.toLowerCase().includes(q))
      if (!match) return false
    }

    return true
  })

  // Priority lineup matching directory page sorting
  const sortedPeers = sortBmfMembers(filteredPeers)

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#111111] font-sans selection:bg-black selection:text-white flex flex-col justify-between">
      
      {/* Main Content Area with integrated top navigation */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 md:px-12 py-4 sm:py-8 space-y-6 sm:space-y-12">
        
        {/* Clean Integrated Top Navigation Row (No boxed/sticky header bar) */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Back Link matching Directory style */}
          <Link
            href="/bmf-club/directory"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-neutral-600 hover:text-black transition-colors px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-black/5 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>BMF Club</span>
          </Link>

          {/* Right: Join Free / Dashboard button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!authLoading && (
              isLoggedIn ? (
                <Link
                  href="/bmf-club/dashboard"
                  className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#111111] hover:bg-black text-white px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-95 shrink-0"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Go to Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70 hidden sm:inline" />
                </Link>
              ) : (
                <Link
                  href="/bmf-club/dashboard"
                  className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#111111] hover:bg-black text-white px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-95 group shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 fill-emerald-400" />
                  <span>Join Free</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform hidden sm:inline" />
                </Link>
              )
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. TOP SPOTLIGHT HERO: LinkedIn + Instagram Hybrid Profile Card           */}
        {/* ========================================================================= */}
        <section className="relative rounded-3xl bg-white border border-black/10 p-6 sm:p-10 md:p-12 overflow-hidden shadow-sm">
          {/* Ambient Soft Emerald Glow */}
          <div 
            className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none transition-all duration-700"
            style={{ background: `radial-gradient(circle, rgba(16, 185, 129, 0.12), transparent 70%)` }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFounder.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative space-y-6 sm:space-y-8"
            >
              {/* Header Row: Circular Avatar + Info (Left) + Prominent Company Badge (Right) */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-7">
                {/* Left Side: Avatar + Details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 flex-1 min-w-0">
                  {/* Circular Profile Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-neutral-100 ring-4 ring-black/5 shadow-md">
                      {activeFounder.avatar_url ? (
                        <img
                          src={normalizeR2Url(activeFounder.avatar_url)}
                          alt={activeFounder.full_name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300 text-neutral-800">
                          <span className="text-3xl sm:text-4xl font-black text-emerald-600">
                            {activeFounder.full_name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    {isFeatured && (
                      <div 
                        className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md ring-2 ring-white"
                        title="Verified Spotlight Founder"
                      >
                        <svg 
                          viewBox="0 0 24 24" 
                          aria-label="Verified Spotlight Founder" 
                          className="w-5 h-5 sm:w-6 sm:h-6 text-[#1d9bf0] fill-current"
                        >
                          <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.75 4.75l-4-4 1.41-1.41 2.59 2.58 6.59-6.58 1.41 1.41-8 8z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Name, Role & Badges */}
                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Category & Status Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-900 border border-emerald-500/25 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-mono font-bold">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>{activeFounder.category || 'DeepTech & AI'}</span>
                      </span>

                      {activeFounder.stage && (
                        <span className="inline-flex items-center gap-1 bg-black/5 text-neutral-700 border border-black/10 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-mono font-medium">
                          {activeFounder.stage}
                        </span>
                      )}

                      {isFeatured && (
                        <span className="inline-flex items-center gap-1 bg-sky-500/10 text-sky-800 border border-sky-500/25 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-mono font-semibold">
                          <ShieldCheck className="w-3 h-3 text-[#1d9bf0]" />
                          <span>Spotlight</span>
                        </span>
                      )}
                    </div>

                    {/* Founder Name */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#111111] leading-tight">
                      {activeFounder.full_name}
                    </h1>

                    {/* Founder Role */}
                    <p className="text-sm sm:text-base md:text-lg font-bold text-emerald-700">
                      {activeFounder.role}
                    </p>
                  </div>
                </div>

                {/* Right Side: Clean Unboxed Company Identity */}
                {activeFounder.company_name && (
                  <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                    {activeFounder.company_logo ? (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
                        <img
                          src={normalizeR2Url(activeFounder.company_logo)}
                          alt={activeFounder.company_name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center shrink-0 text-neutral-400">
                        <Building2 className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                        Company
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-[#111111]">
                        {activeFounder.company_name}
                      </h4>
                    </div>
                  </div>
                )}
              </div>

              {/* Pitch / Tagline */}
              {activeFounder.tagline && (
                <div className="pt-1 border-t border-black/5">
                  <p className="text-sm sm:text-base md:text-lg text-neutral-800 font-semibold leading-relaxed italic border-l-2 border-emerald-500 pl-3 sm:pl-4 py-0.5">
                    "{activeFounder.tagline}"
                  </p>
                </div>
              )}

              {/* Dedicated About Section with 3-Line Clamp & Read More */}
              {activeFounder.description && (
                <div className="space-y-2 pt-2 border-t border-black/5">
                  <h3 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                    About
                  </h3>
                  <div className="space-y-1.5">
                    <p className={`text-xs sm:text-sm md:text-base text-neutral-600 leading-relaxed font-normal max-w-4xl transition-all duration-300 ${!isAboutExpanded ? 'line-clamp-3' : ''}`}>
                      {activeFounder.description}
                    </p>
                    {activeFounder.description.length > 150 && (
                      <button
                        type="button"
                        onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer pt-0.5"
                      >
                        <span>{isAboutExpanded ? 'Show less' : '...read more'}</span>
                        {isAboutExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Stats & Meta Strip */}
              {(activeFounder.location || activeFounder.team_size || activeFounder.metrics || activeFounder.website_url) && (
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 p-3.5 sm:p-4 rounded-2xl bg-[#f8f8fa] border border-black/10 text-xs sm:text-sm">
                  {activeFounder.location && (
                    <div className="flex items-center gap-1.5 text-neutral-700">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-semibold">{activeFounder.location}</span>
                    </div>
                  )}

                  {activeFounder.team_size && (
                    <div className="flex items-center gap-1.5 text-neutral-700">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Team: <strong className="text-black">{activeFounder.team_size}</strong></span>
                    </div>
                  )}

                  {activeFounder.metrics && (
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold">{activeFounder.metrics}</span>
                    </div>
                  )}

                  {activeFounder.website_url && (
                    <a
                      href={activeFounder.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-medium ml-auto"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[180px] sm:max-w-none">
                        {activeFounder.website_url.replace(/^https?:\/\//, '')}
                      </span>
                    </a>
                  )}
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-t border-black/5">
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                  {/* Approach / Request Warm Intro */}
                  <button
                    type="button"
                    onClick={() => setIsIntroModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Handshake className="w-4 h-4 text-emerald-400" />
                    <span>Approach Founder</span>
                  </button>

                  {/* Share Card CTA */}
                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/15 px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <Share2 className="w-4 h-4 text-neutral-700" />
                    <span>Share Card</span>
                  </button>
                </div>

                {/* Social Profiles */}
                <div className="flex items-center gap-2">
                  {activeFounder.linkedin_url && (
                    <a
                      href={activeFounder.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/5 hover:bg-[#0A66C2] text-neutral-700 hover:text-white flex items-center justify-center transition-colors border border-black/10"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </a>
                  )}
                  {activeFounder.twitter_url && (
                    <a
                      href={activeFounder.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/5 hover:bg-black text-neutral-700 hover:text-white flex items-center justify-center transition-colors border border-black/10"
                      aria-label="Twitter Profile"
                    >
                      <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </a>
                  )}
                  {activeFounder.website_url && (
                    <a
                      href={activeFounder.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/5 hover:bg-black text-neutral-700 hover:text-white flex items-center justify-center transition-colors border border-black/10"
                      aria-label="Website"
                    >
                      <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ========================================================================= */}
        {/* 2. BOTTOM SECTION: Related Founders (5 Cards Per Row)                     */}
        {/* ========================================================================= */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 border-b border-black/10 pb-4 sm:pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[#111111]">
                  Discover Related Founders
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-xl">
                Click any founder card below to immediately swap and explore their spotlight details, metrics, and venture pass.
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search peers by name or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-black/10'
              }`}
            >
              All Categories
            </button>
            {BMF_STANDARD_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-black/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Peer Founders Grid: 5 Cards in One Row on Desktop (lg:grid-cols-5) */}
          {sortedPeers.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-black/10 text-center space-y-3">
              <Users className="w-8 h-8 text-neutral-400 mx-auto" />
              <h3 className="text-base font-bold text-neutral-800">No Matching Founders</h3>
              <p className="text-xs text-neutral-500">
                Try selecting "All Categories" or adjusting your search query.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5 justify-items-center">
              {sortedPeers.map((peer) => (
                <div
                  key={peer.id}
                  onClick={() => handleSwapFounder(peer)}
                  className="w-full flex justify-center transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
                >
                  <MemberFlipCard
                    member={peer}
                    currentUserId={currentUserId}
                    currentUserEmail={currentUserEmail}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Share Founder Pass Modal */}
      <ShareFounderCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        member={activeFounder}
        isOwnCard={
          Boolean(
            (currentUserId && activeFounder.user_id && currentUserId === activeFounder.user_id) ||
            (currentUserId && activeFounder.id && currentUserId === activeFounder.id) ||
            (currentUserEmail && activeFounder.email && currentUserEmail.trim().toLowerCase() === activeFounder.email.trim().toLowerCase())
          )
        }
        currentUserId={currentUserId}
        currentUserEmail={currentUserEmail}
      />

      {/* Request Intro Modal */}
      <RequestIntroModal
        isOpen={isIntroModalOpen}
        onClose={() => setIsIntroModalOpen(false)}
        member={activeFounder}
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}
