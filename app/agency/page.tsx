import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { AgencyHero } from '@/components/agency-hero'
import { AgencyFeaturesGrid } from '@/components/agency-features-grid'
import { AgencyGuidelines } from '@/components/agency-guidelines'
import { AgencyPlans } from '@/components/agency-plans'
import { AgencyComparison } from '@/components/agency-comparison'
import { AgencyProcess } from '@/components/agency-process'
import { AgencyContact } from '@/components/agency-contact'
import { FAQ } from '@/components/faq'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Agency Retainer Plans | Dr. Melwin Vincent',
  description: 'Content Engine, Complete Production Partner, and Executive Revenue Retainer Plans built for founders. Strategy, scripting, DFY physical shoots, and revenue alignment.',
}

export default function AgencyPage() {
  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden bg-[#f2f2f2] text-[#111111]">
      {/* Texture grain overlay */}
      <div className="grain-overlay" />

      {/* Floating Navbar */}
      <Navbar />

      {/* Hero Banner */}
      <AgencyHero />

      {/* 4x2 Deliverables Feature Grid */}
      <AgencyFeaturesGrid />

      {/* Standard Operating Guidelines */}
      <AgencyGuidelines />

      {/* Retainer Plans Grid */}
      <AgencyPlans />

      {/* Feature Matrix Comparison */}
      <AgencyComparison />

      {/* Step-by-Step Trial Onboarding Process */}
      <AgencyProcess />

      {/* Agency Lead Contact Form */}
      <AgencyContact />

      {/* Frequently Asked Questions */}
      <FAQ />

      {/* Site Footer */}
      <Footer />
    </main>
  )
}
