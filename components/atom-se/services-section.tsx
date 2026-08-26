'use client'

import React from 'react'
import { Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { ProjectShowcase, type Project } from '@/components/ui/project-showcase'

export type SolutionCategory = 'all' | 'products' | 'web' | 'ai' | 'saas'
export type { Project as ShowcaseItem }

const atomSeProjects: Project[] = [
  {
    title: 'Zane ProEd Website',
    description: 'High-conversion institutional & EdTech platform storefront with interactive course catalogs and enrollment workflows.',
    year: '2024',
    link: 'https://zaneproed.com',
    image: '/images/atom-se%20images/zaneproed-hero.webp',
    category: 'Web & Platform',
  },
  {
    title: 'Zane ProEd Academy',
    description: 'Scalable real-time learning management ecosystem with live video classrooms, dynamic quiz evaluations, and verifiable certificates.',
    year: '2024',
    link: 'https://academy.zaneproed.com',
    image: '/images/atom-se%20images/zane%20proed%20academy.webp',
    category: 'EdTech LMS',
  },
  {
    title: 'Alphatic Labs Website',
    description: 'High-performance artificial intelligence R&D studio, proprietary algorithms, and enterprise automation showcase.',
    year: '2024',
    link: 'https://alphaticlabs.com',
    image: '/images/atom-se%20images/alphaticlabs-hero.webp',
    category: 'AI Software',
  },
  {
    title: 'AlphaticLabs • Clinic Intelligence System',
    description: 'Run your entire clinic on one intelligent system. Connects patients, doctors, billing, and operations into one real-time platform with automated documentation and tracking.',
    year: '2024',
    link: 'https://alphaticlabs.com',
    image: '/images/atom-se%20images/alphaticlabs%20-pms.webp',
    category: 'Healthcare AI',
  },
  {
    title: 'Executive Portfolio & Complete Business Ecosystem Platform',
    description: 'Bespoke corporate architecture connecting executive advisory, global venture funds, investor matchmaking, and multi-asset management.',
    year: '2024',
    link: '/',
    image: '/images/atom-se%20images/melwin.webp',
    category: 'Venture Ecosystem',
  },
  {
    title: 'Internal Tools & Performance Automations',
    description: 'Custom operational bots, automated lead routing, CRM synchronizers, and algorithmic workflows engineered to supercharge company throughput.',
    year: '2024',
    link: '/atom-se/pricing',
    image: '/images/atom-se%20images/autoamioins.jpg',
    category: 'Workflow Automation',
  },
]

export function AtomSeServicesSection() {
  return (
    <section 
      id="showcase" 
      className="py-16 md:py-28 px-4 sm:px-6 md:px-12 w-full bg-[#f2f2f2] text-[#111111] relative scroll-mt-20 border-t border-black/[0.04]"
    >
      <div id="services" className="sr-only" />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/10 text-[11px] font-mono font-bold uppercase tracking-wider text-[#111111] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>PRODUCTION SHOWCASE &bull; SELECTED WORK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight leading-[1.05]">
              What We Build, <br className="hidden sm:inline" />
              <span className="text-[#2142e8] underline decoration-wavy decoration-black/20">Ship &amp; Scale.</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl font-medium">
              Explore our live product ecosystem, AI automation pipelines, venture platforms, and high-performance software.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="#project-form"
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-105"
            >
              <span>Get Custom Quote</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>

        {/* Minimal Kinetic Project Showcase with Local & Custom Assets */}
        <ProjectShowcase 
          projects={atomSeProjects}
          title="Flagship Deployments &amp; Products"
          className="px-0 py-4 max-w-full"
        />

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white border border-black/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-neutral-900">Have a specific project in mind?</h4>
            <p className="text-xs sm:text-sm text-neutral-600">
              Request a custom proposal with milestone breakdowns for landing pages, multi-page platforms, e-commerce, SaaS, or AI pipelines.
            </p>
          </div>
          <Link
            href="#project-form"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-[#111111] text-white hover:bg-black px-6 py-3 rounded-full font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <span>Request Project Scope</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </div>
    </section>
  )
}
export default AtomSeServicesSection
