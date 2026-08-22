'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Laptop, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Sparkles, 
  Server, 
  Code2, 
  ArrowRight,
  Gauge,
  Lock,
  GitBranch,
  Timer
} from 'lucide-react'
import Link from 'next/link'

const capabilities = [
  {
    icon: Code2,
    badge: 'FULL-STACK CORE',
    title: 'Modern Web & App Architecture',
    desc: 'Bespoke Next.js, React, and TypeScript applications engineered with sub-second page loads, clean component architecture, and type-safe backend systems.',
    tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Prisma', 'REST & GraphQL'],
    accent: 'border-blue-500/20 bg-blue-500/5 text-blue-600',
  },
  {
    icon: Sparkles,
    badge: 'INTELLIGENT SYSTEMS',
    title: 'Applied AI & Automation Pipelines',
    desc: 'Integrate LLMs, retrieval-augmented generation (RAG), autonomous scrapers, and automated workflows directly into your operational stack.',
    tags: ['Claude & GPT-4o', 'LangChain', 'Vector DBs', 'Custom AI Agents', 'Workflow Cron'],
    accent: 'border-amber-500/20 bg-amber-500/5 text-amber-600',
  },
  {
    icon: Server,
    badge: 'CLOUD INFRASTRUCTURE',
    title: 'High-Availability DevOps & Cloud',
    desc: 'Production-ready cloud deployment on AWS, Vercel, and Docker with automated CI/CD pipelines, SSL, edge caching, and automated backups.',
    tags: ['AWS / Vercel', 'Docker', 'Edge CDN', 'CI/CD Pipelines', 'Zero Downtime'],
    accent: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600',
  },
  {
    icon: Timer,
    badge: 'RAPID VELOCITY',
    title: 'MVP Sprint & Product Strategy',
    desc: 'Transform raw product specs and wireframes into a fully working, revenue-generating MVP in 3–4 weeks without cutting corners on code quality.',
    tags: ['Figma to Code', 'Stripe Payments', 'Auth Systems', 'Interactive Dashboards'],
    accent: 'border-purple-500/20 bg-purple-500/5 text-purple-600',
  },
]

const stats = [
  {
    value: '< 0.5s',
    label: 'Avg. Page Load Speed',
    detail: 'Top 1% Core Web Vitals',
  },
  {
    value: '3–4 Wks',
    label: 'MVP Turnaround Time',
    detail: 'From concept to live URL',
  },
  {
    value: '100%',
    label: 'Code Ownership',
    detail: 'No lock-in, clean repositories',
  },
  {
    value: '99.99%',
    label: 'Uptime Reliability',
    detail: 'Battle-tested cloud setups',
  },
]

export function AtomSeWhyChooseSection() {
  return (
    <section id="why-atom-se" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 w-full border-t border-b border-black/[0.05] bg-[#f8f8f8]">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200/70 border border-neutral-300/80 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-800">
            <Laptop className="w-3.5 h-3.5 text-neutral-900" />
            <span>ENGINEERING PHILOSOPHY & EXECUTION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight leading-[1.12]">
            From back-of-the-napkin concepts to rock-solid production software.
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed pt-1">
            Most businesses get bogged down hiring disconnected freelancers, navigating bloated legacy agencies, or relying on fragile no-code setups that crumble under scale. At <strong className="text-neutral-900 font-semibold">Atom SE</strong>, we pair agile startup speed with enterprise-grade software engineering.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-3xl p-7 sm:p-9 border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl border ${cap.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {cap.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-black transition-colors">
                    {cap.title}
                  </h3>

                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {cap.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100 flex flex-wrap gap-1.5">
                  {cap.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-neutral-600 bg-neutral-100/90 px-2.5 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Performance & Quality Metrics */}
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1.5 text-center sm:text-left">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-mono text-white">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-neutral-300">
                  {stat.label}
                </div>
                <div className="text-[11px] sm:text-xs text-neutral-500 font-mono">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full source-code repository handover upon delivery with 100% IP rights.</span>
            </div>
            <Link 
              href="/atom-se/pricing" 
              className="inline-flex items-center gap-1.5 text-white font-medium hover:text-emerald-400 transition-colors"
            >
              <span>Explore Pricing & Quotations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
