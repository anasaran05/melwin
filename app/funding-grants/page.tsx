'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  FundingHero,
  GrantsHorizontalScroll,
  MatchingLayerSection,
  RoadmapScrollSection,
  FundingInquiryStepper,
  type GrantItem
} from '@/components/funding-grants'

// Master Grant Directory Scheme Data
const grantsAndSchemes: GrantItem[] = [
  {
    id: 'g1',
    title: 'Startup India Seed Fund Scheme (SISFS)',
    agency: 'DPIIT / Govt of India',
    grantAmount: 'Up to ₹50 Lakhs',
    stage: 'Proof of Concept / Prototype',
    sector: 'Multi-sector / Tech Agnostic',
    type: 'Grant & Soft Loan / Convertible Debt',
    description: 'Financial assistance to startups for proof of concept, prototype development, product trials, market-entry, and commercialization through registered incubators.',
    keyEligibility: ['DPIIT recognized startup', 'Incorporated not more than 2 years ago', 'Innovative business idea solving real problems'],
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  {
    id: 'g2',
    title: 'BIRAC BIG (Biotechnology Ignition Grant)',
    agency: 'BIRAC / Dept of Biotechnology',
    grantAmount: 'Up to ₹50 Lakhs (Non-dilutive)',
    stage: 'Ideation to Proof-of-Concept',
    sector: 'BioTech, Healthcare, MedTech, AgriTech',
    type: '100% Non-Dilutive Grant',
    description: 'Flagship grant scheme for biotech entrepreneurs and healthcare startups to validate discovery ideas and establish commercial proof of concept.',
    keyEligibility: ['Indian biotech/healthcare startup or individual innovator', '51% Indian shareholding', 'High scientific or clinical novelty'],
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    id: 'g3',
    title: 'MeitY TIDE 2.0 & SAMRIDH Scheme',
    agency: 'Ministry of Electronics & IT',
    grantAmount: '₹7 Lakhs to ₹40 Lakhs',
    stage: 'Prototype to Growth Scale',
    sector: 'AI, IoT, SaaS, DeepTech, CyberSecurity',
    type: 'Grant + VC Matching Accelerator',
    description: 'Holistic support for ICT and DeepTech startups. SAMRIDH provides up to ₹40 Lakhs with matching investor funding to scale market readiness.',
    keyEligibility: ['Software / IoT / AI focus', 'Incubated at accredited TIDE 2.0 centres', 'Demonstrated user traction or working prototype'],
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  },
  {
    id: 'g4',
    title: 'MSME Idea Hackathon & Patent Support',
    agency: 'Ministry of MSME',
    grantAmount: 'Up to ₹15 Lakhs per Idea',
    stage: 'Early Concept & Prototype',
    sector: 'Manufacturing, Sustainability, HealthTech, Hardware',
    type: 'Pure Grant for Prototyping',
    description: 'Financial support to incubatees through host institutions to develop innovative technologies, green solutions, and patent filing cost reimbursements.',
    keyEligibility: ['Registered MSME (Udyam)', 'Prototyping phase', 'Affiliated with recognized academic/technical host institute'],
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    id: 'g5',
    title: 'Global Incubators & Accelerators',
    agency: 'Y Combinator, Techstars, Antler, Surge',
    grantAmount: '$125k to $500k Investment',
    stage: 'Early Stage to Seed',
    sector: 'SaaS, Consumer, FinTech, AI',
    type: 'Standard SAFE / Equity Investment',
    description: 'Direct pipeline and coaching on preparing winning pitch materials for tier-1 global accelerator cohorts and demo day syndicates.',
    keyEligibility: ['Fast execution speed', 'High addressable market', 'Strong technical or domain co-founding team'],
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  {
    id: 'g6',
    title: 'Angel Syndicate & Micro-VC Network',
    agency: 'Angel Syndicate & Partner Angels',
    grantAmount: '₹25L to ₹2.5 Cr Check Size',
    stage: 'MVP with Paying Customers / High Early Traction',
    sector: 'HealthTech, EdTech, B2B SaaS, D2C',
    type: 'Angel Round / Seed Notes',
    description: 'Curated 1-on-1 introductions to active angels, family offices, and micro-VC funds aligned with your specific industry vertical.',
    keyEligibility: ['Verified customer retention or clear pilot contracts', 'Cap table clarity', 'Vetted via BMF Club or Advisory review'],
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200'
  }
]

export default function FundingGrantsPage() {
  return (
    <main className="font-sans min-h-screen relative overflow-x-clip bg-[#f2f2f2] text-[#111111]">
      <div className="grain-overlay" />
      <Navbar />

      {/* 1. Hero Section (Full Viewport Fit) */}
      <FundingHero />

      {/* 2. Grant & Scheme Directory (Sticky Horizontal Rail) */}
      <GrantsHorizontalScroll grants={grantsAndSchemes} />

      {/* 3. Founder-Investor Matching Layer (Editorial Vertical Grid Section) */}
      <MatchingLayerSection />

      {/* 4. 4-Step Grant Application Roadmap (Scroll-Driven Fullscreen Step-by-Step) */}
      <RoadmapScrollSection />

      {/* 5. Advisory & Grant Review Request Form (Two-Column Step-Wise Collector) */}
      <FundingInquiryStepper />

      <Footer />
    </main>
  )
}
