'use client'

import React, { useState, useRef } from 'react'
import { BmfMember } from '@/lib/supabase/bmf-members'
import { BmfEvent, saveBmfEvent, slugifyEventTitle } from '@/lib/supabase/bmf-events'
import { compressImageToWebP } from '@/lib/image-utils'
import {
  X,
  Calendar,
  Sparkles,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Building2,
  Lock,
  Tag,
  Loader2,
  Send,
  ArrowRight,
  ArrowLeft,
  Check,
  IndianRupee,
  Upload,
  Image as ImageIcon,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProposeMastermindModalProps {
  isOpen: boolean
  onClose: () => void
  founder: BmfMember
  onProposed?: (event: BmfEvent) => void
}

const CATEGORIES = [
  'Dinner',
  'Roundtable',
  'Workshop',
  'Product Teardown',
  'Investor Chat',
  'Casual Mixer',
  'Demo Day',
]

const PRICING_OPTIONS = [
  { id: 'free', label: 'Free', desc: 'Open to all founders with 0 ticket fee', badge: 'FREE' },
  { id: 'members_only', label: 'Members Only', desc: 'Free for verified BMF Club members', badge: 'MEMBERS ONLY' },
  { id: 'paid', label: 'Paid Ticket', desc: 'Ticket price required to attend', badge: 'PAID' },
  { id: 'invite_only', label: 'Invite Only', desc: 'Curated list / invite pass', badge: 'INVITE ONLY' },
]

const STEPS = [
  { id: 1, title: 'Basic Info', subtitle: 'Name, Type & Image' },
  { id: 2, title: 'When & Where', subtitle: 'Time & Place' },
  { id: 3, title: 'Who Can Join', subtitle: 'Seats & Price' },
  { id: 4, title: 'Review', subtitle: 'Check & Post' },
]

function formatTime12h(time24: string): string {
  if (!time24) return ''
  const [hoursStr, mins] = time24.split(':')
  let hours = parseInt(hoursStr, 10)
  if (isNaN(hours)) return time24
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${mins || '00'} ${ampm}`
}

function formatDateFriendly(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      const d = new Date(year, month, day)
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }
    return dateStr
  } catch {
    return dateStr
  }
}

export function ProposeMastermindModal({
  isOpen,
  onClose,
  founder,
  onProposed,
}: ProposeMastermindModalProps) {
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Basic Info & WebP Image
  const [title, setTitle] = useState('')
  const [tagline, setTagline] = useState('')
  const [category, setCategory] = useState('')
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('')
  const [isCompressingImage, setIsCompressingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Step 2: Time & Place
  const [locationType, setLocationType] = useState<'in_person' | 'virtual' | 'hybrid' | ''>('')
  const [locationCity, setLocationCity] = useState('')
  const [locationVenue, setLocationVenue] = useState('')
  const [selectedDate, setSelectedDate] = useState('') // YYYY-MM-DD
  const [startTime, setStartTime] = useState('') // HH:mm
  const [endTime, setEndTime] = useState('') // HH:mm

  // Step 3: Who Can Join & Price Tag
  const [totalCapacity, setTotalCapacity] = useState<number | ''>('')
  const [pricingType, setPricingType] = useState<'free' | 'paid' | 'members_only' | 'invite_only' | ''>('')
  const [priceInr, setPriceInr] = useState<number | ''>('')
  const [requirements, setRequirements] = useState('')
  const [description, setDescription] = useState('')

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  // Formatted display values
  const formattedDate = formatDateFriendly(selectedDate)
  const formattedTime = startTime
    ? endTime
      ? `${formatTime12h(startTime)} - ${formatTime12h(endTime)}`
      : `From ${formatTime12h(startTime)}`
    : ''

  const todayStr = new Date().toISOString().split('T')[0]

  // Image Upload & 75% WebP Compression Handler
  const handleImageFileSelect = async (file: File) => {
    if (!file) return
    setErrorMsg(null)
    setIsCompressingImage(true)

    try {
      // Auto compress to WebP at 75% quality as requested
      const result = await compressImageToWebP(file, {
        quality: 0.75,
        maxWidth: 1200,
        maxHeight: 800,
      })

      setPendingCoverFile(result.file)
      setCoverPreviewUrl(result.previewUrl)
    } catch (err: any) {
      console.error('Image compression failed:', err)
      setErrorMsg('Failed to process image. Please try another image file.')
    } finally {
      setIsCompressingImage(false)
    }
  }

  const handleNextStep = () => {
    setErrorMsg(null)
    if (currentStep === 1) {
      if (!title.trim()) {
        setErrorMsg('Please enter an event name.')
        return
      }
      if (!category) {
        setErrorMsg('Please select an event type.')
        return
      }
    }
    if (currentStep === 2) {
      if (!locationType) {
        setErrorMsg('Please choose how you will meet (In Person, Online, or Both).')
        return
      }
      if (!locationCity.trim()) {
        setErrorMsg('Please enter a city.')
        return
      }
      if (!selectedDate) {
        setErrorMsg('Please select an event date.')
        return
      }
      if (!startTime) {
        setErrorMsg('Please select a start time.')
        return
      }
    }
    if (currentStep === 3) {
      if (!pricingType) {
        setErrorMsg('Please choose whether this event is Free or Paid.')
        return
      }
      if (pricingType === 'paid' && (!priceInr || Number(priceInr) <= 0)) {
        setErrorMsg('Please enter the ticket price in INR for this paid event.')
        return
      }
    }
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevStep = () => {
    setErrorMsg(null)
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleResetAndClose = () => {
    setCurrentStep(1)
    setTitle('')
    setTagline('')
    setCategory('')
    setPendingCoverFile(null)
    setCoverPreviewUrl('')
    setLocationType('')
    setLocationCity('')
    setLocationVenue('')
    setSelectedDate('')
    setStartTime('')
    setEndTime('')
    setTotalCapacity('')
    setPricingType('')
    setPriceInr('')
    setRequirements('')
    setDescription('')
    setErrorMsg(null)
    onClose()
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      let finalImageUrl = coverPreviewUrl || ''

      // Upload WebP file to Cloudflare R2 if selected
      if (pendingCoverFile) {
        const formData = new FormData()
        formData.append('file', pendingCoverFile)
        formData.append('folder', 'events')
        formData.append('userId', founder.id || 'founder')

        const uploadRes = await fetch('/api/bmf/upload-media', {
          method: 'POST',
          body: formData,
        })
        const uploadData = await uploadRes.json()
        if (uploadRes.ok && uploadData.success && uploadData.url) {
          finalImageUrl = uploadData.url
        }
      }

      const selectedType = locationType || 'in_person'
      const selectedCategory = category || 'Meetup'
      const selectedPricing = pricingType || 'free'
      const finalPrice = selectedPricing === 'paid' ? Number(priceInr) || 0 : 0
      const seatCount = totalCapacity ? Number(totalCapacity) : 16

      const generatedSlug = slugifyEventTitle(title) + `-by-${founder.id?.slice(0, 6) || 'founder'}`
      const newEventPayload: Partial<BmfEvent> = {
        title: title.trim(),
        slug: generatedSlug,
        tagline: tagline.trim() || `Hosted by ${founder.full_name || 'Founder'} (${founder.company_name || 'Startup'})`,
        description: description.trim() || `Meetup hosted by ${founder.full_name}.`,
        cover_image: finalImageUrl || undefined,
        thumbnail_url: finalImageUrl || undefined,
        category: selectedCategory,
        location_type: selectedType,
        location_city: locationCity.trim(),
        location_venue: locationVenue.trim() || (selectedType === 'virtual' ? 'Google Meet / Zoom' : 'To be shared with attendees'),
        event_date: formattedDate || selectedDate,
        event_time: formattedTime || '7:00 PM - 9:00 PM',
        total_capacity: seatCount,
        registered_count: 1, // Host is registered
        is_published: true,
        status: 'upcoming',
        cta_type: 'internal_form',
        external_cta_text: selectedPricing === 'paid' ? `Buy Pass • ₹${finalPrice}` : 'Join Event',
        pricing_type: selectedPricing,
        price_inr: finalPrice,
        requirements: requirements.trim() || `Open to club members in ${founder.category || 'Tech'}`,
        tags: [
          selectedCategory,
          locationCity,
          selectedPricing === 'free' ? 'Free' : selectedPricing === 'paid' ? `Paid (₹${finalPrice})` : 'Members Only',
          founder.company_name || 'Founder'
        ].filter(Boolean) as string[],
      }

      const res = await saveBmfEvent(newEventPayload)

      if (res.success && res.event) {
        setIsSuccess(true)
        if (onProposed) onProposed(res.event)
        setTimeout(() => {
          setIsSuccess(false)
          handleResetAndClose()
        }, 2200)
      } else {
        setErrorMsg(res.error || 'Failed to post event.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while posting.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in-0 duration-200">
      <div
        className="bg-[#101014] border border-neutral-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-auto relative text-neutral-100 max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 shadow-inner">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Host an Event
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
                  Host
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Plan a dinner, workshop, or meetup for other members.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        {!isSuccess && (
          <div className="px-6 pt-4 pb-3 bg-neutral-950/30 border-b border-neutral-800/80 shrink-0">
            <div className="grid grid-cols-4 gap-2">
              {STEPS.map((step) => {
                const isCurrent = currentStep === step.id
                const isDone = currentStep > step.id
                return (
                  <div
                    key={step.id}
                    onClick={() => {
                      if (step.id < currentStep) setCurrentStep(step.id)
                    }}
                    className={`cursor-pointer transition-all ${
                      step.id < currentStep ? 'hover:opacity-80' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all shrink-0 ${
                          isCurrent
                            ? 'bg-white text-black font-bold shadow-md'
                            : isDone
                            ? 'bg-emerald-500 text-black font-bold'
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-500'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
                      </div>
                      <div className="hidden sm:block min-w-0">
                        <span
                          className={`text-[11px] font-bold block truncate leading-tight ${
                            isCurrent ? 'text-white' : isDone ? 'text-neutral-300' : 'text-neutral-500'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-500 block truncate">
                          {step.subtitle}
                        </span>
                      </div>
                    </div>
                    {/* Progress line */}
                    <div
                      className={`h-0.5 w-full mt-2 rounded-full transition-all ${
                        isCurrent
                          ? 'bg-white'
                          : isDone
                          ? 'bg-emerald-500'
                          : 'bg-neutral-800'
                      }`}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSuccess ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-white">Your Event is Live!</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Your event has been added to the club calendar. Other members can now see it and sign up.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 1: BASIC INFO & THUMBNAIL */}
              {/* ========================================================= */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in-0 duration-200">
                  <div className="space-y-1 border-b border-neutral-800 pb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                      Step 1 of 4
                    </span>
                    <h4 className="text-base font-bold text-white">What is your event?</h4>
                    <p className="text-xs text-neutral-400">
                      Give your event a clear name, category, and cover image.
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    <div>
                      <label className="text-xs font-semibold text-neutral-200 block mb-1.5">
                        Event Name <span className="text-neutral-400">*</span>
                      </label>
                      <input
                        type="text"
                        autoFocus
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. AI Founders Dinner, SaaS Growth Workshop"
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-200 block mb-1.5">
                        Event Type <span className="text-neutral-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {CATEGORIES.map((cat) => {
                          const isSelected = category === cat
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setCategory(cat)}
                              className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-neutral-800 border-neutral-600 text-white font-bold shadow-xs'
                                  : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                              }`}
                            >
                              {cat}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Cover Image Upload */}
                    <div>
                      <label className="text-xs font-semibold text-neutral-200 block mb-1.5">
                        Event Cover / Thumbnail Image
                      </label>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageFileSelect(e.target.files[0])
                          }
                        }}
                      />

                      {coverPreviewUrl ? (
                        <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 h-36 flex items-center justify-center group">
                          <img
                            src={coverPreviewUrl}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md cursor-pointer"
                            >
                              Change Image
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCoverPreviewUrl('')
                                setPendingCoverFile(null)
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-rose-300 text-xs backdrop-blur-md cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border border-dashed border-neutral-800 hover:border-neutral-600 rounded-2xl p-4 bg-neutral-900/40 hover:bg-neutral-900/80 transition-all cursor-pointer text-center space-y-1.5"
                        >
                          <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                            {isCompressingImage ? (
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                          </div>
                          <span className="text-xs font-semibold text-neutral-300 block">
                            {isCompressingImage ? 'Processing image...' : 'Upload Event Cover Image'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-200 block mb-1.5">
                        Short Description (One line)
                      </label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="e.g. Talking about growing revenue and sharing lessons"
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 2: WHEN & WHERE */}
              {/* ========================================================= */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in-0 duration-200">
                  <div className="space-y-1 border-b border-neutral-800 pb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                      Step 2 of 4
                    </span>
                    <h4 className="text-base font-bold text-white">Date and Location</h4>
                    <p className="text-xs text-neutral-400">
                      Choose where and when you want to meet.
                    </p>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div>
                      <label className="text-xs font-semibold text-neutral-200 block mb-1.5">
                        How will you meet? <span className="text-neutral-400">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'in_person', label: 'In Person', desc: 'Meet at a venue' },
                          { id: 'virtual', label: 'Online', desc: 'Google Meet / Zoom' },
                          { id: 'hybrid', label: 'Both', desc: 'In-person + Online' },
                        ].map((mode) => {
                          const isSelected = locationType === mode.id
                          return (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => setLocationType(mode.id as any)}
                              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-neutral-800 border-neutral-600 text-white font-bold shadow-xs'
                                  : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:text-white'
                              }`}
                            >
                              <span className="text-xs font-bold block">{mode.label}</span>
                              <span className="text-[10px] font-mono text-neutral-500 block">{mode.desc}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-neutral-200 block mb-1.5">
                          City <span className="text-neutral-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={locationCity}
                          onChange={(e) => setLocationCity(e.target.value)}
                          placeholder="e.g. Bangalore, Mumbai, SF"
                          className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-200 block mb-1.5">
                          Place or Meeting Link
                        </label>
                        <input
                          type="text"
                          value={locationVenue}
                          onChange={(e) => setLocationVenue(e.target.value)}
                          placeholder="e.g. Cafe, Office in Indiranagar, or Meet link"
                          className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Controlled Date Picker */}
                      <div>
                        <label className="text-xs font-semibold text-neutral-200 flex items-center justify-between mb-1.5">
                          <span>Date <span className="text-neutral-400">*</span></span>
                          {formattedDate && (
                            <span className="text-[10px] font-mono text-neutral-300 font-bold">
                              {formattedDate}
                            </span>
                          )}
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            min={todayStr}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none transition-colors [color-scheme:dark] cursor-pointer font-mono"
                          />
                        </div>
                      </div>

                      {/* Controlled Start & End Time Pickers */}
                      <div>
                        <label className="text-xs font-semibold text-neutral-200 flex items-center justify-between mb-1.5">
                          <span>Time <span className="text-neutral-400">*</span></span>
                          {formattedTime && (
                            <span className="text-[10px] font-mono text-neutral-300 font-bold">
                              {formattedTime}
                            </span>
                          )}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-colors [color-scheme:dark] cursor-pointer font-mono"
                          />
                          <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-colors [color-scheme:dark] cursor-pointer font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 3: WHO CAN JOIN & PRICING TAG */}
              {/* ========================================================= */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in-0 duration-200">
                  <div className="space-y-1 border-b border-neutral-800 pb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                      Step 3 of 4
                    </span>
                    <h4 className="text-base font-bold text-white">Access, Price Tag & Topics</h4>
                    <p className="text-xs text-neutral-400">
                      Set if the event is Free or Paid, seat limit, and talking points.
                    </p>
                  </div>

                  <div className="space-y-4 pt-1">
                    {/* Event Tag / Pricing Selector */}
                    <div>
                      <label className="text-xs font-semibold text-neutral-200 block mb-1.5">
                        Is this event Free or Paid? <span className="text-neutral-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {PRICING_OPTIONS.map((opt) => {
                          const isSelected = pricingType === opt.id
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setPricingType(opt.id as any)}
                              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-neutral-800 border-neutral-500 text-white font-bold shadow-xs ring-1 ring-neutral-500'
                                  : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:text-white hover:border-neutral-700'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold block">{opt.label}</span>
                              </div>
                              <span className="text-[10px] font-mono text-neutral-500 block leading-tight">
                                {opt.desc}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* If Paid: Ticket Price Input with presets */}
                    {pricingType === 'paid' && (
                      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2.5 animate-in fade-in-0 duration-200">
                        <label className="text-xs font-semibold text-white flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <IndianRupee className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Ticket Price (INR) <span className="text-neutral-400">*</span></span>
                          </span>
                          {priceInr && (
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">
                              ₹{priceInr} per founder
                            </span>
                          )}
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-1">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">₹</span>
                            <input
                              type="number"
                              min={1}
                              step={50}
                              required
                              value={priceInr}
                              onChange={(e) => setPriceInr(e.target.value ? Number(e.target.value) : '')}
                              placeholder="e.g. 999"
                              className="w-full bg-neutral-950 border border-neutral-700 focus:border-neutral-400 rounded-xl pl-8 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none font-mono"
                            />
                          </div>
                          <div className="flex gap-1.5">
                            {[499, 999, 1999, 4999].map((amt) => (
                              <button
                                key={amt}
                                type="button"
                                onClick={() => setPriceInr(amt)}
                                className={`px-2.5 py-2 rounded-xl text-[11px] font-mono transition-all cursor-pointer ${
                                  priceInr === amt
                                    ? 'bg-white text-black font-bold shadow-xs'
                                    : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
                                }`}
                              >
                                ₹{amt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Seat Limit & Prerequisites */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-neutral-200 block mb-1.5">
                          Number of Seats
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={2}
                            max={100}
                            value={totalCapacity}
                            onChange={(e) => setTotalCapacity(e.target.value ? Number(e.target.value) : '')}
                            placeholder="e.g. 16"
                            className="w-24 bg-neutral-900 border border-neutral-800 focus:border-neutral-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none font-mono text-center placeholder:text-neutral-600 font-bold"
                          />
                          <div className="flex gap-1.5">
                            {[12, 16, 24, 30].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setTotalCapacity(num)}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                                  totalCapacity === num
                                    ? 'bg-white text-black font-bold shadow-xs'
                                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-200 block mb-1.5">
                          Who is this for? (Optional)
                        </label>
                        <input
                          type="text"
                          value={requirements}
                          onChange={(e) => setRequirements(e.target.value)}
                          placeholder="e.g. Early-stage founders, builders"
                          className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-200 block mb-1.5">
                        What will you talk about?
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. Main talking points, questions to discuss, and what people will learn..."
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-500 rounded-xl p-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none resize-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 4: REVIEW & CONFIRM */}
              {/* ========================================================= */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in-0 duration-200">
                  <div className="space-y-1 border-b border-neutral-800 pb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                      Step 4 of 4
                    </span>
                    <h4 className="text-base font-bold text-white">Check and Post</h4>
                    <p className="text-xs text-neutral-400">
                      This is how your event will look to other members.
                    </p>
                  </div>

                  {/* Live Card Preview (No Free/Paid tag overlay on image) */}
                  <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl text-left">
                    {coverPreviewUrl && (
                      <div className="w-full h-36 bg-neutral-950 overflow-hidden relative">
                        <img
                          src={coverPreviewUrl}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 left-2.5 text-[10px] font-mono uppercase bg-black/80 backdrop-blur-md text-white border border-neutral-700 px-2.5 py-0.5 rounded-full font-bold">
                          {category || 'Event'}
                        </span>
                      </div>
                    )}

                    <div className="p-5 space-y-3.5">
                      {!coverPreviewUrl && (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-200 border border-neutral-700 px-2.5 py-0.5 rounded-full font-bold">
                            {category || 'Event'}
                          </span>
                          <span className="text-xs font-mono text-neutral-300 font-bold">
                            {formattedDate || 'Date TBD'} {formattedTime ? `• ${formattedTime}` : ''}
                          </span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-white">{title || 'Event Name'}</h4>
                        {tagline && <p className="text-xs text-neutral-400 italic">&ldquo;{tagline}&rdquo;</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800 text-[11px] font-mono text-neutral-400">
                        <div>
                          <span className="text-neutral-500 block text-[9px] uppercase">Where</span>
                          <span className="text-white font-semibold">
                            {locationCity || 'City TBD'} ({locationType === 'in_person' ? 'In Person' : locationType === 'virtual' ? 'Online' : locationType === 'hybrid' ? 'Both' : 'TBD'})
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[9px] uppercase">Seats & Access</span>
                          <span className="text-white font-semibold">
                            {totalCapacity ? `${totalCapacity} Seats` : '16 Seats'} ({pricingType === 'paid' ? `Paid • ₹${priceInr || 0}` : pricingType === 'free' ? 'Free' : pricingType === 'members_only' ? 'Members Only' : 'Invite Only'})
                          </span>
                        </div>
                      </div>

                      {requirements && (
                        <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300">
                          <strong className="text-neutral-400 font-mono text-[9px] uppercase block mb-0.5">Who can join</strong>
                          {requirements}
                        </div>
                      )}

                      <div className="pt-2 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                        <span>Hosted by: <strong className="text-neutral-300">{founder.full_name} ({founder.company_name})</strong></span>
                        <span className="text-emerald-400 font-bold">Ready to Post</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </Button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-4 py-2 text-neutral-500 hover:text-neutral-300 text-xs font-bold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                )}

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-lg inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Posting event...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        <span>Post Event</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
