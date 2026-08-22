'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BmfMember, INITIAL_BMF_MEMBERS, fetchBmfMembers } from '@/lib/supabase/bmf-members'
import { MemberFlipCard } from './member-flip-card'
import { Search, UserCheck, Sparkles, ArrowRight, Compass } from 'lucide-react'

export function MemberDirectory() {
  const [featuredMembers, setFeaturedMembers] = useState<BmfMember[]>(
    INITIAL_BMF_MEMBERS.filter((m) => m.is_featured).slice(0, 5)
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await fetchBmfMembers({ onlyFeatured: true, limit: 5 })
        if (data && data.length > 0) {
          setFeaturedMembers(data)
        }
      } catch (err) {
        console.error('Failed to load featured member profiles:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadFeatured()
  }, [])

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 w-full bg-[#f2f2f2] text-[#111111]">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-[#111111] text-[11px] font-mono font-semibold uppercase tracking-wider">
              <UserCheck className="w-3 h-3 text-emerald-600" />
              <span>Vetted Community Directory</span>
              <span className="text-neutral-400">•</span>
              <span className="text-amber-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" /> Top {featuredMembers.length} Featured
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#111111]">
              Featured Founder Spotlight
            </h2>
            <p className="text-sm sm:text-base text-[#666666] max-w-xl">
              Meet the spotlighted founders, deeptech builders, and venture leaders scaling high-growth companies inside the club.
            </p>
          </div>

          {/* Right Action: Link to All Members */}
          <div className="flex items-center gap-3">
            <Link
              href="/bmf-club/directory"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-900 border border-black/10 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs hover:border-black shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-neutral-600" />
              <span>Explore All Founders &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Top 5 Featured Members Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 sm:flex sm:flex-wrap items-start justify-center sm:justify-start gap-3 sm:gap-5"
        >
          <AnimatePresence>
            {featuredMembers.map((member) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full sm:w-[210px] md:w-[220px] shrink-0"
              >
                <MemberFlipCard member={member} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Action Link to Full Directory */}
        <div className="flex justify-center pt-2">
          <Link
            href="/bmf-club/directory"
            className="inline-flex items-center gap-2.5 bg-white hover:bg-neutral-900 text-neutral-900 hover:text-white border border-black/10 hover:border-neutral-900 px-8 py-3.5 rounded-full text-xs sm:text-sm font-black transition-all shadow-sm group"
          >
            <span>View Full Founder Showcase Directory</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  )
}
