'use client'

import Link from 'next/link'
import { ArrowRight, Crown } from 'lucide-react'

export function PersonalBrandingDropdown() {
  return (
    <div className="w-full bg-[#111111] text-white rounded-3xl p-6 sm:p-10 md:p-14 border border-white/10 shadow-2xl my-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Text Section */}
        <div className="space-y-2.5 max-w-2xl text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-neutral-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>VIP & INVITATION ONLY</span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Personal Branding & Executive Presence
          </h3>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            Exclusively reserved for high-profile founders, executives, and leaders. We architect, produce, and scale world-class personal brands to command market authority and high-value partnerships.
          </p>
        </div>

        {/* Primary CTA Button */}
        <div className="flex-shrink-0 pt-2 md:pt-0">
          <Link
            href="/agency"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black px-7 py-3.5 sm:px-8 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all shadow-lg hover:scale-105 active:scale-95 group"
          >
            <span>View Detailed Breakdown</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
