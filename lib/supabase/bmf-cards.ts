import { getSupabaseBrowserClient } from './bmf-members'

export type CardTier = 'obsidian' | 'titanium' | 'gold' | 'diamond' | 'quantum'

export type CardApprovalStatus = 'not_applied' | 'pending' | 'approved' | 'rejected'

export interface CardTierMeta {
  id: CardTier
  name: string
  subtitle: string
  colorBadge: string
  bgGradient: string
  textColor: string
  chipColor: 'gold' | 'silver' | 'cyber'
  hologramColor: string
  perks: string[]
  monthlyFee?: string
}

export interface CardApplicationData {
  requested_tier: CardTier
  traction_metric: string
  pitch_tagline: string
  portfolio_or_linkedin?: string
  why_join: string
  applied_at: string
}

export interface BmfCard {
  id: string
  member_id?: string
  user_id?: string | null
  card_number: string
  card_tier: CardTier
  card_holder_name: string
  company_name: string
  valid_thru: string
  member_since: string
  nfc_uid: string
  is_active: boolean
  approval_status: CardApprovalStatus
  application_data?: CardApplicationData
  admin_feedback?: string
  tier_perks?: string[]
  card_customization?: {
    custom_title?: string
    engraving?: string
    accent_glow?: string
  }
  applied_at?: string
  reviewed_at?: string
  created_at?: string
  updated_at?: string
}

export const CARD_TIERS: Record<CardTier, CardTierMeta> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Onyx',
    subtitle: 'Executive Founder Tier',
    colorBadge: 'bg-neutral-900 text-neutral-200 border-neutral-700',
    bgGradient: 'linear-gradient(135deg, #18181b 0%, #09090b 45%, #1c1917 100%)',
    textColor: 'text-neutral-100',
    chipColor: 'silver',
    hologramColor: 'rgba(255,255,255,0.15)',
    perks: [
      'Verified Founder Showcase in global directory',
      'Private Founder WhatsApp Mastermind access',
      'Unlimited startup job postings on Talent Marketplace',
      'Standard investor syndicate deal room pass'
    ]
  },
  titanium: {
    id: 'titanium',
    name: 'Titanium Stealth',
    subtitle: 'High-Conviction Growth Tier',
    colorBadge: 'bg-slate-900 text-cyan-300 border-cyan-800/60',
    bgGradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 40%, #0284c7 100%)',
    textColor: 'text-white',
    chipColor: 'silver',
    hologramColor: 'rgba(56,189,248,0.3)',
    perks: [
      'All Obsidian privileges included',
      'Priority spotlight on global showcase carousel',
      'Quarterly 1-on-1 Strategy Teardown with Dr. Melwin',
      'VIP table reservations at closed-door founder dinners'
    ]
  },
  gold: {
    id: 'gold',
    name: 'Aura 24K Gold',
    subtitle: 'Venture Syndicate Tier',
    colorBadge: 'bg-amber-950/80 text-amber-300 border-amber-600/60',
    bgGradient: 'linear-gradient(135deg, #78350f 0%, #451a03 30%, #b45309 70%, #d97706 100%)',
    textColor: 'text-amber-100',
    chipColor: 'gold',
    hologramColor: 'rgba(245,158,11,0.4)',
    perks: [
      'All Titanium privileges included',
      'Direct warm introductions to vetted Tier-1 Angel Syndicates',
      'Dedicated concierge desk for partnership & grant advisory',
      'Complimentary access to annual BMF Global Retreats'
    ]
  },
  diamond: {
    id: 'diamond',
    name: 'Cosmic Diamond',
    subtitle: 'Sovereign Innovation Tier',
    colorBadge: 'bg-indigo-950/80 text-indigo-200 border-indigo-500/50',
    bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4338ca 70%, #06b6d4 100%)',
    textColor: 'text-white',
    chipColor: 'silver',
    hologramColor: 'rgba(168,85,247,0.4)',
    perks: [
      'All 24K Gold privileges included',
      'Zero-fee syndicate deal structuring & term sheet review',
      'Lifetime VIP Founder Pass across all BMF ecosystem summits',
      'Featured Founder Spotlight podcast teardown & media distribution'
    ]
  },
  quantum: {
    id: 'quantum',
    name: 'Cyber Quantum',
    subtitle: 'DeepTech & AI Pioneer Tier',
    colorBadge: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60',
    bgGradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 40%, #047857 75%, #10b981 100%)',
    textColor: 'text-emerald-50',
    chipColor: 'cyber',
    hologramColor: 'rgba(16,185,129,0.4)',
    perks: [
      'All Diamond privileges included',
      'Priority GPU compute cloud credits & cluster allocations',
      'Access to Sovereign LLM & BioTech private research roundtables',
      'Direct institutional LP pipeline allocation access'
    ]
  }
}

export function generateDefaultCard(member?: { full_name?: string; company_name?: string; id?: string; user_id?: string | null }): BmfCard {
  const name = member?.full_name?.toUpperCase() || 'FOUNDER MEMBER'
  const company = member?.company_name?.toUpperCase() || "FOUNDER'S VENTURE"
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  const randomMid = Math.floor(1000 + Math.random() * 9000)

  return {
    id: `card-${member?.id || 'default'}`,
    member_id: member?.id,
    user_id: member?.user_id || null,
    card_number: `4592  8820  ${randomMid}  ${randomSuffix}`,
    card_tier: 'obsidian',
    card_holder_name: name,
    company_name: company,
    valid_thru: '12/28',
    member_since: '2026',
    nfc_uid: `BMF-NFC-${Math.floor(10000 + Math.random() * 90000)}`,
    is_active: false,
    approval_status: 'not_applied',
    tier_perks: CARD_TIERS.obsidian.perks,
  }
}

export async function fetchMemberCard(userId?: string): Promise<BmfCard> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase || !userId) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('bmf_member_card')
        if (stored) return JSON.parse(stored)
      }
      return generateDefaultCard()
    }

    const { data, error } = await supabase
      .from('bmf_cards')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (data && !error) {
      return data as BmfCard
    }

    // Check fallback in local storage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bmf_member_card')
      if (stored) return JSON.parse(stored)
    }

    return generateDefaultCard({ user_id: userId })
  } catch (err) {
    console.error('Error fetching member card:', err)
    return generateDefaultCard({ user_id: userId })
  }
}

export async function submitCardPassApplication(
  card: Partial<BmfCard>,
  application: {
    requested_tier: CardTier
    traction_metric: string
    pitch_tagline: string
    portfolio_or_linkedin?: string
    why_join: string
  }
): Promise<{ success: boolean; card?: BmfCard; error?: string }> {
  try {
    const supabase = getSupabaseBrowserClient()
    const now = new Date().toISOString()
    const payload: Partial<BmfCard> = {
      ...card,
      card_tier: application.requested_tier,
      tier_perks: CARD_TIERS[application.requested_tier].perks,
      approval_status: 'pending',
      is_active: false,
      applied_at: now,
      application_data: {
        ...application,
        applied_at: now,
      },
      updated_at: now,
    }

    if (!supabase) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bmf_member_card', JSON.stringify(payload))
      }
      return { success: true, card: payload as BmfCard }
    }

    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || card.user_id

    if (!userId) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bmf_member_card', JSON.stringify(payload))
      }
      return { success: true, card: payload as BmfCard }
    }

    // Check if card exists by user_id or id
    const { data: existingCard } = await supabase
      .from('bmf_cards')
      .select('id')
      .or(`user_id.eq.${userId},id.eq.${card.id || userId}`)
      .limit(1)
      .maybeSingle()

    let savedCard: any = null
    let saveError: any = null

    if (existingCard) {
      const { data, error } = await supabase
        .from('bmf_cards')
        .update({
          ...payload,
          user_id: userId,
        })
        .eq('id', existingCard.id)
        .select()
        .single()
      savedCard = data
      saveError = error
    } else {
      const { data, error } = await supabase
        .from('bmf_cards')
        .insert({
          id: card.id || `card-${userId}`,
          user_id: userId,
          ...payload,
        })
        .select()
        .single()
      savedCard = data
      saveError = error
    }

    if (saveError) {
      return { success: false, error: saveError.message }
    }

    const resultCard = (savedCard || payload) as BmfCard

    if (typeof window !== 'undefined') {
      localStorage.setItem('bmf_member_card', JSON.stringify(resultCard))
    }

    return { success: true, card: resultCard }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to submit card application' }
  }
}

export async function saveOrUpgradeCard(card: Partial<BmfCard>): Promise<{ success: boolean; card?: BmfCard; error?: string }> {
  try {
    const supabase = getSupabaseBrowserClient()
    const payload = {
      ...card,
      updated_at: new Date().toISOString(),
    }

    if (!supabase) {
      if (typeof window !== 'undefined') {
        const existing = localStorage.getItem('bmf_member_card')
        const parsed = existing ? JSON.parse(existing) : generateDefaultCard()
        const updated = { ...parsed, ...payload }
        localStorage.setItem('bmf_member_card', JSON.stringify(updated))
        return { success: true, card: updated }
      }
      return { success: true, card: payload as BmfCard }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bmf_member_card', JSON.stringify(payload))
      }
      return { success: true, card: payload as BmfCard }
    }

    const { data: existingCard } = await supabase
      .from('bmf_cards')
      .select('id')
      .or(`user_id.eq.${user.id},id.eq.${card.id || user.id}`)
      .limit(1)
      .maybeSingle()

    let savedCard: any = null
    let saveError: any = null

    if (existingCard) {
      const { data, error } = await supabase
        .from('bmf_cards')
        .update({
          ...payload,
          user_id: user.id,
        })
        .eq('id', existingCard.id)
        .select()
        .single()
      savedCard = data
      saveError = error
    } else {
      const { data, error } = await supabase
        .from('bmf_cards')
        .insert({
          id: card.id || `card-${user.id}`,
          user_id: user.id,
          ...payload,
        })
        .select()
        .single()
      savedCard = data
      saveError = error
    }

    if (saveError) {
      return { success: false, error: saveError.message }
    }

    const resultCard = (savedCard || payload) as BmfCard

    if (typeof window !== 'undefined') {
      localStorage.setItem('bmf_member_card', JSON.stringify(resultCard))
    }

    return { success: true, card: resultCard }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save membership card' }
  }
}

export async function fetchAllCardsForAdmin(): Promise<BmfCard[]> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('bmf_member_card')
        if (stored) return [JSON.parse(stored)]
      }
      return []
    }

    const { data, error } = await supabase
      .from('bmf_cards')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.error('Error fetching cards for admin:', error)
      return []
    }

    return data as BmfCard[]
  } catch (err) {
    console.error('Error fetching cards for admin:', err)
    return []
  }
}
