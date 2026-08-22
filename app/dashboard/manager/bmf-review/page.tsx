'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BmfMember, 
  INITIAL_BMF_MEMBERS, 
  fetchAllMembersForAdmin
} from '@/lib/supabase/bmf-members'
import {
  BmfEvent,
  BmfEventRegistration,
  INITIAL_BMF_EVENTS,
  fetchAllEventsForAdmin,
  saveBmfEvent,
  deleteBmfEvent,
  fetchEventRegistrations
} from '@/lib/supabase/bmf-events'
import { MemberFlipCard } from '@/components/bmf-club/member-flip-card'
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Search, 
  RefreshCw,
  Send,
  Calendar,
  Users,
  Plus,
  Trash2,
  Edit,
  Clock,
  MapPin,
  Flame,
  Check,
  Layers,
  Ticket
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BmfAdminReviewPage() {
  const [mainTab, setMainTab] = useState<'showcases' | 'events' | 'registrations'>('showcases')

  // Showcase Members State
  const [members, setMembers] = useState<BmfMember[]>(INITIAL_BMF_MEMBERS)
  const [memberFilter, setMemberFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [memberSearch, setMemberSearch] = useState('')
  const [activeMemberActionId, setActiveMemberActionId] = useState<string | null>(null)

  // Feedback Rejection Modal
  const [rejectModalMember, setRejectModalMember] = useState<BmfMember | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)

  // Events State
  const [events, setEvents] = useState<BmfEvent[]>(INITIAL_BMF_EVENTS)
  const [registrations, setRegistrations] = useState<BmfEventRegistration[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('all')
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [eventForm, setEventForm] = useState<Partial<BmfEvent>>({
    title: '',
    tagline: '',
    description: '',
    event_date: '',
    event_time: '6:30 PM - 9:30 PM IST',
    location_type: 'in_person',
    location_venue: '',
    location_city: 'Bangalore',
    category: 'Closed-Door Dinner',
    total_capacity: 18,
    registered_count: 0,
    is_published: true,
    status: 'upcoming',
    cta_type: 'internal_form',
    external_cta_url: '',
    external_cta_text: 'Request Invitation',
    pricing_type: 'members_only',
    price_inr: 0,
    requirements: '',
  })
  const [isSavingEvent, setIsSavingEvent] = useState(false)
  const [activeRegActionId, setActiveRegActionId] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [membersData, eventsData, regData] = await Promise.all([
        fetchAllMembersForAdmin(),
        fetchAllEventsForAdmin(),
        fetchEventRegistrations(),
      ])
      setMembers(membersData)
      setEvents(eventsData)
      setRegistrations(regData)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Showcase member actions
  const handleMemberAction = async (memberId: string, action: 'approve' | 'reject' | 'toggle_verify' | 'toggle_featured', feedback?: string) => {
    setActiveMemberActionId(memberId)
    try {
      const res = await fetch('/api/bmf/admin-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, action, feedback }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setMembers((prev) =>
          prev.map((m) => {
            if (m.id !== memberId) return m
            if (action === 'approve') return { ...m, is_approved: true, review_status: 'approved', admin_feedback: null }
            if (action === 'reject') return { ...m, is_approved: false, review_status: 'rejected', admin_feedback: feedback || null }
            if (action === 'toggle_verify') return { ...m, is_verified: !m.is_verified }
            if (action === 'toggle_featured') return { ...m, is_featured: !m.is_featured }
            return m
          })
        )
      } else {
        alert(data.error || 'Action failed.')
      }
    } catch (err: any) {
      alert(err.message || 'Action error.')
    } finally {
      setActiveMemberActionId(null)
      setRejectModalMember(null)
      setFeedbackText('')
      setIsSendingFeedback(false)
    }
  }

  // Event actions
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingEvent(true)
    try {
      const res = await saveBmfEvent(eventForm)
      if (res.success && res.event) {
        setEvents((prev) => [res.event!, ...prev.filter((item) => item.id !== res.event!.id)])
        setIsEventModalOpen(false)
        setEventForm({
          title: '',
          tagline: '',
          description: '',
          event_date: '',
          event_time: '6:30 PM - 9:30 PM IST',
          location_type: 'in_person',
          location_venue: '',
          location_city: 'Bangalore',
          category: 'Closed-Door Dinner',
          total_capacity: 18,
          registered_count: 0,
          is_published: true,
          status: 'upcoming',
          cta_type: 'internal_form',
          external_cta_url: '',
          external_cta_text: 'Request Invitation',
          pricing_type: 'members_only',
          price_inr: 0,
          requirements: '',
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSavingEvent(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    await deleteBmfEvent(eventId)
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
  }

  // Registration attendee actions
  const handleRegistrationAction = async (registrationId: string, action: 'approve' | 'reject' | 'waitlist' | 'mark_attended') => {
    setActiveRegActionId(registrationId)
    try {
      const res = await fetch('/api/bmf/admin-event-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId, action }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setRegistrations((prev) =>
          prev.map((r) => {
            if (r.id !== registrationId) return r
            return {
              ...r,
              status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : action === 'waitlist' ? 'waitlisted' : 'attended',
            }
          })
        )
      } else {
        alert(data.error || 'Failed to update attendee status.')
      }
    } catch (err: any) {
      alert(err.message || 'Error.')
    } finally {
      setActiveRegActionId(null)
    }
  }

  const filteredMembers = members.filter((m) => {
    const status = m.review_status || (m.is_approved ? 'approved' : 'pending')
    const matchesFilter = memberFilter === 'all' || status === memberFilter
    const q = memberSearch.toLowerCase()
    return matchesFilter && (
      m.full_name.toLowerCase().includes(q) ||
      m.company_name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q))
    )
  })

  const filteredRegistrations = registrations.filter((r) => {
    return selectedEventId === 'all' || r.event_id === selectedEventId
  })

  return (
    <div className="min-h-screen bg-[#0d0d10] text-white p-4 sm:p-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-800/50">
              Admin Master Console
            </span>
            <span className="text-xs font-mono text-neutral-400">
              BMF Founders Club Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            BMF Admissions & Events Control Deck
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Moderate showcase directory cards, publish private events with custom CTA routing, and approve RSVP passes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={loadData}
            variant="outline"
            className="bg-neutral-900 border-neutral-700 text-neutral-200 hover:text-white text-xs rounded-full px-4 py-2 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh All</span>
          </Button>
          <Link
            href="/bmf-club"
            target="_blank"
            className="text-xs font-bold bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-full transition-all flex items-center gap-1.5"
          >
            <span>Live Directory</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setMainTab('showcases')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            mainTab === 'showcases'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white bg-neutral-900/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Founder Showcase Queue ({members.length})</span>
        </button>

        <button
          onClick={() => setMainTab('events')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            mainTab === 'events'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white bg-neutral-900/60'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Events & Retreats Manager ({events.length})</span>
        </button>

        <button
          onClick={() => setMainTab('registrations')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            mainTab === 'registrations'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white bg-neutral-900/60'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Attendee RSVP Applications ({registrations.length})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: FOUNDER SHOWCASE REVIEWS */}
      {/* ========================================================= */}
      {mainTab === 'showcases' && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-full w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setMemberFilter('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  memberFilter === 'all' ? 'bg-white text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All ({members.length})
              </button>
              <button
                onClick={() => setMemberFilter('pending')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  memberFilter === 'pending' ? 'bg-amber-400 text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Pending ({members.filter((m) => (m.review_status || (m.is_approved ? 'approved' : 'pending')) === 'pending').length})
              </button>
              <button
                onClick={() => setMemberFilter('approved')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  memberFilter === 'approved' ? 'bg-emerald-400 text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Approved Live ({members.filter((m) => (m.review_status || (m.is_approved ? 'approved' : 'pending')) === 'approved').length})
              </button>
              <button
                onClick={() => setMemberFilter('rejected')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  memberFilter === 'rejected' ? 'bg-rose-400 text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Revision Needed ({members.filter((m) => m.review_status === 'rejected').length})
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search founders, ventures..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredMembers.map((member) => {
              const status = member.review_status || (member.is_approved ? 'approved' : 'pending')
              const isProcessing = activeMemberActionId === member.id

              return (
                <div
                  key={member.id}
                  className="bg-[#141417] rounded-3xl p-6 border border-neutral-800 shadow-xl flex flex-col md:flex-row gap-6 text-left"
                >
                  <div className="w-full md:w-[240px] shrink-0 mx-auto">
                    <div className="transform scale-[0.85] origin-top md:origin-top-left -mb-10">
                      <MemberFlipCard member={member} />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-4 min-w-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded-full border border-neutral-700">
                          {member.category}
                        </span>
                        {status === 'approved' ? (
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Live
                          </span>
                        ) : status === 'rejected' ? (
                          <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 border border-rose-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Revision
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black text-white">{member.full_name}</h3>
                      <p className="text-xs text-neutral-400 font-mono">
                        {member.role} &bull; <strong className="text-white">{member.company_name}</strong>
                      </p>

                      <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                        "{member.tagline}"
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400 pt-1">
                        <div>🚀 {member.stage}</div>
                        <div>💰 {member.metrics || 'N/A'}</div>
                        <div>📍 {member.location || 'N/A'}</div>
                        <div>👥 {member.team_size || 'N/A'}</div>
                      </div>

                      {member.email && (
                        <p className="text-[11px] font-mono text-neutral-500 truncate">
                          ✉️ {member.email}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center gap-2">
                      {status !== 'approved' && (
                        <Button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleMemberAction(member.id, 'approve')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>Approve & Send Email</span>
                        </Button>
                      )}

                      {status !== 'rejected' && (
                        <Button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => {
                            setRejectModalMember(member)
                            setFeedbackText(
                              member.admin_feedback ||
                              `Dear ${member.full_name},\n\nThank you for submitting ${member.company_name} to the BMF Club Showcase. Before we can publish your card live to the directory, please update:\n1. Provide a higher resolution vertical portrait image.\n2. Clarify your current annual revenue / pilot contracts in the traction metrics section.\n\nYou can log back into your Founder Studio to edit and re-submit for expedited review.`
                            )
                          }}
                          className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs px-4 py-2 rounded-full border border-rose-500/30 inline-flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Request Revision</span>
                        </Button>
                      )}

                      <Button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleMemberAction(member.id, 'toggle_verify')}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          member.is_verified
                            ? 'bg-sky-950/60 border-sky-700 text-sky-300'
                            : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                        }`}
                      >
                        <span>Verified: {member.is_verified ? 'Yes' : 'No'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: EVENTS & RETREATS MANAGER */}
      {/* ========================================================= */}
      {mainTab === 'events' && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Private Events & Masterminds</h2>
              <p className="text-xs text-neutral-400">
                Configure calendar dates, seat limits, and internal forms vs external registration links.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => {
                setEventForm({
                  title: '',
                  tagline: '',
                  description: '',
                  event_date: '',
                  event_time: '6:30 PM - 9:30 PM IST',
                  location_type: 'in_person',
                  location_venue: '',
                  location_city: 'Bangalore',
                  category: 'Closed-Door Dinner',
                  total_capacity: 18,
                  registered_count: 0,
                  is_published: true,
                  status: 'upcoming',
                  cta_type: 'internal_form',
                  external_cta_url: '',
                  external_cta_text: 'Request Invitation',
                  pricing_type: 'members_only',
                  price_inr: 0,
                  requirements: '',
                })
                setIsEventModalOpen(true)
              }}
              className="bg-white hover:bg-neutral-200 text-black px-5 py-2.5 rounded-full font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Gathering</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const isFull = event.total_capacity > 0 && event.registered_count >= event.total_capacity

              return (
                <div
                  key={event.id}
                  className="bg-[#141417] rounded-3xl p-6 border border-neutral-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold bg-neutral-800 text-sky-300 px-2.5 py-0.5 rounded-full border border-neutral-700">
                        {event.category}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        event.is_published
                          ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                      }`}>
                        {event.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white line-clamp-2">{event.title}</h3>
                    {event.tagline && (
                      <p className="text-xs text-neutral-400 line-clamp-2">{event.tagline}</p>
                    )}

                    <div className="space-y-1.5 text-xs font-mono text-neutral-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{event.event_date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{event.location_venue || event.location_city}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Users className="w-3.5 h-3.5" />
                        <span>{event.registered_count} / {event.total_capacity || 'Unlimited'} Seats Filled</span>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800 text-[11px] font-mono space-y-1">
                      <div className="text-neutral-400">CTA Routing: <strong className="text-white">{event.cta_type === 'external_link' ? 'External Link' : 'Internal RSVP Form'}</strong></div>
                      {event.cta_type === 'external_link' && event.external_cta_url && (
                        <div className="text-sky-400 truncate">{event.external_cta_url}</div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEventForm(event)
                        setIsEventModalOpen(true)
                      }}
                      className="text-xs text-neutral-300 hover:text-white px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 hover:border-neutral-500 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 p-2 transition-colors cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: EVENT ATTENDEE RSVPs */}
      {/* ========================================================= */}
      {mainTab === 'registrations' && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Attendee RSVP Applications</h2>
              <p className="text-xs text-neutral-400">
                Review registrations, confirm seat passes, or manage waitlists with automated email tickets.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400">Filter Event:</span>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white"
              >
                <option value="all">All Events ({registrations.length})</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredRegistrations.length === 0 ? (
              <div className="bg-[#141417] rounded-3xl p-12 border border-neutral-800 text-center space-y-3">
                <Ticket className="w-10 h-10 text-neutral-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Registrations Yet</h3>
                <p className="text-xs text-neutral-400">
                  Applications will show up here as soon as founders RSVP from the events section.
                </p>
              </div>
            ) : (
              filteredRegistrations.map((reg) => {
                const isProcessing = activeRegActionId === reg.id
                return (
                  <div
                    key={reg.id}
                    className="bg-[#141417] rounded-3xl p-6 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-neutral-700 transition-colors text-left"
                  >
                    <div className="space-y-2 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-sky-400">
                          {reg.event?.title || 'Private Event'}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                          reg.status === 'approved'
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                            : reg.status === 'waitlisted'
                            ? 'bg-amber-950/80 border-amber-700 text-amber-400'
                            : reg.status === 'rejected'
                            ? 'bg-rose-950/80 border-rose-700 text-rose-400'
                            : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                        }`}>
                          {reg.status.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-white">{reg.full_name}</h3>
                      <p className="text-xs text-neutral-400 font-mono">
                        {reg.role} &bull; <strong className="text-white">{reg.company_name}</strong>
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 pt-1">
                        <span>✉️ {reg.email}</span>
                        {reg.phone && <span>📱 {reg.phone}</span>}
                        {reg.ticket_code && <span className="text-sky-300 font-bold">🎟️ Pass: {reg.ticket_code}</span>}
                      </div>

                      {reg.notes && (
                        <p className="text-xs text-neutral-300 bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                          "{reg.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {reg.status !== 'approved' && (
                        <Button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleRegistrationAction(reg.id, 'approve')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-4 py-2 rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>Confirm Seat Pass</span>
                        </Button>
                      )}

                      {reg.status !== 'waitlisted' && (
                        <Button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleRegistrationAction(reg.id, 'waitlist')}
                          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs px-3.5 py-2 rounded-full border border-amber-500/30 cursor-pointer"
                        >
                          <span>Move to Waitlist</span>
                        </Button>
                      )}

                      {reg.status !== 'rejected' && (
                        <Button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleRegistrationAction(reg.id, 'reject')}
                          className="text-neutral-500 hover:text-rose-400 text-xs px-3 py-2 cursor-pointer"
                        >
                          <span>Decline</span>
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Modal: Create/Edit Event */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#161619] border border-neutral-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl text-left my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h3 className="text-xl font-bold text-white">
                {eventForm.id ? 'Edit Event Gathering' : 'Create New Event Gathering'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEventModalOpen(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral-300">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bangalore Elite Founders Dinner"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral-300">1-Line Hook / Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Private 18-seat founder dinner with venture partners"
                    value={eventForm.tagline}
                    onChange={(e) => setEventForm({ ...eventForm, tagline: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Event Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  >
                    <option value="Closed-Door Dinner">Closed-Door Dinner</option>
                    <option value="Mastermind">Mastermind</option>
                    <option value="Private Retreat">Private Retreat</option>
                    <option value="Virtual Syndicate">Virtual Syndicate</option>
                    <option value="Demo Day">Demo Day</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Date String *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. March 28, 2026"
                    value={eventForm.event_date}
                    onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Time Range</label>
                  <input
                    type="text"
                    placeholder="e.g. 6:30 PM - 9:30 PM IST"
                    value={eventForm.event_time}
                    onChange={(e) => setEventForm({ ...eventForm, event_time: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Seat Capacity Limit</label>
                  <input
                    type="number"
                    placeholder="e.g. 18"
                    value={eventForm.total_capacity || ''}
                    onChange={(e) => setEventForm({ ...eventForm, total_capacity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral-300">Venue & City</label>
                  <input
                    type="text"
                    placeholder="e.g. The Leela Palace, Indiranagar, Bangalore"
                    value={eventForm.location_venue}
                    onChange={(e) => setEventForm({ ...eventForm, location_venue: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                {/* CTA Routing Settings */}
                <div className="space-y-1 sm:col-span-2 p-4 bg-neutral-900/90 rounded-2xl border border-neutral-800">
                  <label className="text-xs font-bold text-white block mb-2">Registration Flow & CTA Routing</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-neutral-400">CTA Flow Type</label>
                      <select
                        value={eventForm.cta_type}
                        onChange={(e) => setEventForm({ ...eventForm, cta_type: e.target.value as any })}
                        className="w-full bg-black border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white mt-1"
                      >
                        <option value="internal_form">Internal RSVP Form (Platform Database)</option>
                        <option value="external_link">External Link / Form (Luma, Google Form, etc.)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400">Button Label</label>
                      <input
                        type="text"
                        placeholder="e.g. Request Invitation or Apply via Lu.ma"
                        value={eventForm.external_cta_text}
                        onChange={(e) => setEventForm({ ...eventForm, external_cta_text: e.target.value })}
                        className="w-full bg-black border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white mt-1"
                      />
                    </div>
                  </div>

                  {eventForm.cta_type === 'external_link' && (
                    <div className="pt-2">
                      <label className="text-[11px] text-neutral-400">External URL Link *</label>
                      <input
                        type="url"
                        placeholder="https://lu.ma/your-event or https://forms.google.com/..."
                        value={eventForm.external_cta_url}
                        onChange={(e) => setEventForm({ ...eventForm, external_cta_url: e.target.value })}
                        className="w-full bg-black border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white mt-1"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral-300">Admission Criteria / Requirements</label>
                  <input
                    type="text"
                    placeholder="e.g. Post-Revenue Founders ($200k+ ARR or $1M+ Raised)"
                    value={eventForm.requirements}
                    onChange={(e) => setEventForm({ ...eventForm, requirements: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={isSavingEvent}
                  className="bg-white hover:bg-neutral-200 text-black font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer"
                >
                  {isSavingEvent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Event Gathering</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Showcase Rejection / Revision */}
      {rejectModalMember && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#161619] border border-neutral-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl text-left">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                Request Revisions for {rejectModalMember.company_name}
              </h3>
              <p className="text-xs text-neutral-400">
                This message will be dispatched directly to <strong>{rejectModalMember.email || rejectModalMember.full_name}</strong> via Resend.
              </p>
            </div>

            <textarea
              rows={6}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white font-mono leading-relaxed"
              placeholder="Provide specific instructions..."
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalMember(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <Button
                type="button"
                disabled={isSendingFeedback || !feedbackText.trim()}
                onClick={() => {
                  setIsSendingFeedback(true)
                  handleMemberAction(rejectModalMember.id, 'reject', feedbackText)
                }}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer"
              >
                {isSendingFeedback ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Send Feedback Email</span>
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
