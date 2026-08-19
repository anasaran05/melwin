'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ArrowDown, Sparkles, MousePointer2 } from 'lucide-react'

export function AgencyHero() {
  return (
    <section className="pt-24 pb-12 md:pt-40 md:pb-24 px-4 sm:px-6 md:px-12 w-full text-[#111111] relative overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        
        {/* Split Grid: Left Text + Right Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column (Content) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col gap-5 md:gap-6"
          >

            {/* Headline */}
            <h1 className="text-[2.25rem] sm:text-[3.25rem] leading-[1.04] md:text-[4.5rem] font-black tracking-tight text-[#111111]">
              We Make You <br />
              <span className="text-[#888888]">Famous.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-[#555555] font-normal leading-relaxed max-w-xl">
              Strategic personal brand positioning, done-for-you physical shoots, remote production frameworks, and revenue-generating sales enablement built for founders.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#111111] hover:bg-black text-white px-7 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#guidelines"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 px-6 py-3.5 sm:py-4 rounded-full font-semibold text-sm transition-colors shadow-xs"
              >
                <span>Operating Guidelines</span>
              </a>

              <a
                href="#comparison"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#666666] hover:text-[#111111] px-4 py-3 sm:py-4 font-medium text-sm transition-colors"
              >
                <span>Compare Plans</span>
              </a>
            </div>
          </motion.div>


          {/* Right Column (Showcase Card) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="bg-white rounded-3xl p-3 border border-black/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] relative group overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch min-h-[320px]">
                
                {/* Dark Editorial Left Side of Showcase Card */}
                <div className="md:col-span-5 bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#262626] rounded-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-1 text-xs font-mono font-medium text-neutral-400">
                    <span className="block">Strategy</span>
                    <span className="block">Production</span>
                    <span className="block">Revenue</span>
                  </div>

                  <div className="relative z-10 pt-12">
                    <h3 className="text-2xl font-black uppercase tracking-tight leading-tight mb-2 text-white">
                      MONETIZE YOUR AUTHORITY.
                    </h3>
                    <p className="text-[11px] text-neutral-300 font-sans">
                      Turn organic view velocity into founder revenue.
                    </p>
                  </div>

                  {/* Floating Cursor Pointer */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-4 right-4 bg-white text-black p-2 rounded-xl shadow-lg"
                  >
                    <MousePointer2 className="w-5 h-5 fill-black text-black" />
                  </motion.div>
                </div>

                {/* Right Dashboard/Video Preview Block */}
                <div className="md:col-span-7 bg-[#f8fafc] rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-800">Founder Growth Studio</span>
                    <span className="text-[10px] font-mono bg-neutral-900 text-white px-2 py-0.5 rounded-full font-bold">
                      ACTIVE RETAINER
                    </span>
                  </div>

                  {/* Mock Video / Content Cadence List */}
                  <div className="space-y-3 py-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold text-xs">
                          YT
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-800">Long-form Video</span>
                          <span className="block text-[10px] text-slate-500 font-mono">Scripted & DFY Edit</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-900">+45k Views</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                          IN
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-800">LinkedIn Publishing</span>
                          <span className="block text-[10px] text-slate-500 font-mono">5 Posts / Week</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-600">High Intent</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Target: 100k Reach</span>
                    <span className="text-[#111111] font-bold">100% On Schedule</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
