'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, X } from 'lucide-react'

interface TopEventAnnouncementBannerProps {
  eventId?: string
  slug?: string
}

export function TopEventAnnouncementBanner({
  eventId = '9c2225b0-e13a-4450-b5df-1082e0da0d89',
  slug = 'from-idea-to-first-1-lakh-early-stage-founder-playbook'
}: TopEventAnnouncementBannerProps) {
  const pathname = usePathname()
  const [isDismissed, setIsDismissed] = useState(false)
  const eventOverviewUrl = `/bmf-club/events/${eventId}`

  if (isDismissed) return null

  // Exclude login page, dashboard, internal/admin pages, and the event overview page itself
  if (
    pathname?.startsWith('/bmf-club/login') ||
    pathname?.startsWith('/bmf-club/dashboard') ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/admin') ||
    pathname?.includes(eventId) ||
    pathname?.includes(slug)
  ) {
    return null
  }

  return (
    <aside aria-label="Announcement" className="relative bg-[#050505] text-white border-b border-white/15 px-3 sm:px-6 py-2 sm:py-2.5 z-50 text-xs shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Info / Badge - Clean single-line layout */}
        <Link 
          href={eventOverviewUrl}
          className="flex items-center gap-2 overflow-hidden min-w-0 group hover:opacity-90 transition-opacity"
        >
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider bg-amber-400 text-black shrink-0 shadow-xs">
            Webinar
          </span>

          <p className="text-[11px] sm:text-xs text-neutral-200 font-medium truncate">
            <span className="font-bold text-white">Idea to First ₹1 Lakh:</span> Early-Stage Founder Playbook
            <span className="hidden sm:inline text-neutral-400"> &bull; Sep 26–27 (4 PM IST)</span>
          </p>
        </Link>

        {/* Right CTA Button & Close - Compact on mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href={eventOverviewUrl}
            className="inline-flex items-center justify-center gap-1 bg-white hover:bg-neutral-100 text-black px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <span className="hidden sm:inline">View Event Overview</span>
            <span className="sm:hidden">Overview</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            title="Dismiss announcement"
          >
            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  )
}
