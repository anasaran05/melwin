'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  GraduationCap,
  Rocket,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Send,
  Loader2,
  Users,
  Compass,
  PlayCircle,
  Award,
  Clock,
  Sparkles
} from 'lucide-react'

// Step-by-step curriculum: Build from 0 to Scale
const academyCurriculum = [
  {
    step: 'Module 01',
    title: 'Idea Validation & Problem Discovery',
    tag: 'BEFORE YOU CODE',
    desc: 'How to talk to 50 real customers, test whether people will actually pay, and avoid building things nobody wants.',
    points: ['The Mom Test interviewing method', 'Landing page smoke tests & pre-orders', 'Competitor gap analysis'],
  },
  {
    step: 'Module 02',
    title: 'Building Your MVP in 3 Weeks',
    tag: 'RAPID PROTOTYPING',
    desc: 'Stop over-engineering. Learn how to launch a simple working product using modern tools without wasting months.',
    points: ['Choosing the fastest tech stack', 'Core features vs nice-to-have features', 'Collecting real user feedback'],
  },
  {
    step: 'Module 03',
    title: 'Company Registration & Legal Setup',
    tag: 'FOUNDER FOUNDATIONS',
    desc: 'Clear guidance on Pvt Ltd, LLP, GST, co-founder equity splits, and essential legal protection.',
    points: ['Cap table & 4-year vesting schedules', 'Trademarking your brand name', 'Startup India DPIIT recognition'],
  },
  {
    step: 'Module 04',
    title: 'First 100 Paying Customers',
    tag: 'SALES & MARKETING',
    desc: 'Simple, repeatable frameworks to get your first paying users through cold outreach, LinkedIn, and local networking.',
    points: ['Direct WhatsApp & LinkedIn sales scripts', 'Organic content & short video playbook', 'Referral & affiliate loops'],
  },
  {
    step: 'Module 05',
    title: 'Grants & Fundraising from Scratch',
    tag: 'CAPITAL ENGINE',
    desc: 'How to secure government grants (SISFS, BIRAC), build a winning 10-slide pitch deck, and pitch angel investors.',
    points: ['Non-dilutive grant application playbooks', 'Pitch deck storytelling & financial model', 'Term sheet negotiations & SAFE notes'],
  },
  {
    step: 'Module 06',
    title: 'Hiring, Delegation & Scaling to ₹1 Cr+ ARR',
    tag: 'SCALE & OPERATE',
    desc: 'Transition from solo builder to CEO. Build simple SOPs, hire your first 5 engineers/marketers, and scale operations.',
    points: ['Hiring framework for early startups', 'Automating daily business operations', 'Unit economics & cashflow management'],
  },
]

const freeTemplates = [
  { name: '10-Slide Pitch Deck Template (Keynote / PPT)', format: 'Figma & PPT' },
  { name: 'Co-Founder Equity & Vesting Agreement', format: 'Word / PDF' },
  { name: 'Startup Financial Model & Runway Calculator', format: 'Google Sheets' },
  { name: 'Customer Discovery Call Script', format: 'Google Docs' },
]

export default function StartupAcademyPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    track: 'Complete 0-to-1 Founder Program',
    stage: 'I have an idea / Just starting',
    message: '',
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
          type: 'startup_academy',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          track: formData.track,
          stage: formData.stage,
          message: formData.message,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setFormStatus('success')
      } else {
        setFormStatus('error')
        setErrorMessage(data.error || 'Failed to submit. Please try again.')
      }
    } catch {
      setFormStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden bg-[#f2f2f2] text-[#111111]">
      <div className="grain-overlay" />
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 md:px-12 w-full relative">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/10 text-[#111111] text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
              <GraduationCap className="w-3.5 h-3.5 text-black" />
              <span>PRACTICAL FOUNDER EDUCATION</span>
            </div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#111111] max-w-4xl mx-auto leading-[1.05]"
          >
            Startup Academy 🎓 <br />
            <span className="text-[#777777]">Build From 0. Step-by-Step.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-[#555555] max-w-3xl mx-auto font-normal leading-relaxed"
          >
            No boring business theory. Real frameworks from building companies across India, USA, and Dubai. Learn how to turn an idea into paying customers, grants, and scalable software.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <a
              href="#enroll"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Join Founder Cohort</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#curriculum"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm transition-colors shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Curriculum</span>
            </a>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-left">
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">6 Modules</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">From Idea to Scale</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">100% Real</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">Battle-tested Playbooks</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">Free Docs</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">Decks & Templates</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">Mentorship</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">Dr. Melwin Direct QA</span>
            </div>
          </div>

        </div>
      </section>

      {/* Curriculum Grid */}
      <section id="curriculum" className="py-12 md:py-24 px-4 sm:px-6 md:px-12 w-full border-t border-black/[0.04]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
              STEP-BY-STEP ROADMAP
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight">
              The 0-to-1 Startup Curriculum
            </h2>
            <p className="text-sm sm:text-base text-[#666666] max-w-xl mx-auto">
              Everything you need to know about building, launching, and fundraising.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academyCurriculum.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      {item.step}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-800 px-2.5 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#111111]">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 space-y-2">
                  {item.points.map((pt) => (
                    <div key={pt} className="flex items-center gap-2 text-xs text-[#444444]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Downloadable Templates */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 w-full bg-[#ebebeb]/60 border-t border-b border-black/[0.04]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
              FREE FOUNDER TOOLKIT
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight">
              Ready-to-Use Startup Templates
            </h2>
            <p className="text-sm text-[#666666] max-w-lg mx-auto">
              Save hundreds of hours with pre-filled pitch decks, cap tables, and legal docs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {freeTemplates.map((t) => (
              <div 
                key={t.name}
                className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-black">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#111111]">{t.name}</h4>
                    <span className="text-[10px] text-neutral-400 font-mono">{t.format}</span>
                  </div>
                </div>
                <a
                  href="#enroll"
                  className="text-xs font-bold text-black hover:underline shrink-0"
                >
                  Download &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cohort Enrollment Form */}
      <section id="enroll" className="py-12 md:py-24 px-4 sm:px-6 md:px-12 w-full scroll-mt-20">
        <div className="max-w-4xl mx-auto bg-[#111111] text-white rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden">
          
          {formStatus === 'success' ? (
            <div className="text-center py-12 space-y-5">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Registration Received!
              </h2>
              <p className="text-neutral-300 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                Thank you for signing up for the Startup Academy. You will receive an invitation link to the upcoming live session and access to the free founder toolkit on WhatsApp / Email within 24 hours.
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
                      track: 'Complete 0-to-1 Founder Program',
                      stage: 'I have an idea / Just starting',
                      message: '',
                    })
                  }}
                  className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-neutral-200 transition-colors"
                >
                  Register Another Founder
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
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                  LEARN & BUILD PROPERLY
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                  Join the Next Founder Cohort
                </h2>
                <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed pt-1">
                  Fill in your details below to get notified about upcoming live masterclasses and download the founder resources.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Your Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Saravanan K."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Email Address <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. saravanan@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

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

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Current Stage
                    </label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="I have an idea / Just starting">I have an idea / Just starting</option>
                      <option value="Building prototype / MVP">Building prototype / MVP</option>
                      <option value="Have working product, looking for first customers">Have working product, looking for first customers</option>
                      <option value="Looking to raise grants or angel funding">Looking to raise grants or angel funding</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-medium text-neutral-300">
                    What is your startup idea or what do you want to learn? <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what problem you want to solve, your current background (tech, student, working professional), and your biggest obstacle..."
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
                        <span>Joining Academy...</span>
                      </>
                    ) : (
                      <>
                        <span>Join Academy Cohort</span>
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
