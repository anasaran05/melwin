import { createBrowserClient } from '@supabase/ssr'

export interface BmfEvent {
  id: string
  title: string
  slug?: string
  tagline?: string
  description?: string
  cover_image?: string
  thumbnail_url?: string
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
    id: '9c2225b0-e13a-4450-b5df-1082e0da0d89',
    title: 'From Idea to First ₹1 Lakh: The Early-Stage Founder Playbook',
    slug: 'from-idea-to-first-1-lakh-early-stage-founder-playbook',
    tagline: 'Starting a business is easy. Getting your first paying customers is where the real game begins.',
    description: `Starting a business is easy. Getting your first paying customers is where the real game begins.

In this practical BMF webinar, we’ll break down exactly how early-stage entrepreneurs can go from an idea to their first ₹1 lakh in revenue, without wasting months planning or burning money on things that don’t matter.

We’ll cover idea validation, building your MVP, getting your first 10 customers, ₹0 marketing strategies, pricing, personal branding, common founder mistakes, hiring, and how to build a focused 30-day action plan.

Whether you’re still exploring an idea or already building your first business, this session is designed to help you stop overthinking and start executing.

Format: Online Webinar (60 Minutes)
Hosted by: Build With Melwin (BMF) & BMF Club
Schedule:
• Batch 1: 26th September, 4:00 PM – 5:00 PM IST (Q&A Session Included)
• Batch 2: 27th September, 4:00 PM – 5:00 PM IST (Q&A Session Included)`,
    cover_image: 'https://static.wixstatic.com/media/6abdd9_45fd1f766dab4c88a57eea4ef5de2c08~mv2.png',
    thumbnail_url: 'https://static.wixstatic.com/media/6abdd9_45fd1f766dab4c88a57eea4ef5de2c08~mv2.png',
    event_date: 'September 26–27, 2026',
    event_time: '4:00 PM - 5:00 PM IST',
    location_type: 'virtual',
    location_venue: 'Live Interactive Online Webinar',
    location_city: 'Online',
    category: 'Webinar',
    total_capacity: 0,
    registered_count: 0,
    is_published: true,
    status: 'upcoming',
    cta_type: 'external_link',
    external_cta_url: 'https://payments.cashfree.com/forms?code=from-idea-to-1-lakh-webinar',
    external_cta_text: 'Enroll Now',
    pricing_type: 'paid',
    price_inr: 99,
    requirements: `• Aspiring entrepreneurs & first-time founders\n• Early-stage startup founders\n• Freelancers and solopreneurs\n• Students building their first business\n• Anyone trying to get their first paying customers`,
    tags: ['Webinar', 'Playbook', 'Idea to 1 Lakh', 'First Customers', 'BMF Masterclass', 'Early-Stage'],
  },
  {
    id: 'event-1',
    title: 'INNOVEST 3.0 – Startup Demo Day & Investor Conclave',
    slug: 'innovest-3-startup-demo-day-cit-chennai-2026',
    tagline: 'Startup pitches, investor & incubator interactions, live product demos, and funding connections.',
    description: 'Premier Tamil Nadu startup conclave featuring pitches, live demos, mentor feedback, and direct funding/incubation allocations with leading VCs & angel networks. (Registration deadline: 28 August).',
    cover_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    event_date: 'September 1–3, 2026',
    event_time: '9:30 AM - 5:30 PM IST',
    location_type: 'in_person',
    location_venue: 'Chennai Institute of Technology',
    location_city: 'Chennai',
    category: 'Demo Day & Conclave',
    total_capacity: 150,
    registered_count: 118,
    is_published: true,
    status: 'upcoming',
    cta_type: 'external_link',
    external_cta_url: 'https://unstop.com/hackathons/innovest-30-innovest-chennai-institute-of-technology-1742335',
    external_cta_text: 'Apply via Unstop',
    pricing_type: 'free',
    requirements: 'Founders, Innovators, Angel Investors & Mentors (Registration Deadline: 28 Aug)',
    tags: ['INNOVEST', 'Chennai', 'CIT', 'Funding', 'Demo Day', 'Pitching'],
  },
  {
    id: 'event-2',
    title: 'Startup Founders Meetup by CEDAT',
    slug: 'startup-founders-meetup-cedat-bengaluru-sep-2-2026',
    tagline: 'Collaborative founder meetup for entrepreneurs and MSMEs to exchange feedback and connect with mentors.',
    description: 'A focused, peer-to-peer gathering for early founders, aspiring entrepreneurs, and startup community operators to validate ideas and discover strategic collaborators.',
    cover_image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop',
    event_date: 'September 2, 2026',
    event_time: '5:00 PM - 8:00 PM IST',
    location_type: 'in_person',
    location_venue: 'Koramangala',
    location_city: 'Bengaluru',
    category: 'Founder Meetup',
    total_capacity: 50,
    registered_count: 42,
    is_published: true,
    status: 'upcoming',
    cta_type: 'external_link',
    external_cta_url: 'https://www.cedat.in/events/startup-founders-meetup-by-cedat-2026-09-02-qL5ePx3t9ik7vTqwYupD',
    external_cta_text: 'Register via CEDAT',
    pricing_type: 'free',
    requirements: 'Founders, aspiring founders, operators, mentors, and startup-community participants',
    tags: ['CEDAT', 'Koramangala', 'Bengaluru', 'Founders', 'Networking'],
  },
  {
    id: 'event-3',
    title: 'Namma Bengaluru Startups Meetup by CEDAT',
    slug: 'namma-bengaluru-startups-meetup-cedat-sep-8-2026',
    tagline: 'High-energy ecosystem networking for entrepreneurs with active investors and startup enablers.',
    description: 'Connect directly with angel investors, mentors, and ecosystem enablers across Bangalore’s high-growth startup ecosystem.',
    cover_image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
    event_date: 'September 8, 2026',
    event_time: '5:30 PM - 8:30 PM IST',
    location_type: 'in_person',
    location_venue: 'Ashok Nagar',
    location_city: 'Bengaluru',
    category: 'Ecosystem Mixer',
    total_capacity: 60,
    registered_count: 51,
    is_published: true,
    status: 'upcoming',
    cta_type: 'external_link',
    external_cta_url: 'https://www.cedat.in/events/namma-bengaluru-startups-meetup-by-cedat-2026-09-08-GOPiphfsuNwVmZGyIut0',
    external_cta_text: 'Register via CEDAT',
    pricing_type: 'free',
    requirements: 'Entrepreneurs and professionals interested in networking with investors, mentors, enablers, and other founders',
    tags: ['CEDAT', 'Ashok Nagar', 'Bengaluru', 'Investors', 'Enablers'],
  },
  {
    id: 'event-4',
    title: 'eChai Startup Demo Day (Chennai Edition)',
    slug: 'echai-startup-demo-day-chennai-sep-26-2026',
    tagline: 'A relaxed, open founder-networking and demo event welcoming early & experienced builders.',
    description: 'Free and open founder meetup requiring no membership fee. Present your product, gain active peer feedback, and connect with fellow builders and angel syndicates.',
    cover_image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop',
    event_date: 'September 26, 2026',
    event_time: '6:00 PM - 8:00 PM IST',
    location_type: 'in_person',
    location_venue: 'Chennai Tech Hub & Founder Lounge',
    location_city: 'Chennai',
    category: 'Startup Demo Day',
    total_capacity: 75,
    registered_count: 58,
    is_published: true,
    status: 'upcoming',
    cta_type: 'external_link',
    external_cta_url: 'https://echai.ventures/events/echai-startup-demo-day-in-chennai-sep-26-2026',
    external_cta_text: 'Register via eChai Chennai',
    pricing_type: 'free',
    requirements: 'Free & open to first-time founders, experienced operators & tech builders',
    tags: ['eChai', 'Chennai', 'Demo Day', 'Product Demos', 'Open Community'],
  },
  {
    id: 'event-5',
    title: 'eChai Startup Demo Day (Bengaluru Edition)',
    slug: 'echai-startup-demo-day-bengaluru-sep-26-2026',
    tagline: 'Founders demo live products, pitch MVPs, and receive candid peer & investor feedback.',
    description: 'One of the strongest grassroots founder communities in India. Every registrant can add their startup to their profile and connect with peer builders and angels.',
    cover_image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
    event_date: 'September 26, 2026',
    event_time: '6:00 PM - 8:00 PM IST',
    location_type: 'in_person',
    location_venue: 'Founder Startup House, Koramangala',
    location_city: 'Bengaluru',
    category: 'Startup Demo Day',
    total_capacity: 80,
    registered_count: 68,
    is_published: true,
    status: 'upcoming',
    cta_type: 'external_link',
    external_cta_url: 'https://echai.ventures/events/echai-startup-demo-day-in-bengaluru-sep-26-2026',
    external_cta_text: 'Register via eChai Bengaluru',
    pricing_type: 'free',
    requirements: 'Anyone building a startup or interested in founder networking (every registrant can feature their venture)',
    tags: ['eChai', 'Demo Day', 'Koramangala', 'Bengaluru', 'Product Demos'],
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
          return sortBmfEvents(parsed.filter((e: BmfEvent) => e.is_published))
        }
      }
      return sortBmfEvents(INITIAL_BMF_EVENTS)
    }

    const { data, error } = await supabase
      .from('bmf_events')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      // Trigger background seed to ensure Supabase table gets populated
      if (typeof window !== 'undefined') {
        fetch('/api/bmf/seed-events', { method: 'POST' }).catch(() => {})
      }
      return sortBmfEvents(INITIAL_BMF_EVENTS)
    }

    return sortBmfEvents(data as BmfEvent[])
  } catch (err) {
    console.error('Error fetching BMF events:', err)
    return sortBmfEvents(INITIAL_BMF_EVENTS)
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
      return sortBmfEvents(INITIAL_BMF_EVENTS)
    }

    return sortBmfEvents(data as BmfEvent[])
  } catch (err) {
    console.error('Error fetching admin BMF events:', err)
    return sortBmfEvents(INITIAL_BMF_EVENTS)
  }
}

export function slugifyEventTitle(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || `event-${Date.now()}`
}

export async function saveBmfEvent(event: Partial<BmfEvent>): Promise<{ success: boolean; event?: BmfEvent; error?: string }> {
  try {
    const supabase = getSupabaseBrowserClient()
    const rawTitle = event.title || 'New BMF Event'
    const newEvent: BmfEvent = {
      id: event.id || `event-${Date.now()}`,
      title: rawTitle,
      slug: event.slug?.trim() ? event.slug.trim() : slugifyEventTitle(rawTitle),
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
): Promise<{ success: boolean; status: 'registered' | 'waitlisted'; ticketCode?: string; error?: string }> {
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

    return { success: true, status: data.registrationStatus || 'registered', ticketCode: data.ticketCode }
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

export async function fetchBmfEventByIdOrSlug(idOrSlug: string): Promise<BmfEvent | null> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('bmf_custom_events')
        if (local) {
          const parsed: BmfEvent[] = JSON.parse(local)
          const found = parsed.find((e) => e.id === idOrSlug || e.slug === idOrSlug)
          if (found) return found
        }
      }
      const initialFound = INITIAL_BMF_EVENTS.find((e) => e.id === idOrSlug || e.slug === idOrSlug)
      return initialFound || null
    }

    // Try finding by id first
    let { data, error } = await supabase
      .from('bmf_events')
      .select('*')
      .eq('id', idOrSlug)
      .maybeSingle()

    // If not found, try finding by slug
    if (!data) {
      const slugRes = await supabase
        .from('bmf_events')
        .select('*')
        .eq('slug', idOrSlug)
        .maybeSingle()
      data = slugRes.data
    }

    if (data) {
      return data as BmfEvent
    }

    // Fallback to local storage or initial events
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('bmf_custom_events')
      if (local) {
        const parsed: BmfEvent[] = JSON.parse(local)
        const found = parsed.find((e) => e.id === idOrSlug || e.slug === idOrSlug)
        if (found) return found
      }
    }

    const fallback = INITIAL_BMF_EVENTS.find((e) => e.id === idOrSlug || e.slug === idOrSlug)
    return fallback || null
  } catch (err) {
    console.error('Error fetching BMF event by id or slug:', err)
    const fallback = INITIAL_BMF_EVENTS.find((e) => e.id === idOrSlug || e.slug === idOrSlug)
    return fallback || null
  }
}

export function isEventExpired(event: BmfEvent): boolean {
  if (event.status === 'past' || event.status === 'closed') {
    return true
  }

  if (!event.event_date) return false

  try {
    const raw = event.event_date.trim()

    // 1. Direct standard date parse
    const directDate = new Date(raw)
    if (!isNaN(directDate.getTime())) {
      directDate.setHours(23, 59, 59, 999)
      return directDate.getTime() < Date.now()
    }

    // 2. Handle ranges like "September 26–27, 2026" or "September 1-3, 2026"
    const normalized = raw.replace(/[–—]/g, '-')
    if (normalized.includes('-')) {
      const parts = normalized.split('-')
      const endPart = parts[parts.length - 1].trim()
      const startPart = parts[0].trim()
      const monthMatch = startPart.match(/^(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)/i)
      
      let endString = endPart
      if (monthMatch && !endPart.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)/i)) {
        endString = `${monthMatch[0]} ${endPart}`
      }

      const parsedEndDate = new Date(endString)
      if (!isNaN(parsedEndDate.getTime())) {
        parsedEndDate.setHours(23, 59, 59, 999)
        return parsedEndDate.getTime() < Date.now()
      }
    }

    // 3. Fallback: try parsing with Date.parse
    const fallbackTime = Date.parse(raw)
    if (!isNaN(fallbackTime)) {
      const d = new Date(fallbackTime)
      d.setHours(23, 59, 59, 999)
      return d.getTime() < Date.now()
    }
  } catch (err) {
    console.warn('Could not parse event date for expiration:', event.event_date)
  }

  return false
}

/**
 * Strips duplicate price information from CTA button strings (e.g. "Book Webinar Pass • ₹99" -> "Book Webinar Pass")
 */
export function cleanEventCtaText(text?: string | null): string {
  if (!text) return ''
  const cleaned = text
    .replace(/\s*[•·-]\s*₹\s*[\d,]+/gi, '')
    .replace(/₹\s*[\d,]+/gi, '')
    .replace(/\s*[•·-]\s*INR\s*[\d,]+/gi, '')
    .replace(/INR\s*[\d,]+/gi, '')
    .trim()

  if (cleaned.toLowerCase() === 'book webinar pass' || cleaned.toLowerCase() === 'book pass') {
    return 'Enroll Now'
  }
  return cleaned
}

/**
 * Sorts events so that live / upcoming gatherings are ALWAYS at the top,
 * and expired / completed events are moved down to the bottom.
 */
export function sortBmfEvents(events: BmfEvent[]): BmfEvent[] {
  return [...events].sort((a, b) => {
    const aCompleted = isEventExpired(a) || a.status === 'past' || a.status === 'closed'
    const bCompleted = isEventExpired(b) || b.status === 'past' || b.status === 'closed'

    if (aCompleted && !bCompleted) return 1
    if (!aCompleted && bCompleted) return -1

    return 0
  })
}

