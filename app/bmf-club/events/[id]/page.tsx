import React from 'react'
import type { Metadata } from 'next'
import {
  BmfEvent,
  fetchBmfEventByIdOrSlug,
  fetchBmfEvents,
  sortBmfEvents,
} from '@/lib/supabase/bmf-events'
import { BmfEventDetailClient } from '@/components/bmf-club/event-detail-client'

interface EventPageProps {
  params: Promise<{ id: string }>
}

function parseEventDateToIso(dateStr?: string, timeStr?: string): { startIso: string; endIso: string } {
  // Default fallback ISO date for the BMF webinar
  let start = '2026-09-26T16:00:00+05:30'
  let end = '2026-09-27T17:00:00+05:30'

  if (!dateStr) return { startIso: start, endIso: end }

  // Detect September 26-27 or single dates
  const yearMatch = dateStr.match(/\b(20\d{2})\b/)
  const year = yearMatch ? yearMatch[1] : '2026'

  const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ]
  const lower = dateStr.toLowerCase()
  let monthIdx = monthNames.findIndex((m) => lower.includes(m))
  if (monthIdx === -1) monthIdx = 8 // September

  const dayMatches = dateStr.match(/\b(\d{1,2})\b/g)
  if (dayMatches && dayMatches.length > 0) {
    const startDay = parseInt(dayMatches[0], 10)
    const endDay = dayMatches.length > 1 ? parseInt(dayMatches[1], 10) : startDay
    const mStr = String(monthIdx + 1).padStart(2, '0')
    const sStr = String(startDay).padStart(2, '0')
    const eStr = String(endDay).padStart(2, '0')
    start = `${year}-${mStr}-${sStr}T16:00:00+05:30`
    end = `${year}-${mStr}-${eStr}T17:00:00+05:30`
  }

  return { startIso: start, endIso: end }
}

function generateEventJsonLd(event: BmfEvent) {
  const { startIso, endIso } = parseEventDateToIso(event.event_date, event.event_time)
  const isVirtual =
    event.location_type === 'virtual' ||
    event.location_venue?.toLowerCase().includes('webinar') ||
    event.location_venue?.toLowerCase().includes('online')

  const attendanceMode = isVirtual
    ? 'https://schema.org/OnlineEventAttendanceMode'
    : event.location_type === 'hybrid'
    ? 'https://schema.org/MixedEventAttendanceMode'
    : 'https://schema.org/OfflineEventAttendanceMode'

  const locationData = isVirtual
    ? {
        '@type': 'VirtualLocation',
        url: event.external_cta_url || `https://buildwithmelwin.com/bmf-club/events/${event.id}`,
      }
    : {
        '@type': 'Place',
        name: event.location_venue || 'BMF Club Private Lounge',
        address: {
          '@type': 'PostalAddress',
          addressLocality: event.location_city || 'Chennai',
          addressCountry: 'IN',
        },
      }

  const registrationUrl = event.external_cta_url || `https://buildwithmelwin.com/bmf-club/events/${event.id}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description
      ? event.description.slice(0, 500)
      : event.tagline || event.title,
    startDate: startIso,
    endDate: endIso,
    eventAttendanceMode: attendanceMode,
    eventStatus:
      event.status === 'closed' || event.status === 'past'
        ? 'https://schema.org/EventMovedOnline'
        : 'https://schema.org/EventScheduled',
    location: locationData,
    image: [event.cover_image || 'https://buildwithmelwin.com/og-bmf-events.png'],
    organizer: {
      '@type': 'Organization',
      name: 'BMF Club',
      url: 'https://buildwithmelwin.com/bmf-club',
    },
    offers: {
      '@type': 'Offer',
      price: event.price_inr || 0,
      priceCurrency: 'INR',
      availability:
        event.status === 'sold_out'
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
      url: registrationUrl,
      validFrom: '2026-09-01T00:00:00+05:30',
    },
  }
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params
  const event = await fetchBmfEventByIdOrSlug(id)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://buildwithmelwin.com'

  if (!event) {
    return {
      title: 'Event Not Found | BMF Club',
      description: 'The requested BMF Club event or mastermind session could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = `${event.title} | BMF Club Webinar & Masterclass`
  const rawDescription = event.tagline
    ? `${event.tagline} • ${event.event_date} (${event.location_city || 'Online'})`
    : `${event.title} organized by BMF Club on ${event.event_date}.`
  const description = rawDescription.slice(0, 160)

  const canonicalUrl = `${baseUrl}/bmf-club/events/${encodeURIComponent(event.id)}`
  const imageUrl = event.cover_image || `${baseUrl}/og-bmf-events.png`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'BMF Club - Executive Founder Syndicate',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@buildwithmelwin',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function BmfEventDetailPage({ params }: EventPageProps) {
  const { id } = await params
  const [event, allEvents] = await Promise.all([
    fetchBmfEventByIdOrSlug(id),
    fetchBmfEvents(),
  ])

  const relatedEvents = sortBmfEvents(
    (allEvents || []).filter((e) => e.id !== event?.id && e.is_published)
  ).slice(0, 3)

  const jsonLd = event ? generateEventJsonLd(event) : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BmfEventDetailClient
        initialEvent={event}
        initialRelatedEvents={relatedEvents}
        eventIdOrSlug={id}
      />
    </>
  )
}
