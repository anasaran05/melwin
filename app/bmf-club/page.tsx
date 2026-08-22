'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { BmfHeroSection } from '@/components/bmf-club/bmf-hero'
import { MemberDirectory } from '@/components/bmf-club/member-directory'
import { BmfIntroAnimation } from '@/components/bmf-club/bmf-intro-animation'
import { VerticalTabs } from '@/components/ui/vertical-tabs'
import { UpcomingEventsSection } from '@/components/bmf-club/upcoming-events-section'

export default function BmfClubPage() {
  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden bg-[#f2f2f2] text-[#111111]">
      <BmfIntroAnimation />
      <div className="grain-overlay" />
      <Navbar />

      {/* Interactive 3D Perspective Corridor Hero */}
      <BmfHeroSection />

      {/* Core Ecosystem Pillars - Vertical Tabs Experience */}
      <VerticalTabs className="border-t border-black/[0.04]" />

      {/* Dynamic 3D Flip Member Profile Directory & Founder Showcase */}
      <MemberDirectory />

      {/* Upcoming Private Events & Masterminds (Dynamic with Capacity Tracking & RSVP) */}
      <UpcomingEventsSection />

      <Footer />
    </main>
  )
}
