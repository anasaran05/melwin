'use client'

import React, { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  CheckCircle2,
  ArrowRight,
  Calculator,
  Sparkles,
  Zap,
  Globe,
  ShoppingBag,
  Code2,
  Cpu,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  Layers,
  Send,
  Loader2,
  Lock,
  Clock,
  ExternalLink
} from 'lucide-react'
import { AtomSeNavbar } from '@/components/atom-se/navbar'
import { AtomSeFooter } from '@/components/atom-se/footer'

interface PricingTier {
  id: string
  name: string
  badge: string
  popular?: boolean
  description: string
  priceUSD: string
  priceINR: string
  timeline: string
  bestFor: string
  features: string[]
  icon: React.ComponentType<{ className?: string }>
  accent: string
}

const pricingTiers: PricingTier[] = [
  {
    id: 'landing-page',
    name: 'Landing Page & Portfolio',
    badge: 'RAPID LAUNCH',
    description: 'High-converting, ultra-fast single page or portfolio designed to turn visitors into booked calls and paying customers.',
    priceUSD: '$499 – $899',
    priceINR: '₹39,000 – ₹69,000',
    timeline: '3 – 5 Days',
    bestFor: 'Creators, Founders, Solopreneurs, Product Launches',
    features: [
      '1 – 3 High-Conversion Sections / Pages',
      '100/100 Core Web Vitals Performance',
      'Smooth Framer Motion Micro-Interactions',
      'Lead Capture Form & Email Notifications',
      'SEO Metadata & OpenGraph Social Cards',
      'Vercel / Cloudflare Edge CDN Hosting Setup',
    ],
    icon: Globe,
    accent: 'border-blue-500/30 bg-blue-500/5 text-blue-600',
  },
  {
    id: 'corporate-site',
    name: 'Corporate & Multi-Page Platform',
    badge: 'MOST POPULAR',
    popular: true,
    description: 'Complete multi-page company portal with content management system, dynamic blog, and bespoke brand aesthetics.',
    priceUSD: '$1,499 – $2,499',
    priceINR: '₹1,19,000 – ₹1,89,000',
    timeline: '1 – 2 Weeks',
    bestFor: 'Established Businesses, Agencies, Professional Services',
    features: [
      '5 – 10 Bespoke Responsive Pages',
      'Easy-to-edit Headless CMS / Markdown Blog',
      'Custom Design System & Component Library',
      'CRM Integration (HubSpot, Notion, Airtable)',
      'Advanced On-Page SEO Architecture',
      'Interactive Calendly / Cal.com Booking Sync',
    ],
    icon: Layers,
    accent: 'border-amber-500/40 bg-amber-500/10 text-amber-600 ring-2 ring-amber-500/20',
  },
  {
    id: 'ecommerce-store',
    name: 'E-Commerce Storefront',
    badge: 'RETAIL READY',
    description: 'High-speed modern online store optimized for frictionless mobile checkout, dynamic cart, and localized payment gateways.',
    priceUSD: '$2,499 – $3,999',
    priceINR: '₹1,99,000 – ₹3,19,000',
    timeline: '2 – 3 Weeks',
    bestFor: 'D2C Brands, Digital Goods, Merch & Apparel Stores',
    features: [
      'Custom Product Catalog & Variant Selectors',
      'Sub-Second Slide-Over Cart & Instant Checkout',
      'Stripe / Razorpay / Apple Pay / UPI Gateways',
      'Automated Order Emails & Customer Portal',
      'Inventory Management & Webhook Sync',
      'Analytics & Conversion Funnel Tracking',
    ],
    icon: ShoppingBag,
    accent: 'border-rose-500/30 bg-rose-500/5 text-rose-600',
  },
  {
    id: 'saas-mvp',
    name: 'Full-Stack SaaS MVP',
    badge: 'VENTURE SCALE',
    description: 'Production-ready web application with authentication, database architecture, multi-tenancy, and subscription billing.',
    priceUSD: '$3,999 – $6,999',
    priceINR: '₹3,19,000 – ₹5,49,000',
    timeline: '3 – 4 Weeks',
    bestFor: 'Tech Founders, B2B SaaS, Platform Startups',
    features: [
      'Next.js 15 + TypeScript + PostgreSQL Stack',
      'Auth.js / Clerk Authentication (OAuth, 2FA)',
      'Stripe Subscription & Usage-Based Billing',
      'Interactive Analytics & Admin Dashboard',
      'Role-Based Access Control (RBAC)',
      'REST & GraphQL API Endpoints',
    ],
    icon: Code2,
    accent: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600',
  },
  {
    id: 'ai-pipeline',
    name: 'Applied AI & Automation Engine',
    badge: 'AUTOPILOT',
    description: 'Autonomous workflows, LLM agents, vector retrieval (RAG), and data processing pipelines connected to your stack.',
    priceUSD: '$2,999 – $5,499',
    priceINR: '₹2,39,000 – ₹4,39,000',
    timeline: '2 – 3 Weeks',
    bestFor: 'Companies Automating Repetitive Ops, AI Startups',
    features: [
      'Claude 3.5 & GPT-4o Agent Swarm Orchestration',
      'Vector Embeddings & Semantic Search (Pinecone)',
      'Autonomous Web Scrapers & Enrichment Bots',
      'Background Task Workers & Cron Queues',
      'Real-Time Streaming AI Responses in UI',
      'Token Cost Optimization & Security Guardrails',
    ],
    icon: Cpu,
    accent: 'border-purple-500/30 bg-purple-500/5 text-purple-600',
  },
  {
    id: 'dedicated-squad',
    name: 'Dedicated Engineering Squad',
    badge: 'MONTHLY RETAINER',
    description: 'A senior engineering squad embedded with your team for continuous rapid feature delivery, architectural reviews, and 24/7 SLA.',
    priceUSD: '$4,500 / month',
    priceINR: '₹3,50,000 / month',
    timeline: 'Ongoing Sprints',
    bestFor: 'Funded Startups & Enterprises Scaling High-Traffic Apps',
    features: [
      'Senior Full-Stack & AI Engineers',
      'Unlimited Task Queue & 48h Turnaround on Tasks',
      'CTO Advisory & Cloud Architecture Optimization',
      'Priority Bug Fixes & 24/7 Uptime Monitoring',
      'Weekly Strategy & Sprint Planning Calls',
      'Pause or Cancel Anytime with 14-Day Notice',
    ],
    icon: Zap,
    accent: 'border-neutral-700 bg-neutral-900 text-white',
  },
]

const projectTypes = [
  { id: 'landing', name: 'Landing Page / Portfolio', baseUSD: 650, baseINR: 52000, days: 4 },
  { id: 'business', name: 'Multi-Page Corporate Platform', baseUSD: 1800, baseINR: 144000, days: 10 },
  { id: 'ecommerce', name: 'E-Commerce Online Store', baseUSD: 2900, baseINR: 232000, days: 16 },
  { id: 'saas', name: 'Custom Full-Stack SaaS MVP', baseUSD: 4800, baseINR: 384000, days: 24 },
  { id: 'ai', name: 'Applied AI & Automation System', baseUSD: 3800, baseINR: 304000, days: 18 },
]

const addOnOptions = [
  { id: 'auth', name: 'User Authentication & User Profiles', priceUSD: 400, priceINR: 32000, days: 2 },
  { id: 'stripe', name: 'Payment Gateway / Stripe Subscriptions', priceUSD: 500, priceINR: 40000, days: 3 },
  { id: 'cms', name: 'Headless CMS for Easy Content Edits', priceUSD: 350, priceINR: 28000, days: 2 },
  { id: 'ai_agent', name: 'Custom AI Agent / LLM Integration', priceUSD: 850, priceINR: 68000, days: 4 },
  { id: 'seo_pro', name: 'Advanced SEO & Schema Architecture', priceUSD: 300, priceINR: 24000, days: 1 },
  { id: 'support_3m', name: '3-Month Priority Maintenance & Hosting SLA', priceUSD: 600, priceINR: 48000, days: 0 },
]

const faqs = [
  {
    q: 'How does payment work for a fixed-scope project?',
    a: 'We operate on transparent milestone-based payments: 50% upfront to kick off architecture and initial sprint, and 50% upon final staging approval and production deployment. For retainers, billing is monthly.',
  },
  {
    q: 'Who owns the code and intellectual property (IP)?',
    a: 'You do. 100%. Upon project completion and final payment, the entire GitHub repository, cloud configurations, domain assets, and design files are transferred to your organization with zero lock-in.',
  },
  {
    q: 'Can you work with our existing codebase or API?',
    a: 'Yes. We frequently integrate with existing databases (PostgreSQL, MySQL, MongoDB), third-party APIs, and legacy infrastructure while upgrading the front-end performance or adding AI capabilities.',
  },
  {
    q: 'What is your guarantee on page speed and performance?',
    a: 'Every web platform we build comes with a guaranteed 95+ to 100/100 Core Web Vitals score on mobile and desktop, utilizing Next.js server-side rendering and edge caching.',
  },
  {
    q: 'What happens after launch? Do you provide support?',
    a: 'Every build includes a complimentary 30-day post-launch warranty covering any bug fixes and performance tuning. We also offer ongoing monthly maintenance and sprint retainers.',
  },
]

export default function AtomSePricingPage() {
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD')
  const [selectedType, setSelectedType] = useState<string>('business')
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['cms', 'seo_pro'])
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Inquiry form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Calculate dynamic quote
  const currentTypeObj = projectTypes.find((t) => t.id === selectedType) || projectTypes[1]
  const totalBase = currency === 'USD' ? currentTypeObj.baseUSD : currentTypeObj.baseINR
  const totalAddons = selectedAddons.reduce((acc, addonId) => {
    const addon = addOnOptions.find((a) => a.id === addonId)
    if (!addon) return acc
    return acc + (currency === 'USD' ? addon.priceUSD : addon.priceINR)
  }, 0)
  const totalDays = currentTypeObj.days + selectedAddons.reduce((acc, addonId) => {
    const addon = addOnOptions.find((a) => a.id === addonId)
    return acc + (addon?.days || 0)
  }, 0)

  const estimatedTotal = totalBase + totalAddons

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId))
    } else {
      setSelectedAddons([...selectedAddons, addonId])
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')
    setErrorMessage('')

    const quoteSummary = `Project Type: ${currentTypeObj.name} | Addons: ${selectedAddons.join(', ') || 'None'} | Estimated Quote: ${currency === 'USD' ? '$' : '₹'}${estimatedTotal.toLocaleString()} (~${totalDays} days)`

    try {
      const res = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'atom_se_pricing_quote',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: currentTypeObj.name,
          message: `${formData.message}\n\n[CALCULATED ESTIMATE]: ${quoteSummary}`,
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
      setErrorMessage('Something went wrong. Please check your connection and try again.')
    }
  }

  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden bg-[#f2f2f2] text-[#111111]">
      <div className="grain-overlay" />
      <AtomSeNavbar />

      <div className="pt-28 sm:pt-36 pb-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-16 sm:space-y-24">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-200/80 border border-neutral-300 text-xs font-mono font-bold uppercase tracking-wider text-neutral-800">
            <Calculator className="w-3.5 h-3.5 text-amber-600" />
            <span>TRANSPARENT ENGINEERING QUOTATIONS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-neutral-950 tracking-tight leading-[1.08]">
            Clear Pricing. Sprint Velocity. Zero Lock-In.
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Predictable fixed-milestone scopes with senior engineering squads. Every deliverable comes with 100% full source-code ownership.
          </p>

          {/* Currency Toggle */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="text-xs font-semibold text-neutral-500">Currency:</span>
            <div className="inline-flex bg-white rounded-full p-1 border border-black/10 shadow-inner">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  currency === 'USD' ? 'bg-neutral-900 text-white shadow' : 'text-neutral-600 hover:text-black'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  currency === 'INR' ? 'bg-neutral-900 text-white shadow' : 'text-neutral-600 hover:text-black'
                }`}
              >
                INR (₹)
              </button>
            </div>
          </div>
        </div>

        {/* 6 Pricing Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pricingTiers.map((tier) => {
            const Icon = tier.icon
            return (
              <div
                key={tier.id}
                className={`bg-white rounded-3xl p-7 sm:p-8 border ${
                  tier.popular
                    ? 'border-neutral-900 shadow-2xl relative ring-2 ring-neutral-900/10'
                    : 'border-black/10 shadow-md hover:shadow-xl'
                } transition-all duration-300 flex flex-col justify-between`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-2xl border ${tier.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {tier.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">{tier.name}</h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-100">
                    <div className="text-2xl sm:text-3xl font-black font-mono text-neutral-950">
                      {currency === 'USD' ? tier.priceUSD : tier.priceINR}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1 font-mono">
                      <span>Timeline: <strong className="text-neutral-800">{tier.timeline}</strong></span>
                      <span className="text-emerald-600 font-bold">100% Code Handover</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                      Included Deliverables
                    </span>
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100">
                  <a
                    href="#calculator"
                    onClick={() => {
                      const matchType = projectTypes.find((t) => tier.id.includes(t.id))
                      if (matchType) setSelectedType(matchType.id)
                    }}
                    className={`w-full py-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                      tier.popular
                        ? 'bg-neutral-950 hover:bg-black text-white shadow-lg'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
                    }`}
                  >
                    <span>Customize & Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Interactive Scope & Price Estimator Calculator */}
        <section id="calculator" className="bg-[#111111] text-white rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl border border-neutral-800 relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-10">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                INSTANT SCOPE ESTIMATOR
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Calculate Your Custom Project Quotation
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
                Select your product architecture and optional features to generate an itemized quote estimate.
              </p>
            </div>

            {/* Step 1: Project Type Selection */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                1. Select Core Architecture Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {projectTypes.map((type) => {
                  const isSelected = selectedType === type.id
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'bg-neutral-800 border-white text-white shadow-md ring-1 ring-white/30'
                          : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{type.name}</div>
                      <div className="text-[11px] font-mono text-neutral-400 mt-1 flex items-center justify-between">
                        <span>Base: {currency === 'USD' ? `$${type.baseUSD}` : `₹${type.baseINR.toLocaleString()}`}</span>
                        <span>~{type.days} Days</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 2: Add-on Capabilities */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                2. Select Add-on Modules & Engineering Capabilities
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {addOnOptions.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id)
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all flex items-start justify-between gap-2 ${
                        isChecked
                          ? 'bg-neutral-800 border-emerald-500/60 text-white'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-neutral-200">{addon.name}</div>
                        <div className="text-[10px] font-mono text-neutral-500">
                          +{currency === 'USD' ? `$${addon.priceUSD}` : `₹${addon.priceINR.toLocaleString()}`}
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center mt-0.5 ${
                          isChecked ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-neutral-700'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Live Estimation Output Card */}
            <div className="bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-700 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Estimated Investment ({currentTypeObj.name})
                </span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white">
                  {currency === 'USD' ? `$${estimatedTotal.toLocaleString()}` : `₹${estimatedTotal.toLocaleString()}`}
                </div>
                <p className="text-xs text-emerald-400 flex items-center gap-1.5 justify-center md:justify-start">
                  <Clock className="w-3.5 h-3.5" />
                  Estimated Delivery: ~{totalDays} Working Days
                </p>
              </div>

              <a
                href="#inquiry"
                className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-lg hover:scale-105"
              >
                <span>Lock In This Quote</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </a>
            </div>

          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Clear answers regarding our contracts, deliverables, and engineering process.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-neutral-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-black' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Project Inquiry Section */}
        <section id="inquiry" className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-black/10 shadow-xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
              LET'S COMMENCE BUILD
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950">
              Submit Your Requirements & Quote
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
              Selected Configuration: <strong className="text-neutral-900">{currentTypeObj.name}</strong> ({currency === 'USD' ? `$${estimatedTotal.toLocaleString()}` : `₹${estimatedTotal.toLocaleString()}`})
            </p>
          </div>

          {formStatus === 'success' ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Quotation Inquiry Submitted!</h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                Dr. Melwin and our senior engineering team will review your estimated scope and connect with you on WhatsApp or Email within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#f9f9f9] border border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@acme.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#f9f9f9] border border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#f9f9f9] border border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Company / Project Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Tech"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[#f9f9f9] border border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Project Details / Custom Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Any specific reference websites, integrations, or launch deadlines..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#f9f9f9] border border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none"
                />
              </div>

              {formStatus === 'error' && (
                <p className="text-xs text-rose-600">{errorMessage}</p>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-black text-white px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all disabled:opacity-50"
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Project Quotation Request</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
                <Link href="/atom-se" className="text-xs text-neutral-500 hover:text-black">
                  &larr; Back to Atom SE Home
                </Link>
              </div>
            </form>
          )}
        </section>

      </div>

      <AtomSeFooter />
    </main>
  )
}
