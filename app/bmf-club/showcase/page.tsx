import React from 'react'
import { Metadata } from 'next'
import { fetchBmfMembers, INITIAL_BMF_MEMBERS, BmfMember } from '@/lib/supabase/bmf-members'
import { FounderShowcaseClient } from '@/components/bmf-club/founder-showcase-client'

export const metadata: Metadata = {
  title: 'BMF Club Founder Showcase | Executive Syndicate Directory',
  description: 'Explore the verified founder passes, startup metrics, and breakthrough ventures scaling inside the BMF Executive Founder Syndicate.',
  openGraph: {
    title: 'BMF Club Founder Showcase | Executive Syndicate Directory',
    description: 'Explore the verified founder passes, startup metrics, and breakthrough ventures scaling inside the BMF Executive Founder Syndicate.',
    images: [{ url: '/api/og/founder-card?id=bmf-1', width: 1200, height: 630 }],
  },
}

export default async function ShowcaseIndexPage() {
  let allMembers: BmfMember[] = []
  try {
    allMembers = await fetchBmfMembers({ limit: 40 })
  } catch {
    allMembers = INITIAL_BMF_MEMBERS
  }

  if (allMembers.length === 0) {
    allMembers = INITIAL_BMF_MEMBERS
  }

  const spotlightMember = allMembers.find((m) => m.is_featured) || allMembers[0]

  return (
    <FounderShowcaseClient
      initialMember={spotlightMember}
      allMembers={allMembers}
    />
  )
}
