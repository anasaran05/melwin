'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BmfMember, fetchBmfMembers } from '@/lib/supabase/bmf-members'
import { MemberFlipCard } from '@/components/bmf-club/member-flip-card'
import { SkeletonFounderCard } from '@/components/bmf-club/skeleton-founder-card'
import { Footer } from '@/components/footer'
import { 
  Search, 
  Sparkles, 
  UserCheck, 
  Layers,
  LayoutGrid,
  Rows3,
  X
} from 'lucide-react'

type MembershipTierTab = 'all' | 'premium' | 'regular'

export default function BmfFounderDirectoryPage() {
  const [members, setMembers] = useState<BmfMember[]>([])
  const [tierTab, setTierTab] = useState<MembershipTierTab>('all')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isRegularGridExpanded, setIsRegularGridExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadAllMembers() {
      try {
        const data = await fetchBmfMembers()
        if (data && data.length > 0) {
          setMembers(data)
        }
      } catch (err) {
        console.error('Failed to load all directory members:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadAllMembers()
  }, [])

  // Derive unique categories dynamically
  const categories = ['All', ...Array.from(new Set(members.map((m) => m.category))).filter(Boolean)]

  // Filter pipeline
  const filteredMembers = members.filter((member) => {
    // 1. Tier Tab filter
    if (tierTab === 'premium' && !member.is_featured) return false
    if (tierTab === 'regular' && member.is_featured) return false

    // 2. Category filter
    const matchesCategory = selectedCategory === 'All' || member.category === selectedCategory

    // 3. Search query filter
    const searchLower = searchQuery.toLowerCase().trim()
    if (!searchLower) return matchesCategory

    const matchesSearch =
      member.full_name.toLowerCase().includes(searchLower) ||
      member.company_name.toLowerCase().includes(searchLower) ||
      member.role.toLowerCase().includes(searchLower) ||
      (member.tagline && member.tagline.toLowerCase().includes(searchLower)) ||
      (member.description && member.description.toLowerCase().includes(searchLower)) ||
      (member.location && member.location.toLowerCase().includes(searchLower)) ||
      (member.category && member.category.toLowerCase().includes(searchLower))

    return matchesCategory && matchesSearch
  })

  // Split into Premium & Regular groups
  const premiumMembers = filteredMembers.filter((m) => m.is_featured)
  const regularMembers = filteredMembers.filter((m) => !m.is_featured)

  // Overall counts (unfiltered by search/category for tab badges)
  const totalPremiumCount = members.filter((m) => m.is_featured).length
  const totalRegularCount = members.filter((m) => !m.is_featured).length

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#111111] font-sans flex flex-col justify-between">
      
      {/* Main Directory Container */}
      <main className="flex-1 pt-6 sm:pt-12 pb-12 sm:pb-16 px-3.5 sm:px-6 md:px-12 max-w-7xl mx-auto w-full space-y-6 sm:space-y-7">
        
        {/* Title & Introduction - Center Aligned */}
        <div className="text-center max-w-3xl mx-auto space-y-1.5 sm:space-y-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight">
            Founder Showcase Directory
          </h1>
          <p className="text-xs sm:text-base text-neutral-600 leading-relaxed max-w-xl mx-auto px-2">
            Discover spotlighted Premium Founders and verified Syndicate Members scaling high-impact ventures.
          </p>
        </div>

        {/* Filter & Search Control Panel */}
        <div className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-3xl border border-black/10 shadow-xs space-y-3 sm:space-y-4 text-left">
          
          {/* Row 1: Membership Tier Tabs (Premium vs Regular) + Search Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
            
            {/* Membership Tier Segmented Switcher */}
            <div className="inline-flex p-1 bg-[#f0f0f2] rounded-xl sm:rounded-2xl border border-black/5 w-full sm:w-auto overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setTierTab('all')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                  tierTab === 'all'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>All Founders</span>
                <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full ${tierTab === 'all' ? 'bg-black/10 text-black' : 'bg-black/5 text-neutral-500'}`}>
                  {members.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTierTab('premium')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                  tierTab === 'premium'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-amber-700'
                }`}
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Premium</span>
                <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full ${tierTab === 'premium' ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800'}`}>
                  {totalPremiumCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTierTab('regular')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                  tierTab === 'regular'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Regular</span>
                <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full ${tierTab === 'regular' ? 'bg-white/20 text-white' : 'bg-black/5 text-neutral-500'}`}>
                  {totalRegularCount}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by founder, company, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-black/5 rounded-xl sm:rounded-2xl pl-9 pr-9 py-2 sm:py-2.5 text-xs text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* Row 2: Category Filter Pills (Smooth scroll on mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-black/5 overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap pb-0.5 sm:pb-0">
            <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider pr-1 shrink-0">
              Category:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat
              const count = cat === 'All' 
                ? (tierTab === 'all' ? members.length : tierTab === 'premium' ? totalPremiumCount : totalRegularCount)
                : members.filter((m) => {
                    if (tierTab === 'premium' && !m.is_featured) return false
                    if (tierTab === 'regular' && m.is_featured) return false
                    return m.category === cat
                  }).length

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-[#111111] text-white shadow-xs scale-105'
                      : 'bg-[#f5f5f7] text-neutral-600 hover:bg-neutral-200 hover:text-black'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-neutral-500'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

        </div>

        {/* Loading Skeleton State */}
        {isLoading ? (
          <div className="space-y-10 sm:space-y-12 animate-in fade-in-0 duration-300 text-left">
            {/* Premium Section Skeleton */}
            <section className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-3 pb-2 border-b border-black/10">
                <div className="h-6 bg-black/10 rounded-lg w-52 animate-pulse" />
                <div className="h-5 bg-amber-100 rounded-full w-10 animate-pulse" />
              </div>
              <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-start gap-3 sm:gap-5 pb-2 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
                {[...Array(4)].map((_, i) => (
                  <SkeletonFounderCard key={`skel-prem-${i}`} />
                ))}
              </div>
            </section>

            {/* Regular Section Skeleton */}
            <section className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-3 pb-2 border-b border-black/10">
                <div className="h-6 bg-black/10 rounded-lg w-44 animate-pulse" />
                <div className="h-5 bg-black/10 rounded-full w-10 animate-pulse" />
              </div>
              <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-start gap-3 sm:gap-5 pb-2 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
                {[...Array(4)].map((_, i) => (
                  <SkeletonFounderCard key={`skel-reg-${i}`} />
                ))}
              </div>
            </section>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-black/10 p-8 space-y-3">
            <UserCheck className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-lg font-bold text-neutral-800">No founders found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              No active member profiles match your current tier, category, or search filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setTierTab('all')
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="mt-2 text-xs font-bold text-[#111111] underline hover:text-black cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-12">

            {/* ============================================================== */}
            {/* SECTION 1: PREMIUM MEMBERS (Visible when tierTab is 'all' or 'premium') */}
            {/* ============================================================== */}
            {(tierTab === 'all' || tierTab === 'premium') && premiumMembers.length > 0 && (
              <section className="space-y-4 sm:space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-black/10">
                  <div>
                    <h2 className="text-lg sm:text-2xl font-black text-[#111111] tracking-tight flex items-center gap-2">
                      <span>Premium Spotlight Founders</span>
                      <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {premiumMembers.length}
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5 hidden sm:block">
                      High-conviction founders & executive syndicate members with verified milestones.
                    </p>
                  </div>
                </div>

                <motion.div 
                  layout
                  className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-start gap-3 sm:gap-5 pb-2 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none"
                >
                  <AnimatePresence>
                    {premiumMembers.map((member) => (
                      <motion.div
                        key={member.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="snap-start shrink-0"
                      >
                        <MemberFlipCard member={member} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </section>
            )}

            {/* ============================================================== */}
            {/* SECTION 2: REGULAR MEMBERS (Visible when tierTab is 'all' or 'regular') */}
            {/* ============================================================== */}
            {(tierTab === 'all' || tierTab === 'regular') && regularMembers.length > 0 && (
              <section className="space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/10">
                  <div>
                    <h2 className="text-lg sm:text-2xl font-black text-[#111111] tracking-tight flex items-center gap-2">
                      <span>Verified Club Members</span>
                      <span className="text-xs font-mono font-bold bg-neutral-200 text-neutral-800 px-2.5 py-0.5 rounded-full border border-neutral-300">
                        {regularMembers.length}
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5 hidden sm:block">
                      Active startup builders, engineers, and researchers scaling across the ecosystem.
                    </p>
                  </div>

                  {/* Mobile Toggle: View Slider vs Show More / Grid */}
                  <button
                    type="button"
                    onClick={() => setIsRegularGridExpanded(!isRegularGridExpanded)}
                    className="inline-flex sm:hidden items-center gap-1.5 text-[11px] font-bold text-neutral-800 bg-neutral-200/80 hover:bg-neutral-300 px-3 py-1.5 rounded-full transition-all shrink-0"
                  >
                    {isRegularGridExpanded ? (
                      <>
                        <Rows3 className="w-3 h-3 text-neutral-600" />
                        <span>Slider Mode</span>
                      </>
                    ) : (
                      <>
                        <LayoutGrid className="w-3 h-3 text-neutral-600" />
                        <span>Show More</span>
                      </>
                    )}
                  </button>
                </div>

                <motion.div 
                  layout
                  className={
                    isRegularGridExpanded
                      ? "grid grid-cols-2 sm:flex sm:flex-wrap items-start gap-3 sm:gap-5 justify-items-center"
                      : "flex overflow-x-auto no-scrollbar sm:flex-wrap items-start gap-3 sm:gap-5 pb-2 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none"
                  }
                >
                  <AnimatePresence>
                    {regularMembers.map((member) => (
                      <motion.div
                        key={member.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className={isRegularGridExpanded ? "w-full flex justify-center sm:w-auto shrink-0" : "snap-start shrink-0"}
                      >
                        <MemberFlipCard member={member} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </section>
            )}

        </div>
        )}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
