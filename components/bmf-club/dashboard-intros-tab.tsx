'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Handshake, 
  Mail, 
  Phone, 
  Linkedin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Building2, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  UserCheck
} from 'lucide-react'
import { BmfIntroRequest, fetchReceivedIntros, fetchSentIntros } from '@/lib/supabase/bmf-intros'
import { BmfMember } from '@/lib/supabase/bmf-members'

interface DashboardIntrosTabProps {
  profile: BmfMember
  userEmail: string
}

export function DashboardIntrosTab({ profile, userEmail }: DashboardIntrosTabProps) {
  const [subTab, setSubTab] = useState<'received' | 'sent'>('received')
  const [receivedIntros, setReceivedIntros] = useState<BmfIntroRequest[]>([])
  const [sentIntros, setSentIntros] = useState<BmfIntroRequest[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null)

  const loadIntros = async () => {
    setIsLoading(true)
    try {
      const [recv, sent] = await Promise.all([
        fetchReceivedIntros(profile.id, userEmail),
        fetchSentIntros(userEmail),
      ])
      setReceivedIntros(recv)
      setSentIntros(sent)
    } catch (err) {
      console.error('Failed to load intros:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadIntros()
  }, [profile.id, userEmail])

  const handleRespond = async (requestId: string, action: 'accepted' | 'declined') => {
    setActionLoadingId(requestId)
    setFeedbackSuccess(null)
    try {
      const res = await fetch('/api/bmf/respond-intro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          action,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update intro request')

      // Update local state
      setReceivedIntros((prev) =>
        prev.map((item) => (item.id === requestId ? { ...item, status: action } : item))
      )
      setFeedbackSuccess(
        action === 'accepted'
          ? '🎉 Introduction Accepted! A warm email connecting both of you has been sent.'
          : 'Intro request passed.'
      )
      setTimeout(() => setFeedbackSuccess(null), 5000)
    } catch (err: any) {
      console.error('Error responding to intro:', err)
      alert(err.message || 'Failed to process response.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const pendingReceivedCount = receivedIntros.filter((r) => r.status === 'pending').length
  const connectedCount = receivedIntros.filter((r) => r.status === 'accepted').length

  const filteredReceived = receivedIntros.filter((item) => {
    if (filter === 'all') return true
    return item.status === filter
  })

  return (
    <div className="space-y-6 text-left animate-in fade-in-0 duration-300">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-neutral-900 via-[#121216] to-neutral-950 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Handshake className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Warm Intros & Inquiries</h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Private double-opt-in founder connections. Your contact info is only shared when you accept.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadIntros}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-2 border border-white/5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/5 space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Received Inquiries</p>
          <p className="text-2xl font-black text-white">{receivedIntros.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/5 space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400">Pending Review</p>
          <p className="text-2xl font-black text-amber-400">{pendingReceivedCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/5 space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Connected</p>
          <p className="text-2xl font-black text-emerald-400">{connectedCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/5 space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Sent Outbox</p>
          <p className="text-2xl font-black text-white">{sentIntros.length}</p>
        </div>
      </div>

      {feedbackSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackSuccess}</span>
        </motion.div>
      )}

      {/* Main Tabs (Received vs Sent) */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('received')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'received'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Received Intros</span>
            {pendingReceivedCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-mono font-bold">
                {pendingReceivedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab('sent')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'sent'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Sent by Me ({sentIntros.length})</span>
          </button>
        </div>

        {subTab === 'received' && (
          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'pending', 'accepted', 'declined'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg capitalize text-[11px] font-semibold transition-colors cursor-pointer ${
                  filter === f
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      {subTab === 'received' ? (
        <div className="space-y-3">
          {filteredReceived.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-neutral-900/30 border border-white/5 space-y-2">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-500 mx-auto">
                <MessageSquare className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-neutral-300">No {filter !== 'all' ? filter : ''} intro requests yet</p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                When visitors or fellow founders request an introduction through your showcase card, they will appear here.
              </p>
            </div>
          ) : (
            filteredReceived.map((item) => {
              const isPending = item.status === 'pending'
              const isAccepted = item.status === 'accepted'
              const isDeclined = item.status === 'declined'

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-neutral-900/70 border border-white/10 space-y-4 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {item.requester_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{item.requester_name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-semibold">
                            {item.purpose}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">
                          {item.requester_role || 'Founder'} {item.requester_company ? `@ ${item.requester_company}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isPending
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : isAccepted
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Context Quote */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border-l-2 border-emerald-500 text-xs text-neutral-200 italic leading-relaxed">
                    "{item.message}"
                  </div>

                  {/* Revealed Contact Details if Accepted */}
                  {isAccepted && (
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-emerald-400" />
                        <a href={`mailto:${item.requester_email}`} className="text-emerald-400 hover:underline">
                          {item.requester_email}
                        </a>
                      </div>
                      {item.requester_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <a href={`https://wa.me/${item.requester_phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {item.requester_phone} (WhatsApp)
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons for Pending */}
                  {isPending && (
                    <div className="pt-2 flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => handleRespond(item.id, 'accepted')}
                        disabled={actionLoadingId === item.id}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 disabled:opacity-60"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Accept & Exchange Contacts</span>
                      </button>

                      <button
                        onClick={() => handleRespond(item.id, 'declined')}
                        disabled={actionLoadingId === item.id}
                        className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-semibold transition-all border border-white/5 cursor-pointer disabled:opacity-60"
                      >
                        <span>Politely Pass</span>
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      ) : (
        /* Sent Outbox */
        <div className="space-y-3">
          {sentIntros.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-neutral-900/30 border border-white/5 space-y-2">
              <p className="text-sm font-semibold text-neutral-300">You haven't requested any intros yet</p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Browse the member directory and click <strong>Intro ↗</strong> on any verified founder's card to request a warm connection.
              </p>
            </div>
          ) : (
            sentIntros.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      To: {item.target_member_name} ({item.target_member_company})
                    </h4>
                    <p className="text-xs text-neutral-400">Purpose: {item.purpose}</p>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    item.status === 'pending'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : item.status === 'accepted'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] text-xs text-neutral-300 italic">
                  "{item.message}"
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
