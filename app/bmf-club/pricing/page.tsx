'use client'

import React, { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PricingCards } from '@/components/bmf-club/pricing-cards'
import { Crown, ArrowLeft, HelpCircle } from 'lucide-react'

export function BmfPricingContent() {
  return (
    <main className="font-sans min-h-screen bg-[#f8f8f8] text-[#111111] relative overflow-x-hidden">
      {/* Background Subtle Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/[0.08] via-transparent to-transparent pointer-events-none" />
      <div className="grain-overlay" />

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-20 relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-3">
          <Link
            href="/bmf-club"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to BMF Club
          </Link>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <Crown className="w-3.5 h-3.5 text-amber-600" /> BMF Club Membership
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-950 tracking-tight leading-[1.12] mb-3">
            Invest in Your Network. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600">
              Build With the Best.
            </span>
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Gain direct access to top-tier Tamil Nadu angel investors, verified founders, private masterclasses, and get featured front and center in the BMF Directory.
          </p>
        </div>

        {/* Interactive Pricing Cards */}
        <Suspense fallback={<div className="py-20 text-center text-stone-500">Loading pricing plans...</div>}>
          <PricingCards showTitle={false} />
        </Suspense>

        {/* FAQ Section */}
        <div className="mt-28 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-950">
              Got Questions? We&apos;ve Got Answers.
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
              <h3 className="text-base font-bold text-stone-950 mb-2">
                How does payment work with Cashfree?
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Payments are securely processed through Cashfree Payment Gateway. You can pay seamlessly via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, or NetBanking. Your account status is converted automatically the instant payment completes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
              <h3 className="text-base font-bold text-stone-950 mb-2">
                How does Featured Founder directory placement work?
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                When you upgrade to BMF Premium, your founder profile is instantly promoted to Featured Founder status. Your card receives priority placement in the BMF Member Directory so investors and ecosystem leaders see you first.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
              <h3 className="text-base font-bold text-stone-950 mb-2">
                What is included in Direct Access to Melwin?
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Premium members receive direct interaction channels with Melwin, opportunity to validate startup concepts, priority introductions to venture collaborators, and access to private meetup sessions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
              <h3 className="text-base font-bold text-stone-950 mb-2">
                Is the ₹799 price recurring or a one-time annual pass?
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                The ₹799 plan grants 365 days of full VIP Premium access from the date of purchase. You will receive a reminder before your membership cycle concludes, with no hidden recurring charges.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default function BmfClubPricingPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/bmf-club')
  }, [router])

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
      {/* BMF Pricing postponed - redirecting to /bmf-club */}
    </div>
  )
}
