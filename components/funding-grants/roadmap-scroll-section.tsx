'use client'

import { useRef } from 'react'
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building,
  Coins,
  FileText,
  TrendingUp,
  Award,
  Users,
  Clock,
  Target
} from 'lucide-react'

interface RoadmapStep {
  step: string
  phase: string
  title: string
  timeline: string
  desc: string
  outcome: string
  deliverables: string[]
  metrics: { label: string; value: string }[]
  cardBg: string
  borderStyle: string
  badgeBg: string
  buttonBg: string
  iconBg: string
  icon: React.ReactNode
  footnote?: string
}

const stepsData: RoadmapStep[] = [
  {
    step: '01',
    phase: 'PHASE 01 &bull; DIAGNOSIS & TRL AUDIT',
    title: 'Grant & Scheme Diagnosis',
    timeline: 'Weeks 1 – 2',
    desc: 'We conduct an in-depth audit of your startup’s cap table, technology readiness level (TRL 1–9), patent/IP defensibility, and sector alignment to map every central, state, and non-dilutive grant opportunity.',
    outcome: 'Tailored 15+ Scheme Eligibility Matrix & Capital Readiness Blueprint',
    deliverables: [
      'Comprehensive TRL & IP valuation audit',
      'Evaluation against 15+ Central & State schemes',
      'Entity qualification & DPIIT / Startup India compliance check',
      'Grant probability scoring & strategic filing roadmap'
    ],
    metrics: [
      { label: 'Potential Schemes Reviewed*', value: '15+' },
      { label: 'Initial Review Target', value: '48 Hrs' },
      { label: 'Potential Non-Dilutive Funding', value: 'Scheme-Dependent' }
    ],
    cardBg: 'bg-[#0c6b4b]',
    borderStyle: 'border-emerald-600/30',
    badgeBg: 'bg-white/15 text-white border-white/20',
    buttonBg: 'bg-white text-[#0c6b4b] hover:bg-neutral-100',
    iconBg: 'bg-white/15 text-white',
    icon: <Target className="w-6 h-6 text-white" />,
    footnote: '*The number and relevance of applicable schemes varies by startup, sector, stage, location and eligibility.'
  },
  {
    step: '02',
    phase: 'PHASE 02 &bull; DOSSIER & PROPOSAL ARCHITECTURE',
    title: 'Proposal & Dossier Structuring',
    timeline: 'Weeks 2 – 4',
    desc: 'We draft and calibrate institutional-grade technical grant proposals, financial milestone projections, budget models, and compliance paperwork designed to score top marks on government evaluation rubrics.',
    outcome: 'Ready-to-File Comprehensive Technical Grant Dossier',
    deliverables: [
      'Institutional grant proposal & technical problem-solution writeup',
      'Milestone-linked fund deployment budget & financial model',
      'DSIR / R&D recognition & state incubation paperwork',
      'Pitch deck calibration tailored for evaluation committee scrutiny'
    ],
    metrics: [
      { label: 'Dossier Quality', value: 'Rubric-Aligned' },
      { label: 'Proposal Structuring', value: 'Milestone-Based' },
      { label: 'Filing Readiness', value: '10–14 Days' }
    ],
    cardBg: 'bg-[#1b4ed8]',
    borderStyle: 'border-blue-500/30',
    badgeBg: 'bg-white/15 text-white border-white/20',
    buttonBg: 'bg-white text-[#1b4ed8] hover:bg-neutral-100',
    iconBg: 'bg-white/15 text-white',
    icon: <FileText className="w-6 h-6 text-white" />
  },
  {
    step: '03',
    phase: 'PHASE 03 &bull; PITCH DEFENSE & INCUBATOR ROUNDS',
    title: 'Incubator & Board Defense',
    timeline: 'Weeks 4 – 6',
    desc: 'We conduct simulated dry-run pitch sessions, coaching founders through intense technical and financial cross-examinations before government screening committees and partner incubators.',
    outcome: 'Application Submission & Evaluation Support',
    deliverables: [
      'Rigorous dry-run mock presentations with industry jury feedback',
      'Fast-track partner incubator selection & institutional endorsement',
      'Handling hard technical, financial, and IP defense queries',
      'Sanction letter execution & tranche disbursement tracking'
    ],
    metrics: [
      { label: 'Mock Pitch Sessions', value: '3+ Rounds' },
      { label: 'Incubator Network', value: 'Subject to Availability' },
      { label: 'Readiness Support', value: 'Application & Pitch' }
    ],
    cardBg: 'bg-[#d96620]',
    borderStyle: 'border-orange-500/30',
    badgeBg: 'bg-white/15 text-white border-white/20',
    buttonBg: 'bg-white text-[#d96620] hover:bg-neutral-100',
    iconBg: 'bg-white/15 text-white',
    icon: <Award className="w-6 h-6 text-white" />
  },
  {
    step: '04',
    phase: 'PHASE 04 &bull; CO-INVESTMENT & SYNDICATE LAYER',
    title: 'Angel & VC Syndicate Layer',
    timeline: 'Weeks 6 – 8+',
    desc: 'We bridge vetted, grant-backed startups with high-conviction angel syndicates, family offices, and seed funds looking for de-risked co-investment deals with strategic capital planning.',
    outcome: 'Fundraising & Co-Investment Support',
    deliverables: [
      'Potential introductions to angels, syndicates and micro-VCs, subject to investor interest.',
      '1:1 matching capital syndication alongside non-dilutive grant funds',
      'Term sheet negotiation & founder-friendly SAFE note structuring',
      'Institutional investor reporting & cap table advisory'
    ],
    metrics: [
      { label: 'Angel Syndicate Check', value: '₹25L – ₹2.5 Cr' },
      { label: 'Runway Extension', value: '18–24 Mo' },
      { label: 'Designed to Consider Dilution', value: 'Capital Strategy' }
    ],
    cardBg: 'bg-[#4e2a9b]',
    borderStyle: 'border-purple-500/30',
    badgeBg: 'bg-white/15 text-white border-white/20',
    buttonBg: 'bg-white text-[#4e2a9b] hover:bg-neutral-100',
    iconBg: 'bg-white/15 text-white',
    icon: <Users className="w-6 h-6 text-white" />
  }
]

export function RoadmapScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={containerRef}
      id="roadmap"
      className="py-12 sm:py-16 md:py-28 px-3.5 sm:px-6 md:px-12 w-full bg-[#f2f2f2] text-[#111111]"
    >
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 md:space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-2.5 sm:space-y-3 max-w-3xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/10 text-[#111111] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>HOW WE ASSIST &bull; STEP-BY-STEP</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#111111]">
            4-Step Grant & Capital Roadmap
          </h2>

          <p className="text-xs sm:text-base text-[#555555] leading-relaxed">
            From scheme identification and application preparation to evaluation support and potential private fundraising.
          </p>
        </div>

        {/* Apple-Style Stacking Cards Container */}
        <div className="relative space-y-6 sm:space-y-8 md:space-y-12 pb-8 sm:pb-12">
          {stepsData.map((step, idx) => {
            // Progressive sticky top offset for clean stacking
            const stickyTopClass = [
              'top-16 sm:top-20 md:top-24',
              'top-20 sm:top-24 md:top-28',
              'top-24 sm:top-28 md:top-32',
              'top-28 sm:top-32 md:top-36'
            ][idx]

            return (
              <div
                key={step.step}
                className={`sticky ${stickyTopClass} transition-all duration-300`}
                style={{
                  zIndex: idx + 10
                }}
              >
                <div className={`w-full ${step.cardBg} border ${step.borderStyle} text-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-12 shadow-2xl hover:shadow-3xl transition-shadow relative overflow-hidden`}>
                  
                  {/* Watermark Step Number */}
                  <span className="absolute right-4 top-3 sm:right-6 sm:top-4 md:right-10 md:top-6 text-6xl sm:text-8xl md:text-9xl font-black font-mono select-none pointer-events-none text-white/10">
                    {step.step}
                  </span>

                  {/* Card Header: Phase badge & Timeline */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 relative z-10 pb-3 sm:pb-4 border-b border-white/15">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider border ${step.badgeBg}`}>
                        <span dangerouslySetInnerHTML={{ __html: step.phase }} />
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-white/90 bg-black/20 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/80" />
                      <span>{step.timeline}</span>
                    </div>
                  </div>

                  {/* Main Card Content: 2-Column Split */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-4 sm:pt-6 relative z-10">
                    
                    {/* Left 7 Columns: Title, Description, and Deliverables */}
                    <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl ${step.iconBg} border border-white/20 shrink-0`}>
                          {step.icon}
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-normal">
                        {step.desc}
                      </p>

                      <div className="space-y-2 sm:space-y-2.5 pt-1 sm:pt-2">
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-white/70 block">
                          Key Deliverables & Action Items:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                          {step.deliverables.map((item, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-2 text-[11px] sm:text-xs text-white/95">
                              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5 text-white" />
                              <span className="leading-snug">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right 5 Columns: Metrics Box & Outcome Summary */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-3 sm:space-y-4">
                      
                      {/* 3 Metric Chips */}
                      <div className="space-y-1.5">
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 bg-black/20 backdrop-blur-md border border-white/20 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl">
                          {step.metrics.map((m, mIdx) => (
                            <div key={mIdx} className="text-center space-y-0.5 sm:space-y-1">
                              <span className="text-xs sm:text-base md:text-lg font-black block font-mono text-white leading-tight">
                                {m.value}
                              </span>
                              <span className="text-[8px] sm:text-[10px] sm:text-[11px] text-white/75 leading-tight block">
                                {m.label}
                              </span>
                            </div>
                          ))}
                        </div>
                        {step.footnote && (
                          <p className="text-[9px] sm:text-[10px] text-white/70 font-mono italic leading-tight px-1">
                            {step.footnote}
                          </p>
                        )}
                      </div>

                      {/* Milestone Outcome Banner */}
                      <div className="bg-black/20 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl space-y-1 sm:space-y-1.5">
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
                          <ShieldCheck className="w-3.5 h-3.5 text-white" />
                          <span>Phase Milestone Target</span>
                        </span>
                        <p className="text-[11px] sm:text-xs text-white/90 font-medium leading-relaxed">
                          {step.outcome}
                        </p>
                      </div>

                      {/* Step CTA */}
                      <a
                        href="#apply"
                        className={`inline-flex items-center justify-center gap-2 ${step.buttonBg} px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all hover:scale-[1.02] shadow-lg text-center`}
                      >
                        <span>Apply for {step.title}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>

                    </div>

                  </div>

                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
