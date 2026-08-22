'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { BmfHeroSection } from '@/components/bmf-club/bmf-hero'
import { MemberDirectory } from '@/components/bmf-club/member-directory'
import { BmfIntroAnimation } from '@/components/bmf-club/bmf-intro-animation'
import { VerticalTabs } from '@/components/ui/vertical-tabs'
import { UpcomingEventsSection } from '@/components/bmf-club/upcoming-events-section'
import {
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Calendar,
  MessageSquare,
  Building2,
  Compass,
  Rocket,
  Flame,
  CheckCircle2,
  ExternalLink,
  Send,
  Loader2,
  Lock,
  Search,
  Filter,
} from 'lucide-react'

export default function BmfClubPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    stage: 'Early Traction / Seed',
    city: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bmf_club',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          stage: formData.stage,
          city: formData.city,
          message: formData.message
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setFormStatus('success')
      } else {
        setFormStatus('error')
        setErrorMessage(data.error || 'Failed to submit application. Please try again.')
      }
    } catch {
      setFormStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden bg-[#f2f2f2] text-[#111111]">
      <BmfIntroAnimation />
      <div className="grain-overlay" />
      <Navbar />

      {/* Interactive 3D Perspective Corridor Hero */}
      <BmfHeroSection />

      {/* Core Ecosystem Pillars - Vertical Tabs Experience */}
      <VerticalTabs className="border-t border-black/[0.04]" />

      {/* Dynamic 3D Flip Member Profile Directory & Founder Showcase */}
      <MemberDirectory />

      {/* Upcoming Private Events & Masterminds (Dynamic with Capacity Tracking & RSVP) */}
      <UpcomingEventsSection />

      {/* Join Application Section */}
      <section id="apply" className="py-12 md:py-24 px-4 sm:px-6 md:px-12 w-full scroll-mt-20">
        <div className="max-w-4xl mx-auto bg-[#111111] text-white rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden">
          
          {formStatus === 'success' ? (
            <div className="text-center py-12 space-y-5">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Application Received!
              </h2>
              <p className="text-neutral-300 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                Thank you for applying to the BMF Club. Our membership committee and Dr. Melwin’s office review every application manually to ensure community alignment. We will reach out via WhatsApp/Email within 48 hours.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormStatus('idle')
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      company: '',
                      stage: 'Early Traction / Seed',
                      city: '',
                      message: ''
                    })
                  }}
                  className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-neutral-200 transition-colors"
                >
                  Submit Another Application
                </button>
                <Link
                  href="/"
                  className="bg-neutral-900 text-white border border-white/20 px-6 py-3 rounded-full font-medium text-sm hover:bg-neutral-800 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-neutral-300 text-[11px] font-mono font-semibold uppercase tracking-wider">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Curated & Vetted Admission</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                  Apply to Join the BMF Club
                </h2>
                <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed pt-1">
                  Tell us about yourself and the company you are building. We look for conviction, integrity, and relentless execution.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Your Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Work / Personal Email <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@startup.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      WhatsApp Number <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Startup / Company Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NextGen BioTech"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  {/* Stage */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Current Venture Stage
                    </label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="Idea / Prototyping">Idea / Prototyping</option>
                      <option value="MVP / Early Traction">MVP / Early Traction</option>
                      <option value="Seed / Angel Funded">Seed / Angel Funded</option>
                      <option value="Series A+">Series A / Growth Stage</option>
                      <option value="Bootstrapped & Profitable">Bootstrapped & Profitable</option>
                    </select>
                  </div>

                  {/* City */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      City & Country <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bangalore, India"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                {/* Founder Bio / Links */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-medium text-neutral-300">
                    Tell us what you're building & share LinkedIn / Website URL <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Briefly describe your venture, what problems you solve, your traction so far, and what you hope to get out of the BMF Club..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>

                {formStatus === 'error' && (
                  <p className="text-xs text-rose-400 text-left">
                    {errorMessage}
                  </p>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black px-8 py-3.5 rounded-full font-bold text-sm transition-all disabled:opacity-50"
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit BMF Club Application</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <Link
                    href="/"
                    className="text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    &larr; Back to Dr. Melwin's Home
                  </Link>
                </div>
              </form>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}
