'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, X } from 'lucide-react'

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
    <aside
      aria-label="Announcement"
      className="relative emerald-banner-bg overflow-hidden text-neutral-200 border-b border-emerald-500/25 px-3.5 py-2.5 sm:px-6 sm:py-2 z-50 text-xs sm:text-[13px] leading-snug shadow-sm"
    >
      {/* Moving Shimmer Beam Overlay */}
      <div
        className="pointer-events-none absolute inset-0 emerald-shimmer-beam opacity-40"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.08) 30%, rgba(52, 211, 153, 0.28) 50%, rgba(16, 185, 129, 0.08) 70%, transparent 100%)',
          width: '100%',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Banner Content - Exactly following Supabase reference format */}
        <div className="flex-1 flex flex-wrap items-center sm:justify-center gap-x-2 gap-y-1 min-w-0 pr-1">
          <Link
            href={eventOverviewUrl}
            className="text-white hover:text-emerald-200 font-medium transition-colors drop-shadow-xs"
          >
            How to Go from a Business Idea to Making Your First ₹1 Lakh
          </Link>

          <span className="text-emerald-500/70 select-none">&bull;</span>

          <Link
            href={eventOverviewUrl}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 inline-flex items-center gap-0.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Enroll Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          title="Dismiss announcement"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  )
}
