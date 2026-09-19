'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BmfEvent,
  fetchBmfEventByIdOrSlug,
  fetchBmfEvents,
  registerForEvent,
  isEventExpired,
  cleanEventCtaText,
  sortBmfEvents,
} from '@/lib/supabase/bmf-events'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'
import { Footer } from '@/components/footer'
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Ticket,
  ShieldCheck,
  Sparkles,
  Loader2,
  CalendarPlus,
  AlertCircle,
  X,
  Building2,
  UserCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const VERIFIED_BADGE_URL = 'https://img.icons8.com/stickers/500/verified-badge.png'

export default function BmfEventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventIdOrSlug = params?.id as string

  const [event, setEvent] = useState<BmfEvent | null>(null)
  const [relatedEvents, setRelatedEvents] = useState<BmfEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedLink, setCopiedLink] = useState(false)

  // Auth / User session
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | undefined>()

  // RSVP Modal State
  const [isRsvpOpen, setIsRsvpOpen] = useState(false)
  const [rsvpForm, setRsvpForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    role: '',
    linkedin_url: '',
    notes: '',
  })
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false)
  const [rsvpSuccessData, setRsvpSuccessData] = useState<{ ticketCode: string; eventTitle: string } | null>(null)
  const [rsvpError, setRsvpError] = useState<string | null>(null)

  useEffect(() => {
    let isSubscribed = true

    const loadData = async () => {
      if (!eventIdOrSlug) return
      setIsLoading(true)

      try {
        const [eventData, allEvents] = await Promise.all([
          fetchBmfEventByIdOrSlug(eventIdOrSlug),
          fetchBmfEvents(),
          (async () => {
            const supabase = getSupabaseBrowserClient()
            if (supabase) {
              const { data: { session } } = await supabase.auth.getSession()
              if (session?.user && isSubscribed) {
                setIsLoggedIn(true)
                setCurrentUserId(session.user.id)
                setRsvpForm((prev) => ({
                  ...prev,
                  email: session.user.email || prev.email,
                  full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || prev.full_name,
                }))
              }
            }
          })()
        ])

        if (isSubscribed) {
          if (eventData) {
            setEvent(eventData)
            // Filter and sort other events (live/upcoming first) for recommendations
            const others = sortBmfEvents(
              (allEvents || []).filter((e) => e.id !== eventData.id && e.is_published)
            ).slice(0, 3)
            setRelatedEvents(others)
          } else {
            setEvent(null)
          }
        }
      } catch (err) {
        console.error('Error loading event detail:', err)
      } finally {
        if (isSubscribed) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isSubscribed = false
    }
  }, [eventIdOrSlug])

  // Handle Share / Copy Link
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  // Google Calendar Link generator
  const googleCalendarUrl = useMemo(() => {
    if (!event) return '#'
    const title = encodeURIComponent(event.title)
    const details = encodeURIComponent(`${event.tagline || ''}\n\n${event.description || ''}\n\nOrganized by BMF Club`)
    const location = encodeURIComponent(`${event.location_venue ? event.location_venue + ', ' : ''}${event.location_city || ''}`)
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`
  }, [event])

  // Handle Primary CTA Click
  const handlePrimaryCta = () => {
    if (!event) return
    if (event.cta_type === 'external_link' && event.external_cta_url) {
      window.open(event.external_cta_url, '_blank', 'noopener,noreferrer')
      return
    }
    setIsRsvpOpen(true)
    setRsvpError(null)
    setRsvpSuccessData(null)
  }

  // Handle RSVP Submission
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return
    if (!rsvpForm.full_name.trim() || !rsvpForm.email.trim()) {
      setRsvpError('Please provide your full name and email.')
      return
    }

    setIsSubmittingRsvp(true)
    setRsvpError(null)

    try {
      const generatedTicket = `BMF-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString().slice(-4)}`
      const res = await registerForEvent({
        event_id: event.id,
        user_id: currentUserId || null,
        full_name: rsvpForm.full_name.trim(),
        email: rsvpForm.email.trim().toLowerCase(),
        phone: rsvpForm.phone.trim() || undefined,
        company_name: rsvpForm.company_name.trim() || undefined,
        role: rsvpForm.role.trim() || undefined,
        linkedin_url: rsvpForm.linkedin_url.trim() || undefined,
        notes: rsvpForm.notes.trim() || undefined,
      })

      if (res.success) {
        setRsvpSuccessData({
          ticketCode: res.ticketCode || generatedTicket,
          eventTitle: event.title,
        })
        // Optimistically increment attendees
        setEvent((prev) => prev ? { ...prev, registered_count: (prev.registered_count || 0) + 1 } : prev)
      } else {
        setRsvpError(res.error || 'Failed to submit registration. Please try again.')
      }
    } catch (err: any) {
      setRsvpError(err.message || 'An error occurred during RSVP submission.')
    } finally {
      setIsSubmittingRsvp(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-[#111111] font-sans flex flex-col justify-between antialiased">
        <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <Loader2 className="w-9 h-9 text-neutral-600 animate-spin" />
          <p className="text-xs font-mono text-neutral-500">Loading gathering overview...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-[#111111] font-sans flex flex-col justify-between antialiased">
        <main className="flex-1 max-w-xl mx-auto flex flex-col items-center justify-center p-6 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-neutral-200/80 flex items-center justify-center text-neutral-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900">Gathering Not Found</h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            The event you are looking for may have been rescheduled, concluded, or removed from our live calendar.
          </p>
          <Link
            href="/bmf-club/events"
            className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Gatherings</span>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const isPaid = event.pricing_type === 'paid'
  const isSoldOut = event.status === 'sold_out'
  const isPast = isEventExpired(event)
  const displayImage = event.cover_image || event.thumbnail_url
  const isUnlimitedCapacity = !event.total_capacity || event.total_capacity === 0 || event.total_capacity >= 9999
  const capacityPercent = !isUnlimitedCapacity && event.total_capacity
    ? Math.min(100, Math.round(((event.registered_count || 0) / event.total_capacity) * 100))
    : 0
  const seatsLeft = !isUnlimitedCapacity ? Math.max(0, (event.total_capacity || 0) - (event.registered_count || 0)) : 0

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#111111] font-sans flex flex-col justify-between selection:bg-black selection:text-white antialiased">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#f5f5f7]/90 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/bmf-club/events"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-black transition-colors px-3 py-1.5 rounded-xl hover:bg-black/5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Gatherings</span>
            </Link>
            <span className="text-neutral-300 hidden sm:inline">&bull;</span>
            <Link
              href="/bmf-club"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-black transition-colors"
            >
              BMF Club
            </Link>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-400 text-xs font-semibold text-neutral-800 transition-colors shadow-xs cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Share</span>
                </>
              )}
            </button>

            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-400 text-xs font-semibold text-neutral-800 transition-colors shadow-xs"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-neutral-500" />
              <span>Add to Calendar</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-6 sm:py-10 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto w-full space-y-8 sm:space-y-12 pb-24 lg:pb-12">
        
        {/* Hero Section */}
        {/* Hero Section (Responsive & Clean - Zero Text Collision on Mobile) */}
        <section className="bg-white border border-neutral-200/90 rounded-3xl overflow-hidden shadow-xs">
          {displayImage ? (
            <div className="w-full bg-neutral-950 relative overflow-hidden flex items-center justify-center border-b border-neutral-200/80">
              <img
                src={displayImage}
                alt={event.title}
                className="w-full h-auto max-h-[460px] object-contain sm:object-cover bg-neutral-950"
              />
            </div>
          ) : null}

          {/* Event Header Information (Separated from image - no collision or text collapsing) */}
          <div className="p-6 sm:p-8 md:p-10 space-y-4">
            
            {/* Category, Status & Pricing Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase bg-black text-white px-3.5 py-1.5 rounded-full shadow-xs">
                {event.category}
              </span>
              <span className={`text-xs font-mono font-bold uppercase px-3 py-1.5 rounded-full ${
                isPast
                  ? 'bg-neutral-200 text-neutral-700 font-semibold'
                  : isSoldOut
                  ? 'bg-rose-100 text-rose-700 border border-rose-200 font-semibold'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
              }`}>
                {isPast ? 'Event Completed' : event.status.replace('_', ' ')}
              </span>
              {event.pricing_type && (
                <span className="text-xs font-mono text-neutral-600 bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-full font-medium">
                  {event.pricing_type === 'free' ? 'Complimentary' : event.pricing_type === 'members_only' ? 'Members Exclusive' : `₹${event.price_inr?.toLocaleString()}`}
                </span>
              )}
            </div>

            {/* Event Title */}
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-neutral-950 leading-tight tracking-tight">
              {event.title}
            </h1>

            {/* Date, Time & Venue */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-mono text-neutral-600 pt-1">
              <span className="flex items-center gap-1.5 text-neutral-900 font-semibold bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200/60">
                <Calendar className="w-4 h-4 text-neutral-600" />
                <span>{event.event_date}</span>
              </span>
              {event.event_time && (
                <span className="flex items-center gap-1.5 bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200/60">
                  <Clock className="w-4 h-4 text-neutral-500" />
                  <span>{event.event_time}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5 bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200/60">
                <MapPin className="w-4 h-4 text-neutral-500" />
                <span>{event.location_city || 'Online'} &bull; {event.location_venue || 'Live Interactive Webinar'}</span>
              </span>
            </div>

            {/* Tagline */}
            {event.tagline && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                💡 {event.tagline}
              </div>
            )}

            {/* Mobile Quick Action Button (Visible on mobile screens) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:hidden">
              <Button
                type="button"
                onClick={handlePrimaryCta}
                disabled={isSoldOut || isPast}
                className="w-full py-3.5 text-xs font-bold bg-[#111111] hover:bg-black text-white rounded-xl inline-flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSoldOut ? (
                  <span>Gathering Sold Out</span>
                ) : isPast ? (
                  <span>Event Completed</span>
                ) : event.cta_type === 'external_link' ? (
                  <>
                    <span>{cleanEventCtaText(event.external_cta_text) || 'Book Webinar Pass'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </>
                ) : isPaid ? (
                  <>
                    <span>Claim Seat</span>
                    <Ticket className="w-3.5 h-3.5 text-amber-400" />
                  </>
                ) : (
                  <>
                    <span>Register for Event (RSVP)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </div>

          </div>
        </section>

        {/* 2-Column Content Layout: Details + Sticky Action Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Logistics Card */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-700" />
                <span>Gathering Logistics</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Date & Time */}
                <div className="space-y-1 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <span className="text-[11px] font-mono uppercase text-neutral-500 font-semibold block">Date & Timing</span>
                  <p className="text-sm font-bold text-neutral-950 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span>{event.event_date}</span>
                  </p>
                  <p className="text-xs text-neutral-600 font-mono flex items-center gap-1.5 pl-5">
                    <span>{event.event_time || 'Schedule confirmed on RSVP'}</span>
                  </p>
                </div>

                {/* Location & Format */}
                <div className="space-y-1 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <span className="text-[11px] font-mono uppercase text-neutral-500 font-semibold block">Location & Format</span>
                  <p className="text-sm font-bold text-neutral-950 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span>{event.location_city || 'Virtual'} &bull; {event.location_venue || 'Private Location'}</span>
                  </p>
                  <div className="pl-5 pt-0.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-neutral-200/80 text-neutral-800 font-bold">
                      {event.location_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Pricing & Access */}
                <div className="space-y-1 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <span className="text-[11px] font-mono uppercase text-neutral-500 font-semibold block">Access Tier</span>
                  <p className="text-sm font-bold text-neutral-950 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span>
                      {event.pricing_type === 'free'
                        ? 'Free for Community'
                        : event.pricing_type === 'paid'
                        ? `Paid Pass: ₹${event.price_inr}`
                        : event.pricing_type === 'members_only'
                        ? 'BMF Club Members Only'
                        : 'Curated Invite Only'}
                    </span>
                  </p>
                  <p className="text-xs text-neutral-600 pl-5">
                    {event.pricing_type === 'members_only'
                      ? 'Complimentary with active founder pass'
                      : event.pricing_type === 'paid'
                      ? 'Covers entry & dining expenses'
                      : 'Verified founders, leaders & operators'}
                  </p>
                </div>

                {/* Capacity & Spots */}
                <div className="space-y-1 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <span className="text-[11px] font-mono uppercase text-neutral-500 font-semibold block">Capacity Format</span>
                  {isUnlimitedCapacity ? (
                    <>
                      <p className="text-sm font-bold text-neutral-950 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Open Access &bull; Unlimited</span>
                      </p>
                      <p className="text-xs text-neutral-600 pl-5">
                        Live online webinar with interactive Q&A for all registered attendees.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-neutral-950 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>{event.registered_count || 0} / {event.total_capacity} Reserved</span>
                      </p>
                      <div className="pl-5 pt-1 space-y-1">
                        <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-neutral-950 rounded-full transition-all"
                            style={{ width: `${capacityPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500 block">
                          {seatsLeft > 0 ? `${seatsLeft} seats remaining` : 'Gathering at maximum capacity'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

              </div>
            </div>

            {/* Description & Full Agenda */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <h2 className="text-base font-black text-neutral-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>About This Gathering & Agenda</span>
              </h2>

              <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-4 font-sans">
                {event.description ? (
                  event.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="whitespace-pre-line leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="italic text-neutral-500">
                    A curated discussion and peer gathering connecting founders and operators across our private network.
                  </p>
                )}
              </div>
            </div>

            {/* Eligibility & Criteria */}
            {event.requirements && (
              <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                <h2 className="text-base font-black text-neutral-950 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Who Can Join & Eligibility Criteria</span>
                </h2>
                
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                  {event.requirements}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-bold">
                  Focus Topics & Industries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Curator / Host Card */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                  BMF
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm sm:text-base font-bold text-neutral-950">BMF Club Gathering</h4>
                    <img
                      src={VERIFIED_BADGE_URL}
                      alt="Verified"
                      className="w-4 h-4 object-contain inline-block shrink-0"
                    />
                  </div>
                  <p className="text-xs text-neutral-500">Curated specifically for verified founders & business builders.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/bmf-club"
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors"
                >
                  Learn About BMF
                </Link>
              </div>
            </div>

          </div>

          {/* Sticky Sidebar Action Card (1 Col) */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
              
              <div className="space-y-2 border-b border-neutral-100 pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-neutral-500 font-bold">Ticket Access</span>
                  <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800">
                    {event.pricing_type?.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-black text-neutral-950">
                    {event.pricing_type === 'free'
                      ? 'Free'
                      : event.pricing_type === 'paid'
                      ? `₹${event.price_inr}`
                      : 'Club Pass'}
                  </span>
                  {event.pricing_type === 'paid' && (
                    <span className="text-xs text-neutral-500 font-medium">/ attendee</span>
                  )}
                </div>

                <p className="text-xs text-neutral-500">
                  {event.pricing_type === 'members_only'
                    ? 'Exclusive access for BMF Club passholders'
                    : event.pricing_type === 'free'
                    ? 'Complimentary entry with RSVP confirmation'
                    : 'Instant access pass issued on registration'}
                </p>
              </div>

              {/* Progress & Availability */}
              {isUnlimitedCapacity ? (
                <div className="space-y-1.5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Open Registration &bull; Unlimited</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Live interactive webinar with Q&A session. Passholders receive instant confirmation and meeting link.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-600 font-semibold">Attendance Fill</span>
                    <span className="text-neutral-950 font-bold">{capacityPercent}% full</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-950 rounded-full transition-all duration-500"
                      style={{ width: `${capacityPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-0.5">
                    <span>{event.registered_count || 0} attending</span>
                    <span>{seatsLeft} seats left</span>
                  </div>
                </div>
              )}

              {/* Primary Call to Action Button */}
              <div className="space-y-3 pt-2">
                <Button
                  type="button"
                  onClick={handlePrimaryCta}
                  disabled={isSoldOut || isPast}
                  className="w-full py-4 text-sm font-bold bg-[#111111] hover:bg-black text-white rounded-2xl inline-flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSoldOut ? (
                    <span>Gathering Sold Out</span>
                  ) : isPast ? (
                    <span>Event Completed</span>
                  ) : event.cta_type === 'external_link' ? (
                    <>
                      <span>{cleanEventCtaText(event.external_cta_text) || 'Register Online'}</span>
                      <ExternalLink className="w-4 h-4" />
                    </>
                  ) : isPaid ? (
                    <>
                      <span>Claim Seat</span>
                      <Ticket className="w-4 h-4 text-amber-400" />
                    </>
                  ) : (
                    <>
                      <span>Register for Event (RSVP)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                {/* Secondary Links */}
                <div className="pt-2 text-center">
                  <button
                    onClick={handleCopyLink}
                    className="text-xs text-neutral-500 hover:text-black transition-colors font-medium inline-flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Event Page URL'}</span>
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-neutral-100 space-y-2.5 text-[11px] text-neutral-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Curated by BMF Club community leads</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant RSVP verification & digital ticket pass</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Connect directly with peer founders</span>
                </div>
              </div>

            </div>

            {/* Need Help Box */}
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-4 text-xs text-neutral-600 space-y-1.5">
              <p className="font-bold text-neutral-900">Have questions about this gathering?</p>
              <p className="text-[11px] leading-relaxed">
                Contact the event coordinator via BMF Club support or email us directly at support@bmfclub.com.
              </p>
            </div>

          </div>

        </div>

        {/* Related / Other Upcoming Gatherings */}
        {relatedEvents.length > 0 && (
          <section className="pt-10 border-t border-neutral-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-neutral-950">More Upcoming Gatherings</h3>
                <p className="text-xs text-neutral-500 font-mono">Discover other founder dinners, conclaves & workshops</p>
              </div>
              <Link
                href="/bmf-club/events"
                className="text-xs font-bold text-neutral-800 hover:text-black flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((ev) => {
                const img = ev.thumbnail_url || ev.cover_image
                return (
                  <Link
                    key={ev.id}
                    href={`/bmf-club/events/${ev.id}`}
                    className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden hover:border-neutral-400 transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
                  >
                    <div>
                      {img ? (
                        <div className="w-full h-36 bg-neutral-100 overflow-hidden relative">
                          <img
                            src={img}
                            alt={ev.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2 left-2 text-[9px] font-mono font-bold uppercase bg-black/75 text-white px-2.5 py-0.5 rounded-full">
                            {ev.category}
                          </span>
                        </div>
                      ) : (
                        <div className="p-4 bg-neutral-100 border-b border-neutral-200">
                          <span className="text-[9px] font-mono font-bold uppercase bg-white text-neutral-800 px-2.5 py-0.5 rounded-full border border-neutral-200">
                            {ev.category}
                          </span>
                        </div>
                      )}

                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                          <span>{ev.event_date}</span>
                          <span>{ev.location_city}</span>
                        </div>
                        <h4 className="text-sm font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors line-clamp-2">
                          {ev.title}
                        </h4>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <span className="text-xs font-bold text-neutral-900 flex items-center gap-1">
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

      </main>

      {/* Sticky Bottom Action Banner (Always visible on mobile & tablet viewports) */}
      {event && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/15 px-4 py-3 text-white shadow-2xl">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-white truncate leading-tight">
                {event.title}
              </p>
              <p className="text-[10px] font-mono text-neutral-400 truncate mt-0.5">
                {event.event_date}
              </p>
            </div>

            <Button
              type="button"
              onClick={handlePrimaryCta}
              disabled={isSoldOut || isPast}
              className="shrink-0 py-2.5 px-5 text-xs font-black bg-white hover:bg-neutral-100 text-black rounded-xl inline-flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSoldOut ? (
                <span>Sold Out</span>
              ) : isPast ? (
                <span>Completed</span>
              ) : event.cta_type === 'external_link' ? (
                <>
                  <span>{cleanEventCtaText(event.external_cta_text) || 'Book Pass'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-700" />
                </>
              ) : isPaid ? (
                <>
                  <span>Claim Seat</span>
                  <Ticket className="w-3.5 h-3.5 text-amber-500" />
                </>
              ) : (
                <>
                  <span>RSVP Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* RSVP Registration Modal */}
      <AnimatePresence>
        {isRsvpOpen && event && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative my-auto"
            >
              <button
                onClick={() => {
                  setIsRsvpOpen(false)
                  setRsvpSuccessData(null)
                }}
                className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {rsvpSuccessData ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-neutral-900">Seat Confirmed!</h3>
                    <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                      You are registered for <strong>{rsvpSuccessData.eventTitle}</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold block">
                      Digital Entry Pass Code
                    </span>
                    <span className="text-base sm:text-lg font-mono font-black text-neutral-950 block">
                      {rsvpSuccessData.ticketCode}
                    </span>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <a
                      href={googleCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      <span>Add to Google Calendar</span>
                    </a>
                    <Button
                      type="button"
                      onClick={() => {
                        setIsRsvpOpen(false)
                        setRsvpSuccessData(null)
                      }}
                      className="flex-1 py-3 text-xs font-bold text-white bg-[#111111] hover:bg-black rounded-xl cursor-pointer"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold block">
                      Registration Pass
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-neutral-950">
                      Join {event.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-mono mt-0.5">
                      {event.event_date} &bull; {event.location_city}
                    </p>
                  </div>

                  {rsvpError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{rsvpError}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-700">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={rsvpForm.full_name}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, full_name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-700">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={rsvpForm.email}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                          placeholder="you@company.com"
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-700">Phone / WhatsApp</label>
                        <input
                          type="tel"
                          value={rsvpForm.phone}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-700">Company / Startup</label>
                        <input
                          type="text"
                          value={rsvpForm.company_name}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, company_name: e.target.value })}
                          placeholder="e.g. Acme Corp"
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-700">Role / Designation</label>
                        <input
                          type="text"
                          value={rsvpForm.role}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, role: e.target.value })}
                          placeholder="e.g. Founder / CTO"
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-700">LinkedIn Profile URL</label>
                        <input
                          type="url"
                          value={rsvpForm.linkedin_url}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, linkedin_url: e.target.value })}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-700">Notes / Intent for Joining</label>
                      <textarea
                        rows={2}
                        value={rsvpForm.notes}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, notes: e.target.value })}
                        placeholder="What do you hope to discuss or take away from this gathering?"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRsvpOpen(false)}
                      className="px-4 py-2.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      disabled={isSubmittingRsvp}
                      className="bg-[#111111] hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      {isSubmittingRsvp ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Issuing Pass...</span>
                        </>
                      ) : (
                        <>
                          <span>{isPaid ? 'Confirm & Get Pass' : 'Get Digital Pass'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  )
}
