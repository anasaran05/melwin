'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { BmfMember } from '@/lib/supabase/bmf-members'
import {
  BmfCard,
  CardTier,
  CARD_TIERS,
  generateCardNumber,
  generateNfcUid,
  adminIssueCard,
} from '@/lib/supabase/bmf-cards'
import { ExecutiveMetalCard } from '@/components/bmf-club/executive-metal-card'
import {
  X,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Check,
  RotateCcw,
  Search,
  Building2,
  User,
  Loader2,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminIssueCardModalProps {
  isOpen: boolean
  onClose: () => void
  members: BmfMember[]
  existingCards?: BmfCard[]
  preselectedMember?: BmfMember | null
  onCardIssued: (card: BmfCard) => void
}

export function AdminIssueCardModal({
  isOpen,
  onClose,
  members,
  existingCards = [],
  preselectedMember = null,
  onCardIssued,
}: AdminIssueCardModalProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('')
  const [isCustomFounder, setIsCustomFounder] = useState<boolean>(false)
  const [memberSearch, setMemberSearch] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

  // Card Form State
  const [holderName, setHolderName] = useState<string>('')
  const [companyName, setCompanyName] = useState<string>('')
  const [selectedTier, setSelectedTier] = useState<CardTier>('obsidian')
  const [cardNumber, setCardNumber] = useState<string>('')
  const [nfcUid, setNfcUid] = useState<string>('')
  const [validThru, setValidThru] = useState<string>('12/28')
  const [memberSince, setMemberSince] = useState<string>('2026')
  const [engraving, setEngraving] = useState<string>('FOUNDING CLASS OF 2026')
  const [tractionMetric, setTractionMetric] = useState<string>('')
  const [pitchTagline, setPitchTagline] = useState<string>('')
  const [isAutoActive, setIsAutoActive] = useState<boolean>(true)

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Initialize or handle preselected member
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null)
      setSuccessMessage(null)
      setCardNumber(generateCardNumber())
      setNfcUid(generateNfcUid())

      if (preselectedMember) {
        applyMemberToForm(preselectedMember)
      } else if (members.length > 0) {
        // Auto-select first member
        applyMemberToForm(members[0])
      } else {
        setIsCustomFounder(true)
        setHolderName('FOUNDER NAME')
        setCompanyName('VENTURE LABS')
      }
    }
  }, [isOpen, preselectedMember])

  const applyMemberToForm = (m: BmfMember) => {
    setSelectedMemberId(m.id)
    setIsCustomFounder(false)
    setHolderName(m.full_name?.toUpperCase() || 'FOUNDER NAME')
    setCompanyName(m.company_name?.toUpperCase() || 'VENTURE LABS')
    setTractionMetric(m.metrics || '')
    setPitchTagline(m.tagline || m.description || '')

    // If member already has a card, inherit its tier if available
    const existing = existingCards.find((c) => c.member_id === m.id || c.user_id === m.user_id)
    if (existing) {
      setSelectedTier(existing.card_tier || 'obsidian')
      if (existing.card_number) setCardNumber(existing.card_number)
      if (existing.nfc_uid) setNfcUid(existing.nfc_uid)
      if (existing.valid_thru) setValidThru(existing.valid_thru)
      if (existing.member_since) setMemberSince(existing.member_since)
      if (existing.card_customization?.engraving) setEngraving(existing.card_customization.engraving)
    }
  }

  // Filter members list for search
  const filteredMembers = useMemo(() => {
    if (!memberSearch.trim()) return members
    const query = memberSearch.toLowerCase()
    return members.filter(
      (m) =>
        m.full_name?.toLowerCase().includes(query) ||
        m.company_name?.toLowerCase().includes(query) ||
        m.category?.toLowerCase().includes(query)
    )
  }, [members, memberSearch])

  // Constructed BmfCard object for real-time live preview
  const livePreviewCard: BmfCard = useMemo(() => {
    const selectedMember = members.find((m) => m.id === selectedMemberId)
    return {
      id: selectedMemberId ? `card-${selectedMemberId}` : 'card-preview',
      member_id: selectedMemberId || undefined,
      user_id: selectedMember?.user_id || null,
      card_number: cardNumber || '4592  8820  1234  5678',
      card_tier: selectedTier,
      card_holder_name: holderName || 'FOUNDER NAME',
      company_name: companyName || 'VENTURE LABS',
      valid_thru: validThru || '12/28',
      member_since: memberSince || '2026',
      nfc_uid: nfcUid || 'BMF-NFC-88291',
      is_active: isAutoActive,
      approval_status: isAutoActive ? 'approved' : 'pending',
      tier_perks: CARD_TIERS[selectedTier]?.perks || CARD_TIERS.obsidian.perks,
      card_customization: {
        engraving: engraving || undefined,
      },
      application_data: (tractionMetric || pitchTagline) ? {
        requested_tier: selectedTier,
        traction_metric: tractionMetric,
        pitch_tagline: pitchTagline,
        why_join: 'Issued directly by administrator.',
        applied_at: new Date().toISOString(),
      } : undefined,
    }
  }, [
    selectedMemberId,
    members,
    cardNumber,
    selectedTier,
    holderName,
    companyName,
    validThru,
    memberSince,
    nfcUid,
    isAutoActive,
    engraving,
    tractionMetric,
    pitchTagline,
  ])

  const handleRandomizeCardNumber = () => {
    setCardNumber(generateCardNumber())
  }

  const handleRandomizeNfc = () => {
    setNfcUid(generateNfcUid())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!holderName.trim() || !companyName.trim()) {
      setErrorMessage('Cardholder Name and Company Name are required.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const selectedMember = members.find((m) => m.id === selectedMemberId)
      const payload: Partial<BmfCard> = {
        member_id: selectedMemberId || undefined,
        user_id: selectedMember?.user_id || undefined,
        card_holder_name: holderName.trim().toUpperCase(),
        company_name: companyName.trim().toUpperCase(),
        card_tier: selectedTier,
        card_number: cardNumber.trim(),
        nfc_uid: nfcUid.trim(),
        valid_thru: validThru.trim(),
        member_since: memberSince.trim(),
        is_active: isAutoActive,
        approval_status: isAutoActive ? 'approved' : 'pending',
        tier_perks: CARD_TIERS[selectedTier]?.perks || CARD_TIERS.obsidian.perks,
        card_customization: {
          engraving: engraving.trim() || undefined,
        },
        application_data: (tractionMetric || pitchTagline) ? {
          requested_tier: selectedTier,
          traction_metric: tractionMetric.trim(),
          pitch_tagline: pitchTagline.trim(),
          why_join: 'Issued directly by administrator.',
          applied_at: new Date().toISOString(),
        } : undefined,
      }

      const res = await adminIssueCard(payload)

      if (res.success && res.card) {
        setSuccessMessage(`Executive Pass Card successfully granted to ${res.card.card_holder_name}!`)
        onCardIssued(res.card)
        setTimeout(() => {
          onClose()
        }, 1200)
      } else {
        setErrorMessage(res.error || 'Failed to issue pass card.')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while issuing pass.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in-0 duration-200">
      <div
        className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col my-auto relative text-neutral-100 max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Issue Executive Metal Pass
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Admin Pass Creator
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Grant bespoke metal NFC card access to BMF Club founders with live privileges.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2-Column Responsive Layout */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT FORM COLUMN (7 Cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            
            {/* Status alerts */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2.5">
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}

            {/* 1. Founder Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>01. Assign to BMF Founder</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomFounder(!isCustomFounder)
                    if (!isCustomFounder) {
                      setSelectedMemberId('')
                      setHolderName('')
                      setCompanyName('')
                    }
                  }}
                  className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer"
                >
                  {isCustomFounder ? '← Choose from Directory' : '+ Custom Founder'}
                </button>
              </div>

              {!isCustomFounder ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full p-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-left flex items-center justify-between transition-all cursor-pointer shadow-inner"
                  >
                    {selectedMemberId ? (
                      (() => {
                        const m = members.find((item) => item.id === selectedMemberId)
                        return (
                          <div className="flex items-center gap-3 truncate">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-white/10 shrink-0 flex items-center justify-center">
                              {m?.avatar_url ? (
                                <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs font-bold text-amber-400">{m?.full_name?.charAt(0) || 'F'}</span>
                              )}
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-bold text-white truncate">{m?.full_name}</p>
                              <p className="text-[10px] text-neutral-400 truncate">{m?.company_name} &bull; {m?.stage || 'Founder'}</p>
                            </div>
                          </div>
                        )
                      })()
                    ) : (
                      <span className="text-xs text-neutral-400">Select a BMF Founder member...</span>
                    )}
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  </button>

                  {/* Dropdown with search */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-2 z-30 shadow-2xl max-h-60 overflow-y-auto space-y-1">
                      <div className="p-2 border-b border-neutral-800 flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-neutral-400" />
                        <input
                          type="text"
                          placeholder="Search founders by name or venture..."
                          value={memberSearch}
                          onChange={(e) => setMemberSearch(e.target.value)}
                          className="bg-transparent text-xs text-white placeholder:text-neutral-500 w-full focus:outline-none"
                          autoFocus
                        />
                      </div>

                      {filteredMembers.length === 0 ? (
                        <p className="text-xs text-neutral-500 p-3 text-center">No matching founders found.</p>
                      ) : (
                        filteredMembers.map((m) => {
                          const isSelected = selectedMemberId === m.id
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                applyMemberToForm(m)
                                setIsDropdownOpen(false)
                              }}
                              className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-colors cursor-pointer ${
                                isSelected ? 'bg-amber-500/20 text-white' : 'hover:bg-neutral-800/80 text-neutral-300'
                              }`}
                            >
                              <div className="w-7 h-7 rounded-full overflow-hidden bg-neutral-800 shrink-0 flex items-center justify-center border border-white/10">
                                {m.avatar_url ? (
                                  <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[10px] font-bold text-amber-400">{m.full_name?.charAt(0)}</span>
                                )}
                              </div>
                              <div className="truncate flex-1">
                                <span className="text-xs font-bold text-white block truncate">{m.full_name}</span>
                                <span className="text-[10px] text-neutral-400 truncate block">{m.company_name}</span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                            </button>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                      Cardholder Full Name
                    </label>
                    <input
                      type="text"
                      value={holderName}
                      onChange={(e) => setHolderName(e.target.value.toUpperCase())}
                      placeholder="E.G. DR. MELWIN VINCENT"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                      Company / Venture Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value.toUpperCase())}
                      placeholder="E.G. ATOM LABS"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 font-mono uppercase"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Tier Selection Grid */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>02. Select Metal Tier</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(Object.keys(CARD_TIERS) as CardTier[]).map((tierKey) => {
                  const meta = CARD_TIERS[tierKey]
                  const isSelected = selectedTier === tierKey
                  return (
                    <button
                      key={tierKey}
                      type="button"
                      onClick={() => setSelectedTier(tierKey)}
                      className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400 shadow-md shadow-amber-500/10'
                          : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${meta.colorBadge}`}>
                          {tierKey}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <h4 className="text-xs font-bold text-white mt-2 truncate">{meta.name}</h4>
                      <p className="text-[10px] text-neutral-400 truncate mt-0.5">{meta.subtitle}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Card Details & Security UID */}
            <div className="space-y-3 pt-1 border-t border-neutral-900">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>03. Card Numbers & Engraving</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Card Number */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-neutral-400">Card Pass Number</span>
                    <button
                      type="button"
                      onClick={handleRandomizeCardNumber}
                      className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Randomize</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* NFC UID */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-neutral-400">Pass Security UID</span>
                    <button
                      type="button"
                      onClick={handleRandomizeNfc}
                      className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Randomize</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={nfcUid}
                    onChange={(e) => setNfcUid(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Dates & Engraving */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Valid Thru
                  </label>
                  <input
                    type="text"
                    value={validThru}
                    onChange={(e) => setValidThru(e.target.value)}
                    placeholder="12/28"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Member Since
                  </label>
                  <input
                    type="text"
                    value={memberSince}
                    onChange={(e) => setMemberSince(e.target.value)}
                    placeholder="2026"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Back Engraving
                  </label>
                  <input
                    type="text"
                    value={engraving}
                    onChange={(e) => setEngraving(e.target.value.toUpperCase())}
                    placeholder="FOUNDING CLASS"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500 uppercase"
                  />
                </div>
              </div>

              {/* Optional Traction highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Traction Metric (Optional)
                  </label>
                  <input
                    type="text"
                    value={tractionMetric}
                    onChange={(e) => setTractionMetric(e.target.value)}
                    placeholder="e.g. $1.5M ARR / Seed-Backed"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Pitch Tagline (Optional)
                  </label>
                  <input
                    type="text"
                    value={pitchTagline}
                    onChange={(e) => setPitchTagline(e.target.value)}
                    placeholder="e.g. AI Workflow Automation Engine"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Instant Active Toggle */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Instantly Activate & Unlock</span>
                <span className="text-[10px] text-neutral-400">
                  Cardholder will immediately see their live metal pass in their Founder Studio.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isAutoActive}
                onChange={(e) => setIsAutoActive(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <Button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Issuing Pass...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-black" />
                    <span>Grant & Activate Pass</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* RIGHT PREVIEW COLUMN (5 Cols Sticky) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                Interactive Live Preview
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                3D Interactive Flip
              </span>
            </div>

            {/* 3D Metal Card Render */}
            <div className="p-4 rounded-3xl bg-neutral-900/80 border border-neutral-800/90 flex flex-col items-center justify-center space-y-3 shadow-xl">
              <div className="w-full flex justify-center scale-[0.88] sm:scale-95 origin-center">
                <ExecutiveMetalCard card={livePreviewCard} showControls={true} />
              </div>
              <p className="text-[10px] text-neutral-400 font-mono text-center">
                &bull; Click card to flip &bull; Move cursor for real-time laser glare
              </p>
            </div>

            {/* Selected Tier Perks Snapshot */}
            <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-2.5 text-xs text-left">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Tier Privileges</span>
                <span className="text-xs font-bold text-amber-400">
                  {CARD_TIERS[selectedTier]?.name}
                </span>
              </div>
              <ul className="space-y-1.5">
                {(CARD_TIERS[selectedTier]?.perks || []).map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[11px] text-neutral-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
