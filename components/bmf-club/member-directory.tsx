'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BmfMember, INITIAL_BMF_MEMBERS, fetchBmfMembers } from '@/lib/supabase/bmf-members'
import { MemberFlipCard } from './member-flip-card'
import { Search, UserCheck, Sparkles, LogIn, PlusCircle } from 'lucide-react'

export function MemberDirectory() {
  const [members, setMembers] = useState<BmfMember[]>(INITIAL_BMF_MEMBERS)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await fetchBmfMembers()
        if (data && data.length > 0) {
          setMembers(data)
        }
      } catch (err) {
        console.error('Failed to load member profiles:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadMembers()
  }, [])

  // Derive unique categories dynamically
  const categories = ['All', ...Array.from(new Set(members.map((m) => m.category))).filter(Boolean)]

  const filteredMembers = members.filter((member) => {
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
    <section id="showcases" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 w-full bg-[#ebebeb]/70 border-t border-b border-black/[0.06] scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Header & Search Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#666666] bg-black/[0.04] px-3 py-1 rounded-full border border-black/5">
                BMF CLUB DIRECTORY
              </span>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full font-semibold">
                {members.length}+ Vetted Members
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight">
              Featured Founder Spotlights
            </h2>
            <p className="text-sm sm:text-base text-[#666666] max-w-xl">
              Meet the founders, deeptech builders, and venture leaders scaling high-growth companies inside the club.
            </p>
          </div>

          {/* Right Action Stack: Search Bar & Member Portal Access */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search founders, ventures, tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-full pl-9 pr-4 py-2.5 text-xs text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black transition-colors shadow-xs"
              />
            </div>

            {/* Member Portal Button */}
            <Link
              href="/bmf-club/login"
              className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 text-neutral-300" />
              <span>Member Portal / Edit Card</span>
            </Link>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            const count = cat === 'All' ? members.length : members.filter((m) => m.category === cat).length
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#111111] text-white shadow-sm scale-105'
                    : 'bg-white text-[#555555] border border-black/10 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Members Grid with 3D Flip Cards */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-black/10 p-8 space-y-3">
            <UserCheck className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-lg font-bold text-neutral-800">No members found matching your search</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Try searching with another keyword or reset the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="mt-2 text-xs font-bold text-[#111111] underline hover:text-black"
            >
              Reset Filters
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <MemberFlipCard member={member} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Bottom Banner: Join BMF Club to get featured */}
        <div className="bg-gradient-to-r from-[#111111] to-[#1f1f1f] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Are You Building Something Ambitious?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Get Your Venture Spotlighted in the BMF Club Directory
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl">
              Approved founders receive direct access to closed-door masterminds, investor syndicates, and a dedicated public card profile.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#apply"
              className="bg-white hover:bg-neutral-100 text-black px-6 py-3 rounded-full text-xs font-black transition-all shadow-md hover:scale-105"
            >
              Apply for Membership
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
