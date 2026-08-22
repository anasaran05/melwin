'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, 
  Sparkles, 
  ShoppingBag, 
  Code2, 
  Workflow, 
  Search, 
  ArrowRight, 
  ArrowUpRight,
  CheckCircle2, 
  Zap, 
  Clock, 
  Laptop,
  GraduationCap,
  Cpu,
  Layers,
  Rocket,
  ShieldCheck,
  Flame,
  ExternalLink,
  Play,
  Database,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

export type SolutionCategory = 'all' | 'products' | 'web' | 'ai' | 'saas'

export interface ShowcaseItem {
  id: string
  category: 'products' | 'web' | 'ai' | 'saas'
  categoryLabel: string
  categoryIcon: React.ComponentType<{ className?: string }>
  title: string
  badge: string
  badgeColor: string
  shortDesc: string
  fullDesc: string
  timeline: string
  metricLabel: string
  metricValue: string
  liveUrl?: string
  isInternalLink?: boolean
  highlights: string[]
  techStack: string[]
  accentColor: string
  renderPreview: () => React.ReactNode
}

const showcaseData: ShowcaseItem[] = [
  {
    id: 'zane-proed',
    category: 'products',
    categoryLabel: 'Featured Product',
    categoryIcon: GraduationCap,
    title: 'Zane ProEd Platform',
    badge: 'LIVE PRODUCT',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    shortDesc: 'High-scale professional EdTech & real-time learning management ecosystem with live classes and interactive curriculum.',
    fullDesc: 'Engineered from scratch to empower students and educators with instant course streaming, dynamic quiz evaluations, automated certificate generation, and seamless batch enrollment.',
    timeline: 'Production Scale',
    metricLabel: 'Active Learners',
    metricValue: '15,000+',
    liveUrl: 'https://zaneproed.com',
    highlights: [
      'Interactive student dashboard & live lecture streaming',
      'Automated quiz grading & verifiable certificate issuance',
      'Integrated payment gateways & student progression tracking',
    ],
    techStack: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'AWS S3', 'Video CDN'],
    accentColor: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30',
    renderPreview: () => (
      <div className="w-full h-full p-4 flex flex-col justify-between bg-[#0f172a] text-white rounded-2xl border border-blue-900/40 text-left">
        <div className="flex items-center justify-between border-b border-blue-900/40 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-blue-400">zaneproed.com</span>
          </div>
          <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono font-semibold">EDTECH LMS</span>
        </div>
        <div className="space-y-2 py-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-200">Full-Stack Masterclass</span>
            <span className="text-[10px] text-blue-400 font-mono">Module 04/12</span>
          </div>
          <div className="w-full bg-blue-950/60 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full w-[72%] rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-slate-900/90 p-2 rounded-lg border border-blue-500/20">
              <span className="text-[10px] text-slate-400 block">Next Live Batch</span>
              <span className="text-xs font-bold text-white flex items-center gap-1"><Play className="size-3 text-blue-400 fill-blue-400" /> In 2 Hours</span>
            </div>
            <div className="bg-slate-900/90 p-2 rounded-lg border border-blue-500/20">
              <span className="text-[10px] text-slate-400 block">Certificate</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="size-3" /> Auto-Verified</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-blue-900/40">
          <span className="text-blue-300">Live WebRTC & CDN</span>
          <span>99.98% Stream SLA</span>
        </div>
      </div>
    ),
  },
  {
    id: 'alphatic-labs',
    category: 'products',
    categoryLabel: 'Featured Product',
    categoryIcon: Cpu,
    title: 'Alphatic Labs',
    badge: 'AI SOFTWARE & LAB',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    shortDesc: 'Artificial intelligence R&D hub and proprietary automation software lab building next-gen intelligence solutions.',
    fullDesc: 'Powers autonomous workflow bots, data extraction engines, LLM agents, and bespoke algorithmic solutions for scaling digital enterprises and modern startups.',
    timeline: 'Live Platform',
    metricLabel: 'Automations Run',
    metricValue: '1M+ Tasks',
    liveUrl: 'https://alphaticlabs.com',
    highlights: [
      'Proprietary AI agent orchestration framework',
      'Automated multimodal document analysis & data extraction',
      'High-throughput vector search & knowledge retrieval',
    ],
    techStack: ['Python', 'FastAPI', 'Claude 3.5 Sonnet', 'OpenAI', 'Pinecone Vector DB', 'Next.js 15'],
    accentColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
    renderPreview: () => (
      <div className="w-full h-full p-4 flex flex-col justify-between bg-neutral-950 text-white rounded-2xl border border-emerald-500/30 text-left">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-mono text-emerald-400 font-bold">alphaticlabs.com</span>
          </div>
          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">AI PIPELINE</span>
        </div>
        <div className="space-y-1.5 py-1 text-[11px] font-mono bg-black/60 p-2.5 rounded-lg border border-neutral-800 text-neutral-300">
          <div className="text-emerald-400">&gt; Initializing agent swarm...</div>
          <div className="text-neutral-400">&gt; Vector embedding match: 0.984</div>
          <div className="text-amber-300">&gt; Synthesis: 48 pages analyzed in 1.2s</div>
          <div className="text-emerald-300 font-bold">&gt; Task complete [HTTP 200 OK]</div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2 border-t border-neutral-800">
          <span className="text-emerald-400 flex items-center gap-1">
            <Zap className="size-3" /> 180ms Latency
          </span>
          <span>Zero-Drop Queue</span>
        </div>
      </div>
    ),
  },
  {
    id: 'startup-academy',
    category: 'products',
    categoryLabel: 'Featured Product',
    categoryIcon: Rocket,
    title: 'Startup Academy Platform',
    badge: 'INCUBATOR HUB',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    shortDesc: 'Venture acceleration portal providing founders with structured startup frameworks, mentor booking, and grant roadmaps.',
    fullDesc: 'Integrated platform featuring cohort tracking, investor pitch review workflows, curated legal and grant templates, and founder matchmaking.',
    timeline: 'Live Ecosystem',
    metricLabel: 'Startups Supported',
    metricValue: '250+ Founders',
    liveUrl: '/startup-academy',
    isInternalLink: true,
    highlights: [
      'Multi-stage founder cohort management',
      'Direct grant roadmap & government funding tracker',
      'Interactive business model canvas & pitch deck builder',
    ],
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Framer Motion'],
    accentColor: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
    renderPreview: () => (
      <div className="w-full h-full p-4 flex flex-col justify-between bg-neutral-900 text-white rounded-2xl border border-amber-500/30 text-left">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold">
            <Rocket className="size-3.5" /> Startup Academy
          </div>
          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">COHORT 2026</span>
        </div>
        <div className="space-y-2 py-2">
          <div className="flex items-center justify-between bg-neutral-950 p-2 rounded-lg border border-neutral-800">
            <div>
              <div className="text-xs font-bold text-white">Seed Readiness Gate</div>
              <div className="text-[10px] text-neutral-400">Financial Model & TAM Validation</div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">PASS</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-300 px-1">
            <span>Grant Pipeline Match</span>
            <span className="text-amber-400 font-mono font-bold">$100k Eligible</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2 border-t border-neutral-800">
          <span className="text-amber-400">Active Mentorship</span>
          <span>Cohort Sprint #4</span>
        </div>
      </div>
    ),
  },
  {
    id: 'wocha-brand',
    category: 'products',
    categoryLabel: 'Featured Brand',
    categoryIcon: Flame,
    title: 'Wocha Beverage Storefront',
    badge: 'HIGH-CONVERSION STORE',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    shortDesc: 'Ultra-sleek brand storefront with immersive kinetic animations, flavor discovery, and lightning-fast checkout.',
    fullDesc: 'Designed to elevate modern retail presence with 60fps micro-interactions, mobile-first product configuration, localized shipping calculators, and omnichannel store locator.',
    timeline: 'Live Brand',
    metricLabel: 'Conversion Boost',
    metricValue: '+42% Sales',
    liveUrl: '/wocha',
    isInternalLink: true,
    highlights: [
      'Sub-second mobile checkout & Apple Pay integration',
      'Dynamic ingredient & nutrition interactive visualizer',
      'Interactive store locator with geolocation search',
    ],
    techStack: ['Next.js 15', 'Framer Motion', 'Shopify / Stripe API', 'Tailwind CSS'],
    accentColor: 'from-rose-500/20 to-orange-500/10 border-rose-500/30',
    renderPreview: () => (
      <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-2xl border border-rose-500/30 text-left">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400">
            <ShoppingBag className="size-3.5" /> Wocha Brand
          </div>
          <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">100/100 SPEED</span>
        </div>
        <div className="space-y-2 py-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-rose-400/20 rounded font-bold text-xs text-rose-300 px-1 flex items-center">Sparkling Matcha</div>
            <span className="text-xs font-mono font-bold text-white">$24.00</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold text-emerald-400">12pk</div>
            <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] text-neutral-400">24pk</div>
            <div className="flex-1 h-8 bg-rose-500 rounded-lg text-black font-bold text-[11px] flex items-center justify-center gap-1">
              <span>Instant Cart</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2 border-t border-neutral-800">
          <span className="text-emerald-400">0.38s Mobile LCP</span>
          <span>Apple Pay Ready</span>
        </div>
      </div>
    ),
  },
  {
    id: 'ai-blog-engine',
    category: 'ai',
    categoryLabel: 'AI & Automation',
    categoryIcon: Sparkles,
    title: 'Autonomous AI Content & SEO Engine',
    badge: 'AUTOPILOT GROWTH',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    shortDesc: 'Autonomous keyword-driven content system that writes, formats, and publishes high-ranking SEO articles directly to your CMS.',
    fullDesc: 'Continuously monitors high-intent search keywords in your industry, writes in-depth branded articles, generates diagrams, formats meta tags, and pushes directly to Next.js or headless CMS.',
    timeline: 'Setup in 3 Days',
    metricLabel: 'Organic Reach',
    metricValue: '10x Content',
    highlights: [
      'Automated semantic keyword research and clustering',
      'Fact-checked AI writing matching your exact brand tone',
      'Direct webhook publishing with OpenGraph image generation',
    ],
    techStack: ['Claude 3.5 Sonnet', 'GPT-4o', 'Headless CMS', 'Next.js SSR', 'Cron Jobs'],
    accentColor: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30',
    renderPreview: () => (
      <div className="w-full h-full p-4 flex flex-col justify-between bg-neutral-950 text-white rounded-2xl border border-purple-500/30 text-left">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-400">
            <Sparkles className="size-3.5" /> SEO Article Engine
          </div>
          <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">AUTO-PILOT</span>
        </div>
        <div className="space-y-1.5 py-1 text-xs">
          <div className="text-[10px] text-neutral-400 font-mono">Target: <span className="text-white font-semibold">"Best AI Dev Squads 2026"</span></div>
          <div className="bg-purple-950/40 p-2 rounded-lg border border-purple-500/20 text-[11px] text-purple-200">
            &bull; 2,400 words written &bull; 14 SEO headers &bull; Schema markup generated
          </div>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
            <CheckCircle2 className="size-3" /> Published to production CMS
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2 border-t border-neutral-800">
          <span className="text-purple-400">Rank #1 Target</span>
          <span>Zero Human Overhead</span>
        </div>
      </div>
    ),
  },
  {
    id: 'saas-core',
    category: 'saas',
    categoryLabel: 'SaaS & MVP',
    categoryIcon: Code2,
    title: 'Enterprise SaaS MVP & Billing Stack',
    badge: '3-WEEK SPRINT',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    shortDesc: 'Production-ready full-stack SaaS scaffold with authentication, tenant isolation, Stripe billing, and live dashboards.',
    fullDesc: 'Launch your software business in weeks instead of quarters. Complete with role-based access control (RBAC), team workspaces, webhook handlers, and transactional emails.',
    timeline: '3 Weeks Delivery',
    metricLabel: 'Speed to Market',
    metricValue: '3 Weeks',
    highlights: [
      'Auth.js / Clerk authentication with OAuth and 2FA',
      'Stripe customer portal & tiered subscription webhooks',
      'Interactive data charts, filtering & real-time notifications',
    ],
    techStack: ['Next.js 15', 'TypeScript', 'Prisma ORM', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    accentColor: 'from-emerald-500/20 to-blue-500/10 border-emerald-500/30',
    renderPreview: () => (
      <div className="w-full h-full p-4 flex flex-col justify-between bg-neutral-950 text-white rounded-2xl border border-emerald-500/30 text-left">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
            <BarChart3 className="size-3.5" /> SaaS Operations Hub
          </div>
          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">MRR $42.5K</span>
        </div>
        <div className="space-y-2 py-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-400">Subscribers</span>
              <div className="text-sm font-bold text-white">1,420 Paid</div>
            </div>
            <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-400">Churn Rate</span>
              <div className="text-sm font-bold text-emerald-400">0.8%</div>
            </div>
          </div>
          <div className="h-6 w-full bg-neutral-900 rounded-lg flex items-center px-2 text-[10px] text-neutral-300 justify-between">
            <span>Stripe Webhook Sync</span>
            <span className="text-emerald-400 font-mono">HEALTHY</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2 border-t border-neutral-800">
          <span className="text-emerald-400">Multi-Tenant RBAC</span>
          <span>Postgres Scaled</span>
        </div>
      </div>
    ),
  },
]

export function AtomSeServicesSection() {
  const [selectedCategory, setSelectedCategory] = useState<SolutionCategory>('all')
  const [activeModalItem, setActiveModalItem] = useState<ShowcaseItem | null>(null)

  const filteredItems = showcaseData.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  )

  const categories: { key: SolutionCategory; label: string; count: number }[] = [
    { key: 'all', label: 'All Capabilities', count: showcaseData.length },
    { key: 'products', label: 'Featured Products', count: showcaseData.filter((i) => i.category === 'products').length },
    { key: 'ai', label: 'AI & Automation', count: showcaseData.filter((i) => i.category === 'ai').length },
    { key: 'saas', label: 'SaaS & Apps', count: showcaseData.filter((i) => i.category === 'saas').length },
  ]

  return (
    <section 
      id="showcase" 
      className="py-16 md:py-28 px-4 sm:px-6 md:px-12 w-full bg-[#f2f2f2] relative scroll-mt-20 border-t border-black/[0.04]"
    >
      <div id="services" className="sr-only" />
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200/80 border border-neutral-300 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>PRODUCTION SHOWCASE & CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight leading-[1.1]">
              What We Build, Ship & Scale.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Explore our live product ecosystem, bespoke platforms, AI pipelines, and high-performance software engineered for market leaders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/atom-se/pricing"
              className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all shadow-sm hover:scale-105"
            >
              <span>View Pricing & Scope</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-b border-black/[0.08] pb-4">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-md scale-105'
                    : 'bg-white text-neutral-600 hover:text-black border border-black/10 hover:border-black/20'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Bento Grid of Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const CategoryIcon = item.categoryIcon
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-black/10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.09)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Top Badge & Metric */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-neutral-400 block">{item.metricLabel}</span>
                        <span className="text-xs font-black font-mono text-neutral-900">{item.metricValue}</span>
                      </div>
                    </div>

                    {/* Interactive Visual Preview Box */}
                    <div className="h-44 w-full rounded-2xl overflow-hidden shadow-inner relative">
                      {item.renderPreview()}
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2 pt-1">
                      <h3 className="text-lg font-bold text-neutral-900 group-hover:text-black transition-colors flex items-center justify-between">
                        <span>{item.title}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3">
                        {item.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Tech Stack & Actions */}
                  <div className="pt-5 mt-5 border-t border-neutral-100 space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {item.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                      {item.techStack.length > 3 && (
                        <span className="text-[10px] font-mono text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded-md">
                          +{item.techStack.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {item.liveUrl ? (
                        item.isInternalLink ? (
                          <Link
                            href={item.liveUrl}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-black group-hover:translate-x-0.5 transition-all"
                          >
                            <span>Explore Venture</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <span>Visit Live Site</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )
                      ) : (
                        <span className="text-[11px] font-mono text-neutral-400">{item.timeline}</span>
                      )}

                      <button
                        onClick={() => setActiveModalItem(item)}
                        className="text-xs font-semibold text-neutral-500 hover:text-black transition-colors underline underline-offset-4 decoration-neutral-300"
                      >
                        View Architecture
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Banner to Pricing */}
        <div className="rounded-3xl p-8 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-neutral-800">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl font-bold text-white">Have a specific product or website in mind?</h4>
            <p className="text-xs sm:text-sm text-neutral-400">
              Calculate instant estimates for landing pages, multi-page platforms, e-commerce, SaaS, or AI pipelines.
            </p>
          </div>
          <Link
            href="/atom-se/pricing"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-100 px-6 py-3 rounded-full font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <span>Interactive Pricing Calculator</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </Link>
        </div>

      </div>

      {/* Architecture Detail Modal */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-black/10 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${activeModalItem.badgeColor}`}>
                    {activeModalItem.badge}
                  </span>
                  <h3 className="text-2xl font-black text-neutral-900 mt-1">{activeModalItem.title}</h3>
                </div>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
                >
                  &times;
                </button>
              </div>

              <div className="py-5 space-y-5">
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {activeModalItem.fullDesc}
                </p>

                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider mb-2">
                    Key Highlights & Implementation
                  </h4>
                  <div className="space-y-2">
                    {activeModalItem.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider mb-2">
                    Technology & Infrastructure Matrix
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeModalItem.techStack.map((tech) => (
                      <span key={tech} className="text-xs font-mono bg-neutral-100 text-neutral-800 px-3 py-1 rounded-lg border border-neutral-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                {activeModalItem.liveUrl ? (
                  activeModalItem.isInternalLink ? (
                    <Link
                      href={activeModalItem.liveUrl}
                      className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-black transition-colors"
                    >
                      <span>Open Venture Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <a
                      href={activeModalItem.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                      <span>Visit Live Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )
                ) : (
                  <span className="text-xs text-neutral-500">Atom SE Custom Engineering</span>
                )}

                <Link
                  href="#project-form"
                  onClick={() => setActiveModalItem(null)}
                  className="text-xs font-bold text-neutral-900 hover:text-black underline"
                >
                  Request Similar Build &rarr;
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
