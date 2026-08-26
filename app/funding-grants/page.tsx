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
    grantAmount: 'Up to ₹20L Grant + up to ₹50L Investment',
    statusBadge: 'GOVERNMENT SCHEME • 2026 STATUS',
    fundingLabel: 'Typical / Potential Funding',
    supportDetails: 'Support: Up to ₹20L grant + up to ₹50L investment support, subject to eligibility and scheme conditions.',
    stage: 'Proof of Concept / Prototype',
    sector: 'Multi-sector / Tech Agnostic',
    type: 'Grant & Soft Loan / Convertible Debt',
    description: 'Financial assistance for proof of concept, prototype development, product trials, market entry and commercialisation, provided through eligible incubators.',
    keyEligibility: ['DPIIT recognized startup', 'Incorporated not more than 2 years ago', 'Innovative business idea solving real problems'],
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  {
    id: 'g2',
    title: 'BIRAC BIG (Biotechnology Ignition Grant)',
    agency: 'BIRAC / Dept of Biotechnology',
    grantAmount: 'Up to ₹50 Lakhs (Non-dilutive)',
    statusBadge: 'GOVERNMENT SCHEME • BIRAC',
    fundingLabel: 'Typical / Potential Funding',
    supportDetails: 'Support: Up to ₹50 Lakhs (100% Non-Dilutive Grant)',
    stage: 'Ideation to Proof-of-Concept',
    sector: 'Biotechnology, Healthcare, Life Sciences, Diagnostics, Medical Devices, Agriculture & related areas 🧬',
    type: '100% Non-Dilutive Grant',
    description: 'Flagship grant scheme for biotech entrepreneurs and healthcare startups to validate discovery ideas and establish commercial proof of concept.',
    keyEligibility: ['Indian biotech/healthcare startup or individual innovator', '51% Indian shareholding', 'High scientific or clinical novelty'],
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    id: 'g3',
    title: 'MeitY TIDE 2.0 & SAMRIDH Scheme',
    agency: 'Ministry of Electronics & IT',
    grantAmount: 'SAMRIDH: Up to ₹40 Lakhs matching funding',
    statusBadge: 'MEITY PROGRAMMES • AVAILABILITY VARIES',
    fundingLabel: 'Typical / Potential Funding',
    supportDetails: 'Support: SAMRIDH up to ₹40 Lakhs matching funding, subject to programme conditions.',
    stage: 'Prototype to Growth Scale',
    sector: 'AI, IoT, SaaS, DeepTech, CyberSecurity',
    type: 'Grant + VC Matching Accelerator',
    description: 'SAMRIDH supports technology startups through selected accelerators, including acceleration services, customer connections, investor connections and matching funding of up to ₹40 Lakhs, subject to programme conditions.',
    keyEligibility: ['Software / IoT / AI focus', 'Incubated at accredited TIDE 2.0 centres', 'Demonstrated user traction or working prototype'],
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  },
  {
    id: 'g4',
    title: 'MSME Idea Hackathon & Patent Support',
    agency: 'Ministry of MSME',
    grantAmount: 'Up to ₹15 Lakhs per approved idea, provided to the Host Institute',
    statusBadge: 'MSME INNOVATIVE • IDEA HACKATHON 6.0',
    fundingLabel: 'Typical / Potential Funding',
    supportDetails: 'Support: Up to ₹15 Lakhs per approved idea, provided to the Host Institute.',
    stage: 'Early Concept & Prototype',
    sector: 'Manufacturing, Sustainability, HealthTech, Hardware',
    type: 'Pure Grant for Prototyping',
    description: 'MSME’s Innovative scheme supports selected ideas through Host Institutes for development of proof-of-concept/prototypes and related innovation activities.',
    keyEligibility: ['Registered MSME (Udyam)', 'Prototyping phase', 'Affiliated with recognized academic/technical host institute'],
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    id: 'g5',
    title: 'Global Incubators & Accelerators',
    agency: 'Y Combinator, Techstars, Antler, Surge',
    grantAmount: 'Funding varies by accelerator, cohort, stage and investment terms.',
    statusBadge: 'PRIVATE ACCELERATORS • INVESTMENT OPPORTUNITIES',
    fundingLabel: 'Typical / Potential Funding',
    supportDetails: 'Funding: Varies by accelerator, cohort, stage and investment terms.',
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
    grantAmount: 'Potential investment range varies by investor, startup and round.',
    statusBadge: 'PRIVATE INVESTMENT • AVAILABILITY VARIES',
    fundingLabel: 'Typical / Potential Funding',
    supportDetails: 'Potential investment range varies by investor, startup and round.',
    stage: 'MVP with Paying Customers / High Early Traction',
    sector: 'HealthTech, EdTech, B2B SaaS, D2C',
    type: 'Angel Round / Seed Notes',
    description: 'Potential introductions to angels, family offices and micro-VCs may be facilitated based on investor availability, sector fit and startup readiness.',
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
