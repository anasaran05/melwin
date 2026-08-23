'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Briefcase,
  Crown,
  Handshake,
  GraduationCap,
  Mic2,
  BadgeCheck,
  Calendar as CalendarIcon,
  Loader2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  SendHorizontal,
  ChevronDown,
  Check
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateTimePicker } from '@/components/ui/date-time-picker'

type ServiceId = 'strategy' | 'personal-branding' | 'brand' | 'career' | 'invite'

interface ServiceMeta {
  id: ServiceId
  title: string
  subtitle: string
  pillLabel: string
  icon: React.ElementType
  badge: string
  summary: string
  highlight?: string
}

const servicesList: ServiceMeta[] = [
  {
    id: 'strategy',
    title: 'Business Consultation',
    subtitle: 'Data-driven insights • Startup challenges • Navigation',
    pillLabel: 'Business Consultation',
    icon: Briefcase,
    badge: '1-on-1 STRATEGY',
    summary: 'Direct 45–60 min strategic consulting session with Dr. Melwin Vincent with personalized roadmap & tactical execution.',
    highlight: '₹2,999 • 45-60 Mins',
  },
  {
    id: 'personal-branding',
    title: 'Personal Branding',
    subtitle: 'Content strategy • Video production • Executive presence',
    pillLabel: 'Personal Branding',
    icon: Crown,
    badge: 'VIP & INVITATION ONLY',
    summary: 'Complete done-for-you video production, studio shoots, scriptwriting, and executive authority on LinkedIn & Instagram.',
    highlight: 'Retainer Cohorts',
  },
  {
    id: 'brand',
    title: 'Brand Collaborations',
    subtitle: 'Infrastructure • Mutual growth • Partnerships',
    pillLabel: 'Brand Collaborations',
    icon: Handshake,
    badge: 'STRATEGIC PARTNERSHIPS',
    summary: 'High-visibility creator campaigns, educational media, sponsored integrations, and long-term brand growth initiatives.',
    highlight: 'Creator & B2B Campaigns',
  },
  {
    id: 'career',
    title: 'Career Guidance',
    subtitle: 'Calculated moves • Technical professionals',
    pillLabel: 'Career Guidance',
    icon: GraduationCap,
    badge: 'CAREER & HIGHER STUDIES',
    summary: 'Confidential strategic guidance for students and professionals transitioning roles, colleges, or advancing higher studies.',
    highlight: 'From ₹1,499',
  },
  {
    id: 'invite',
    title: 'Invite Melwin',
    subtitle: 'Keynotes • Guest Lectures • Panel Discussions',
    pillLabel: 'Invite Melwin',
    icon: Mic2,
    badge: 'SPEAKING ENGAGEMENTS',
    summary: 'Invite Dr. Melwin to deliver keynotes, masterclasses, or participate in panels at universities, summits, and conferences.',
    highlight: 'Conferences & Summits',
  },
]

export function ServicesGrid() {
  const [activeService, setActiveService] = useState<ServiceId>('strategy')
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  // Form states for each service
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    email: '',
    phone: '',
    slot_preference: '',
    intake_notes: '',
    city: '',
    state: '',
    consultation_type: 'consult_melwin',
  })

  const [brandingForm, setBrandingForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    plan: 'executive_presence',
    message: '',
  })

  const [brandCollabForm, setBrandCollabForm] = useState({
    company_name: '',
    platform_url: '',
    budget_tier: '',
    objective: '',
    contact_email: '',
    mobile_number: '',
    city: '',
    state: '',
  })

  const [careerForm, setCareerForm] = useState({
    name: '',
    email: '',
    mobile_number: '',
    background: '',
    session_tier: 'consult_melwin',
    message: '',
    city: '',
    state: '',
  })

  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    mobile_number: '',
    institution_event: '',
    message: '',
  })

  // Handle clicking outside mobile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMobileDropdownOpen(false)
      }
    }
    if (mobileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileDropdownOpen])

  // Handle URL hash changes & custom events
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'consultation' || hash === 'strategy') {
        setActiveService('strategy')
      } else if (hash === 'personal-branding' || hash === 'personalbranding' || hash === 'branding') {
        setActiveService('personal-branding')
      } else if (hash === 'partnerships' || hash === 'partnership' || hash === 'brand') {
        setActiveService('brand')
      } else if (hash === 'career') {
        setActiveService('career')
      } else if (hash === 'invite' || hash === 'invitemelwin') {
        setActiveService('invite')
      }
    }

    const handleOpenService = (e: CustomEvent<string>) => {
      const id = e.detail
      if (id === 'consultation' || id === 'strategy') {
        setActiveService('strategy')
      } else if (id === 'personal-branding' || id === 'personalbranding' || id === 'branding') {
        setActiveService('personal-branding')
      } else if (id === 'partnerships' || id === 'partnership' || id === 'brand') {
        setActiveService('brand')
      } else if (id === 'career') {
        setActiveService('career')
      } else if (id === 'invite' || id === 'invitemelwin') {
        setActiveService('invite')
      }
    }

    const handleOpenConsultation = (e: CustomEvent<string>) => {
      setActiveService('strategy')
      setConsultationForm((prev) => ({ ...prev, consultation_type: e.detail }))
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('openService', handleOpenService as EventListener)
    window.addEventListener('openConsultation', handleOpenConsultation as EventListener)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('openService', handleOpenService as EventListener)
      window.removeEventListener('openConsultation', handleOpenConsultation as EventListener)
    }
  }, [])

  // 1. Submit Consultation
  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consultationForm.name.trim()) return toast.error('Please enter your name')
    if (!consultationForm.email.trim() || !consultationForm.email.includes('@'))
      return toast.error('Please enter a valid email')
    if (!consultationForm.phone.trim()) return toast.error('Please enter your phone number')
    if (!consultationForm.slot_preference.trim()) return toast.error('Please select a preferred date')

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    const match = consultationForm.slot_preference.match(dateRegex)
    if (!match) return toast.error('Please enter the date in dd/mm/yyyy format')

    const [_, day, month, year] = match
    const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    selectedDate.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate <= today) return toast.error('Please select a future date')

    if (!consultationForm.city.trim()) return toast.error('Please enter your city')
    if (!consultationForm.state.trim()) return toast.error('Please enter your state')

    setLoading(true)
    try {
      const response = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'consultation_booking',
          ...consultationForm,
        }),
      })
      const data = await response.json()
      if (!response.ok) return toast.error(data.error || 'Failed to submit booking request')

      toast.success(`Thanks ${consultationForm.name}, your request is received! We will contact you shortly.`)
      setConsultationForm({
        name: '',
        email: '',
        phone: '',
        slot_preference: '',
        intake_notes: '',
        city: '',
        state: '',
        consultation_type: 'consult_melwin',
      })
    } catch {
      toast.error('Error submitting booking request')
    } finally {
      setLoading(false)
    }
  }

  // 2. Submit Personal Branding
  const handleBrandingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!brandingForm.name.trim()) return toast.error('Please enter your full name')
    if (!brandingForm.email.trim() || !brandingForm.email.includes('@'))
      return toast.error('Please enter a valid work email')
    if (!brandingForm.phone.trim()) return toast.error('Please enter your phone / WhatsApp number')
    if (!brandingForm.company.trim()) return toast.error('Please enter your company or brand name')

    setLoading(true)
    try {
      const response = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'agency_lead',
          ...brandingForm,
        }),
      })
      const data = await response.json()
      if (!response.ok) return toast.error(data.error || 'Failed to submit inquiry')

      toast.success(`Thank you ${brandingForm.name}! We will review your profile and reach out within 24 hours.`)
      setBrandingForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        plan: 'executive_presence',
        message: '',
      })
    } catch {
      toast.error('Error submitting inquiry')
    } finally {
      setLoading(false)
    }
  }

  // 3. Submit Brand Collab
  const handleBrandCollabSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!brandCollabForm.company_name.trim()) return toast.error('Please enter your company name')
    if (!brandCollabForm.platform_url.trim()) return toast.error('Please enter your website or platform URL')
    if (!brandCollabForm.budget_tier) return toast.error('Please select a budget tier')
    if (!brandCollabForm.objective.trim()) return toast.error('Please describe your campaign objective')
    if (!brandCollabForm.contact_email.trim() || !brandCollabForm.contact_email.includes('@'))
      return toast.error('Please enter a valid email')
    if (!brandCollabForm.mobile_number.trim()) return toast.error('Please enter your mobile number')
    if (!brandCollabForm.city.trim()) return toast.error('Please enter your city')
    if (!brandCollabForm.state.trim()) return toast.error('Please enter your state')

    setLoading(true)
    try {
      const response = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'brand_collab',
          ...brandCollabForm,
        }),
      })
      const data = await response.json()
      if (!response.ok) return toast.error(data.error || 'Failed to submit inquiry')

      toast.success(`Thanks ${brandCollabForm.company_name}, inquiry submitted! We'll reach out within 48 hours.`)
      setBrandCollabForm({
        company_name: '',
        platform_url: '',
        budget_tier: '',
        objective: '',
        contact_email: '',
        mobile_number: '',
        city: '',
        state: '',
      })
    } catch {
      toast.error('Error submitting inquiry')
    } finally {
      setLoading(false)
    }
  }

  // 4. Submit Career Guidance
  const handleCareerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!careerForm.name.trim()) return toast.error('Please enter your name')
    if (!careerForm.email.trim() || !careerForm.email.includes('@'))
      return toast.error('Please enter a valid email')
    if (!careerForm.mobile_number.trim()) return toast.error('Please enter your mobile number')
    if (!careerForm.background) return toast.error('Please select your background')
    if (!careerForm.message.trim()) return toast.error('Please share your situation or question')
    if (!careerForm.city.trim()) return toast.error('Please enter your city')
    if (!careerForm.state.trim()) return toast.error('Please enter your state')

    setLoading(true)
    try {
      const response = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'career_advice',
          ...careerForm,
        }),
      })
      const data = await response.json()
      if (!response.ok) return toast.error(data.error || 'Failed to submit')

      toast.success(`Thanks ${careerForm.name}! We will review and reach out with the schedule.`)
      setCareerForm({
        name: '',
        email: '',
        mobile_number: '',
        background: '',
        session_tier: 'consult_melwin',
        message: '',
        city: '',
        state: '',
      })
    } catch {
      toast.error('Error submitting request')
    } finally {
      setLoading(false)
    }
  }

  // 5. Submit Invite Melwin
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteForm.name.trim()) return toast.error('Please enter your name')
    if (!inviteForm.email.trim() || !inviteForm.email.includes('@'))
      return toast.error('Please enter a valid email')
    if (!inviteForm.mobile_number.trim()) return toast.error('Please enter a mobile number')
    if (!inviteForm.institution_event.trim())
      return toast.error('Please enter the institution or event name')

    setLoading(true)
    try {
      const response = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'invite_melwin',
          ...inviteForm,
        }),
      })
      const data = await response.json()
      if (!response.ok) return toast.error(data.error || 'Failed to submit inquiry')

      toast.success(`Thanks ${inviteForm.name}, speaking invitation received!`)
      setInviteForm({
        name: '',
        email: '',
        mobile_number: '',
        institution_event: '',
        message: '',
      })
    } catch {
      toast.error('Error submitting inquiry')
    } finally {
      setLoading(false)
    }
  }

  const currentMeta = servicesList.find((s) => s.id === activeService) || servicesList[0]

  return (
    <section id="services" className="py-20 md:py-28 px-4 sm:px-6 md:px-12 w-full text-[#111111] scroll-mt-24">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#111111] leading-[1.05]"
          >
            Services & Inquiries
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-base sm:text-lg text-[#666666] max-w-2xl mt-3"
          >
            Select a service to tailor your direct inquiry form below.
          </motion.p>
        </div>

        {/* Mobile Service Selector Dropdown (< lg) */}
        <div ref={dropdownRef} className="lg:hidden w-full mb-8 relative">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 block mb-2.5 pl-1">
            Select a Service
          </label>
          
          <button
            type="button"
            onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            className="w-full text-left min-h-[74px] sm:min-h-[80px] bg-[#111111] hover:bg-black text-white rounded-2xl sm:rounded-3xl border border-black/10 px-4 sm:px-5 py-4 shadow-xl transition-all flex items-center justify-between gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                {React.createElement(currentMeta.icon, { className: "w-5 h-5 text-emerald-400 shrink-0" })}
              </div>
              <div className="flex flex-col min-w-0 justify-center flex-1">
                <span className="font-bold text-base text-white tracking-tight truncate leading-tight">
                  {currentMeta.title}
                </span>
                <span className="text-xs text-neutral-400 font-medium truncate mt-1 leading-tight">
                  {currentMeta.highlight || currentMeta.badge}
                </span>
              </div>
            </div>

            <div className="shrink-0 pl-2">
              <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${mobileDropdownOpen ? 'rotate-180 text-white' : ''}`} />
            </div>
          </button>

          <AnimatePresence>
            {mobileDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#161618] border border-white/10 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-2xl overflow-hidden backdrop-blur-xl"
              >
                <div className="flex flex-col gap-1 max-h-[340px] overflow-y-auto pr-0.5">
                  {servicesList.map((service) => {
                    const Icon = service.icon
                    const isSelected = activeService === service.id
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => {
                          setActiveService(service.id)
                          setMobileDropdownOpen(false)
                        }}
                        className={`w-full text-left rounded-xl sm:rounded-2xl p-3 sm:p-3.5 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected 
                            ? 'bg-white/15 text-white ring-1 ring-white/20' 
                            : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                            <Icon className="w-5 h-5 text-emerald-400 shrink-0" />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm sm:text-base font-semibold leading-tight truncate text-white">
                              {service.title}
                            </span>
                            <span className="text-xs text-neutral-400 leading-tight truncate mt-0.5">
                              {service.subtitle}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2-Column Split: Service Pills on Left, Dynamic Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Interactive Service Pills (Desktop only: hidden on mobile) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col gap-3.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 block pl-1">
              Select a Service
            </span>

            <div className="flex flex-col gap-3">
              {servicesList.map((service) => {
                const isSelected = activeService === service.id
                const Icon = service.icon

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setActiveService(service.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-200 relative group cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#111111] text-white shadow-xl ring-2 ring-black/10 scale-[1.01]'
                        : 'bg-white hover:bg-neutral-50 text-[#111111] border border-neutral-200/90 shadow-xs hover:shadow-md hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      <div
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isSelected
                            ? 'bg-white text-black shadow-sm'
                            : 'bg-neutral-100 text-neutral-700 group-hover:scale-105'
                        }`}
                      >
                        <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-base sm:text-lg font-bold tracking-tight truncate ${
                              isSelected ? 'text-white' : 'text-[#111111]'
                            }`}
                          >
                            {service.title}
                          </h3>
                        </div>
                        <p
                          className={`text-xs truncate mt-0.5 ${
                            isSelected ? 'text-neutral-300' : 'text-neutral-500'
                          }`}
                        >
                          {service.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isSelected ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Quick Context Card */}
            <div className="hidden lg:block mt-4 p-5 rounded-2xl bg-neutral-100 border border-neutral-200/80 text-xs text-neutral-600 space-y-2">
              <div className="flex items-center gap-2 text-neutral-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Fast Direct Response</span>
              </div>
              <p className="leading-relaxed">
                Inquiries are reviewed daily. You will receive direct confirmation and follow-up on email & WhatsApp.
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Form Container */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-neutral-200/90 shadow-xl relative overflow-hidden">
              {/* Form Header */}
              <div className="mb-6 pb-6 border-b border-neutral-100">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-neutral-100 text-neutral-800 border border-neutral-200">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{currentMeta.badge}</span>
                  </span>

                  {currentMeta.highlight && (
                    <span className="text-xs font-mono font-bold text-neutral-700 bg-neutral-50 px-2.5 py-0.5 rounded-lg border border-neutral-200">
                      {currentMeta.highlight}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
                  {currentMeta.title}
                </h3>
                <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                  {currentMeta.summary}
                </p>
              </div>

              {/* Dynamic Animated Forms */}
              <AnimatePresence mode="wait">
                {/* 1. Business Consultation Form */}
                {activeService === 'strategy' && (
                  <motion.form
                    key="form-strategy"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleConsultationSubmit}
                    className="space-y-4 sm:space-y-5"
                  >
                    {/* Melwin Card Preview */}
                    <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/90 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0">
                          <Image src="/melwin.jpeg" alt="Dr. Melwin" fill className="object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-sm text-neutral-900">Dr. Melwin Vincent</span>
                            <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
                          </div>
                          <span className="text-xs text-neutral-500">1-on-1 Strategy Consultation • 45-60 min</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-neutral-400 line-through mr-1.5">₹5,000</span>
                        <span className="text-lg font-extrabold text-neutral-900">₹2,999</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Full Name *</label>
                        <Input
                          value={consultationForm.name}
                          onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                          placeholder="Your full name"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Email Address *</label>
                        <Input
                          type="email"
                          value={consultationForm.email}
                          onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })}
                          placeholder="your@email.com"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Phone / WhatsApp *</label>
                        <Input
                          type="tel"
                          value={consultationForm.phone}
                          onChange={(e) => setConsultationForm({ ...consultationForm, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Preferred Date *</label>
                        <DateTimePicker
                          name="slot_preference"
                          value={consultationForm.slot_preference}
                          onChange={(e) => setConsultationForm({ ...consultationForm, slot_preference: e.target.value })}
                          className="bg-white border-neutral-300 rounded-xl h-10 px-3 py-2 w-full text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">City *</label>
                        <Input
                          value={consultationForm.city}
                          onChange={(e) => setConsultationForm({ ...consultationForm, city: e.target.value })}
                          placeholder="City"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">State *</label>
                        <Input
                          value={consultationForm.state}
                          onChange={(e) => setConsultationForm({ ...consultationForm, state: e.target.value })}
                          placeholder="State"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Intake Notes / Challenge
                      </label>
                      <Textarea
                        value={consultationForm.intake_notes}
                        onChange={(e) => setConsultationForm({ ...consultationForm, intake_notes: e.target.value })}
                        placeholder="Brief overview of your startup, business bottleneck, or strategic goal..."
                        className="bg-white border-neutral-300 rounded-xl min-h-[90px]"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#111111] hover:bg-black text-white font-bold py-5 rounded-2xl shadow-lg transition-all hover:scale-[1.01]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Secure Consultation Slot</span>
                          <SendHorizontal className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </motion.form>
                )}

                {/* 2. Personal Branding Form */}
                {activeService === 'personal-branding' && (
                  <motion.form
                    key="form-branding"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleBrandingSubmit}
                    className="space-y-4 sm:space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Full Name *</label>
                        <Input
                          value={brandingForm.name}
                          onChange={(e) => setBrandingForm({ ...brandingForm, name: e.target.value })}
                          placeholder="Your full name"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Work Email *</label>
                        <Input
                          type="email"
                          value={brandingForm.email}
                          onChange={(e) => setBrandingForm({ ...brandingForm, email: e.target.value })}
                          placeholder="founder@company.com"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Phone / WhatsApp *</label>
                        <Input
                          type="tel"
                          value={brandingForm.phone}
                          onChange={(e) => setBrandingForm({ ...brandingForm, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Company / Venture *</label>
                        <Input
                          value={brandingForm.company}
                          onChange={(e) => setBrandingForm({ ...brandingForm, company: e.target.value })}
                          placeholder="Company name or brand"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Growth Focus *</label>
                      <Select
                        value={brandingForm.plan}
                        onValueChange={(val) => setBrandingForm({ ...brandingForm, plan: val })}
                      >
                        <SelectTrigger className="bg-white border-neutral-300 rounded-xl">
                          <SelectValue placeholder="Select branding focus" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-neutral-200">
                          <SelectItem value="executive_presence">Founder Authority & Executive Presence (LinkedIn + Video)</SelectItem>
                          <SelectItem value="video_engine">Done-For-You Studio Shoots & High-Yield Video Production</SelectItem>
                          <SelectItem value="inbound_pipeline">Inbound Lead Generation & Media Repositioning</SelectItem>
                          <SelectItem value="custom_retainer">Full Comprehensive Branding Retainer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Social Handles / Goals
                      </label>
                      <Textarea
                        value={brandingForm.message}
                        onChange={(e) => setBrandingForm({ ...brandingForm, message: e.target.value })}
                        placeholder="Links to LinkedIn/Instagram profile, current content roadblocks, or target audience..."
                        className="bg-white border-neutral-300 rounded-xl min-h-[90px]"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#111111] hover:bg-black text-white font-bold py-5 rounded-2xl shadow-lg transition-all hover:scale-[1.01]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Apply for Branding Retainer</span>
                          <SendHorizontal className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </motion.form>
                )}

                {/* 3. Brand Collaborations Form */}
                {activeService === 'brand' && (
                  <motion.form
                    key="form-brand-collab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleBrandCollabSubmit}
                    className="space-y-4 sm:space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Company / Brand Name *</label>
                        <Input
                          value={brandCollabForm.company_name}
                          onChange={(e) => setBrandCollabForm({ ...brandCollabForm, company_name: e.target.value })}
                          placeholder="Your brand name"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Platform URL *</label>
                        <Input
                          value={brandCollabForm.platform_url}
                          onChange={(e) => setBrandCollabForm({ ...brandCollabForm, platform_url: e.target.value })}
                          placeholder="https://yourbrand.com"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Budget Tier *</label>
                        <Select
                          value={brandCollabForm.budget_tier}
                          onValueChange={(val) => setBrandCollabForm({ ...brandCollabForm, budget_tier: val })}
                        >
                          <SelectTrigger className="bg-white border-neutral-300 rounded-xl">
                            <SelectValue placeholder="Select campaign budget" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-neutral-200">
                            <SelectItem value="5k-25k">₹5k – ₹25k</SelectItem>
                            <SelectItem value="25k-50k">₹25k – ₹50k</SelectItem>
                            <SelectItem value="50k-1lakh">₹50k – ₹1L</SelectItem>
                            <SelectItem value="1lakh-plus">₹1L+ (Enterprise / Retainer)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Contact Email *</label>
                        <Input
                          type="email"
                          value={brandCollabForm.contact_email}
                          onChange={(e) => setBrandCollabForm({ ...brandCollabForm, contact_email: e.target.value })}
                          placeholder="collabs@brand.com"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Mobile Number *</label>
                        <Input
                          type="tel"
                          value={brandCollabForm.mobile_number}
                          onChange={(e) => setBrandCollabForm({ ...brandCollabForm, mobile_number: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">City *</label>
                        <Input
                          value={brandCollabForm.city}
                          onChange={(e) => setBrandCollabForm({ ...brandCollabForm, city: e.target.value })}
                          placeholder="City"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">State *</label>
                        <Input
                          value={brandCollabForm.state}
                          onChange={(e) => setBrandCollabForm({ ...brandCollabForm, state: e.target.value })}
                          placeholder="State"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Campaign Objective & Format *
                      </label>
                      <Textarea
                        value={brandCollabForm.objective}
                        onChange={(e) => setBrandCollabForm({ ...brandCollabForm, objective: e.target.value })}
                        placeholder="Describe your partnership goals, target deliverables (UGC, sponsored video, long-term brand ambassador, event), etc."
                        className="bg-white border-neutral-300 rounded-xl min-h-[90px]"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#111111] hover:bg-black text-white font-bold py-5 rounded-2xl shadow-lg transition-all hover:scale-[1.01]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Submit Partnership Proposal</span>
                          <SendHorizontal className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </motion.form>
                )}

                {/* 4. Career Guidance Form */}
                {activeService === 'career' && (
                  <motion.form
                    key="form-career"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleCareerSubmit}
                    className="space-y-4 sm:space-y-5"
                  >
                    {/* Consultation Tier Selection */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-2">Consultation Tier *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                          onClick={() => setCareerForm({ ...careerForm, session_tier: 'consult_melwin' })}
                          className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between relative ${
                            careerForm.session_tier === 'consult_melwin'
                              ? 'border-black bg-neutral-50 shadow-xs'
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-neutral-900 text-xs sm:text-sm">Consult with Melwin</span>
                              <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
                            </div>
                            <span className="font-extrabold text-neutral-900 text-sm">₹2,999</span>
                          </div>
                          <span className="text-[11px] text-neutral-500">1-on-1 strategic roadmap session</span>
                        </div>

                        <div
                          onClick={() => setCareerForm({ ...careerForm, session_tier: 'regular' })}
                          className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                            careerForm.session_tier === 'regular'
                              ? 'border-black bg-neutral-50 shadow-xs'
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-neutral-900 text-xs sm:text-sm">Regular Consultation</span>
                            <span className="font-extrabold text-neutral-900 text-sm">₹1,499</span>
                          </div>
                          <span className="text-[11px] text-neutral-500">Standard career strategy session</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Full Name *</label>
                        <Input
                          value={careerForm.name}
                          onChange={(e) => setCareerForm({ ...careerForm, name: e.target.value })}
                          placeholder="Your name"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Email Address *</label>
                        <Input
                          type="email"
                          value={careerForm.email}
                          onChange={(e) => setCareerForm({ ...careerForm, email: e.target.value })}
                          placeholder="your@email.com"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Mobile Number *</label>
                        <Input
                          type="tel"
                          value={careerForm.mobile_number}
                          onChange={(e) => setCareerForm({ ...careerForm, mobile_number: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Your Background *</label>
                        <Select
                          value={careerForm.background}
                          onValueChange={(val) => setCareerForm({ ...careerForm, background: val })}
                        >
                          <SelectTrigger className="bg-white border-neutral-300 rounded-xl">
                            <SelectValue placeholder="Select background" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-neutral-200">
                            <SelectItem value="engineering">Engineering / Tech</SelectItem>
                            <SelectItem value="healthcare">Healthcare / Medical</SelectItem>
                            <SelectItem value="arts_science">Arts & Science</SelectItem>
                            <SelectItem value="commerce">Commerce / Business</SelectItem>
                            <SelectItem value="school_to_college">School to College Transition</SelectItem>
                            <SelectItem value="working_professional">Working Professional / Repositioning</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">City *</label>
                        <Input
                          value={careerForm.city}
                          onChange={(e) => setCareerForm({ ...careerForm, city: e.target.value })}
                          placeholder="City"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">State *</label>
                        <Input
                          value={careerForm.state}
                          onChange={(e) => setCareerForm({ ...careerForm, state: e.target.value })}
                          placeholder="State"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Your Current Situation & Questions *
                      </label>
                      <Textarea
                        value={careerForm.message}
                        onChange={(e) => setCareerForm({ ...careerForm, message: e.target.value })}
                        placeholder="What is your current hurdle? (Higher studies abroad, career switch, placement readiness, master's planning...)"
                        className="bg-white border-neutral-300 rounded-xl min-h-[90px]"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#111111] hover:bg-black text-white font-bold py-5 rounded-2xl shadow-lg transition-all hover:scale-[1.01]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Request Career Session</span>
                          <SendHorizontal className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </motion.form>
                )}

                {/* 5. Invite Melwin Form */}
                {activeService === 'invite' && (
                  <motion.form
                    key="form-invite"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleInviteSubmit}
                    className="space-y-4 sm:space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Contact Person *</label>
                        <Input
                          value={inviteForm.name}
                          onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                          placeholder="Your full name"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Official Email *</label>
                        <Input
                          type="email"
                          value={inviteForm.email}
                          onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                          placeholder="contact@university.edu"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Mobile Number *</label>
                        <Input
                          type="tel"
                          value={inviteForm.mobile_number}
                          onChange={(e) => setInviteForm({ ...inviteForm, mobile_number: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Organization / Event Name *</label>
                        <Input
                          value={inviteForm.institution_event}
                          onChange={(e) => setInviteForm({ ...inviteForm, institution_event: e.target.value })}
                          placeholder="College / Summit / Organization"
                          className="bg-white border-neutral-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Tell Us About the Event & Audience
                      </label>
                      <Textarea
                        value={inviteForm.message}
                        onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                        placeholder="Date, location/virtual, expected audience size, session format (Keynote, Panel, Masterclass), and topic focus..."
                        className="bg-white border-neutral-300 rounded-xl min-h-[100px]"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#111111] hover:bg-black text-white font-bold py-5 rounded-2xl shadow-lg transition-all hover:scale-[1.01]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Submit Speaking Invitation</span>
                          <SendHorizontal className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
