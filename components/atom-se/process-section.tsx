'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  FileCode2, 
  Layers, 
  ShieldCheck, 
  Rocket, 
  Check, 
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export interface ProcessStep {
  number: string
  timeline: string
  title: string
  desc: string
  deliverables: string[]
  icon: React.ComponentType<{ className?: string }>
}

const steps: ProcessStep[] = [
  {
    number: '01',
    timeline: 'Days 1 – 3',
    title: 'Discovery & System Blueprint',
    desc: 'We listen to your vision, plan out every page and feature, and create interactive visual mockups so you can see and click through your product before we write any code.',
    deliverables: [
      'Interactive UI designs & wireframes',
      'Feature roadmap & timeline',
      'System & database blueprint'
    ],
    icon: FileCode2,
  },
  {
    number: '02',
    timeline: 'Weeks 1 – 3',
    title: 'Rapid Building & Live Previews',
    desc: 'Our engineers build your website or application in fast weekly stages. You receive a private preview link updated regularly so you can test real working features as they are built.',
    deliverables: [
      'Private live staging demo link',
      'Clean, high-performance codebase',
      'Payment, auth & database integration'
    ],
    icon: Layers,
  },
  {
    number: '03',
    timeline: 'Days 18 – 21',
    title: 'Testing, Speed Tuning & Security',
    desc: 'We test every button, form, and page across iPhones, Androids, tablets, and laptops. We tune your speed so pages open instantly in under a second and lock down security.',
    deliverables: [
      'Sub-second page load optimization',
      '100% mobile & tablet responsiveness',
      'Security & spam protection audit'
    ],
    icon: ShieldCheck,
  },
  {
    number: '04',
    timeline: 'Day 22 & Beyond',
    title: 'Go-Live & 100% IP Handover',
    desc: 'We connect your domain and launch your project live to the world with zero downtime. You get full 100% ownership of all source code and files, backed by 30 days of post-launch warranty.',
    deliverables: [
      'Zero-downtime production launch',
      '100% source code & asset ownership',
      '30-day post-launch support & monitoring'
    ],
    icon: Rocket,
  },
]

export function AtomSeProcessSection() {
  return (
    <section id="process" className="py-20 md:py-32 px-4 sm:px-6 md:px-12 w-full bg-white text-[#111111] relative border-t border-b border-black/[0.05]">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-500">
            HOW WE WORK
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111111] leading-[1.12]">
            Up and running in four simple steps
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            Designed for clear momentum. Go from your initial concept to a live, production-grade product without technical confusion or hidden surprises.
          </p>
        </div>

        {/* Vertical Timeline Stepper */}
        <div className="relative pl-4 sm:pl-8">
          
          {/* Vertical Connecting Track Line */}
          <div className="absolute left-[31px] sm:left-[47px] top-6 bottom-10 w-[2px] bg-neutral-200" />

          <div className="space-y-10 sm:space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex items-start gap-5 sm:gap-7 group"
                >
                  {/* Timeline Node Box */}
                  <div className="relative z-10 flex-shrink-0 size-12 sm:size-14 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center shadow-sm group-hover:border-black group-hover:shadow-md transition-all duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 group-hover:text-black transition-colors" />
                  </div>

                  {/* Content Column */}
                  <div className="space-y-3 pt-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-neutral-600 px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200/80">
                        {step.number}
                      </span>
                      <span className="text-xs font-mono font-semibold text-blue-700 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                        {step.timeline}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                      {step.title}
                    </h3>

                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl font-normal">
                      {step.desc}
                    </p>

                    {/* Deliverables tags */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      {step.deliverables.map((item, i) => (
                        <div 
                          key={i} 
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-700 font-medium"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Action CTA Bar */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-600">
            Have a project in mind? We can map out your blueprint in under 24 hours.
          </p>
          <Link
            href="#project-form"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-black px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <span>Start Your Blueprint</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default AtomSeProcessSection
