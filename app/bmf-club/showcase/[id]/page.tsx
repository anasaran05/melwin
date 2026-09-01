import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { 
  fetchBmfMemberByIdOrSlug, 
  fetchBmfMembers, 
  INITIAL_BMF_MEMBERS,
  BmfMember
} from '@/lib/supabase/bmf-members'
import { FounderShowcaseClient } from '@/components/bmf-club/founder-showcase-client'

interface ShowcasePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ShowcasePageProps): Promise<Metadata> {
  const { id } = await params
  const member = await fetchBmfMemberByIdOrSlug(id) || INITIAL_BMF_MEMBERS.find((m) => m.id === id) || INITIAL_BMF_MEMBERS[0]

  const title = `${member.full_name} | BMF Club Founder Pass`
  const description = `${member.role ? `${member.role} at ` : ''}${member.company_name || 'BMF Club'}. ${member.tagline || member.description || 'Verified member of the BMF Executive Founder Syndicate.'}`
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://buildwithmelwin.com'
  const ogImageUrl = `${baseUrl}/api/og/founder-card?id=${encodeURIComponent(member.id || id)}`
  const canonicalUrl = `${baseUrl}/bmf-club/showcase/${encodeURIComponent(member.id || id)}`

  // Normalize direct avatar image URL for social media link previews
  let directAvatarUrl = member.avatar_url?.trim() || ''
  if (directAvatarUrl.includes('.r2.dev')) {
    directAvatarUrl = directAvatarUrl.replace(/https?:\/\/[a-zA-Z0-9_-]+\.r2\.dev/, 'https://media.buildwithmelwin.com')
  }

  const imagesList = [
    {
      url: ogImageUrl,
      width: 1200,
      height: 630,
      alt: `${member.full_name} - ${member.company_name} Founder Pass`,
      type: 'image/png',
    },
    ...(directAvatarUrl ? [{
      url: directAvatarUrl,
      width: 800,
      height: 800,
      alt: `${member.full_name} Profile Photo`,
    }] : []),
  ]

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'profile',
      siteName: 'BMF Club - Executive Founder Syndicate',
      images: imagesList,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl, ...(directAvatarUrl ? [directAvatarUrl] : [])],
      creator: '@buildwithmelwin',
    },
    other: {
      'og:image:secure_url': ogImageUrl,
    },
  }
}

export default async function FounderShowcasePage({ params }: ShowcasePageProps) {
  const { id } = await params
  let member: BmfMember | null = await fetchBmfMemberByIdOrSlug(id)

  if (!member) {
    member = INITIAL_BMF_MEMBERS.find((m) => m.id === id) || null
  }

  // Fallback if not found to first member
  if (!member) {
    member = INITIAL_BMF_MEMBERS[0]
  }

  // Fetch all members for the bottom showcase recommendations
  let allMembers: BmfMember[] = []
  try {
    allMembers = await fetchBmfMembers({ limit: 40 })
  } catch {
    allMembers = INITIAL_BMF_MEMBERS
  }

  if (allMembers.length === 0) {
    allMembers = INITIAL_BMF_MEMBERS
  }

  return (
    <FounderShowcaseClient
      initialMember={member}
      allMembers={allMembers}
    />
  )
}
