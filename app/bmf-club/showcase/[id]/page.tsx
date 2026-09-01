import React from 'react'
import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { 
  INITIAL_BMF_MEMBERS,
  slugifyFounderName,
  fetchBmfMembers,
  BmfMember
} from '@/lib/supabase/bmf-members'
import { FounderShowcaseClient } from '@/components/bmf-club/founder-showcase-client'

interface ShowcasePageProps {
  params: Promise<{ id: string }>
}

async function getShowcaseMemberServer(idOrSlug: string): Promise<BmfMember> {
  const clean = decodeURIComponent(idOrSlug).trim().toLowerCase()

  // 1. Direct Supabase Query with Service Role / Anon Key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { data: member, error } = await supabase
        .from('bmf_members')
        .select('*')
        .or(`id.eq.${idOrSlug},user_id.eq.${idOrSlug}`)
        .limit(1)
        .maybeSingle()

      if (member && !error) {
        return member as BmfMember
      }

      // Search by slug or full_name
      const { data: allMembers } = await supabase
        .from('bmf_members')
        .select('*')
        .limit(100)

      if (allMembers && allMembers.length > 0) {
        const found = allMembers.find(
          (m: BmfMember) =>
            m.id?.toLowerCase() === clean ||
            m.user_id?.toLowerCase() === clean ||
            slugifyFounderName(m.full_name) === clean ||
            m.full_name?.toLowerCase() === clean
        )
        if (found) return found as BmfMember
      }
    } catch (err) {
      console.error('[Showcase Page SSR Fetch Error]:', err)
    }
  }

  // 2. Fallback to Initial Members
  const fallbackMatch = INITIAL_BMF_MEMBERS.find(
    (m) => m.id.toLowerCase() === clean || slugifyFounderName(m.full_name) === clean
  )
  return fallbackMatch || INITIAL_BMF_MEMBERS[0]
}

export async function generateMetadata({ params }: ShowcasePageProps): Promise<Metadata> {
  const { id } = await params
  const member = await getShowcaseMemberServer(id)

  const title = `${member.full_name} | BMF Club Founder Pass`
  const description = `${member.role ? `${member.role} at ` : ''}${member.company_name || 'BMF Club'}. ${member.tagline || member.description || 'Verified member of the BMF Executive Founder Syndicate.'}`
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://buildwithmelwin.com'
  const ogImageUrl = `${baseUrl}/api/og/founder-card?id=${encodeURIComponent(member.id || id)}`
  const canonicalUrl = `${baseUrl}/bmf-club/showcase/${encodeURIComponent(member.id || id)}`

  // Normalize direct avatar image URL for social media link previews (WhatsApp, LinkedIn, Twitter, iMessage)
  let directAvatarUrl = member.avatar_url?.trim() || ''
  if (directAvatarUrl.includes('.r2.dev')) {
    directAvatarUrl = directAvatarUrl.replace(/https?:\/\/[a-zA-Z0-9_-]+\.r2\.dev/, 'https://media.buildwithmelwin.com')
  }
  if (!directAvatarUrl) {
    directAvatarUrl = `https://api.dicebear.com/7.x/personas/png?seed=${encodeURIComponent(member.full_name)}&backgroundColor=121214`
  }

  const imagesList = [
    {
      url: directAvatarUrl,
      width: 800,
      height: 800,
      alt: `${member.full_name} - ${member.company_name}`,
    },
    {
      url: ogImageUrl,
      width: 1200,
      height: 630,
      alt: `${member.full_name} - ${member.company_name} Founder Pass`,
      type: 'image/png',
    },
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
      images: [directAvatarUrl, ogImageUrl],
      creator: '@buildwithmelwin',
    },
    other: {
      'og:image:secure_url': directAvatarUrl,
    },
  }
}

export default async function FounderShowcasePage({ params }: ShowcasePageProps) {
  const { id } = await params
  const member = await getShowcaseMemberServer(id)

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
