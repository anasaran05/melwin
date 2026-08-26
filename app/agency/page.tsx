import type { Metadata } from 'next'
import { AgencyHero } from '@/components/agency-hero'
import { AgencyFeaturesGrid } from '@/components/agency-features-grid'
import { AgencyGuidelines } from '@/components/agency-guidelines'
import { AgencyComparison } from '@/components/agency-comparison'
import { AgencyProcess } from '@/components/agency-process'
import { AgencyContact } from '@/components/agency-contact'
import { FAQ } from '@/components/faq'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Personal Branding & Agency Retainers | Dr. Melwin Vincent',
  description: 'Turn the founder into the #1 customer acquisition channel. Complete done-for-you video production, studio shoots, scriptwriting, and executive authority on LinkedIn & Instagram.',
  openGraph: {
    title: 'Personal Branding & Agency Retainers | Dr. Melwin Vincent',
    description: 'Turn the founder into the #1 customer acquisition channel. Complete done-for-you video production, studio shoots, scriptwriting, and executive authority on LinkedIn & Instagram.',
    url: 'https://buildwithmelwin.com/agency',
    siteName: 'Dr. Melwin Vincent',
    images: [
      {
        url: '/images/personal-branding.webp',
        width: 1200,
        height: 630,
        alt: 'Personal Branding & Agency Retainers - Dr. Melwin Vincent',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Branding & Agency Retainers | Dr. Melwin Vincent',
    description: 'Turn the founder into the #1 customer acquisition channel. Complete done-for-you video production, studio shoots, scriptwriting, and executive authority on LinkedIn & Instagram.',
    images: ['/images/personal-branding.webp'],
  },
}

export default function AgencyPage() {
  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden bg-[#f2f2f2] text-[#111111]">
      {/* Texture grain overlay */}
      <div className="grain-overlay" />

      {/* Hero Banner */}
      <AgencyHero />

      {/* 4x2 Deliverables Feature Grid */}
      <AgencyFeaturesGrid />

      {/* Standard Operating Guidelines */}
      <AgencyGuidelines />

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
