'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BmfEvent,
  fetchBmfEvents,
  registerForEvent,
  INITIAL_BMF_EVENTS
} from '@/lib/supabase/bmf-events'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'
import { Footer } from '@/components/footer'
import {
  Calendar,
  MapPin,
  Users,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  Loader2,
  Ticket,
  LayoutDashboard,
  Users2,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const VERIFIED_BADGE_URL = 'https://img.icons8.com/stickers/500/verified-badge.png'

const CATEGORY_TABS = [
  { label: 'All Gatherings', value: 'all' },
  { label: 'Dinners', value: 'Dinner' },
  { label: 'Roundtables', value: 'Roundtable' },
  { label: 'Workshops', value: 'Workshop' },
  { label: 'Demo Days', value: 'Demo Day' },
  { label: 'Mixers', value: 'Mixer' },
]

export default function BmfPublicEventsPage() {
  const [events, setEvents] = useState<BmfEvent[]>(INITIAL_BMF_EVENTS)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedPricing, setSelectedPricing] = useState<'all' | 'free' | 'paid' | 'members_only'>('all')

  // RSVP Modal State
  const [rsvpEvent, setRsvpEvent] = useState<BmfEvent | null>(null)
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

  // Auth session check for quick prefill and button states
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | undefined>()

  useEffect(() => {
    let isSubscribed = true

    const loadEventsAndAuth = async () => {
      try {
        setIsLoading(true)
        const [fetchedEvents] = await Promise.all([
          fetchBmfEvents(),
          // Check auth
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

        if (isSubscribed && fetchedEvents) {
          setEvents(fetchedEvents)
        }
      } catch (err) {
        console.error('Failed to load events:', err)
      } finally {
        if (isSubscribed) {
          setIsLoading(false)
          setAuthLoading(false)
        }
      }
    }

    loadEventsAndAuth()

    return () => {
      isSubscribed = false
    }
  }, [])

  // Derived Cities
  const cities = useMemo(() => {
    const list = new Set<string>()
    events.forEach((e) => {
      if (e.location_city) list.add(e.location_city.trim())
    })
    return ['all', ...Array.from(list)]
  }, [events])

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (!e.is_published) return false

      // Category filter
      if (selectedCategory !== 'all') {
        const catLower = (e.category || '').toLowerCase()
        const targetLower = selectedCategory.toLowerCase()
        if (!catLower.includes(targetLower)) return false
      }

      // City filter
      if (selectedCity !== 'all') {
        if ((e.location_city || '').toLowerCase() !== selectedCity.toLowerCase()) {
          return false
        }
      }

      // Pricing filter
      if (selectedPricing !== 'all') {
        if (selectedPricing === 'free' && e.pricing_type !== 'free') return false
        if (selectedPricing === 'paid' && e.pricing_type !== 'paid') return false
        if (selectedPricing === 'members_only' && e.pricing_type !== 'members_only') return false
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = (e.title || '').toLowerCase().includes(q)
        const matchDesc = (e.description || '').toLowerCase().includes(q)
        const matchTagline = (e.tagline || '').toLowerCase().includes(q)
        const matchCity = (e.location_city || '').toLowerCase().includes(q)
        const matchVenue = (e.location_venue || '').toLowerCase().includes(q)
        const matchTags = (e.tags || []).some((t) => t.toLowerCase().includes(q))
        if (!matchTitle && !matchDesc && !matchTagline && !matchCity && !matchVenue && !matchTags) {
          return false
        }
      }

      return true
    })
  }, [events, selectedCategory, selectedCity, selectedPricing, searchQuery])

  // Open RSVP
  const handleOpenRsvp = (event: BmfEvent) => {
    if (event.cta_type === 'external_link' && event.external_cta_url) {
      window.open(event.external_cta_url, '_blank', 'noopener,noreferrer')
      return
    }
    setRsvpEvent(event)
    setRsvpError(null)
    setRsvpSuccessData(null)
  }

  // Submit RSVP
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvpEvent) return
    if (!rsvpForm.full_name.trim() || !rsvpForm.email.trim()) {
      setRsvpError('Please provide your name and email.')
      return
    }

    setIsSubmittingRsvp(true)
    setRsvpError(null)

    try {
      const generatedTicket = `BMF-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString().slice(-4)}`
      const res = await registerForEvent({
        event_id: rsvpEvent.id,
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
          eventTitle: rsvpEvent.title,
        })
        // Optimistically increment attendees
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === rsvpEvent.id
              ? { ...ev, registered_count: (ev.registered_count || 0) + 1 }
              : ev
          )
        )
      } else {
        setRsvpError(res.error || 'Failed to submit RSVP registration.')
      }
    } catch (err: any) {
      setRsvpError(err.message || 'Error occurred during registration.')
    } finally {
      setIsSubmittingRsvp(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#111111] font-sans flex flex-col justify-between selection:bg-black selection:text-white antialiased">
      
      {/* Main Container */}
      <main className="flex-1 pt-6 sm:pt-10 pb-16 sm:pb-24 px-3.5 sm:px-6 md:px-12 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
        
        {/* Title Section with Blue Tick & Navigation Buttons */}
        <div className="space-y-4">
          
          {/* Mobile Top Controls Bar (< md) */}
          <div className="flex md:hidden items-center justify-between gap-2">
            <Link
              href="/bmf-club"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black transition-colors px-2.5 py-1.5 rounded-xl hover:bg-black/5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BMF Club</span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/bmf-club/directory"
                className="inline-flex items-center gap-1 bg-white border border-neutral-300 text-neutral-800 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs active:scale-95"
              >
                <Users2 className="w-3.5 h-3.5" />
                <span>Directory</span>
              </Link>
              <Link
                href="/bmf-club/dashboard"
                className="inline-flex items-center gap-1 bg-[#111111] hover:bg-black text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs active:scale-95"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>

          {/* Desktop Integrated 3-Column Header (>= md) */}
          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-center gap-4">
            
            {/* Left: Back to BMF Club Link */}
            <div className="flex justify-start">
              <Link
                href="/bmf-club"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-600 hover:text-black transition-colors px-3 py-1.5 rounded-xl hover:bg-black/5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BMF Club</span>
              </Link>
            </div>

            {/* Center: BMF Club with Blue Tick */}
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight inline-flex items-center justify-center gap-2.5">
                <span>BMF Club</span>
                <img
                  src={VERIFIED_BADGE_URL}
                  alt="Verified Badge"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain select-none shrink-0"
                />
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                Founder Meetups, Private Dinners & Masterminds
              </p>
            </div>

            {/* Right: Go to Directory & Go to Dashboard Buttons */}
            <div className="flex items-center justify-end gap-2.5">
              <Link
                href="/bmf-club/directory"
                className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 px-4 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
              >
                <Users2 className="w-4 h-4 text-neutral-600" />
                <span>Go to Directory</span>
              </Link>

              <Link
                href="/bmf-club/dashboard"
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-70" />
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <section className="space-y-4 pt-1">
          
          {/* Top Bar: Search + City + Pricing */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, city, venue, or tag..."
                className="w-full bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* City & Pricing Dropdown Filters */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 md:pb-0">
              {/* City Filter */}
              <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-2xl px-3.5 py-2 text-xs shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-xs text-neutral-800 focus:outline-none cursor-pointer capitalize font-medium"
                >
                  {cities.map((city) => (
                    <option key={city} value={city} className="bg-white text-neutral-900">
                      {city === 'all' ? 'All Cities' : city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing Filter */}
              <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-2xl px-3.5 py-2 text-xs shadow-xs">
                <Ticket className="w-3.5 h-3.5 text-neutral-400" />
                <select
                  value={selectedPricing}
                  onChange={(e) => setSelectedPricing(e.target.value as any)}
                  className="bg-transparent text-xs text-neutral-800 focus:outline-none cursor-pointer font-medium"
                >
                  <option value="all" className="bg-white text-neutral-900">All Access Types</option>
                  <option value="free" className="bg-white text-neutral-900">Free</option>
                  <option value="paid" className="bg-white text-neutral-900">Paid Tickets</option>
                  <option value="members_only" className="bg-white text-neutral-900">Members Only</option>
                </select>
              </div>

              {/* Host Event Button */}
              <Link
                href="/bmf-club/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-900 text-xs font-semibold transition-colors shrink-0 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Host Event</span>
              </Link>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const isSelected = selectedCategory === tab.value
              return (
                <button
                  key={tab.value}
                  onClick={() => setSelectedCategory(tab.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#111111] text-white font-bold shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 shadow-xs'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* Events Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500 border-b border-neutral-200 pb-3">
            <span>Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'Gathering' : 'Gatherings'}</span>
            <span>Live event feed</span>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-neutral-500 animate-spin" />
              <p className="text-xs font-mono text-neutral-500">Loading events calendar...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white border border-neutral-200 rounded-3xl p-8 shadow-xs">
              <Calendar className="w-8 h-8 text-neutral-400 mx-auto" />
              <h3 className="text-base font-bold text-neutral-900">No gatherings found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No events matched your current filters. Try changing category, city, or clearing search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedCity('all')
                  setSelectedPricing('all')
                  setSearchQuery('')
                }}
                className="mt-2 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const isPaid = event.pricing_type === 'paid'
                const displayImage = event.thumbnail_url || event.cover_image
                const capacityPercent = event.total_capacity 
                  ? Math.min(100, Math.round(((event.registered_count || 0) / event.total_capacity) * 100))
                  : 0

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-neutral-200/90 hover:border-neutral-300 rounded-3xl overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between group transition-all"
                  >
                    <div>
                      {/* Event Cover Image (No Free/Paid tag overlay on image) */}
                      {displayImage ? (
                        <div className="w-full h-48 bg-neutral-100 relative overflow-hidden shrink-0">
                          <img
                            src={displayImage}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase bg-black/75 backdrop-blur-md text-white px-3 py-1 rounded-full shadow-xs">
                            {event.category}
                          </span>
                        </div>
                      ) : (
                        <div className="p-5 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase bg-white text-neutral-800 border border-neutral-200 px-3 py-1 rounded-full font-bold shadow-xs">
                            {event.category}
                          </span>
                        </div>
                      )}

                      {/* Event Details Body */}
                      <div className="p-6 space-y-4">
                        
                        {/* Date & Time */}
                        <div className="flex items-center justify-between text-xs font-mono text-neutral-600">
                          <span className="text-neutral-900 font-semibold flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                            {event.event_date}
                          </span>
                          <span>{event.event_time || 'TBD'}</span>
                        </div>

                        {/* Title & Tagline */}
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-neutral-950 leading-snug group-hover:text-neutral-700 transition-colors">
                            {event.title}
                          </h3>
                          {event.tagline && (
                            <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                              {event.tagline}
                            </p>
                          )}
                        </div>

                        {/* Location details */}
                        <div className="pt-2 text-xs font-mono text-neutral-600 space-y-1.5 border-t border-neutral-100">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate">
                              {event.location_city} &bull; {event.location_venue || 'Private Venue'} ({event.location_type?.replace('_', ' ')})
                            </span>
                          </div>
                          
                          {/* Attendee count & Progress */}
                          <div className="space-y-1 pt-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-neutral-400" />
                                <span>{event.registered_count || 0} / {event.total_capacity || 20} Attending</span>
                              </span>
                              <span className="text-neutral-400">{capacityPercent}% full</span>
                            </div>
                            <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-neutral-900 rounded-full transition-all"
                                style={{ width: `${capacityPercent}%` }}
                              />
                            </div>
                          </div>

                          {event.requirements && (
                            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-700 font-sans mt-2">
                              <strong className="text-neutral-900 font-mono text-[10px] uppercase block mb-0.5">Who can join</strong>
                              {event.requirements}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Action Button */}
                    <div className="p-6 pt-0">
                      <Button
                        type="button"
                        onClick={() => handleOpenRsvp(event)}
                        className="w-full bg-[#111111] hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all"
                      >
                        {event.cta_type === 'external_link' ? (
                          <>
                            <span>{event.external_cta_text || 'Register Online'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </>
                        ) : isPaid ? (
                          <>
                            <span>Buy Ticket &bull; ₹{event.price_inr}</span>
                            <Ticket className="w-3.5 h-3.5 text-amber-400" />
                          </>
                        ) : (
                          <>
                            <span>Join Event (RSVP)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>

        {/* Host Your Own Gathering Banner */}
        <section className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
              Founder Curators
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-950">
              Want to host a closed-door roundtable or dinner?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              BMF Club founders can propose and curate private sessions for fellow builders. Our concierge coordinates RSVPs and guest lists.
            </p>
          </div>

          <Link
            href="/bmf-club/dashboard"
            className="bg-[#111111] hover:bg-black text-white font-bold text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2 shrink-0 shadow-xs transition-all active:scale-95"
          >
            <LayoutDashboard className="w-4 h-4 text-amber-400" />
            <span>Host in Founder Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      {/* RSVP Modal (Light Theme) */}
      <AnimatePresence>
        {rsvpEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in-0 duration-200">
            <div
              className="bg-white border border-neutral-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-neutral-900 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
                <div className="space-y-1 pr-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                      {rsvpEvent.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700">
                      {rsvpEvent.pricing_type === 'paid' ? `₹${rsvpEvent.price_inr} Ticket` : 'Free RSVP'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-950 leading-snug">
                    {rsvpEvent.title}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    setRsvpEvent(null)
                    setRsvpSuccessData(null)
                  }}
                  className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {rsvpSuccessData ? (
                  <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
                    <div className="w-14 h-14 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-neutral-950">RSVP Confirmed!</h4>
                      <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                        Your pass has been reserved for <strong>{rsvpSuccessData.eventTitle}</strong>.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 max-w-xs mx-auto space-y-1">
                      <span className="text-[9px] font-mono uppercase text-neutral-500 block">Your Ticket Access Code</span>
                      <span className="text-base font-mono font-black text-neutral-950 tracking-widest block">
                        {rsvpSuccessData.ticketCode}
                      </span>
                    </div>

                    <Button
                      type="button"
                      onClick={() => {
                        setRsvpEvent(null)
                        setRsvpSuccessData(null)
                      }}
                      className="mt-4 px-6 py-2 rounded-full bg-[#111111] hover:bg-black text-white font-bold text-xs"
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-4">
                    {rsvpError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                        {rsvpError}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">
                          Full Name <span className="text-neutral-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={rsvpForm.full_name}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, full_name: e.target.value })}
                          placeholder="e.g. Alex Rivera"
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-neutral-700 block mb-1">
                            Work Email <span className="text-neutral-400">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={rsvpForm.email}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                            placeholder="alex@startup.com"
                            className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-neutral-700 block mb-1">
                            Contact Number
                          </label>
                          <input
                            type="tel"
                            value={rsvpForm.phone}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-neutral-700 block mb-1">
                            Company / Startup
                          </label>
                          <input
                            type="text"
                            value={rsvpForm.company_name}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, company_name: e.target.value })}
                            placeholder="e.g. Acme AI"
                            className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-neutral-700 block mb-1">
                            Your Role
                          </label>
                          <input
                            type="text"
                            value={rsvpForm.role}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, role: e.target.value })}
                            placeholder="e.g. Founder & CEO"
                            className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">
                          LinkedIn Profile (Optional)
                        </label>
                        <input
                          type="url"
                          value={rsvpForm.linkedin_url}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, linkedin_url: e.target.value })}
                          placeholder="https://linkedin.com/in/alex"
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setRsvpEvent(null)}
                        className="text-xs text-neutral-500 hover:text-neutral-900 font-semibold"
                      >
                        Cancel
                      </button>

                      <Button
                        type="submit"
                        disabled={isSubmittingRsvp}
                        className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-black text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-xs"
                      >
                        {isSubmittingRsvp ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Confirming...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm RSVP Pass</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
