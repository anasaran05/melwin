'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  FileCode2, 
  GitPullRequest, 
  ShieldCheck, 
  Rocket, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export interface ProcessStep {
  number: string
  phase: string
  title: string
  timeline: string
  desc: string
  deliverables: string[]
  icon: React.ComponentType<{ className?: string }>
}

const engineeringSteps: ProcessStep[] = [
  {
    number: '01',
    phase: 'PHASE 01',
    timeline: 'Days 1 – 3',
    title: 'Discovery & System Blueprint',
    desc: 'We define the functional requirements, design the database schemas, map API contracts, and establish a high-fidelity visual prototype.',
    deliverables: ['System Architecture Diagram', 'Interactive Wireframe / UI Mockup', 'Milestone & Sprint Schedule'],
    icon: FileCode2,
  },
  {
    number: '02',
    phase: 'PHASE 02',
    timeline: 'Weeks 1 – 3',
    title: 'Rapid Agile Sprints & Staging',
    desc: 'Our senior engineers construct your codebase in fast iterative sprints with a password-protected live staging environment updated daily.',
    deliverables: ['Daily / Weekly Working Demos', 'Clean, Type-Safe Codebase', 'Database & API Integrations'],
    icon: GitPullRequest,
  },
  {
    number: '03',
    phase: 'PHASE 03',
    timeline: 'Days 18 – 21',
    title: 'Hardening & Performance QA',
    desc: 'Stress testing, cross-browser responsiveness, SEO metadata formatting, and optimization to lock in 100/100 Core Web Vitals.',
    deliverables: ['100/100 PageSpeed Guarantee', 'Security & Auth Audit', 'Cross-Device Responsiveness'],
    icon: ShieldCheck,
  },
  {
    number: '04',
    phase: 'PHASE 04',
    timeline: 'Day 22 & Beyond',
    title: 'Production Deploy & IP Handover',
    desc: 'Zero-downtime deployment to your production domain, transfer of all GitHub repositories, DNS setup, and 30-day post-launch warranty.',
    deliverables: ['Production Cloud Deployment', '100% Repository & IP Ownership', 'Post-Launch Support & Monitoring'],
    icon: Rocket,
  },
]

export function AtomSeProcessSection() {
  return (
    <section id="process" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 w-full border-t border-black/[0.04] bg-white">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
            THE ATOM SE EXECUTION MODEL
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight leading-[1.15]">
            How We Take Your Project Live.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            A transparent, sprint-driven engineering process designed for zero friction and rapid go-to-market execution.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {engineeringSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-[#f9f9f9] rounded-3xl p-6 sm:p-7 border border-black/10 shadow-sm hover:shadow-md hover:border-black/20 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-neutral-300 font-mono">
                      {step.number}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-700">
                      {step.timeline}
                    </span>
                  </div>

                  <div className="p-2.5 w-fit rounded-xl bg-white border border-black/10 text-neutral-900">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-neutral-900">{step.title}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                <div className="pt-4 mt-5 border-t border-black/[0.06] space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                    Deliverables
                  </span>
                  {step.deliverables.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Banner */}
        <div className="text-center pt-4">
          <Link
            href="#project-form"
            className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-black text-white px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-105"
          >
            <span>Book Your Architecture Blueprint Session</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

      </div>
    </section>
  )
}
