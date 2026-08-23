'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BmfMember, 
  fetchPaginatedMembers, 
  sortBmfMembers,
  clearClientMembersCache 
} from '@/lib/supabase/bmf-members'
import { MemberFlipCard } from '@/components/bmf-club/member-flip-card'
import { SkeletonFounderCard } from '@/components/bmf-club/skeleton-founder-card'
import { Footer } from '@/components/footer'
import { 
  Search, 
  Sparkles, 
  UserCheck, 
  Layers,
  X,
  ArrowUp,
  RotateCw,
  SlidersHorizontal,
  Flame,
  CheckCircle2
} from 'lucide-react'

type MembershipTierTab = 'all' | 'premium' | 'regular'

const PAGE_SIZE = 12

export default function BmfFounderDirectoryPage() {
  // Directory state
  const [members, setMembers] = useState<BmfMember[]>([])
  const [tierTab, setTierTab] = useState<MembershipTierTab>('all')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Pagination & infinite loading state
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPremium, setTotalPremium] = useState(0)
  const [totalRegular, setTotalRegular] = useState(0)
  const [categories, setCategories] = useState<string[]>(['All'])
  
  // Loading states
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Infinite scroll sentinel observer ref
  const observerRef = useRef<HTMLDivElement | null>(null)

  // Scroll listener for floating "Back to top" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load initial page or when tier/category/search changes
  const loadInitialData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true)
      clearClientMembersCache()
    } else {
      setIsInitialLoading(true)
    }

    try {
      const res = await fetchPaginatedMembers({
        page: 1,
        limit: PAGE_SIZE,
        tier: tierTab,
        category: selectedCategory,
        search: searchQuery,
        forceFresh: isRefresh,
      })

      setMembers(res.members)
      setPage(1)
      setHasMore(res.pagination.hasMore)
      setTotalCount(res.pagination.total)
      if (res.meta) {
        setCategories(res.meta.categories || ['All'])
        setTotalPremium(res.meta.totalPremium || 0)
        setTotalRegular(res.meta.totalRegular || 0)
      }
    } catch (err) {
      console.error('[Directory Initial Load Error]:', err)
    } finally {
      setIsInitialLoading(false)
      setIsRefreshing(false)
    }
  }, [tierTab, selectedCategory, searchQuery])

  // Trigger initial data load when filters change
  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  // Load next page function (Pinterest-style infinite scroll)
  const loadNextPage = useCallback(async () => {
    if (isLoadingMore || !hasMore || isInitialLoading) return

    setIsLoadingMore(true)
    const nextPage = page + 1

    try {
      const res = await fetchPaginatedMembers({
        page: nextPage,
        limit: PAGE_SIZE,
        tier: tierTab,
        category: selectedCategory,
        search: searchQuery,
      })

      if (res.members && res.members.length > 0) {
        setMembers((prev) => {
          // Deduplicate based on member id
          const existingIds = new Set(prev.map((m) => m.id))
          const newUnique = res.members.filter((m) => !existingIds.has(m.id))
          return [...prev, ...newUnique]
        })
        setPage(nextPage)
        setHasMore(res.pagination.hasMore)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error('[Directory Load More Error]:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMore, isInitialLoading, page, tierTab, selectedCategory, searchQuery])

  // Setup IntersectionObserver for bottom sentinel
  useEffect(() => {
    if (!observerRef.current || !hasMore || isInitialLoading || isLoadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage()
        }
      },
      { threshold: 0.1, rootMargin: '250px' }
    )

    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [loadNextPage, hasMore, isInitialLoading, isLoadingMore])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Split into Premium & Regular groups for Tiered View
  const premiumMembers = sortBmfMembers(members.filter((m) => m.is_featured))
  const regularMembers = sortBmfMembers(members.filter((m) => !m.is_featured))

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#111111] font-sans flex flex-col justify-between selection:bg-black selection:text-white">
      
      {/* Main Directory Container */}
      <main className="flex-1 pt-6 sm:pt-12 pb-16 sm:pb-24 px-3.5 sm:px-6 md:px-12 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
        
        {/* Title & Introduction - Center Aligned */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
         

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight">
            Founder Showcase Directory
          </h1>
          <p className="text-xs sm:text-base text-neutral-600 leading-relaxed max-w-xl mx-auto px-2">
            Discover spotlighted Premium Founders and verified Syndicate Members scaling high-impact ventures.
          </p>
        </div>

        {/* Filter & Search Control Panel */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-black/10 shadow-xs space-y-3 sm:space-y-4 text-left">
          
          {/* Row 1: Membership Tier Tabs (Premium vs Regular) + View Mode + Search Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
            
            {/* Membership Tier Segmented Switcher */}
            <div className="inline-flex p-1 bg-[#f0f0f2] rounded-xl sm:rounded-2xl border border-black/5 w-full sm:w-auto overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setTierTab('all')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  tierTab === 'all'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>All Founders</span>
                <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full ${tierTab === 'all' ? 'bg-black/10 text-black' : 'bg-black/5 text-neutral-500'}`}>
                  {totalPremium + totalRegular}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTierTab('premium')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  tierTab === 'premium'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-amber-700'
                }`}
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Premium</span>
                <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full ${tierTab === 'premium' ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800'}`}>
                  {totalPremium}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTierTab('regular')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  tierTab === 'regular'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Regular</span>
                <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full ${tierTab === 'regular' ? 'bg-white/20 text-white' : 'bg-black/5 text-neutral-500'}`}>
                  {totalRegular}
                </span>
              </button>
            </div>

            {/* Right Controls: Search Input & Refresh Button */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 lg:max-w-md">
              {/* Search Input */}
              <div className="relative flex-1">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Cache Refresh Button */}
              <button
                type="button"
                onClick={() => loadInitialData(true)}
                disabled={isRefreshing}
                title="Refresh from server"
                className="p-2 sm:p-2.5 rounded-xl bg-[#f5f5f7] hover:bg-neutral-200 text-neutral-600 hover:text-black transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-black' : ''}`} />
              </button>

            </div>

          </div>

          {/* Row 2: Category Filter Pills (Smooth scroll on mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-black/5 overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap pb-0.5 sm:pb-0">
            <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider pr-1 shrink-0">
              Category:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#111111] text-white shadow-xs scale-105'
                      : 'bg-[#f5f5f7] text-neutral-600 hover:bg-neutral-200 hover:text-black'
                  }`}
                >
                  <span>{cat}</span>
                </button>
              )
            })}
          </div>

        </div>

        {/* Live Pagination Counter & Status Bar */}
        <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">
              Showing {members.length} of {totalCount}
            </span>
            <span>Verified Founders</span>
            {isRefreshing && (
              <span className="text-[11px] font-mono text-amber-600 animate-pulse flex items-center gap-1">
                • Syncing fresh data...
              </span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
            <span>Progressive Loading</span>
            <span>•</span>
            <span>Instant Client Cache</span>
          </div>
        </div>

        {/* Initial Loading Skeleton State */}
        {isInitialLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 justify-items-center animate-in fade-in-0 duration-300">
            {[...Array(10)].map((_, i) => (
              <SkeletonFounderCard 
                key={`initial-skel-${i}`} 
                aspectRatio={i % 3 === 0 ? 'tall' : i % 2 === 0 ? 'standard' : 'compact'}
                className="w-full"
              />
            ))}
          </div>
        ) : members.length === 0 ? (
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
          /* ============================================================== */
          /* PINTEREST-STYLE MASONRY WATERFALL FEED */
          /* ============================================================== */
          <div className="space-y-8">
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 justify-items-center"
            >
              <AnimatePresence mode="popLayout">
                {members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, delay: (index % 6) * 0.04 }}
                    className="w-full flex justify-center shrink-0"
                  >
                    <MemberFlipCard member={member} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Bottom Infinite Loading Sentinel & Skeleton Placeholders */}
            {hasMore && (
              <div ref={observerRef} className="pt-4 pb-8 space-y-6">
                {isLoadingMore ? (
                  <div className="space-y-4 text-center">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 justify-items-center">
                      {[...Array(5)].map((_, i) => (
                        <SkeletonFounderCard key={`loading-skel-${i}`} className="w-full" />
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-neutral-500 bg-white border border-black/10 px-4 py-2 rounded-full shadow-xs">
                      <RotateCw className="w-3.5 h-3.5 animate-spin text-black" />
                      <span>Loading next batch of founders...</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={loadNextPage}
                      className="inline-flex items-center gap-2 bg-white hover:bg-neutral-900 text-neutral-900 hover:text-white border border-black/10 hover:border-black px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <span>Load More Founders &darr;</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Reached End of Directory Badge */}
            {!hasMore && members.length > 0 && (
              <div className="pt-6 pb-2 text-center">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-black/10 shadow-xs text-xs font-semibold text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You have reached the end</span>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Floating "Back to Top" Action Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-neutral-900 text-white rounded-full shadow-xl hover:bg-black transition-transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer border border-white/20"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  )
}

