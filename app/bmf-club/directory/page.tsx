'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BmfMember, INITIAL_BMF_MEMBERS, fetchBmfMembers } from '@/lib/supabase/bmf-members'
import { MemberFlipCard } from '@/components/bmf-club/member-flip-card'
import { Footer } from '@/components/footer'
import { 
  Search, 
  ArrowLeft, 
  Sparkles, 
  Compass, 
  SlidersHorizontal, 
  UserCheck, 
  Building2, 
  LogIn, 
  Users 
} from 'lucide-react'

export default function BmfFounderDirectoryPage() {
  const [members, setMembers] = useState<BmfMember[]>(INITIAL_BMF_MEMBERS)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [onlyFeaturedFilter, setOnlyFeaturedFilter] = useState(false)
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

  const filteredMembers = members.filter((member) => {
    if (onlyFeaturedFilter && !member.is_featured) return false
    const matchesCategory = selectedCategory === 'All' || member.category === selectedCategory
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      member.full_name.toLowerCase().includes(searchLower) ||
      member.company_name.toLowerCase().includes(searchLower) ||
      member.role.toLowerCase().includes(searchLower) ||
      member.tagline.toLowerCase().includes(searchLower) ||
      (member.description && member.description.toLowerCase().includes(searchLower)) ||
      member.location.toLowerCase().includes(searchLower)

    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#111111] font-sans flex flex-col justify-between">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#f5f5f7]/80 backdrop-blur-md border-b border-black/[0.06] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/bmf-club"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to BMF Club</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/bmf-club/login"
              className="inline-flex items-center gap-1.5 bg-[#111111] hover:bg-black text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5 text-neutral-300" />
              <span>Member Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Directory Container */}
      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full space-y-10">
        
        {/* Title & Introduction */}
        <div className="space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] border border-black/5 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-600">
            <Compass className="w-3.5 h-3.5 text-neutral-500" />
            <span>BMF Global Founder Showcase</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight">
                Founder Showcase Directory
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mt-2">
                Explore vetted startup founders, deeptech pioneers, and ambitious builders scaling companies across the BMF syndicate.
              </p>
            </div>

            {/* Stats pill */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-black/5 shadow-xs shrink-0">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-neutral-800">
                {filteredMembers.length} {filteredMembers.length === 1 ? 'Founder' : 'Founders'} Shown
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-black/10 shadow-xs space-y-4 text-left">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by founder, company, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-black/5 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Featured Only Toggle */}
            <button
              type="button"
              onClick={() => setOnlyFeaturedFilter(!onlyFeaturedFilter)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
                onlyFeaturedFilter
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-[#f5f5f7] text-neutral-600 border-transparent hover:text-black'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${onlyFeaturedFilter ? 'text-amber-600' : 'text-neutral-400'}`} />
              <span>Featured Only</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-black/5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat
              const count = cat === 'All' ? members.length : members.filter((m) => m.category === cat).length
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#111111] text-white shadow-xs scale-105'
                      : 'bg-[#f5f5f7] text-neutral-600 hover:bg-neutral-200 hover:text-black'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-neutral-500'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Members Grid */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-black/10 p-8 space-y-3">
            <UserCheck className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-lg font-bold text-neutral-800">No founders found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              No active member profiles match your current search and filter settings.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
                setOnlyFeaturedFilter(false)
              }}
              className="mt-2 text-xs font-bold text-[#111111] underline hover:text-black cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6"
          >
            <AnimatePresence>
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <MemberFlipCard member={member} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
