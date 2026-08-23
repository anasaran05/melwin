'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { Footer } from '@/components/footer'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
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
            <FileText className="w-3.5 h-3.5" />
            <span>Official Membership & Platform Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-mono">
            Last updated: August 2026 • Governing Build With Melwin & BMF Club
          </p>
          <p className="text-sm text-neutral-300 leading-relaxed pt-2">
            These Terms of Service (“Terms”) govern your access to and use of the <strong>Build With Melwin</strong> platform, <strong>BMF Club</strong> (Business & Mentorship / Founders Club), executive membership programs, founder showcase directory, advisory services, and associated modules (collectively, the “Platform”), operated under the direction of Dr. Melwin Vincent.
          </p>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed pt-1">
            By creating an account, authenticating via Google OAuth, submitting founder credentials, or purchasing an executive pass, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must discontinue using the Platform immediately.
          </p>
        </div>

        {/* Terms Body */}
        <div className="space-y-8 text-neutral-300 text-sm leading-relaxed border-t border-white/10 pt-8">
          
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">1.</span>
              Eligibility & Account Authority
            </h2>
            <p className="text-neutral-400">
              You must be at least 18 years of age and possess the legal authority to enter into binding agreements. If you register or publish a company profile on behalf of a startup or legal entity, you represent and warrant that you hold the requisite corporate authority to bind that entity.
            </p>
            <p className="text-neutral-400">
              Each founder account is personal to the registered user. Sharing credentials, delegating unauthorized access, or misrepresenting founder identities is strictly prohibited.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">2.</span>
              Scope of Platform & BMF Club Services
            </h2>
            <p className="text-neutral-400">
              Build With Melwin delivers an ecosystem designed for high-growth founders and operators, encompassing:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-400 pl-2">
              <li><strong>BMF Club Showcase:</strong> Interactive 3D founder profile cards, searchable industry directory, and public venture indexing.</li>
              <li><strong>Executive Metal Passes:</strong> Precision-crafted, laser-engraved physical membership passes customized with founder name, company, and syndicate ID.</li>
              <li><strong>Advisory & Growth Mentorship:</strong> Strategic consulting sessions, scaling frameworks, export-import scaling, and talent strategy.</li>
              <li><strong>Atom SE & Digital Acceleration:</strong> Enterprise technology architecture, software engineering advisory, and digital tooling.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">3.</span>
              Founder Verification & Showcase Guidelines
            </h2>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <strong className="text-white">• Editorial Review:</strong> To preserve the quality and prestige of the BMF Club Directory, all submitted founder cards undergo an administrative verification review before appearing publicly.
              </li>
              <li>
                <strong className="text-white">• Accuracy of Metrics:</strong> You certify that all self-reported stage indicators, funding figures, revenue/GMV metrics, and portfolio links are accurate and not misleading.
              </li>
              <li>
                <strong className="text-white">• Approval Discretion:</strong> BMF Club administration retains absolute discretion to approve, request revisions, or decline directory inclusion to safeguard network integrity.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">4.</span>
              Physical Laser-Engraved Pass Terms
            </h2>
            <p className="text-neutral-400">
              Physical executive metal passes are custom manufactured and laser-etched upon approved application and fee settlement. You are solely responsible for providing an accurate shipping address and recipient name.
            </p>
            <p className="text-neutral-400">
              Due to the personalized nature of laser-engraving, completed pass productions cannot be cancelled, returned, or refunded once laser-etching has commenced.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">5.</span>
              Acceptable Use & Anti-Scraping Policy
            </h2>
            <p className="text-neutral-400">
              When accessing the Platform and founder directory, you agree NOT to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-400 pl-2">
              <li>Use automated scrapers, bots, or extraction scripts to harvest member contact information or directory data.</li>
              <li>Circumvent API rate limiters or security headers implemented on our network.</li>
              <li>Send unsolicited mass spam, deceptive investment solicitations, or malicious links to community members.</li>
              <li>Impersonate another founder, company executive, or platform administrator.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">6.</span>
              Advisory Nature & Earnings Disclaimer
            </h2>
            <p className="text-neutral-400">
              Mentorship sessions, consulting frameworks, and discussions led by Dr. Melwin Vincent or guest advisors represent educational guidance and strategic opinions based on industry experience.
            </p>
            <p className="text-neutral-400">
              They do not constitute guaranteed financial, investment, or legal underwriting. Business success, funding approvals, customer acquisition, and operational outcomes depend exclusively on market factors and founder execution.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">7.</span>
              Intellectual Property Rights
            </h2>
            <p className="text-neutral-400">
              • <strong className="text-white">Platform IP:</strong> The platform design, 3D card rendering engines, interactive flip animations, trademarks, and branding belong exclusively to Build With Melwin.
            </p>
            <p className="text-neutral-400">
              • <strong className="text-white">Founder Content:</strong> You retain ownership of your company trademarks, logos, and submitted bios. By submitting your profile for public directory showcase, you grant us a worldwide, non-exclusive license to display your card across the BMF Club network.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">8.</span>
              Governing Law & Dispute Resolution
            </h2>
            <p className="text-neutral-400">
              These Terms and any disputes arising out of your membership or platform use shall be governed by and construed in accordance with the <strong>laws of India</strong>, including the <strong>Digital Personal Data Protection Act, 2023</strong> and the <strong>Information Technology Act, 2000</strong>. Any legal proceedings shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-2 pt-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">9.</span>
              Contact Information
            </h2>
            <p className="text-neutral-400">
              For questions regarding these Terms of Service or membership privileges, please reach out to:
            </p>
            <div className="pt-2 text-xs font-mono text-neutral-300 space-y-1">
              <div><span className="text-neutral-400">Organization:</span> Build With Melwin & BMF Club</div>
              <div><span className="text-neutral-400">Founder & Principal:</span> Dr. Melwin Vincent</div>
              <div><span className="text-neutral-400">Support & Legal:</span> <a href="mailto:buildwithmelwin@gmail.com" className="text-blue-400 hover:underline">buildwithmelwin@gmail.com</a></div>
              <div><span className="text-neutral-400">Website:</span> <a href="https://buildwithmelwin.com" className="text-neutral-300 hover:underline">https://buildwithmelwin.com</a></div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
