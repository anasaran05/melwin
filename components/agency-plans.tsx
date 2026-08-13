'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { AgencyBookingModal } from '@/components/agency-booking-modal'

export function AgencyPlans() {
  const [selectedPlan, setSelectedPlan] = useState<{ title: string; price: string } | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSelectPlan = (title: string, price: string) => {
    setSelectedPlan({ title, price })
    setModalOpen(true)
  }

  return (
    <section id="plans" className="py-12 md:py-24 px-4 sm:px-6 md:px-16 w-full text-[#111111] scroll-mt-24">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-3">
          <span className="text-blue-600 text-[11px] sm:text-xs font-mono tracking-widest uppercase font-bold block">
            TAILORED RETAINER PLANS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-[#111111]">
            Retainer Plans
          </h2>
          <p className="text-[#666666] text-xs sm:text-sm md:text-base max-w-xl mx-auto">
            Three distinct engagement models structured for founder branding, remote post-production, full-service physical shoots, and revenue alignment.
          </p>
        </div>

        {/* 3 Mobile Device / Luxury Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* ==================== CARD 1: SILVER PLAN ==================== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0b1021] text-white rounded-[2.5rem] p-6 pb-10 border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col justify-between relative overflow-hidden group hover:border-blue-400/40 transition-all duration-300"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#1e3a8a]/40 via-[#1d4ed8]/10 to-transparent pointer-events-none" />

            <div>
              {/* Organic Fluid Banner Wave */}
              <div className="h-36 -mx-6 -mt-6 mb-6 relative overflow-hidden">
                <svg
                  className="w-full h-full object-cover opacity-90"
                  viewBox="0 0 400 180"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M-10 40 Q 100 160 200 60 T 410 80 L 410 0 L -10 0 Z"
                    fill="url(#silverGradient1)"
                  />
                  <path
                    d="M-10 70 Q 120 10 240 110 T 410 50 L 410 0 L -10 0 Z"
                    fill="url(#silverGradient2)"
                    opacity="0.7"
                  />
                  <defs>
                    <linearGradient id="silverGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#1d4ed8" />
                      <stop offset="100%" stopColor="#0b1021" />
                    </linearGradient>
                    <linearGradient id="silverGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Title & Description */}
              <div className="px-2 flex flex-col items-center">
                <h3 className="text-3xl font-normal font-sans tracking-tight text-white mb-2 text-center">
                  Silver Plan
                </h3>
                <p className="text-xs text-white/60 font-light leading-relaxed mb-6 max-w-xs text-center">
                  Beginners or founders comfortable filming remotely who need expert strategy, scripting, and post-production.
                </p>

                {/* Price */}
                <div className="mb-6 flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-normal text-white tracking-tight font-sans">
                    ₹60,000
                  </span>
                  <span className="text-xs text-white/50 font-mono">/ monthly</span>
                </div>

                {/* Glassmorphic Translucent Action Button */}
                <button
                  onClick={() => handleSelectPlan('Silver: The Content Engine', '₹60,000 / month')}
                  className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium py-3.5 px-6 rounded-2xl border border-white/15 transition-all flex items-center justify-center text-sm cursor-pointer shadow-inner mb-8"
                >
                  <span>Select Silver Plan</span>
                </button>
              </div>

              {/* Plan Limits & Highlights - LEFT ALIGNED */}
              <div className="px-2 space-y-6 w-full text-left">
                <div>
                  <h4 className="text-sm font-medium text-white/90 mb-3 font-sans text-left">
                    Plan Scope
                  </h4>
                  <ul className="space-y-3 text-xs text-white/70 font-light flex flex-col items-start text-left">
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                      <span><strong>10 Reels/Shorts</strong> + <strong>2 YouTube</strong> videos per month</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                      <span><strong>360 video minutes</strong> per year remote post-production</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/90 mb-3 font-sans text-left">
                    Features Included
                  </h4>
                  <ul className="space-y-3 text-xs text-white/70 font-light flex flex-col items-start text-left">
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                      <span>LinkedIn Publishing (3 posts / week)</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                      <span>Brand positioning, ideation & scripting</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                      <span>Full remote video editing, FX & subtitles</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                      <span>1x 60-Minute monthly strategy call</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </motion.div>


          {/* ==================== CARD 2: GOLD PLAN (MOST POPULAR) ==================== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#170921] text-white rounded-[2.5rem] p-6 pb-10 border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col justify-between relative overflow-hidden group transform lg:-translate-y-4 hover:border-fuchsia-400/40 transition-all duration-300"
          >
            {/* Top Right Floating White Popular Badge */}
            <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 bg-white text-black px-3.5 py-1.5 rounded-full shadow-lg border border-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-600 animate-pulse" />
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest">
                MOST POPULAR
              </span>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#7e22ce]/40 via-[#a855f7]/10 to-transparent pointer-events-none" />

            <div>
              {/* Organic Fluid Banner Wave */}
              <div className="h-36 -mx-6 -mt-6 mb-6 relative overflow-hidden">
                <svg
                  className="w-full h-full object-cover opacity-90"
                  viewBox="0 0 400 180"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M-10 20 Q 110 170 210 50 T 410 90 L 410 0 L -10 0 Z"
                    fill="url(#goldGradient1)"
                  />
                  <path
                    d="M-10 60 Q 130 0 250 120 T 410 40 L 410 0 L -10 0 Z"
                    fill="url(#goldGradient2)"
                    opacity="0.75"
                  />
                  <defs>
                    <linearGradient id="goldGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e056fd" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#170921" />
                    </linearGradient>
                    <linearGradient id="goldGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f472b6" />
                      <stop offset="100%" stopColor="#7e22ce" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Title & Description */}
              <div className="px-2 flex flex-col items-center">
                <h3 className="text-3xl font-normal font-sans tracking-tight text-white mb-2 text-center">
                  Gold Plan
                </h3>
                <p className="text-xs text-white/60 font-light leading-relaxed mb-6 max-w-xs text-center">
                  Busy founders wanting a "Done-For-You" physical shoot, directing, and elevated publishing volume.
                </p>

                {/* Price */}
                <div className="mb-6 flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-normal text-white tracking-tight font-sans">
                    ₹90,000
                  </span>
                  <span className="text-xs text-white/50 font-mono">/ monthly</span>
                </div>

                {/* Glassmorphic Translucent Action Button */}
                <button
                  onClick={() => handleSelectPlan('Gold: The Complete Production Partner', '₹90,000 / month')}
                  className="w-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-medium py-3.5 px-6 rounded-2xl border border-white/20 transition-all flex items-center justify-center text-sm cursor-pointer shadow-inner mb-8"
                >
                  <span>Select Gold Plan</span>
                </button>
              </div>

              {/* Plan Limits & Highlights - LEFT ALIGNED */}
              <div className="px-2 space-y-6 w-full text-left">
                <div>
                  <h4 className="text-sm font-medium text-white/90 mb-3 font-sans text-left">
                    Production & Shoot Limits
                  </h4>
                  <ul className="space-y-3 text-xs text-white/70 font-light flex flex-col items-start text-left">
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-fuchsia-300 shrink-0 mt-0.5" />
                      <span><strong>Up to 3 Dedicated Shoot Days</strong> per month (6h on set)</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-fuchsia-300 shrink-0 mt-0.5" />
                      <span>On-site camera, studio lighting & audio setup</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/90 mb-3 font-sans text-left">
                    Everything In Silver Plus...
                  </h4>
                  <ul className="space-y-3 text-xs text-white/70 font-light flex flex-col items-start text-left">
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-fuchsia-300 shrink-0 mt-0.5" />
                      <span>Up to 15 Reels/Shorts + 6 YouTube videos/mo</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-fuchsia-300 shrink-0 mt-0.5" />
                      <span>5 LinkedIn Posts / wk + 2 SEO Blog Articles</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-fuchsia-300 shrink-0 mt-0.5" />
                      <span>Founder performance coaching & live direction</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-fuchsia-300 shrink-0 mt-0.5" />
                      <span>Continuous competitor intelligence & gap analysis</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </motion.div>


          {/* ==================== CARD 3: DIAMOND PLAN ==================== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#051714] text-white rounded-[2.5rem] p-6 pb-10 border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col justify-between relative overflow-hidden group hover:border-emerald-400/40 transition-all duration-300"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#047857]/40 via-[#10b981]/10 to-transparent pointer-events-none" />

            <div>
              {/* Organic Fluid Banner Wave */}
              <div className="h-36 -mx-6 -mt-6 mb-6 relative overflow-hidden">
                <svg
                  className="w-full h-full object-cover opacity-90"
                  viewBox="0 0 400 180"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M-10 50 Q 100 150 200 30 T 410 100 L 410 0 L -10 0 Z"
                    fill="url(#diamondGradient1)"
                  />
                  <path
                    d="M-10 80 Q 140 20 260 130 T 410 40 L 410 0 L -10 0 Z"
                    fill="url(#diamondGradient2)"
                    opacity="0.75"
                  />
                  <defs>
                    <linearGradient id="diamondGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#047857" />
                      <stop offset="100%" stopColor="#051714" />
                    </linearGradient>
                    <linearGradient id="diamondGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#065f46" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Title & Description */}
              <div className="px-2 flex flex-col items-center">
                <h3 className="text-3xl font-normal font-sans tracking-tight text-white mb-2 text-center">
                  Diamond Plan
                </h3>
                <p className="text-xs text-white/60 font-light leading-relaxed mb-6 max-w-xs text-center">
                  Elite founders transforming personal brand into a direct revenue-generating sales engine.
                </p>

                {/* Price */}
                <div className="mb-6 flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-normal text-white tracking-tight font-sans">
                    ₹1,59,000
                  </span>
                  <span className="text-xs text-white/50 font-mono">/ monthly</span>
                </div>

                {/* Glassmorphic Translucent Action Button */}
                <button
                  onClick={() => handleSelectPlan('Diamond: The Executive Revenue Partner', '₹1,59,000 / month')}
                  className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium py-3.5 px-6 rounded-2xl border border-white/15 transition-all flex items-center justify-center text-sm cursor-pointer shadow-inner mb-8"
                >
                  <span>Select Diamond Plan</span>
                </button>
              </div>

              {/* Plan Limits & Highlights - LEFT ALIGNED */}
              <div className="px-2 space-y-6 w-full text-left">
                <div>
                  <h4 className="text-sm font-medium text-white/90 mb-3 font-sans text-left">
                    Executive Revenue Scope
                  </h4>
                  <ul className="space-y-3 text-xs text-white/70 font-light flex flex-col items-start text-left">
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                      <span>Founder-led sales funnels & lead magnets</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                      <span>Sales enablement video assets & ROI attribution</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/90 mb-3 font-sans text-left">
                    Everything In Gold Plus...
                  </h4>
                  <ul className="space-y-3 text-xs text-white/70 font-light flex flex-col items-start text-left">
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                      <span>Executive PR, creator & podcast outreach</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                      <span>Dynamic location shoots & fresher b-roll</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                      <span><strong>Unlimited Strategic Sync Calls</strong> & direct access</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-left">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                      <span>VIP direct line support (&lt;4-hour SLA)</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>

      {/* Booking Modal Trigger */}
      <AgencyBookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </section>
  )
}
