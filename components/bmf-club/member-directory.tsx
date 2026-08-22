'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BmfMember, INITIAL_BMF_MEMBERS, fetchBmfMembers } from '@/lib/supabase/bmf-members'
import { MemberFlipCard } from './member-flip-card'
import { Search, UserCheck, Sparkles, LogIn, ArrowRight, Compass } from 'lucide-react'

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
    <section id="showcases" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 w-full bg-[#ebebeb]/70 border-t border-b border-black/[0.06] scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Header & Navigation to Full Showcase */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#666666] bg-black/[0.04] px-3 py-1 rounded-full border border-black/5">
                BMF SPOTLIGHT
              </span>
              <span className="text-xs font-mono text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" /> Top {featuredMembers.length} Featured
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight">
              Featured Founder Spotlights
            </h2>
            <p className="text-sm sm:text-base text-[#666666] max-w-xl">
              Meet the spotlighted founders, deeptech builders, and venture leaders scaling high-growth companies inside the club.
            </p>
          </div>

          {/* Right Action Stack: Link to All Members & Member Portal */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/bmf-club/directory"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-900 border border-black/10 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs hover:border-black shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-neutral-600" />
              <span>Explore All Founders &rarr;</span>
            </Link>

            <Link
              href="/bmf-club/login"
              className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 text-neutral-300" />
              <span>Member Portal / Edit Card</span>
            </Link>
          </div>
        </div>

        {/* Top 5 Featured Members Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6"
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

        {/* Bottom Banner: Join BMF Club */}
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
            <Link
              href="/bmf-club/dashboard"
              className="bg-white hover:bg-neutral-100 text-black px-6 py-3 rounded-full text-xs font-black transition-all shadow-md hover:scale-105"
            >
              Get Started &rarr;
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
