'use client'

import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Compass, Video, Target, Crown, ShieldAlert } from 'lucide-react'

type ComparisonItem = {
  feature: string
  planA: boolean | string
  planB: boolean | string
  planC: boolean | string
}

type ComparisonSection = {
  category: string
  icon: React.ElementType
  items: ComparisonItem[]
}

export function AgencyComparison() {
  const sections: ComparisonSection[] = [
    {
      category: '1. Brand Strategy & Intelligence',
      icon: Compass,
      items: [
        {
          feature: 'Personal Brand Positioning & Core Narrative',
          planA: true,
          planB: true,
          planC: true,
        },
        {
          feature: 'Target Audience & Authority Mapping',
          planA: true,
          planB: true,
          planC: true,
        },
        {
          feature: 'Brand Voice & Communication Framework',
          planA: true,
          planB: true,
          planC: true,
        },
        {
          feature: 'Monthly Trend & Topic Monitoring',
          planA: true,
          planB: true,
          planC: true,
        },
        {
          feature: 'Continuous Competition Intelligence & Gap Analysis',
          planA: false,
          planB: true,
          planC: true,
        },
      ],
    },
    {
      category: '2. Content Engine & Scaled Publishing',
      icon: Video,
      items: [
        {
          feature: 'Premium Reels / Shorts per Month',
          planA: '10 Reels / mo',
          planB: 'Up to 15 Reels / mo',
          planC: 'Baseline Gold Volume',
        },
        {
          feature: 'Long-Form YouTube Videos per Month',
          planA: '2 Videos / mo',
          planB: 'Up to 6 Videos / mo',
          planC: 'Baseline Gold Volume',
        },
        {
          feature: 'LinkedIn Publishing Frequency',
          planA: '3 posts / week',
          planB: '5 posts / week',
          planC: '5 posts / week',
        },
        {
          feature: 'Blog Publishing (2 Long-Form Articles / 10 Days)',
          planA: false,
          planB: true,
          planC: true,
        },
        {
          feature: 'SEO / AEO Scope (Keyword Research, On-Page Optimization)',
          planA: false,
          planB: true,
          planC: true,
        },
        {
          feature: 'Ideation, Hooks, Scripts & Storytelling Frameworks',
          planA: true,
          planB: true,
          planC: true,
        },
        {
          feature: 'Custom Thumbnails & Covers',
          planA: true,
          planB: true,
          planC: true,
        },
      ],
    },
    {
      category: '3. Production & Physical Shoot Logistics',
      icon: Video,
      items: [
        {
          feature: 'Remote Shoot Guides (Client Self-Films with Guides)',
          planA: true,
          planB: 'DFY Included',
          planC: 'DFY Included',
        },
        {
          feature: 'On-Site Physical Shoot Days',
          planA: false,
          planB: 'Up to 3 Days / mo (6h on set)',
          planC: 'Up to 6 Days / mo (6h on set)',
        },
        {
          feature: 'On-Site Camera, Lighting & Audio Setup',
          planA: false,
          planB: true,
          planC: true,
        },
        {
          feature: 'Founder Performance Coaching & Live Direction',
          planA: false,
          planB: true,
          planC: true,
        },
        {
          feature: 'Dynamic Locations & Fresher B-Roll Strategy',
          planA: false,
          planB: false,
          planC: true,
        },
        {
          feature: 'Professional Video Editing (Pacing, Retention, B-Roll, FX)',
          planA: true,
          planB: true,
          planC: true,
        },
        {
          feature: 'Platform-Tailored Captions & Subtitles',
          planA: true,
          planB: true,
          planC: true,
        },
      ],
    },
    {
      category: '4. Revenue Engine & Sales Enablement',
      icon: Target,
      items: [
        {
          feature: 'Founder-Led Marketing Campaigns',
          planA: false,
          planB: false,
          planC: true,
        },
        {
          feature: 'Lead-Generation Strategy & Founder Funnels',
          planA: false,
          planB: false,
          planC: true,
        },
        {
          feature: 'Offer & Landing Page Funnel Optimization',
          planA: false,
          planB: false,
          planC: true,
        },
        {
          feature: 'Sales Enablement Video Assets (Overcoming Objections)',
          planA: false,
          planB: false,
          planC: true,
        },
        {
          feature: 'Revenue Attribution & Organic ROI Systems',
          planA: false,
          planB: false,
          planC: true,
        },
      ],
    },
    {
      category: '5. Executive Positioning & PR Outreach',
      icon: Crown,
      items: [
        {
          feature: 'Industry Authority & Thought-Leadership Positioning',
          planA: false,
          planB: false,
          planC: true,
        },
        {
          feature: 'Monthly Creator Collab, Podcast & PR Outreach',
          planA: false,
          planB: false,
          planC: 'Active Outreach Included',
        },
      ],
    },
    {
      category: '6. Strategic Syncs & Support SLA',
      icon: ShieldAlert,
      items: [
        {
          feature: 'Strategic Sync Calls',
          planA: '1x 60-Min Monthly Call',
          planB: 'Unlimited Strategic Syncs',
          planC: 'Unlimited Strategic Syncs',
        },
        {
          feature: 'Monthly Growth Report & Strategy Recalibration',
          planA: true,
          planB: true,
          planC: true,
        },
        {
          feature: 'Priority Access to Strategy Team',
          planA: false,
          planB: true,
          planC: true,
        },
        {
          feature: 'Support Channel & Turnaround Time',
          planA: 'Email & WA (24–48h)',
          planB: 'Priority Access',
          planC: 'VIP Line (<4h SLA)',
        },
      ],
    },
  ]

  const renderCellContent = (value: boolean | string, isPlanB = false) => {
    if (typeof value === 'boolean') {
      return value ? (
        <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold">
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
      ) : (
        <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-100 text-rose-600 font-bold">
          <X className="w-4 h-4 stroke-[3]" />
        </div>
      )
    }
    return (
      <span className={`text-xs md:text-sm font-medium ${isPlanB ? 'text-purple-950 font-bold' : 'text-neutral-800'}`}>
        {value}
      </span>
    )
  }

  return (
    <section id="comparison" className="py-12 md:py-20 px-4 sm:px-6 md:px-16 w-full text-[#111111] scroll-mt-24">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col gap-3 mb-8 md:mb-12">
          <span className="text-blue-600 text-[11px] sm:text-xs font-mono tracking-wider uppercase font-bold">
            COMPLETE FEATURE BREAKDOWN
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-[#111111]">
            Detailed Comparison Table
          </h2>
          <p className="text-[#666666] text-xs sm:text-sm md:text-base max-w-2xl">
            Review the exact scope, shoot allowances, content publishing volume, and strategic deliverables included in each retainer plan.
          </p>
        </div>

        {/* Table Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl border border-black/10 shadow-2xl overflow-hidden"
        >
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-left border-collapse min-w-[760px]">
              
              {/* Sticky Table Header matching Retainer Card Themes */}
              <thead>
                <tr className="text-white text-sm font-bold sticky top-0 z-20">
                  {/* Left Column: Scope */}
                  <th className="p-5 md:p-6 w-2/5 text-base font-black bg-[#111111] border-r border-white/10">
                    Feature / Scope
                  </th>

                  {/* Silver Plan Header Column (Deep Cobalt Blue Theme) */}
                  <th className="p-5 md:p-6 w-1/5 text-center bg-[#0b1021] border-r border-white/10 relative overflow-hidden">
                    {/* SVG Fluid Wave Accent */}
                    <div className="absolute top-0 inset-x-0 h-10 opacity-70 pointer-events-none">
                      <svg className="w-full h-full object-cover" viewBox="0 0 200 40" preserveAspectRatio="none" fill="none">
                        <path d="M0 10 Q 50 35 100 15 T 200 20 L 200 0 L 0 0 Z" fill="url(#tableSilverGrad)" />
                        <defs>
                          <linearGradient id="tableSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="relative z-10 pt-2">
                      <span className="block text-white text-base font-bold font-sans">Silver Plan</span>
                      <span className="text-xs text-blue-300 font-mono font-normal">₹60,000 / mo</span>
                    </div>
                  </th>

                  {/* Gold Plan Header Column (Deep Fuchsia/Purple Theme - MOST POPULAR) */}
                  <th className="p-5 md:p-6 w-1/5 text-center bg-[#170921] border-x border-fuchsia-500/40 relative overflow-hidden">
                    {/* Top Right Floating White Popular Badge */}
                    <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-white text-black px-2.5 py-1 rounded-full shadow-md border border-white/40">
                      <span className="w-1 h-1 rounded-full bg-fuchsia-600 animate-pulse" />
                      <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider">MOST POPULAR</span>
                    </div>

                    {/* SVG Fluid Wave Accent */}
                    <div className="absolute top-0 inset-x-0 h-10 opacity-70 pointer-events-none">
                      <svg className="w-full h-full object-cover" viewBox="0 0 200 40" preserveAspectRatio="none" fill="none">
                        <path d="M0 15 Q 60 5 120 30 T 200 10 L 200 0 L 0 0 Z" fill="url(#tableGoldGrad)" />
                        <defs>
                          <linearGradient id="tableGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#e056fd" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="relative z-10 pt-2">
                      <span className="block text-fuchsia-200 text-base font-bold font-sans">Gold Plan</span>
                      <span className="text-xs text-fuchsia-300/80 font-mono font-normal">₹90,000 / mo</span>
                    </div>
                  </th>

                  {/* Diamond Plan Header Column (Deep Emerald Theme) */}
                  <th className="p-5 md:p-6 w-1/5 text-center bg-[#051714] border-l border-white/10 relative overflow-hidden">
                    {/* SVG Fluid Wave Accent */}
                    <div className="absolute top-0 inset-x-0 h-10 opacity-70 pointer-events-none">
                      <svg className="w-full h-full object-cover" viewBox="0 0 200 40" preserveAspectRatio="none" fill="none">
                        <path d="M0 20 Q 50 0 100 25 T 200 15 L 200 0 L 0 0 Z" fill="url(#tableDiamondGrad)" />
                        <defs>
                          <linearGradient id="tableDiamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#047857" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="relative z-10 pt-2">
                      <span className="block text-emerald-200 text-base font-bold font-sans">Diamond Plan</span>
                      <span className="text-xs text-emerald-300/80 font-mono font-normal">₹1,59,000 / mo</span>
                    </div>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-neutral-200 text-sm">
                {sections.map((section) => {
                  const IconComp = section.icon
                  return (
                    <Fragment key={section.category}>
                      {/* Category Row */}
                      <tr className="bg-neutral-100/90 font-mono text-xs uppercase tracking-wider font-bold text-neutral-800 border-y border-neutral-300">
                        <td colSpan={4} className="py-3 px-6">
                          <div className="flex items-center gap-2">
                            <IconComp className="w-4 h-4 text-blue-600" />
                            <span>{section.category}</span>
                          </div>
                        </td>
                      </tr>

                      {/* Items */}
                      {section.items.map((item) => (
                        <tr
                          key={item.feature}
                          className="hover:bg-neutral-50/80 transition-colors border-b border-neutral-100"
                        >
                          <td className="p-4 md:p-5 text-[#111111] font-medium text-xs md:text-sm">
                            {item.feature}
                          </td>

                          {/* Silver Column Cell */}
                          <td className="p-4 md:p-5 text-center bg-blue-50/20">
                            {renderCellContent(item.planA)}
                          </td>

                          {/* Gold Column Cell (Featured) */}
                          <td className="p-4 md:p-5 text-center bg-purple-50/40 border-x border-purple-100/70 font-medium">
                            {renderCellContent(item.planB, true)}
                          </td>

                          {/* Diamond Column Cell */}
                          <td className="p-4 md:p-5 text-center bg-emerald-50/20">
                            {renderCellContent(item.planC)}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
