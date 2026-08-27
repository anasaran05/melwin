'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BmfEvent, 
  INITIAL_BMF_EVENTS, 
  fetchBmfEvents, 
  registerForEvent 
} from '@/lib/supabase/bmf-events'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Flame, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X,
  Sparkles,
  Ticket,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function UpcomingEventsSection() {
  const [events, setEvents] = useState<BmfEvent[]>(INITIAL_BMF_EVENTS)
  const [selectedEvent, setSelectedEvent] = useState<BmfEvent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Registration Form State
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    role: '',
    linkedin_url: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [assignedStatus, setAssignedStatus] = useState<'registered' | 'waitlisted'>('registered')

  useEffect(() => {
    async function loadEvents() {
      try {
        const liveEvents = await fetchBmfEvents()
        if (liveEvents && liveEvents.length > 0) {
          setEvents(liveEvents)
        }
      } catch (err) {
        console.error('Error fetching events:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadEvents()
  }, [])

  const handleOpenRsvp = (event: BmfEvent) => {
    if (event.cta_type === 'external_link' && event.external_cta_url) {
      window.open(event.external_cta_url, '_blank', 'noopener,noreferrer')
      return
    }
    setSelectedEvent(event)
    setSubmitStatus('idle')
    setStatusMessage('')
    setIsModalOpen(true)
  }

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const res = await registerForEvent({
        event_id: selectedEvent.id,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        company_name: form.company_name,
        role: form.role,
        linkedin_url: form.linkedin_url,
        notes: form.notes,
      })

      if (res.success) {
        setSubmitStatus('success')
        setAssignedStatus(res.status)
        setStatusMessage(
          res.status === 'waitlisted'
            ? 'Capacity has been reached for this private gathering. You have been placed on the VIP priority waitlist!'
            : 'Your seat application has been confirmed! An invitation confirmation has been sent to your email.'
        )
      } else {
        setSubmitStatus('error')
        setStatusMessage(res.error || 'Failed to submit registration. Please try again.')
      }
    } catch (err: any) {
      setSubmitStatus('error')
      setStatusMessage(err.message || 'Registration error.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="events" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 w-full bg-white border-t border-b border-black/[0.06] scroll-mt-20">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
         
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight">
            Upcoming Private Events & Retreats
          </h2>
          <p className="text-sm sm:text-base text-[#666666] max-w-xl mx-auto">
            Strictly capped gatherings designed to facilitate candid deal-making, narrative mastery, and peer-to-peer scaling.
          </p>
        </div>

        {/* Events List (Last 5 events) */}
        <div className="space-y-4">
          {events.slice(0, 5).map((event) => {
            const isFull = event.total_capacity > 0 && event.registered_count >= event.total_capacity
            const spotsRemaining = Math.max(0, event.total_capacity - event.registered_count)

            return (
              <div
                key={event.id}
                className="bg-[#fafafa] rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-black/30 hover:shadow-md transition-all text-left group"
              >
                <div className="space-y-3 max-w-xl">
                  {/* Category & Status Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider bg-[#111111] text-white px-3 py-1 rounded-full">
                      {event.category.toUpperCase()}
                    </span>

                    {isFull ? (
                      <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3 text-rose-500" />
                        <span>Waitlist Only (Seats Full)</span>
                      </span>
                    ) : spotsRemaining <= 5 ? (
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500" />
                        <span>Only {spotsRemaining} Spots Left</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{event.total_capacity ? `${event.total_capacity} Curated Seats` : 'Open Seats'}</span>
                      </span>
                    )}

                    {event.pricing_type && (
                      <span className="text-[10px] font-mono text-neutral-500 bg-white border border-black/10 px-2 py-0.5 rounded-md">
                        {event.pricing_type === 'members_only' ? 'Members Exclusive' : event.pricing_type === 'free' ? 'Complimentary' : `₹${event.price_inr?.toLocaleString()}`}
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#111111] group-hover:text-black transition-colors">
                      {event.title}
                    </h3>
                    {event.tagline && (
                      <p className="text-xs text-[#666666] pt-1 leading-relaxed">
                        {event.tagline}
                      </p>
                    )}
                  </div>

                  {/* Date, Time & Venue */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-600 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{event.event_date}</span>
                    </span>
                    {event.event_time && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{event.event_time}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{event.location_venue || event.location_city}</span>
                    </span>
                  </div>

                  {event.requirements && (
                    <p className="text-[11px] font-mono text-neutral-500 bg-white/80 p-2 rounded-xl border border-black/5">
                      📌 <strong>Criteria:</strong> {event.requirements}
                    </p>
                  )}
                </div>

                {/* CTA Action Button */}
                <div className="shrink-0">
                  <Button
                    type="button"
                    onClick={() => handleOpenRsvp(event)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-6 py-3.5 rounded-full text-xs font-bold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <span>{event.external_cta_text || (event.cta_type === 'external_link' ? 'Apply on External Site' : isFull ? 'Join Waitlist' : 'Request Invitation')}</span>
                    {event.cta_type === 'external_link' ? (
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Link to All Events */}
        <div className="flex justify-center pt-2">
          <Link
            href="/bmf-club/events"
            className="inline-flex items-center gap-2.5 bg-white hover:bg-neutral-900 text-neutral-900 hover:text-white border border-black/10 hover:border-neutral-900 px-8 py-3.5 rounded-full text-xs sm:text-sm font-black transition-all shadow-sm group cursor-pointer"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>

      {/* Internal RSVP Registration Modal */}
      <AnimatePresence>
        {isModalOpen && selectedEvent && (
          <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#141417] text-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-neutral-700 shadow-2xl relative space-y-6 text-left my-8"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="space-y-2 border-b border-neutral-800 pb-4 pr-8">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-800">
                  {selectedEvent.category} &bull; RSVP Pass
                </span>
                <h3 className="text-xl font-bold text-white leading-tight">
                  {selectedEvent.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400 pt-1">
                  <span>🗓️ {selectedEvent.event_date}</span>
                  <span>📍 {selectedEvent.location_venue || selectedEvent.location_city}</span>
                </div>
              </div>

              {/* Status Message / Success Screen */}
              {submitStatus === 'success' ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    {assignedStatus === 'waitlisted' ? 'Added to Priority Waitlist' : 'RSVP Application Received!'}
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
                    {statusMessage}
                  </p>
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-full font-bold text-xs cursor-pointer"
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitRsvp} className="space-y-4">
                  {submitStatus === 'error' && (
                    <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{statusMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-300">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. S Kishore"
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-300">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="founder@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-300">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        inputMode="tel"
                        required
                        placeholder="+919876543210"
                        value={form.phone}
                        onChange={(e) => {
                          const val = e.target.value
                          const startsWithPlus = val.startsWith('+')
                          const digits = val.replace(/\D/g, '')
                          setForm({ ...form, phone: startsWithPlus ? `+${digits}` : digits })
                        }}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-300">Startup / Venture *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PharmPulse AI"
                        value={form.company_name}
                        onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-300">Official Role *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Founder & CEO"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-300">LinkedIn Profile</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        value={form.linkedin_url}
                        onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-300">
                      Why are you interested in this gathering? (Stage & Context)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Briefly state your current ARR/traction and what topic you'd like to discuss..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
                    <p className="text-[10px] font-mono text-neutral-400">
                      Passes are issued after peer vetting.
                    </p>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-white hover:bg-neutral-200 text-black font-bold text-xs px-6 py-2.5 rounded-full inline-flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ticket className="w-3.5 h-3.5" />}
                      <span>Submit RSVP</span>
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
