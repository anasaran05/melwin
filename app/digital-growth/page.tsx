'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  TrendingUp,
  Search,
  Share2,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Send,
  Loader2,
  Megaphone,
  Eye,
  BarChart3,
  Globe2,
  ShieldCheck
} from 'lucide-react'

const growthServices = [
  {
    icon: Share2,
    title: 'Social Media Management',
    tag: 'ORGANIC REACH',
    description: 'We plan, design, and post high-quality content across Instagram, LinkedIn, YouTube, and X so your brand stays active and gains genuine followers.',
    points: ['Content calendar & captions', 'Short-form reels & carousel designs', 'Daily community engagement'],
  },
  {
    icon: Search,
    title: 'Google Search Growth (SEO)',
    tag: 'FIRST PAGE RANKINGS',
    description: 'We optimize your website and write helpful articles so customers looking for your products find you first on Google instead of competitors.',
    points: ['Keyword research & blog content', 'Google Maps local optimization', 'Fixing website speed & technical errors'],
  },
  {
    icon: Target,
    title: 'Paid Ads (Meta & Google)',
    tag: 'MEASURABLE LEADS',
    description: 'We run targeted ads on Instagram, Facebook, and Google Search that bring paying customers, inquiries, and sales with positive return on ad spend.',
    points: ['Ad copywriting & visual designs', 'Audience targeting & A/B testing', 'Transparent weekly ROI reporting'],
  },
  {
    icon: Megaphone,
    title: 'Brand Identity & Visuals',
    tag: 'INSTANT TRUST',
    description: 'We design modern logos, color palettes, pitch presentations, and brand stylebooks that make your business look established and premium.',
    points: ['Logo & color guidelines', 'Social media templates', 'Pitch decks & marketing flyers'],
  },
  {
    icon: Eye,
    title: 'Founder Branding & Video',
    tag: 'EXECUTIVE INFLUENCE',
    description: 'Turn the founder into the #1 marketing engine. We help you script, record, and edit sharp videos and LinkedIn posts that build authority.',
    points: ['Founder video editing', 'LinkedIn ghostwriting', 'Speaking & podcast placements'],
  },
  {
    icon: BarChart3,
    title: 'Conversion Optimization',
    tag: 'TURN VISITORS INTO BUYERS',
    description: 'Already getting traffic but not enough sales? We rewrite your website copy, simplify forms, and add clear call-to-actions that double conversions.',
    points: ['Landing page audits', 'Heatmap & visitor behavior tracking', 'Clear customer buying journeys'],
  },
]

export default function DigitalGrowthPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Complete Social Media & Content',
    budget: '₹25,000 - ₹50,000 / month',
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
          type: 'digital_growth',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
          budget: formData.budget,
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
              <TrendingUp className="w-3.5 h-3.5 text-black" />
              <span>PARTNER-LED GROWTH & MARKETING NETWORK</span>
            </div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#111111] max-w-4xl mx-auto leading-[1.05]"
          >
            Digital Growth 📈 <br />
            <span className="text-[#777777]">Get more customers without confusion.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-[#555555] max-w-3xl mx-auto font-normal leading-relaxed"
          >
            We connect you with trusted, hand-picked growth partners who handle social media, Google search ranking (SEO), paid advertising, and brand design — with zero agency fluff.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <a
              href="#audit-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get a Free Growth Plan</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm transition-colors shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Marketing Services</span>
            </a>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-left">
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">1.7M+</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">Organic Impressions</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">100%</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">Verified Partners</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">Simple</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">Plain English Reporting</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">Direct</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">Measurable ROI</span>
            </div>
          </div>

        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-12 md:py-24 px-4 sm:px-6 md:px-12 w-full border-t border-black/[0.04]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
              OUR GROWTH STACK
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight">
              Marketing done simply and properly
            </h2>
            <p className="text-sm sm:text-base text-[#666666] max-w-xl mx-auto">
              Choose individual services or bundle them together into a monthly growth package.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {growthServices.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center text-[#111111]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#111111]">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[#555555] leading-relaxed">
                      {item.description}
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
              )
            })}
          </div>
        </div>
      </section>

      {/* Growth Audit Inquiry Form */}
      <section id="audit-form" className="py-12 md:py-24 px-4 sm:px-6 md:px-12 w-full scroll-mt-20">
        <div className="max-w-4xl mx-auto bg-[#111111] text-white rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden">
          
          {formStatus === 'success' ? (
            <div className="text-center py-12 space-y-5">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Growth Request Received!
              </h2>
              <p className="text-neutral-300 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                Thank you for reaching out. Dr. Melwin's growth partner team will review your brand and get back to you with a free initial audit and recommendation within 24 hours.
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
                      service: 'Complete Social Media & Content',
                      budget: '₹25,000 - ₹50,000 / month',
                      message: '',
                    })
                  }}
                  className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-neutral-200 transition-colors"
                >
                  Send Another Request
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
                  GROW YOUR REVENUE
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                  Request a Free Growth Plan
                </h2>
                <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed pt-1">
                  Tell us where you want to grow. We'll connect you with the right specialist partner to handle everything.
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
                      placeholder="e.g. Priya Sundaram"
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
                      placeholder="e.g. priya@brand.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Phone / WhatsApp Number <span className="text-emerald-400">*</span>
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
                      Brand / Company Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Surya Organics"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Primary Service Needed
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="Social Media & Reels Management">Social Media & Reels Management</option>
                      <option value="Google SEO & Website Ranking">Google SEO & Website Ranking</option>
                      <option value="Meta & Google Paid Advertising">Meta & Google Paid Advertising</option>
                      <option value="Brand Identity & Logo Design">Brand Identity & Logo Design</option>
                      <option value="Founder Branding & Personal Videos">Founder Branding & Personal Videos</option>
                      <option value="Complete All-In-One Growth Retainer">Complete All-In-One Growth Retainer</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Monthly Budget Range
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="₹15,000 - ₹25,000 / month">₹15,000 - ₹25,000 / month</option>
                      <option value="₹25,000 - ₹50,000 / month">₹25,000 - ₹50,000 / month</option>
                      <option value="₹50,000 - ₹1,00,000 / month">₹50,000 - ₹1,00,000 / month</option>
                      <option value="₹1,00,000+ / month (Enterprise)">₹1,00,000+ / month (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-medium text-neutral-300">
                    Tell us about your brand & what you want to achieve <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your Instagram or website link if any, current challenges, and what kind of customers you want to attract..."
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
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Growth Request</span>
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
