import { createBrowserClient } from '@supabase/ssr'

export interface BmfEvent {
  id: string
  title: string
  slug?: string
  tagline?: string
  description?: string
  cover_image?: string
  event_date: string
  event_time?: string
  location_type: 'in_person' | 'virtual' | 'hybrid'
  location_venue?: string
  location_city?: string
  category: string
  total_capacity: number
  registered_count: number
  is_published: boolean
  status: 'upcoming' | 'ongoing' | 'past' | 'closed' | 'sold_out'
  cta_type: 'internal_form' | 'external_link'
  external_cta_url?: string
  external_cta_text?: string
  pricing_type?: 'free' | 'paid' | 'members_only' | 'invite_only'
  price_inr?: number
  requirements?: string
  tags?: string[]
  created_at?: string
  updated_at?: string
}

export interface BmfEventRegistration {
  id: string
  event_id: string
  user_id?: string | null
  full_name: string
  email: string
  phone?: string
  company_name?: string
  role?: string
  linkedin_url?: string
  notes?: string
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted' | 'attended'
  admin_feedback?: string | null
  ticket_code?: string
  created_at?: string
  updated_at?: string
  event?: BmfEvent
}

export const INITIAL_BMF_EVENTS: BmfEvent[] = [
  {
    id: 'event-1',
    title: 'Bangalore Elite Founders Dinner: Scaling from $1M to $10M ARR',
    slug: 'bangalore-elite-founders-dinner-2026',
    tagline: 'Private 18-seat founder dinner with venture partners & scale-stage operators.',
    description: 'An intimate, Chatham House Rule dinner gathering for series-funded and bootstrapped founders scaling beyond $1M ARR. Discussing board governance, international sales loops, and executive hiring.',
    cover_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    event_date: 'March 28, 2026',
    event_time: '6:30 PM - 9:30 PM IST',
    location_type: 'in_person',
    location_venue: 'The Leela Palace, Indiranagar',
    location_city: 'Bangalore',
    category: 'Closed-Door Dinner',
    total_capacity: 18,
    registered_count: 14,
    is_published: true,
    status: 'upcoming',
    cta_type: 'internal_form',
    external_cta_text: 'Request Invitation',
    pricing_type: 'members_only',
    requirements: 'Post-Revenue Founders ($200k+ ARR or $1M+ Raised)',
    tags: ['Scaling', 'Dinner', 'Bangalore', 'Venture'],
  },
  {
    id: 'event-2',
    title: 'Global Pitch Teardown & Cross-Border Expansion Masterclass',
    slug: 'global-pitch-teardown-masterclass',
    tagline: 'Live narrative surgery on high-ticket enterprise pitch decks.',
    description: 'Interactive virtual teardown session with Dr. Melwin Vincent and Silicon Valley syndicate leads analyzing market framing, deck flow, and US market entry strategies.',
    cover_image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
    event_date: 'April 12, 2026',
    event_time: '5:00 PM - 7:30 PM IST',
    location_type: 'virtual',
    location_venue: 'Live Stream & Private Breakouts (Zoom + Discord)',
    location_city: 'Virtual Global',
    category: 'Virtual Syndicate',
    total_capacity: 50,
    registered_count: 32,
    is_published: true,
    status: 'upcoming',
    cta_type: 'internal_form',
    external_cta_text: 'RSVP Live Stream',
    pricing_type: 'free',
    requirements: 'Open to all verified BMF members & tech founders',
    tags: ['Pitch Deck', 'Fundraising', 'Virtual', 'US Expansion'],
  },
  {
    id: 'event-3',
    title: 'Dubai Founder & Investor Conclave (MENA & SEA Markets)',
    slug: 'dubai-founder-investor-conclave-2026',
    tagline: '3-day closed retreat connecting Indian founders with Gulf family offices & global capital.',
    description: 'Curated 30-founder delegation in Dubai for sovereign wealth introductions, cross-border corporate structuring in DIFC/ADGM, and sunset yacht deal-making.',
    cover_image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
    event_date: 'May 20-22, 2026',
    event_time: '3-Day Full Conclave',
    location_type: 'in_person',
    location_venue: 'DIFC Innovation Hub & Burj Club',
    location_city: 'Dubai, UAE',
    category: 'Private Retreat',
    total_capacity: 30,
    registered_count: 28,
    is_published: true,
    status: 'upcoming',
    cta_type: 'external_link',
    external_cta_url: 'https://lu.ma/bmf-dubai-retreat',
    external_cta_text: 'Apply via Lu.ma Conclave',
    pricing_type: 'paid',
    price_inr: 85000,
    requirements: 'Growth Stage Founders with cross-border appetite',
    tags: ['Dubai', 'Conclave', 'Retreat', 'MENA Capital'],
  },
]

export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return null
  return createBrowserClient(supabaseUrl, supabaseKey)
}

export async function fetchBmfEvents(): Promise<BmfEvent[]> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('bmf_custom_events')
        if (local) {
          const parsed = JSON.parse(local)
          return parsed.filter((e: BmfEvent) => e.is_published)
        }
      }
      return INITIAL_BMF_EVENTS
    }

    const { data, error } = await supabase
      .from('bmf_events')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return INITIAL_BMF_EVENTS
    }

    return data as BmfEvent[]
  } catch (err) {
    console.error('Error fetching BMF events:', err)
    return INITIAL_BMF_EVENTS
  }
}

export async function fetchAllEventsForAdmin(): Promise<BmfEvent[]> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('bmf_custom_events')
        return local ? JSON.parse(local) : INITIAL_BMF_EVENTS
      }
      return INITIAL_BMF_EVENTS
    }

    const { data, error } = await supabase
      .from('bmf_events')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return INITIAL_BMF_EVENTS
    }

    return data as BmfEvent[]
  } catch (err) {
    console.error('Error fetching admin BMF events:', err)
    return INITIAL_BMF_EVENTS
  }
}

export async function saveBmfEvent(event: Partial<BmfEvent>): Promise<{ success: boolean; event?: BmfEvent; error?: string }> {
  try {
    const supabase = getSupabaseBrowserClient()
    const newEvent: BmfEvent = {
      id: event.id || `event-${Date.now()}`,
      title: event.title || 'New BMF Event',
      slug: event.slug || `event-${Date.now()}`,
      tagline: event.tagline || '',
      description: event.description || '',
      cover_image: event.cover_image || '',
      event_date: event.event_date || 'TBD',
      event_time: event.event_time || '6:00 PM IST',
      location_type: event.location_type || 'in_person',
      location_venue: event.location_venue || 'Bangalore',
      location_city: event.location_city || 'Bangalore',
      category: event.category || 'Mastermind',
      total_capacity: event.total_capacity !== undefined ? event.total_capacity : 30,
      registered_count: event.registered_count || 0,
      is_published: event.is_published !== undefined ? event.is_published : true,
      status: event.status || 'upcoming',
      cta_type: event.cta_type || 'internal_form',
      external_cta_url: event.external_cta_url || '',
      external_cta_text: event.external_cta_text || 'Request Invitation',
      pricing_type: event.pricing_type || 'members_only',
      price_inr: event.price_inr || 0,
      requirements: event.requirements || '',
      tags: event.tags || [],
      created_at: event.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (!supabase) {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('bmf_custom_events')
        const current: BmfEvent[] = local ? JSON.parse(local) : [...INITIAL_BMF_EVENTS]
        const existsIndex = current.findIndex((e) => e.id === newEvent.id)
        if (existsIndex >= 0) {
          current[existsIndex] = newEvent
        } else {
          current.unshift(newEvent)
        }
        localStorage.setItem('bmf_custom_events', JSON.stringify(current))
      }
      return { success: true, event: newEvent }
    }

    const { data, error } = await supabase
      .from('bmf_events')
      .upsert(newEvent)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, event: data as BmfEvent }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save event' }
  }
}

export async function deleteBmfEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('bmf_custom_events')
        const current: BmfEvent[] = local ? JSON.parse(local) : [...INITIAL_BMF_EVENTS]
        const filtered = current.filter((e) => e.id !== eventId)
        localStorage.setItem('bmf_custom_events', JSON.stringify(filtered))
      }
      return { success: true }
    }

    const { error } = await supabase
      .from('bmf_events')
      .delete()
      .eq('id', eventId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete event' }
  }
}

export async function registerForEvent(
  registration: Omit<BmfEventRegistration, 'id' | 'status' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; status: 'registered' | 'waitlisted'; error?: string }> {
  try {
    const response = await fetch('/api/bmf/event-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registration),
    })

    const data = await response.json()
    if (!response.ok || !data.success) {
      return { success: false, status: 'registered', error: data.error || 'Registration failed' }
    }

    return { success: true, status: data.registrationStatus || 'registered' }
  } catch (err: any) {
    return { success: false, status: 'registered', error: err.message || 'Network error during registration' }
  }
}

export async function fetchEventRegistrations(eventId?: string): Promise<BmfEventRegistration[]> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('bmf_event_registrations')
        const items: BmfEventRegistration[] = local ? JSON.parse(local) : []
        return eventId ? items.filter((r) => r.event_id === eventId) : items
      }
      return []
    }

    let query = supabase
      .from('bmf_event_registrations')
      .select('*, event:bmf_events(*)')
      .order('created_at', { ascending: false })

    if (eventId) {
      query = query.eq('event_id', eventId)
    }

    const { data, error } = await query
    if (error || !data) return []

    return data as BmfEventRegistration[]
  } catch (err) {
    console.error('Error fetching event registrations:', err)
    return []
  }
}
