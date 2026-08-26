'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Footer } from '@/components/footer'
import {
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  Users,
  Video,
  DollarSign,
  Briefcase,
  FileText,
  X,
  Cpu
} from 'lucide-react'

interface ServiceItem {
  id: string
  title: string
  subtitle: string
  category: string
  description: string
  isOpen: boolean
  tag: string
  statusBadge: string
  icon: React.ElementType
  href?: string
  highlights: string[]
  lockedReason?: string
}

const servicesData: ServiceItem[] = [
  // 1. BMF Club (Open)
  {
    id: 'bmfc',
    title: 'BMF Club (BMFC)',
    subtitle: 'Private Startup Founder & Creator Community',
    category: 'Ecosystem & Community',
    description: 'Join 23,000+ ambitious entrepreneurs for weekly masterminds, real-time collaboration, peer dealflow, investor networking, and exclusive startup growth playbooks.',
    isOpen: true,
    tag: 'FREE LIFETIME ACCESS',
    statusBadge: 'OPEN FOR FOUNDERS',
    icon: Users,
    href: '/bmf-club',
    highlights: [
      'Active network of 23,000+ founders & operators',
      'Weekly masterminds & expert Q&A sessions',
      'Executive Metal Card & digital membership ID',
      'Exclusive startup perks, credits & partner discounts'
    ]
  },
  // 2. Personal Branding (Open)
  {
    id: 'personal-branding',
    title: 'Personal Branding (Agency)',
    subtitle: 'Executive Content Engine & DFY Video Production',
    category: 'Media & Authority',
    description: 'Turn the founder into the #1 customer acquisition channel. Complete done-for-you video production, studio shoots, scriptwriting, and executive authority on LinkedIn & Instagram.',
    isOpen: true,
    tag: 'RETAINER COHORTS',
    statusBadge: 'OPEN FOR CLIENTS',
    icon: Video,
    href: '/agency',
    highlights: [
      'Strategic scriptwriting & viral narrative positioning',
      'Complete DFY physical shoots & cinema-grade gear',
      'High-velocity reels, shorts & carousel creation',
      'Direct revenue & inbound lead pipeline alignment'
    ]
  },
  // 3. Atom SE (Open)
  {
    id: 'atom-se',
    title: 'Atom SE (Tech & AI Studio)',
    subtitle: 'Full-Stack Software, AI Agents & High-Performance Web Apps',
    category: 'Technology & Product',
    description: 'Bespoke engineering arm building production-ready web apps, scalable APIs, AI automation pipelines, and enterprise-grade software products.',
    isOpen: true,
    tag: 'TECH RETAINERS',
    statusBadge: 'OPEN FOR CLIENTS',
    icon: Cpu,
    href: '/atom-se',
    highlights: [
      'Modern Next.js, React, Node.js & cloud infrastructure',
      'Custom AI agents, LLM workflows & automation',
      'High-performance UI/UX design & fluid animations',
      'End-to-end product architecture & maintenance'
    ]
  },
  // 4. Funding & Grants (Open)
  {
    id: 'funding-grants',
    title: 'Funding & Grants Matchmaking',
    subtitle: 'Government Subsidies & Investor Syndication',
    category: 'Capital & Investment',
    description: 'Seed pitch deck refinement, state & central government grant subsidies, angel investor syndicate matchmaking, and due-diligence data room prep.',
    isOpen: true,
    tag: '2026 ACTIVE SCHEMES',
    statusBadge: 'OPEN FOR FOUNDERS',
    icon: DollarSign,
    href: '/funding-grants',
    highlights: [
      'Startup India Seed Fund & Grant application support',
      'Curated pitch deck reviews & financial models',
      'Direct warm intros to vetted angel investors',
      'Term sheet negotiation & cap-table structuring'
    ]
  },
  // 5. Jobs & Startup Talent (Locked)
  {
    id: 'jobs-talent',
    title: 'Jobs & Startup Talent Hub',
    subtitle: 'Pre-Vetted Engineering & Growth Hiring',
    category: 'Talent & Recruitment',
    description: 'Curated talent network matching high-impact founding engineers, full-stack developers, product designers, and growth marketers with funded startups.',
    isOpen: false,
    tag: 'AVAILABLE SOON',
    statusBadge: 'LOCKED',
    icon: Briefcase,
    lockedReason: 'Our talent network and verification pipelines are gearing up. This service will be available soon!',
    highlights: [
      'Technical assessment & skill verification',
      'Zero-headache candidate matching',
      'Fractional CTO & engineering lead placements',
      'Founder-first hiring agreements'
    ]
  },
  // 6. Biz Registrations & Legal Compliance (Locked)
  {
    id: 'business-services',
    title: 'Biz Registrations & Legal Compliance',
    subtitle: 'Company Incorporation, GST, IP & CA Filings',
    category: 'Legal & Business',
    description: 'Hassle-free company registration (Pvt Ltd / LLP), monthly GST returns, trademark IP protection, founder vesting agreements, and bookkeeping.',
    isOpen: false,
    tag: 'AVAILABLE SOON',
    statusBadge: 'LOCKED',
    icon: FileText,
    lockedReason: 'Partner CA & legal onboarding is in progress. This service will be available soon!',
    highlights: [
      'Fast-track Pvt Ltd & LLP company registration',
      'Monthly GST & TDS returns with zero penalties',
      'Co-founder agreements, NDAs & ESOP drafting',
      'Dedicated CA advisor for startup audits'
    ]
  }
]

export default function ServicesPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'open' | 'locked'>('all')
  const [activeLockedModal, setActiveLockedModal] = useState<ServiceItem | null>(null)

  const filteredServices = servicesData.filter((item) => {
    if (selectedFilter === 'open') return item.isOpen
    if (selectedFilter === 'locked') return !item.isOpen
    return true
  })

  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden bg-[#f2f2f2] text-[#111111]">
      <div className="grain-overlay" />

      {/* Top Navigation */}
      <div className="pt-6 sm:pt-8 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111]/70 hover:text-[#111111] transition-all py-2.5 px-4 rounded-full bg-white border border-neutral-200/80 shadow-xs hover:scale-105 active:scale-95"
        >
          <span>&larr; Back to Home</span>
        </Link>

        <Link
          href="/bmf-club"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-[#111111] hover:bg-black transition-all py-2.5 px-4 rounded-full shadow-xs hover:scale-105 active:scale-95"
        >
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span>Join Founder's Club (Free)</span>
        </Link>
      </div>

      {/* Hero Header */}
      <section className="pt-12 pb-12 sm:pt-16 sm:pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto text-center space-y-6">
       

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#111111] max-w-4xl mx-auto leading-[1.05]"
        >
          Explore All Services <br />
          <span className="text-[#777777] font-semibold text-3xl sm:text-5xl md:text-6xl">& Venture Capabilities</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-[#555555] max-w-2xl mx-auto font-normal leading-relaxed"
        >
          A comprehensive suite of specialized arms built to build, scale, fund, and market ambitious startups. 
          BMF Club and Personal Branding are live for immediate access; our upcoming services are locked and will be available soon.
        </motion.p>

        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedFilter === 'all'
                ? 'bg-[#111111] text-white shadow-md'
                : 'bg-white text-[#555555] hover:text-black border border-black/10'
            }`}
          >
            All Services ({servicesData.length})
          </button>
          <button
            onClick={() => setSelectedFilter('open')}
            className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
              selectedFilter === 'open'
                ? 'bg-[#111111] text-white shadow-md'
                : 'bg-white text-[#555555] hover:text-black border border-black/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available Now ({servicesData.filter((s) => s.isOpen).length})</span>
          </button>
          <button
            onClick={() => setSelectedFilter('locked')}
            className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
              selectedFilter === 'locked'
                ? 'bg-[#111111] text-white shadow-md'
                : 'bg-white text-[#555555] hover:text-black border border-black/10'
            }`}
          >
            <Lock className="w-3 h-3 text-neutral-500" />
            <span>Locked • Available Soon ({servicesData.filter((s) => !s.isOpen).length})</span>
          </button>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-8 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service, index) => {
            const Icon = service.icon
            const isOpen = service.isOpen

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isOpen
                    ? 'bg-white border-2 border-black/10 shadow-lg hover:shadow-2xl hover:border-black hover:-translate-y-1.5'
                    : 'bg-[#e9e9e9]/80 border border-neutral-300/80 shadow-xs cursor-pointer group hover:bg-[#e4e4e4] hover:border-neutral-400'
                }`}
                onClick={() => {
                  if (!isOpen) {
                    setActiveLockedModal(service)
                  }
                }}
              >
                {/* Header Badge & Status */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${
                      isOpen
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'bg-neutral-300 text-neutral-700 group-hover:scale-105'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isOpen ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>ACTIVE • OPEN</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-neutral-200/90 text-neutral-700 border border-neutral-300/80">
                          <Lock className="w-3 h-3 text-neutral-600" />
                          <span>LOCKED</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
                      {service.category}
                    </span>
                    <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${
                      isOpen ? 'text-[#111111]' : 'text-neutral-800'
                    }`}>
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-neutral-600 mt-0.5">
                      {service.subtitle}
                    </p>
                  </div>

                  <p className={`text-sm leading-relaxed ${
                    isOpen ? 'text-[#555555]' : 'text-neutral-600'
                  }`}>
                    {service.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="mt-6 pt-5 border-t border-black/[0.06] space-y-2.5">
                  {service.highlights.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      {isOpen ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      )}
                      <span className={isOpen ? 'text-[#333333] font-medium' : 'text-neutral-600'}>
                        {pt}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <div className="mt-8 pt-2">
                  {isOpen && service.href ? (
                    <Link
                      href={service.href}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white py-3.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Explore {service.title.split(' ')[0]}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center gap-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all group-hover:border-neutral-400 border border-neutral-300"
                    >
                      <Lock className="w-4 h-4 text-neutral-600" />
                      <span>Locked • Available Soon</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Bottom Ecosystem CTA Box */}
      <section className="pb-24 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto">
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-12 md:p-14 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
            <Users className="w-7 h-7" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto">
            Connect with Dr. Melwin
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Join the BMF Founder’s Club for networking, or book a 1-on-1 strategy consultation directly.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/bmf-club"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black px-8 py-4 rounded-full font-bold text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <span>Join Founder's Club (Free)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/#consultation"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white border border-white/20 px-8 py-4 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95"
            >
              <span>Consult with Melwin 1-1</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Locked Service Detail Modal */}
      <AnimatePresence>
        {activeLockedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-black/10 relative text-left"
            >
              <button
                onClick={() => setActiveLockedModal(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center border border-neutral-200">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200">
                    LOCKED • AVAILABLE SOON
                  </span>
                  <h3 className="text-xl font-black text-[#111111] mt-1">
                    {activeLockedModal.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[#555555] leading-relaxed mb-5">
                {activeLockedModal.description}
              </p>

              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-1.5 mb-6">
                <span className="text-xs font-bold text-neutral-800 block">
                  Service Status
                </span>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {activeLockedModal.lockedReason || 'This service is currently locked as we prepare our next rollout. It will be available soon!'}
                </p>
              </div>

              <div className="space-y-2 mb-6">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                  What’s coming in this arm:
                </span>
                {activeLockedModal.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveLockedModal(null)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md"
                >
                  <span>Got It</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
