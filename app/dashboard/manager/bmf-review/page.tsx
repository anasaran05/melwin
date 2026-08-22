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
import {
  BmfCard,
  CardTier,
  CARD_TIERS,
  fetchAllCardsForAdmin
} from '@/lib/supabase/bmf-cards'
import { MemberFlipCard } from '@/components/bmf-club/member-flip-card'
import { ExecutiveMetalCard } from '@/components/bmf-club/executive-metal-card'
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
  Ticket,
  CreditCard,
  Lock,
  Zap,
  Eye,
  Award,
  ShieldAlert
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BmfAdminReviewPage() {
  const [mainTab, setMainTab] = useState<'showcases' | 'events' | 'registrations' | 'cards'>('showcases')

  // Showcase Members State
  const [members, setMembers] = useState<BmfMember[]>(INITIAL_BMF_MEMBERS)
  const [memberFilter, setMemberFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [memberSearch, setMemberSearch] = useState('')
  const [activeMemberActionId, setActiveMemberActionId] = useState<string | null>(null)

  // Feedback Rejection Modal
  const [rejectModalMember, setRejectModalMember] = useState<BmfMember | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)

  // Executive Pass Cards State
  const [cards, setCards] = useState<BmfCard[]>([])
  const [cardFilter, setCardFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [cardSearch, setCardSearch] = useState('')
  const [activeCardActionId, setActiveCardActionId] = useState<string | null>(null)
  const [previewCard, setPreviewCard] = useState<BmfCard | null>(null)
  const [rejectModalCard, setRejectModalCard] = useState<BmfCard | null>(null)
  const [cardRejectFeedback, setCardRejectFeedback] = useState('')

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
      const [membersData, eventsData, regData, cardsData] = await Promise.all([
        fetchAllMembersForAdmin(),
        fetchAllEventsForAdmin(),
        fetchEventRegistrations(),
        fetchAllCardsForAdmin(),
      ])
      setMembers(membersData)
      setEvents(eventsData)
      setRegistrations(regData)
      setCards(cardsData)
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
  const handleMemberAction = async (
    memberId: string, 
    action: 'approve' | 'reject' | 'toggle_verify' | 'toggle_featured' | 'set_priority', 
    feedback?: string,
    priorityOrder?: number
  ) => {
    setActiveMemberActionId(memberId)
    try {
      const res = await fetch('/api/bmf/admin-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, action, feedback, priority_order: priorityOrder }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setMembers((prev) => {
          const updated = prev.map((m) => {
            if (m.id !== memberId) return m
            if (action === 'approve') return { ...m, is_approved: true, review_status: 'approved' as const, admin_feedback: null }
            if (action === 'reject') return { ...m, is_approved: false, review_status: 'rejected' as const, admin_feedback: feedback || null }
            if (action === 'toggle_verify') return { ...m, is_verified: !m.is_verified }
            if (action === 'toggle_featured') return { ...m, is_featured: !m.is_featured }
            if (action === 'set_priority') return { ...m, priority_order: priorityOrder }
            return m
          })
          return updated.sort((a, b) => (a.priority_order ?? 100) - (b.priority_order ?? 100))
        })
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

  // Pass Card actions
  const handleCardAction = async (cardId: string, action: 'approve' | 'reject' | 'set_tier' | 'toggle_active', feedback?: string, tier?: CardTier) => {
    setActiveCardActionId(cardId)
    try {
      const res = await fetch('/api/bmf/admin-card-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, action, feedback, tier }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setCards((prev) =>
          prev.map((c) => {
            if (c.id !== cardId) return c
            if (action === 'approve') return { ...c, approval_status: 'approved', is_active: true, admin_feedback: undefined }
            if (action === 'reject') return { ...c, approval_status: 'rejected', is_active: false, admin_feedback: feedback }
            if (action === 'set_tier' && tier) return { ...c, card_tier: tier, tier_perks: CARD_TIERS[tier].perks }
            if (action === 'toggle_active') return { ...c, is_active: !c.is_active }
            return c
          })
        )
        if (previewCard && previewCard.id === cardId) {
          setPreviewCard((prev) => prev ? {
            ...prev,
            approval_status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : prev.approval_status,
            is_active: action === 'approve' ? true : action === 'reject' ? false : prev.is_active,
            card_tier: (action === 'set_tier' && tier) ? tier : prev.card_tier,
          } : null)
        }
      } else {
        alert(data.error || 'Card action failed.')
      }
    } catch (err: any) {
      alert(err.message || 'Card action error.')
    } finally {
      setActiveCardActionId(null)
      setRejectModalCard(null)
      setCardRejectFeedback('')
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

  const filteredCards = cards.filter((c) => {
    const status = c.approval_status || (c.is_active ? 'approved' : 'pending')
    const matchesFilter = cardFilter === 'all' || status === cardFilter
    const q = cardSearch.toLowerCase()
    return matchesFilter && (
      c.card_holder_name.toLowerCase().includes(q) ||
      c.company_name.toLowerCase().includes(q) ||
      c.card_tier.toLowerCase().includes(q)
    )
  })

  const filteredRegistrations = registrations.filter((r) => {
    return selectedEventId === 'all' || r.event_id === selectedEventId
  })

  const pendingCardCount = cards.filter((c) => c.approval_status === 'pending').length

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
            Moderate showcase directory cards, approve bespoke metal passes, publish private dinners, and manage RSVP passes.
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
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            mainTab === 'showcases'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white bg-neutral-900/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Founder Showcase Queue ({members.length})</span>
        </button>

        <button
          onClick={() => setMainTab('cards')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            mainTab === 'cards'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white bg-neutral-900/60'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Executive Pass Cards ({cards.length})</span>
          {pendingCardCount > 0 && (
            <span className="bg-amber-500 text-black text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
              {pendingCardCount} new
            </span>
          )}
        </button>

        <button
          onClick={() => setMainTab('events')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
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
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
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
                Needs Revisions ({members.filter((m) => (m.review_status || (m.is_approved ? 'approved' : 'pending')) === 'rejected').length})
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by founder, company, email..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full bg-neutral-900/80 border border-neutral-700/80 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          {/* Members Showcase Queue Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => {
              const status = member.review_status || (member.is_approved ? 'approved' : 'pending')
              const isActionRunning = activeMemberActionId === member.id

              return (
                <div
                  key={member.id}
                  className="bg-[#141418] border border-neutral-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between shadow-lg relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Header with status badge */}
                    <div className="flex items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        status === 'approved'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                          : status === 'rejected'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                          : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                      }`}>
                        {status === 'approved' ? 'Live on Directory' : status === 'rejected' ? 'Revision Requested' : 'Pending Review'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {member.is_verified && (
                          <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-800/50">
                            Verified
                          </span>
                        )}
                        {member.is_featured && (
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/50">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-800 border border-white/10 shrink-0">
                        <img
                          src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'}
                          alt={member.full_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="text-sm font-bold text-white truncate">{member.full_name}</h3>
                        <p className="text-xs text-neutral-400 truncate">{member.role} @ <strong className="text-neutral-200">{member.company_name}</strong></p>
                        <span className="text-[10px] font-mono text-neutral-500">{member.category}</span>
                      </div>
                    </div>

                    {/* Tagline / Pitch */}
                    <p className="text-xs text-neutral-300 bg-black/40 p-3 rounded-xl border border-neutral-800/80 line-clamp-2">
                      &ldquo;{member.tagline}&rdquo;
                    </p>

                    {/* Metrics / Stage */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400">
                      <div>Stage: <strong className="text-neutral-200">{member.stage || 'N/A'}</strong></div>
                      <div>Traction: <strong className="text-emerald-400">{member.metrics || 'Active'}</strong></div>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-4 border-t border-neutral-800/80 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {status !== 'approved' ? (
                        <Button
                          type="button"
                          disabled={isActionRunning}
                          onClick={() => handleMemberAction(member.id, 'approve')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs py-2 rounded-full flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Go Live</span>
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          disabled={isActionRunning}
                          onClick={() => handleMemberAction(member.id, 'reject', 'Showcase paused by administrator.')}
                          className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs py-2 rounded-full flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Pause / Unpublish</span>
                        </Button>
                      )}

                      <Button
                        type="button"
                        disabled={isActionRunning}
                        onClick={() => {
                          setRejectModalMember(member)
                          setFeedbackText(member.admin_feedback || 'Please update your metrics and high-res portrait.')
                        }}
                        className="bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/60 text-rose-300 text-xs py-2 rounded-full flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Send Feedback</span>
                      </Button>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                      <button
                        type="button"
                        onClick={() => handleMemberAction(member.id, 'toggle_verify')}
                        className={`hover:underline cursor-pointer ${member.is_verified ? 'text-sky-400' : 'text-neutral-500'}`}
                      >
                        {member.is_verified ? '✓ Verified Badge' : '+ Verify Founder'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMemberAction(member.id, 'toggle_featured')}
                        className={`hover:underline cursor-pointer ${member.is_featured ? 'text-amber-400' : 'text-neutral-500'}`}
                      >
                        {member.is_featured ? '★ Featured Spotlight' : '+ Spotlight'}
                      </button>
                    </div>

                    {/* Priority & Top Lineup Controls */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-neutral-800/60 text-[11px] font-mono">
                      <button
                        type="button"
                        onClick={() => handleMemberAction(member.id, 'set_priority', undefined, member.priority_order === 1 ? 100 : 1)}
                        className={`hover:underline cursor-pointer flex items-center gap-1 ${member.priority_order === 1 ? 'text-amber-300 font-bold' : 'text-neutral-400'}`}
                      >
                        <span>{member.priority_order === 1 ? '👑 Pinned #1 (Top)' : '📌 Pin to #1'}</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <span className="text-[10px]">Rank:</span>
                        <select
                          value={member.priority_order ?? 100}
                          onChange={(e) => handleMemberAction(member.id, 'set_priority', undefined, Number(e.target.value))}
                          className="bg-neutral-900 border border-neutral-700 text-white rounded px-2 py-0.5 text-[10px] cursor-pointer"
                        >
                          <option value={1}>#1 (President / Top)</option>
                          <option value={2}>#2</option>
                          <option value={3}>#3</option>
                          <option value={4}>#4</option>
                          <option value={5}>#5</option>
                          <option value={100}>Default (100)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: EXECUTIVE PASS CARD APPLICATIONS */}
      {/* ========================================================= */}
      {mainTab === 'cards' && (
        <div className="space-y-6 text-left animate-in fade-in-0 duration-300">
          
          {/* Sub Header & Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#141418] border border-neutral-800">
              <span className="text-[10px] font-mono uppercase text-neutral-500">Total Pass Records</span>
              <p className="text-xl font-bold text-white mt-1">{cards.length}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141418] border border-amber-500/30">
              <span className="text-[10px] font-mono uppercase text-amber-400">Pending Review</span>
              <p className="text-xl font-bold text-amber-300 mt-1">{pendingCardCount}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141418] border border-emerald-500/30">
              <span className="text-[10px] font-mono uppercase text-emerald-400">Active Live Passes</span>
              <p className="text-xl font-bold text-emerald-300 mt-1">
                {cards.filter((c) => c.approval_status === 'approved' || c.is_active).length}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141418] border border-rose-500/30">
              <span className="text-[10px] font-mono uppercase text-rose-400">Rejected / Revisions</span>
              <p className="text-xl font-bold text-rose-300 mt-1">
                {cards.filter((c) => c.approval_status === 'rejected').length}
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-full w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setCardFilter('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  cardFilter === 'all' ? 'bg-white text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All ({cards.length})
              </button>
              <button
                onClick={() => setCardFilter('pending')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  cardFilter === 'pending' ? 'bg-amber-400 text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Pending Review ({cards.filter((c) => c.approval_status === 'pending').length})
              </button>
              <button
                onClick={() => setCardFilter('approved')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  cardFilter === 'approved' ? 'bg-emerald-400 text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Live & Unlocked ({cards.filter((c) => c.approval_status === 'approved' || c.is_active).length})
              </button>
              <button
                onClick={() => setCardFilter('rejected')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  cardFilter === 'rejected' ? 'bg-rose-400 text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Rejected ({cards.filter((c) => c.approval_status === 'rejected').length})
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search cardholders, tiers, ventures..."
                value={cardSearch}
                onChange={(e) => setCardSearch(e.target.value)}
                className="w-full bg-neutral-900/80 border border-neutral-700/80 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          {/* Card Applications List */}
          {filteredCards.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#141418] border border-neutral-800 text-center space-y-3">
              <CreditCard className="w-10 h-10 text-neutral-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Pass Card Applications Found</h3>
              <p className="text-xs text-neutral-400">
                Applications submitted by founders from their studio dashboard will appear here for review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((c) => {
                const status = c.approval_status || (c.is_active ? 'approved' : 'pending')
                const isActionRunning = activeCardActionId === c.id
                const meta = CARD_TIERS[c.card_tier] || CARD_TIERS.obsidian

                return (
                  <div
                    key={c.id}
                    className="bg-[#141418] border border-neutral-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between shadow-lg relative overflow-hidden text-left"
                  >
                    <div className="space-y-4">
                      {/* Header with status badge */}
                      <div className="flex items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                          status === 'approved'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                            : status === 'rejected'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                            : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                        }`}>
                          {status === 'approved' ? 'Live & Unlocked' : status === 'rejected' ? 'Rejected' : 'Pending Review'}
                        </span>

                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${meta.colorBadge}`}>
                          {meta.name}
                        </span>
                      </div>

                      {/* Cardholder & Company */}
                      <div>
                        <h3 className="text-sm font-bold text-white truncate">{c.card_holder_name}</h3>
                        <p className="text-xs text-neutral-400 truncate">{c.company_name}</p>
                        <p className="text-[10px] font-mono text-neutral-500 mt-0.5">UID: {c.nfc_uid}</p>
                      </div>

                      {/* Application Data if Available */}
                      {c.application_data && (
                        <div className="p-3 bg-black/50 rounded-xl border border-neutral-800/80 space-y-1.5 text-xs">
                          {c.application_data.traction_metric && (
                            <div className="text-neutral-300">
                              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Traction:</span>
                              <strong className="text-emerald-400">{c.application_data.traction_metric}</strong>
                            </div>
                          )}
                          {c.application_data.pitch_tagline && (
                            <div className="text-neutral-300 line-clamp-2 italic">
                              &ldquo;{c.application_data.pitch_tagline}&rdquo;
                            </div>
                          )}
                          {c.application_data.why_join && (
                            <div className="text-neutral-400 text-[11px] line-clamp-2 pt-1 border-t border-neutral-800">
                              <span className="text-[9px] font-mono uppercase text-neutral-500 block">Why Join:</span>
                              {c.application_data.why_join}
                            </div>
                          )}
                          {c.application_data.portfolio_or_linkedin && (
                            <a
                              href={c.application_data.portfolio_or_linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-sky-400 hover:underline pt-1"
                            >
                              <span>Founder Profile</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}

                      {/* Rejection feedback if existing */}
                      {c.admin_feedback && (
                        <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/50 text-[11px] text-rose-300">
                          <strong>Feedback:</strong> {c.admin_feedback}
                        </div>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="pt-4 border-t border-neutral-800/80 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {status !== 'approved' ? (
                          <Button
                            type="button"
                            disabled={isActionRunning}
                            onClick={() => handleCardAction(c.id, 'approve')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs py-2 rounded-full flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Unlock</span>
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            disabled={isActionRunning}
                            onClick={() => handleCardAction(c.id, 'reject', 'Pass locked by administrator.')}
                            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs py-2 rounded-full flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Lock / Revoke</span>
                          </Button>
                        )}

                        <Button
                          type="button"
                          disabled={isActionRunning}
                          onClick={() => {
                            setRejectModalCard(c)
                            setCardRejectFeedback(c.admin_feedback || 'Your venture traction does not currently meet syndicate thresholds.')
                          }}
                          className="bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/60 text-rose-300 text-xs py-2 rounded-full flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Reject / Notes</span>
                        </Button>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => setPreviewCard(c)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-sky-400" />
                          <span>3D Card Preview</span>
                        </button>

                        <select
                          value={c.card_tier}
                          onChange={(e) => handleCardAction(c.id, 'set_tier', undefined, e.target.value as CardTier)}
                          className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-0.5 text-[10px] font-mono text-neutral-300"
                        >
                          {(Object.keys(CARD_TIERS) as CardTier[]).map((t) => (
                            <option key={t} value={t}>{t.toUpperCase()}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: EVENTS & RETREATS MANAGER */}
      {/* ========================================================= */}
      {mainTab === 'events' && (
        <div className="space-y-6 text-left animate-in fade-in-0 duration-300">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Curated Founder Gatherings & Dinners</h2>
              <p className="text-xs text-neutral-400">Publish closed-door masterminds and route CTAs internally or externally.</p>
            </div>

            <Button
              onClick={() => setIsEventModalOpen(true)}
              className="bg-white hover:bg-neutral-200 text-black text-xs font-bold px-4 py-2 rounded-full inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish Gathering</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-[#141418] border border-neutral-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase bg-sky-950/80 text-sky-400 px-2.5 py-0.5 rounded-full border border-sky-800/60 font-bold">
                      {event.category}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">{event.event_date}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{event.title}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">{event.tagline || event.description}</p>
                  
                  <div className="pt-2 text-xs font-mono text-neutral-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{event.location_city} ({event.location_venue || 'Private Venue'})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Capacity: {event.total_capacity || 18} Founders &bull; {event.registered_count || 0} Registered</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-500">CTA: {event.cta_type}</span>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: RSVP ATTENDEES */}
      {/* ========================================================= */}
      {mainTab === 'registrations' && (
        <div className="space-y-6 text-left animate-in fade-in-0 duration-300">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Attendee RSVP Approvals</h2>
              <p className="text-xs text-neutral-400">Review and approve admission passes for closed-door mastermind dinners.</p>
            </div>

            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white"
            >
              <option value="all">All Events ({registrations.length})</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {filteredRegistrations.map((reg) => (
              <div key={reg.id} className="p-4 rounded-2xl bg-[#141418] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{reg.full_name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                      {reg.company_name || 'Founder'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">
                    {reg.email} &bull; {reg.phone || 'No phone'}
                  </p>
                  {reg.notes && (
                    <p className="text-xs text-neutral-300 italic pt-1">
                      &ldquo;{reg.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => handleRegistrationAction(reg.id, 'approve')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-4 py-1.5 rounded-full cursor-pointer"
                  >
                    Approve Pass
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleRegistrationAction(reg.id, 'reject')}
                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs px-4 py-1.5 rounded-full cursor-pointer"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3D METAL CARD PREVIEW MODAL */}
      {/* ========================================================= */}
      {previewCard && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-neutral-700 rounded-3xl p-6 sm:p-10 max-w-2xl w-full space-y-6 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 text-left">
              <div>
                <h3 className="text-lg font-bold text-white">{previewCard.card_holder_name}</h3>
                <p className="text-xs text-neutral-400">{previewCard.company_name} &bull; {previewCard.card_tier.toUpperCase()} TIER</p>
              </div>
              <button onClick={() => setPreviewCard(null)} className="p-2 text-neutral-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center py-4">
              <ExecutiveMetalCard card={previewCard} />
            </div>

            <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
              <div className="text-left text-xs font-mono text-neutral-400">
                Status: <strong className="text-white uppercase">{previewCard.approval_status || 'pending'}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewCard(null)}
                  className="text-xs text-neutral-400 hover:text-white px-4 py-2"
                >
                  Close
                </button>
                <Button
                  type="button"
                  onClick={() => handleCardAction(previewCard.id, 'approve')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-6 py-2 rounded-full cursor-pointer"
                >
                  Approve & Go Live
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CARD REJECTION / FEEDBACK MODAL */}
      {/* ========================================================= */}
      {rejectModalCard && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-neutral-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl text-left animate-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                Reject / Request Revisions for {rejectModalCard.card_holder_name}
              </h3>
              <p className="text-xs text-neutral-400">
                Provide constructive feedback explaining why this pass is not currently approved.
              </p>
            </div>

            <textarea
              rows={5}
              value={cardRejectFeedback}
              onChange={(e) => setCardRejectFeedback(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white font-mono"
              placeholder="Explain required traction or syndicate alignment..."
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalCard(null)}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={() => handleCardAction(rejectModalCard.id, 'reject', cardRejectFeedback)}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-full cursor-pointer"
              >
                Send Rejection Feedback
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CREATE EVENT MODAL */}
      {/* ========================================================= */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121216] border border-neutral-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl text-left my-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h3 className="text-lg font-bold text-white">Publish New Founder Gathering</h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-neutral-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral-300">Gathering Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Infra Closed-Door Dinner"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Event Date *</label>
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
                  <label className="text-xs font-semibold text-neutral-300">City / Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bangalore (Indiranagar)"
                    value={eventForm.location_city}
                    onChange={(e) => setEventForm({ ...eventForm, location_city: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Event Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the format, focus areas, and attendees..."
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white resize-none"
                />
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
                  <span>Publish Gathering</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SHOWCASE REJECTION MODAL */}
      {/* ========================================================= */}
      {rejectModalMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#161619] border border-neutral-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl text-left">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                Request Revisions for {rejectModalMember.company_name}
              </h3>
              <p className="text-xs text-neutral-400">
                This message will be dispatched directly to <strong>{rejectModalMember.email || rejectModalMember.full_name}</strong>.
              </p>
            </div>

            <textarea
              rows={5}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white font-mono"
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
