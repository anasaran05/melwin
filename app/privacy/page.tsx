'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Shield } from 'lucide-react'
import { Footer } from '@/components/footer'

function PrivacyPolicyContent() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || searchParams.get('returnTo')
  const isFromBmf = Boolean(from && (from.startsWith('/bmf-club') || from.includes('bmf')))
  const backUrl = from || '/'
  const backLabel = isFromBmf 
    ? (from === '/bmf-club/login' ? 'Back to Portal Login' : from === '/bmf-club/dashboard' ? 'Back to Dashboard' : 'Back to BMF Club')
    : 'Back to Home'

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={backUrl}
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
              <span>{backLabel}</span>
            </Link>
            {isFromBmf && (
              <Link
                href="/"
                className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors hidden sm:inline-block"
              >
                Personal Website
              </Link>
            )}
          </div>
          <div className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-500">
            Build With Melwin • Legal & Compliance
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10 text-left">
        {/* Title Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono font-semibold text-blue-400">
            <Shield className="w-3.5 h-3.5" />
            <span>DPDP Act 2023 Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-mono">
            Last updated: August 2026 • Effective for Build With Melwin & BMF Club
          </p>
          <p className="text-sm text-neutral-300 leading-relaxed pt-2">
            This Privacy Policy explains how <strong>Build With Melwin</strong> and <strong>BMF Club</strong> (“we”, “us”, “our”, operated under the leadership of Dr. Melwin Vincent) collects, uses, stores, and protects your information when you access or use our platform, including our founder directory, membership cards, executive pass program, consulting services, and professional community features (collectively, the “Platform”).
          </p>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed pt-1">
            By using the Platform, creating a founder account, or authenticating via Google OAuth, you provide your unambiguous, free, specific, informed, and unconditional consent to the collection, processing, and usage of your personal data as outlined in this Privacy Policy, in accordance with the <strong>Digital Personal Data Protection (DPDP) Act, 2023 (India)</strong> and other applicable global privacy regulations.
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 text-neutral-300 text-sm leading-relaxed border-t border-white/10 pt-8">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">1.</span>
              Information We Collect
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-400">
              <div>
                <h3 className="font-semibold text-white mb-1">a) Information You Provide Directly</h3>
                <p className="mb-2">We collect information that you voluntarily submit when signing up, onboarding to BMF Club, or applying for executive passes:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Full Name and Professional Title</li>
                  <li>Email address and Google Account credentials via OAuth</li>
                  <li>Company / Startup Name, Category, Stage, and Revenue/GMV metrics</li>
                  <li>Elevator Pitch, Bio, and Founder Story</li>
                  <li>Company website URL, LinkedIn profile, and Twitter / X handle</li>
                  <li>Portrait photos, company logos, and physical shipping address for laser-engraved metal passes</li>
                  <li>Billing details and transaction records for club memberships and advisory sessions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">b) Founder Verification & Activity Records</h3>
                <p className="mb-2">To maintain the elite integrity of the BMF ecosystem, we record:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Verification submission statuses, reviewer timestamps, and approval history</li>
                  <li>Pass tier authorizations (Standard, Executive, Syndicate, Lifetime)</li>
                  <li>Syndicate introductions and collaborative founder interactions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">c) Technical and Telemetry Data</h3>
                <p className="mb-2">We automatically log technical data required for security and rate-limiting:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>IP address, device identifiers, and browser user-agent</li>
                  <li>Session security tokens and login timestamps</li>
                  <li>Page interaction events and directory query patterns (used for load optimization and caching)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">2.</span>
              How We Use Your Information
            </h2>
            <p className="text-neutral-400">We process your data for the following lawful and legitimate purposes:</p>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-400 text-xs sm:text-sm pl-2">
              <li><strong>Authentication & Security:</strong> Verifying your identity securely through Google OAuth without storing plaintext passwords on our servers.</li>
              <li><strong>Directory & Card Generation:</strong> Creating, rendering, and indexing your interactive 3D Founder Card on the BMF Directory.</li>
              <li><strong>Pass Fulfillment:</strong> Manufacturing, laser-engraving, and shipping physical BMF Club executive metal passes to verified founders.</li>
              <li><strong>Advisory & Growth Consulting:</strong> Facilitating strategic sessions with Dr. Melwin Vincent, funding intros, and talent matchmaking.</li>
              <li><strong>Abuse Prevention:</strong> Enforcing rate-limiting algorithms to protect our platform, APIs, and member directory from scraping or unauthorized access.</li>
            </ul>
            <p className="text-xs text-neutral-400 pt-1">
              We never sell, rent, or monetize your personal data or Google account information to third parties.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">3.</span>
              Public Directory & Visibility Controls
            </h2>
            <ul className="space-y-2 text-neutral-400 text-xs sm:text-sm">
              <li>
                <strong className="text-white">• Draft Profile:</strong> While you are building or editing your founder profile in the BMF Dashboard, your draft fields remain private to your account.
              </li>
              <li>
                <strong className="text-white">• Approved Directory Showcase:</strong> Once approved, your public founder card (Name, Role, Company, Category, Bio, Traction Metric, and Social URLs) is published to the BMF Club Directory for peer networking and investor discovery.
              </li>
              <li>
                <strong className="text-white">• Profile Editing & Delisting:</strong> You retain complete control to update, modify, or request the delisting of your founder card at any time from your dashboard or by emailing support.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">4.</span>
              Cookies and Tracking Technologies
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              We use lightweight, modern session storage, cookies, and telemetry to optimize platform performance and understand user engagement:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-400 text-xs sm:text-sm pl-2">
              <li><strong>Essential Session Cookies:</strong> Managing active authentication state and security tokens.</li>
              <li><strong>Client Caching:</strong> Utilizing browser session storage to cache directory cards for 5 minutes, preventing redundant database calls and improving page load speeds.</li>
              <li><strong>Google Analytics 4 (GA4):</strong> Aggregating anonymized traffic metrics to evaluate platform discovery and improve founder resources.</li>
              <li><strong>Meta Pixel (Datasets):</strong> Measuring the effectiveness of startup event announcements and community outreach campaigns.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">5.</span>
              Data Sharing & Trusted Service Providers
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              We share data exclusively with trusted infrastructure partners bound by strict confidentiality and data protection agreements:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-400 text-xs sm:text-sm pl-2">
              <li><strong>Database & Auth:</strong> Supabase Inc. (managed PostgreSQL & OAuth session token management).</li>
              <li><strong>Media Storage:</strong> Cloudflare R2 (compressed WebP portraits and company logos).</li>
              <li><strong>Physical Fulfillment:</strong> Certified manufacturing and courier partners (strictly for delivering physical laser-engraved metal passes).</li>
              <li><strong>Legal Compliance:</strong> Government or regulatory authorities only when strictly required by applicable Indian or international law.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">6.</span>
              Data Storage, Security & Retention
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Your data is stored in enterprise-grade cloud environments featuring end-to-end SSL/TLS encryption, Row-Level Security (RLS) policies, and strict role-based access control.
            </p>
            <p className="text-neutral-400 text-xs sm:text-sm">
              We retain personal records for as long as your BMF Club membership is active or as necessary to fulfill founder verification, resolve disputes, and satisfy statutory tax or legal obligations.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">7.</span>
              Compliance with DPDP Act, 2023 (India)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              In accordance with the <strong>Digital Personal Data Protection Act, 2023</strong> of India, Build With Melwin acts as the <strong>Data Fiduciary</strong>, and you act as the <strong>Data Principal</strong>.
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-neutral-400 pl-2">
              <p><strong>a) Rights of the Data Principal:</strong> You have the right to access summaries of your personal data, request correction or erasure of inaccurate records, seek grievance redressal, and nominate a representative in the event of incapacity.</p>
              <p><strong>b) Consent Withdrawal:</strong> You may withdraw your processing consent at any time. Notice of withdrawal may result in the suspension of your verified founder showcase and active club privileges.</p>
              <p><strong>c) Grievance Redressal:</strong> If you have any inquiries or grievances regarding data processing, contact our designated Grievance Officer below. You also hold the statutory right to file a complaint with the Data Protection Board of India.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="space-y-2 pt-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">8.</span>
              Contact & Grievance Officer
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              For privacy inquiries, data deletion requests, or formal communications under the DPDP Act, reach out to our team:
            </p>
            <div className="pt-2 text-xs font-mono text-neutral-300 space-y-1">
              <div><span className="text-neutral-400">Organization:</span> Build With Melwin & BMF Club</div>
              <div><span className="text-neutral-400">Founder & Principal:</span> Dr. Melwin Vincent</div>
              <div><span className="text-neutral-400">Grievance & Legal Desk:</span> <a href="mailto:buildwithmelwin@gmail.com" className="text-blue-400 hover:underline">buildwithmelwin@gmail.com</a></div>
              <div><span className="text-neutral-400">Website:</span> <a href="https://buildwithmelwin.com" className="text-neutral-300 hover:underline">https://buildwithmelwin.com</a></div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0c] text-white" />}>
      <PrivacyPolicyContent />
    </Suspense>
  )
}
