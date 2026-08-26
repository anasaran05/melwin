'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  Loader2,
  ChevronRight,
  Link as LinkIcon,
  Sparkles,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react'

export function FundingInquiryStepper() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Founder & Startup Basics
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    website_or_linkedin: '',

    // Step 2: What You Are Building & Progress
    sector: 'AI, Software & SaaS',
    stage: '🛠️ Prototype / Working Demo Built',
    one_line_pitch: '',

    // Step 3: Funding Goals & Pitch Deck
    funding_type: '🌐 Both Grants & Private Funding',
    target_amount: '₹20 Lakhs – ₹50 Lakhs (Grant + Seed Blend)',
    deck_url: ''
  })

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.company.trim() || !formData.location.trim()) {
        setErrorMessage('Please fill in all required fields (Name, Email, Phone, Startup Name, and Location).')
        return
      }
    }
    if (currentStep === 2) {
      if (!formData.one_line_pitch.trim() || formData.one_line_pitch.trim().length < 10) {
        setErrorMessage('Please describe what your startup is building in 1-2 sentences.')
        return
      }
    }
    setErrorMessage('')
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handleBack = () => {
    setErrorMessage('')
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.deck_url.trim()) {
      setErrorMessage('Please provide a link to your Pitch Deck, Demo Video, Notion Doc, or Website.')
      return
    }

    setFormStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'funding_grants',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          location: formData.location,
          website_or_linkedin: formData.website_or_linkedin,
          sector: formData.sector,
          stage: formData.stage,
          one_line_pitch: formData.one_line_pitch,
          funding_type: formData.funding_type,
          target_amount: formData.target_amount,
          deck_url: formData.deck_url
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setFormStatus('success')
      } else {
        setFormStatus('error')
        setErrorMessage(data.error || 'Failed to submit application. Please check your details and try again.')
      }
    } catch {
      setFormStatus('error')
      setErrorMessage('Network connection error. Please try again.')
    }
  }

  return (
    <section id="apply" className="py-12 sm:py-16 md:py-24 px-3.5 sm:px-6 md:px-12 w-full bg-[#f2f2f2] text-[#111111] scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Two-Column Card Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-black/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
          
          {/* LEFT COLUMN: Clean Brand Narrative (5 Cols) */}
          <div className="lg:col-span-5 relative bg-[#fafaf8] p-6 sm:p-10 md:p-12 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-black/10 min-h-auto lg:min-h-[640px]">
            
            {/* Background Graphic Asset with Soft Light Wash */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/funding.webp"
                alt="Capital Advisory & Grant Readiness"
                fill
                className="object-cover opacity-20 filter contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fafaf8] via-[#fafaf8]/90 to-[#fafaf8]/50" />
            </div>

            {/* Top Badge & Header */}
            <div className="relative z-10 space-y-4 my-auto py-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-xs font-mono font-bold uppercase tracking-wider text-neutral-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Founder Application &bull; 2026</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#111111] leading-tight">
                Apply for Funding & Grant Advisory
              </h2>

              <p className="text-xs sm:text-sm text-[#555555] leading-relaxed max-w-sm">
                Submit your startup details for non-dilutive government scheme mapping, grant proposal structuring, and private syndicate co-investment review.
              </p>

              <div className="pt-4 space-y-2.5 text-xs text-[#444444]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Confidential & protected under standard NDA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Direct review by Dr. Melwin's advisory desk</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div className="relative z-10 pt-4 border-t border-black/10 text-[11px] font-mono text-[#777777] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Applications Open &bull; 48-Hour Response SLA</span>
            </div>

          </div>

          {/* RIGHT COLUMN: Streamlined Step-Wise Form (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-white">
            
            {formStatus === 'success' ? (
              <div className="my-auto text-center py-12 space-y-5">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#111111]">
                  Application Received!
                </h3>
                <p className="text-[#555555] max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
                  Thank you for submitting your startup information. Dr. Melwin's team will evaluate your applicable government grant options and investor fit, reaching out within 48 hours.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormStatus('idle')
                      setCurrentStep(1)
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        location: '',
                        website_or_linkedin: '',
                        sector: 'AI, Software & SaaS',
                        stage: '🛠️ Prototype / Working Demo Built',
                        one_line_pitch: '',
                        funding_type: '🌐 Both Grants & Private Funding',
                        target_amount: '₹20 Lakhs – ₹50 Lakhs (Grant + Seed Blend)',
                        deck_url: ''
                      })
                    }}
                    className="bg-[#111111] text-white px-6 py-3 rounded-full font-bold text-xs hover:bg-black transition-colors shadow-sm"
                  >
                    Submit Another Application
                  </button>
                  <Link
                    href="/"
                    className="bg-neutral-100 text-[#111111] border border-black/10 px-6 py-3 rounded-full font-medium text-xs hover:bg-neutral-200 transition-colors"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Step Progress Indicators Bar */}
                <div className="space-y-3 pb-2 border-b border-black/10">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#666666]">
                      STEP {currentStep} OF 3 &bull;{' '}
                      <strong className="text-[#111111]">
                        {currentStep === 1
                          ? 'You & Your Startup'
                          : currentStep === 2
                          ? 'What You Are Building'
                          : 'Funding Goals & Pitch Deck'}
                      </strong>
                    </span>
                    <span className="text-emerald-700 font-bold">
                      {Math.round((currentStep / 3) * 100)}% Complete
                    </span>
                  </div>

                  {/* 3 Step Pill Bars */}
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((stepNum) => (
                      <button
                        key={stepNum}
                        type="button"
                        onClick={() => {
                          if (stepNum < currentStep) setCurrentStep(stepNum)
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentStep >= stepNum
                            ? 'bg-[#111111]'
                            : 'bg-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Form Container with Animated Step Transition */}
                <form onSubmit={currentStep === 3 ? handleSubmit : handleNext} className="space-y-5">
                  <AnimatePresence mode="wait">
                    
                    {/* STEP 1: Founder & Startup Basics */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-[#111111]">Founder & Startup Information</h4>
                          <p className="text-xs text-[#666666]">
                            Tell us who you are and where your venture is based.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Name */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-xs font-semibold text-[#333333]">
                              Founder Full Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Anand Varma"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                            />
                          </div>

                          {/* Email */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-xs font-semibold text-[#333333]">
                              Email Address <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="e.g. anand@startup.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                            />
                          </div>

                          {/* Phone */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-xs font-semibold text-[#333333]">
                              Phone / WhatsApp Number <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="e.g. +91 98765 43210"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                            />
                          </div>

                          {/* Startup Name */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-xs font-semibold text-[#333333]">
                              Startup / Project Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. BioCure Health"
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                            />
                          </div>

                          {/* Location */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-xs font-semibold text-[#333333]">
                              City & Country <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Bengaluru, India (or Dubai, UAE)"
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                            />
                          </div>

                          {/* Website or LinkedIn */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-xs font-semibold text-[#333333]">
                              Website or LinkedIn (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. yourstartup.com or linkedin.com/in/..."
                              value={formData.website_or_linkedin}
                              onChange={(e) => setFormData({ ...formData, website_or_linkedin: e.target.value })}
                              className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: What You Are Building & Progress */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-[#111111]">What You Are Building</h4>
                          <p className="text-xs text-[#666666]">
                            Help us understand your product and current progress.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Sector */}
                            <div className="space-y-1.5 text-left">
                              <label className="text-xs font-semibold text-[#333333]">
                                Industry / Sector <span className="text-rose-500">*</span>
                              </label>
                              <select
                                value={formData.sector}
                                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-black focus:bg-white transition-colors"
                              >
                                <option value="AI, Software & SaaS">AI, Software & SaaS</option>
                                <option value="HealthTech, BioTech & MedTech">HealthTech, BioTech & MedTech</option>
                                <option value="Hardware, Robotics & DeepTech">Hardware, Robotics & DeepTech</option>
                                <option value="CleanTech, EV & Energy">CleanTech, EV & Energy</option>
                                <option value="FinTech & Web3">FinTech & Web3</option>
                                <option value="Consumer, D2C & EdTech">Consumer, D2C & EdTech</option>
                                <option value="Other / Multi-Sector">Other / Multi-Sector</option>
                              </select>
                            </div>

                            {/* Stage */}
                            <div className="space-y-1.5 text-left">
                              <label className="text-xs font-semibold text-[#333333]">
                                Current Stage <span className="text-rose-500">*</span>
                              </label>
                              <select
                                value={formData.stage}
                                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-black focus:bg-white transition-colors"
                              >
                                <option value="💡 Idea / Concept Phase">💡 Idea / Concept Phase</option>
                                <option value="🛠️ Prototype / Working Demo Built">🛠️ Prototype / Working Demo Built</option>
                                <option value="🚀 Launched with Early Users">🚀 Launched with Early Users</option>
                                <option value="📈 Generating Paying Customers / Revenue">📈 Generating Paying Customers / Revenue</option>
                              </select>
                            </div>
                          </div>

                          {/* One-Line Pitch */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-xs font-semibold text-[#333333]">
                              What does your startup do? <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                              required
                              rows={3}
                              placeholder="In 1-2 simple sentences, what problem do you solve and what is your product/solution?"
                              value={formData.one_line_pitch}
                              onChange={(e) => setFormData({ ...formData, one_line_pitch: e.target.value })}
                              className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors resize-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: Funding Goals & Pitch Deck */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-[#111111]">Funding Goal & Presentation</h4>
                          <p className="text-xs text-[#666666]">
                            Share your funding objectives and a link to your deck or product.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Funding Type */}
                            <div className="space-y-1.5 text-left">
                              <label className="text-xs font-semibold text-[#333333]">
                                Support Needed <span className="text-rose-500">*</span>
                              </label>
                              <select
                                value={formData.funding_type}
                                onChange={(e) => setFormData({ ...formData, funding_type: e.target.value })}
                                className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-black focus:bg-white transition-colors"
                              >
                                <option value="🏛️ Government Grants (SISFS, BIRAC, MeitY, MSME)">🏛️ Government Grants</option>
                                <option value="🤝 Angel & Seed Syndicate Investment">🤝 Angel & Seed Syndicate</option>
                                <option value="🌐 Both Grants & Private Funding">🌐 Both Grants & Private Funding</option>
                                <option value="🧭 Seeking Advisory on the Best Options">🧭 Seeking Advisory on Options</option>
                              </select>
                            </div>

                            {/* Target Amount */}
                            <div className="space-y-1.5 text-left">
                              <label className="text-xs font-semibold text-[#333333]">
                                Target Funding Amount <span className="text-rose-500">*</span>
                              </label>
                              <select
                                value={formData.target_amount}
                                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                                className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-black focus:bg-white transition-colors"
                              >
                                <option value="Up to ₹20 Lakhs (Early Grant Focus)">Up to ₹20 Lakhs</option>
                                <option value="₹20 Lakhs – ₹50 Lakhs (Grant + Seed Blend)">₹20 Lakhs – ₹50 Lakhs</option>
                                <option value="₹50 Lakhs – ₹1.5 Crore (Angel / Syndicate Seed)">₹50 Lakhs – ₹1.5 Crore</option>
                                <option value="₹1.5 Crore+ (Growth Capital)">₹1.5 Crore+</option>
                                <option value="Exploring Options / Not Sure">Exploring Options / Open</option>
                              </select>
                            </div>
                          </div>

                          {/* Pitch Deck / Presentation Link */}
                          <div className="space-y-1.5 text-left">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-semibold text-[#333333] flex items-center gap-1.5">
                                <LinkIcon className="w-3.5 h-3.5 text-neutral-600" />
                                <span>Pitch Deck, One-Pager, or Demo Link <span className="text-rose-500">*</span></span>
                              </label>
                            </div>
                            <input
                              type="url"
                              required
                              placeholder="e.g. https://docsend.com/... or https://drive.google.com/... or your website"
                              value={formData.deck_url}
                              onChange={(e) => setFormData({ ...formData, deck_url: e.target.value })}
                              className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                            />
                            <p className="text-[11px] text-neutral-500">
                              💡 Don't have a formal deck yet? A simple Google Drive folder, Notion page, demo video, or website link works great!
                            </p>
                          </div>

                          {/* Quick Summary Box */}
                          <div className="bg-[#f8f9fa] border border-black/10 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-xs space-y-1.5 text-[#444444]">
                            <div className="flex justify-between">
                              <span className="text-[#777777]">Applicant:</span>
                              <span className="font-semibold text-[#111111] truncate max-w-[200px]">{formData.name} &bull; {formData.company}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#777777]">Sector:</span>
                              <span className="font-semibold text-emerald-700 truncate max-w-[220px]">{formData.sector}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#777777]">Target:</span>
                              <span className="font-semibold text-neutral-900 truncate max-w-[220px]">{formData.target_amount}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>

                  {/* Error Notification */}
                  {errorMessage && (
                    <p className="text-xs text-rose-700 text-left bg-rose-50 border border-rose-200 p-3 rounded-xl">
                      {errorMessage}
                    </p>
                  )}

                  {/* Step Navigation Controls */}
                  <div className="pt-4 border-t border-black/10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-[#111111] px-5 py-3 rounded-full text-xs font-semibold transition-colors border border-black/10 w-full sm:w-auto"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Previous Step</span>
                      </button>
                    ) : (
                      <div className="hidden sm:block" />
                    )}

                    {currentStep < 3 ? (
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-7 py-3 rounded-full text-xs font-bold transition-all shadow-md hover:scale-[1.02] w-full sm:w-auto"
                      >
                        <span>Continue to Next Step</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold transition-all shadow-lg hover:scale-[1.02] disabled:opacity-50 w-full sm:w-auto"
                      >
                        {formStatus === 'submitting' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting Application...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Application</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  )
}
