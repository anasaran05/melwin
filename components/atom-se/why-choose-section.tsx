'use client'

import React from 'react'
import { 
  Laptop, 
  Sparkles, 
  Code2, 
  Server
} from 'lucide-react'
import { 
  FeatureCard, 
  CardHeading, 
  DualModeImage, 
  CircularUI, 
  type CircleConfig 
} from '@/components/ui/features-10'
import { CardHeader } from '@/components/ui/card'

export function AtomSeWhyChooseSection() {
  return (
    <section id="why-atom-se" className="py-20 md:py-32 px-4 sm:px-6 md:px-12 w-full border-t border-b border-black/[0.05] bg-[#f8f8f8]">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight leading-[1.12]">
            We build modern websites and custom software.
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed pt-1">
            Whether you need a high-converting website, a scalable web application, or custom software for your business, we handle design, development, and deployment from start to finish.
          </p>
        </div>

        {/* Features-10 Grid System */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Card 1: Modern Full-Stack Architecture */}
          <FeatureCard className="bg-white">
            <CardHeader className="pb-3">
              <CardHeading
                icon={Code2}
                title="Lightning-Fast Websites & Custom Apps"
                description="Engineered to load in under a second, convert visitors, and work flawlessly on every screen."
              />
            </CardHeader>

            <div className="relative mb-6 border-t border-dashed border-neutral-200 sm:mb-0">
              <div className="aspect-[76/48] p-3 px-6 overflow-hidden">
                <div className="w-full h-full rounded-xl overflow-hidden border border-black/10 shadow-md">
                  <DualModeImage
                    darkSrc="/images/atom-se%20images/fullstack.jpg"
                    lightSrc="/images/atom-se%20images/fullstack.jpg"
                    alt="Lightning-Fast Web & App Development"
                    width={1207}
                    height={929}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex flex-wrap gap-1.5">
              {['Sub-Second Load Speed', 'Mobile & Desktop Ready', 'SEO & Google Optimized', 'Custom Database', 'Secure & Scalable'].map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-mono font-medium text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </FeatureCard>

          {/* Card 2: Applied AI & Intelligent Automation */}
          <FeatureCard className="bg-white">
            <CardHeader className="pb-3">
              <CardHeading
                icon={Sparkles}
                title="Smart AI & Business Automation"
                description="Put repetitive tasks on autopilot with custom AI assistants, automated lead workflows, and smart integrations."
              />
            </CardHeader>

            <div className="relative mb-6 border-t border-dashed border-neutral-200 sm:mb-0">
              <div className="aspect-[76/48] p-3 px-6 overflow-hidden">
                <div className="w-full h-full rounded-xl overflow-hidden border border-black/10 shadow-md">
                  <DualModeImage
                    darkSrc="/images/atom-se%20images/applied%20ai.jpg"
                    lightSrc="/images/atom-se%20images/applied%20ai.jpg"
                    alt="AI Automation & Business Systems"
                    width={1207}
                    height={929}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex flex-wrap gap-1.5">
              {['AI Customer Assistants', 'Automated Lead Routing', 'CRM & Payment Sync', 'Time-Saving Custom Tools'].map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-mono font-medium text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </FeatureCard>

          {/* Card 3 (Span 2): Tier-1 Multi-Cloud Infrastructure & Topology */}
          <FeatureCard className="p-6 sm:p-8 lg:col-span-2 bg-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">
                  <Server className="w-4 h-4 text-emerald-600" />
                  <span>BULLETPROOF RELIABILITY &amp; SECURITY</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900">
                  Always Online, Hacker-Protected &amp; Backed by 99.99% Uptime.
                </h3>
              </div>

              <span className="text-xs font-mono px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold self-start md:self-auto">
                ZERO DOWNTIME
              </span>
            </div>

            <p className="max-w-2xl text-sm sm:text-base text-neutral-600 leading-relaxed mb-8">
              Your software and websites stay fast, secure, and always accessible worldwide. Includes enterprise SSL encryption, automated daily backups, and instant disaster recovery.
            </p>

            <div className="flex justify-center flex-wrap gap-6 sm:gap-10 overflow-hidden py-4 border-t border-b border-neutral-100">
              <CircularUI
                label="Global Speed"
                circles={[{ pattern: 'border' }, { pattern: 'border' }]}
              />

              <CircularUI
                label="Bank-Grade Security"
                circles={[{ pattern: 'none' }, { pattern: 'primary' }]}
              />

              <CircularUI
                label="Daily Backups"
                circles={[{ pattern: 'blue' }, { pattern: 'none' }]}
              />

              <CircularUI
                label="24/7 Monitoring"
                circles={[{ pattern: 'primary' }, { pattern: 'none' }]}
                className="hidden sm:block"
              />
            </div>
          </FeatureCard>

        </div>

      </div>
    </section>
  )
}

export default AtomSeWhyChooseSection
