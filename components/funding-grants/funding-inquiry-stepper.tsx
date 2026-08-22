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
  Sparkles,
  ShieldCheck,
  Building,
  Coins,
  FileText,
  User,
  Layers,
  ChevronRight
} from 'lucide-react'

export function FundingInquiryStepper() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    track: 'Government Grants (SISFS / BIRAC / MeitY)',
    sector: 'HealthTech / BioTech / MedTech',
    stage: 'Proof of Concept / Prototype',
    deck_url: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.company) {
        setErrorMessage('Please fill in all mandatory founder & venture details.')
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
    if (!formData.message) {
      setErrorMessage('Please provide a brief summary of your technology and grant goals.')
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
          track: formData.track,
          sector: formData.sector,
          stage: formData.stage,
          deck_url: formData.deck_url,
          message: formData.message
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setFormStatus('success')
      } else {
        setFormStatus('error')
        setErrorMessage(data.error || 'Failed to submit advisory request. Please try again.')
      }
    } catch {
      setFormStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <section id="apply" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 w-full bg-[#f2f2f2] text-[#111111] scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Two-Column Card Container (Light Theme) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-black/10 rounded-3xl overflow-hidden shadow-xl">
          
          {/* LEFT COLUMN: Visual & Trust Indicators (5 Cols) */}
          <div className="lg:col-span-5 relative bg-[#fafaf8] p-8 sm:p-12 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-black/10 min-h-[420px] lg:min-h-[640px]">
            
            {/* Background Graphic Asset with Soft Light Wash */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/funding.webp"
                alt="Capital Advisory & Grant Readiness"
                fill
                className="object-cover opacity-20 filter contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fafaf8] via-[#fafaf8]/85 to-[#fafaf8]/40" />
            </div>

            {/* Top Badge & Header */}
            <div className="relative z-10 space-y-4">
          
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111111] leading-tight">
                Request Grant & Funding Advisory
              </h2>

              <p className="text-xs sm:text-sm text-[#555555] leading-relaxed max-w-sm">
                Get your technology readiness level (TRL) audited by Dr. Melwin’s capital desk to unlock non-dilutive government schemes and matching angel syndicate pools.
              </p>
            </div>

            {/* Middle Feature Highlights */}
            <div className="relative z-10 my-auto py-6 space-y-3">
              <div className="flex items-center gap-3.5 bg-white border border-black/10 p-4 rounded-2xl shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#111111] block">Non-Dilutive First</span>
                  <span className="text-[11px] text-[#666666]">Preserve equity during proof-of-concept phase</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-white border border-black/10 p-4 rounded-2xl shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 border border-blue-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#111111] block">48-Hour Response SLA</span>
                  <span className="text-[11px] text-[#666666]">Direct technical eligibility audit feedback</span>
                </div>
              </div>
            </div>

          

          </div>

          {/* RIGHT COLUMN: Step-Wise Form Data Collector (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-white">
            
            {formStatus === 'success' ? (
              <div className="my-auto text-center py-12 space-y-5">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#111111]">
                  Venture Submitted for Review!
                </h3>
                <p className="text-[#555555] max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
                  Thank you for submitting your details. Dr. Melwin's capital advisory desk will audit your venture against active grant parameters and get in touch with actionable next steps within 48 hours.
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
                        track: 'Government Grants (SISFS / BIRAC / MeitY)',
                        sector: 'HealthTech / BioTech / MedTech',
                        stage: 'Proof of Concept / Prototype',
                        deck_url: '',
                        message: ''
                      })
                    }}
                    className="bg-[#111111] text-white px-6 py-3 rounded-full font-bold text-xs hover:bg-black transition-colors shadow-sm"
                  >
                    Submit Another Venture
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
                          ? 'Founder & Venture Details'
                          : currentStep === 2
                          ? 'Funding Track & Sector'
                          : 'Technology & Grant Goals'}
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
                    
                    {/* STEP 1: Founder & Venture Details */}
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
                          <h4 className="text-lg font-bold text-[#111111]">Founder & Entity Information</h4>
                          <p className="text-xs text-[#666666]">
                            Tell us who you are and where your startup is incorporated.
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
                              Official Email <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="e.g. anand@biocure.io"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                            />
                          </div>

                          {/* Phone */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-xs font-semibold text-[#333333]">
                              Phone / WhatsApp <span className="text-rose-500">*</span>
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

                          {/* Company */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-xs font-semibold text-[#333333]">
                              Startup / Company Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. BioCure Therapeutics Pvt Ltd"
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: Funding Track & Sector Focus */}
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
                          <h4 className="text-lg font-bold text-[#111111]">Target Track & Industry Focus</h4>
                          <p className="text-xs text-[#666666]">
                            Select the capital avenues you wish to explore.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Track Selection */}
                          <div className="space-y-1.5 text-left sm:col-span-2">
                            <label className="text-xs font-semibold text-[#333333]">
                              Target Funding / Grant Track
                            </label>
                            <select
                              value={formData.track}
                              onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                              className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-black focus:bg-white transition-colors"
                            >
                              <option value="Government Grants (SISFS / BIRAC / MeitY)">Government Grants (SISFS / BIRAC / MeitY)</option>
                              <option value="MSME & Innovation Prototyping Schemes">MSME & Innovation Prototyping Schemes</option>
                              <option value="Global Incubator / Accelerator Applications">Global Incubator / Accelerator (YC / Techstars)</option>
                              <option value="Angel Syndicate & Investor Matching Layer">Angel Syndicate & Investor Matching Layer</option>
                              <option value="Comprehensive Capital Readiness Audit">Comprehensive Capital Readiness Audit (All Tracks)</option>
                            </select>
                          </div>

                          {/* Sector Selection */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-xs font-semibold text-[#333333]">
                              Industry Sector
                            </label>
                            <select
                              value={formData.sector}
                              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                              className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-black focus:bg-white transition-colors"
                            >
                              <option value="HealthTech / BioTech / MedTech">HealthTech / BioTech / MedTech</option>
                              <option value="Artificial Intelligence / DeepTech / SaaS">Artificial Intelligence / DeepTech / SaaS</option>
                              <option value="Logistics / Hardware / Robotics">Logistics / Hardware / Robotics</option>
                              <option value="FinTech / Web3 / LegalTech">FinTech / Web3 / LegalTech</option>
                              <option value="ClimateTech / Clean Energy / AgriTech">ClimateTech / Clean Energy / AgriTech</option>
                              <option value="Consumer / D2C / EdTech">Consumer / D2C / EdTech</option>
                            </select>
                          </div>

                          {/* Current Stage */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-xs font-semibold text-[#333333]">
                              Current Readiness Stage
                            </label>
                            <select
                              value={formData.stage}
                              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                              className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-black focus:bg-white transition-colors"
                            >
                              <option value="Idea / Concept Phase">Idea / Concept Phase</option>
                              <option value="Proof of Concept / Prototype">Proof of Concept / Prototype</option>
                              <option value="MVP with Early Beta Traction">MVP with Early Beta Traction</option>
                              <option value="Market Ready / Paying Customers">Market Ready / Paying Customers</option>
                            </select>
                          </div>

                          {/* Pitch Deck / Link */}
                          <div className="space-y-1.5 text-left sm:col-span-2">
                            <label className="text-xs font-semibold text-[#333333]">
                              Pitch Deck / Website / Demo Link (Optional)
                            </label>
                            <input
                              type="url"
                              placeholder="https://drive.google.com/... or https://yourstartup.com"
                              value={formData.deck_url}
                              onChange={(e) => setFormData({ ...formData, deck_url: e.target.value })}
                              className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: Technology Innovation & Goals */}
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
                          <h4 className="text-lg font-bold text-[#111111]">Innovation Summary & Capital Goals</h4>
                          <p className="text-xs text-[#666666]">
                            Briefly outline your technology, patents/IP if any, and target grant timeline.
                          </p>
                        </div>

                        {/* Summary / Notes */}
                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-semibold text-[#333333]">
                            Summary of Technology & Current Traction <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            required
                            rows={4}
                            placeholder="Briefly state your core novelty, prototype readiness level, patents/IP filed, and how much funding or runway extension you aim to secure..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-[#f8f9fa] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors resize-none"
                          />
                        </div>

                        {/* Quick Recap Pill */}
                        <div className="bg-[#f8f9fa] border border-black/10 p-4 rounded-2xl text-xs space-y-1.5 text-[#444444]">
                          <div className="flex justify-between">
                            <span className="text-[#777777]">Founder:</span>
                            <span className="font-semibold text-[#111111]">{formData.name || '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#777777]">Company:</span>
                            <span className="font-semibold text-[#111111]">{formData.company || '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#777777]">Selected Track:</span>
                            <span className="font-semibold text-emerald-700 truncate max-w-[240px]">{formData.track}</span>
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
                  <div className="pt-4 border-t border-black/10 flex items-center justify-between gap-3">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-[#111111] px-5 py-3 rounded-full text-xs font-semibold transition-colors border border-black/10"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Previous Step</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 3 ? (
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-7 py-3 rounded-full text-xs font-bold transition-all shadow-md hover:scale-[1.02]"
                      >
                        <span>Continue to Next Step</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold transition-all shadow-lg hover:scale-[1.02] disabled:opacity-50"
                      >
                        {formStatus === 'submitting' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Evaluating Submission...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit for Funding Review</span>
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
