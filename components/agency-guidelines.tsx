'use client'

import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Clock, FileCheck } from 'lucide-react'

export function AgencyGuidelines() {
  return (
    <section id="guidelines" className="py-20 px-6 md:px-16 w-full text-[#111111] bg-[#fafafa] scroll-mt-24">
      <div className="max-w-[1300px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white text-[#111111] rounded-3xl p-8 md:p-14 relative overflow-hidden shadow-xl border border-black/10"
        >
          {/* Subtle background gradient glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col gap-2 mb-10 relative z-10">
            <span className="text-[#f95738] text-xs font-mono font-bold uppercase tracking-wider">
              ENGAGEMENT BOUNDARIES & TERMS
            </span>
            <h2 className="text-3xl max-md:text-2xl md:text-5xl font-black tracking-tight text-[#111111]">
              Standard Operating Guidelines
            </h2>
            <p className="text-[#666666] text-sm md:text-base max-w-3xl pt-1">
              (Applies to All Plans) — To ensure high-quality output and seamless execution, all engagements operate under the following boundaries:
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            
            {/* Card 1: Revision Limits */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-50/90 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between hover:bg-white hover:border-[#f95738]/50 hover:shadow-lg transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#f95738] mb-5 font-bold">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">Revision Limits</h3>
                <p className="text-[#555555] text-sm leading-relaxed">
                  <strong className="text-[#111111] font-semibold">2 rounds of minor revisions</strong> per video/asset. Complete structural re-edits after script approval are billed separately.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Rule #1</span>
                <span className="text-[#f95738] font-bold">Asset Approval</span>
              </div>
            </motion.div>

            {/* Card 2: Content Approval */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-50/90 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between hover:bg-white hover:border-[#f95738]/50 hover:shadow-lg transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-5 font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">Content Approval</h3>
                <p className="text-[#555555] text-sm leading-relaxed">
                  Clients have a <strong className="text-[#111111] font-semibold">48-hour window</strong> to approve content or request revisions. After 48 hours, content is considered approved to prevent publishing bottlenecks.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Rule #2</span>
                <span className="text-blue-600 font-bold">48-Hour Turnaround</span>
              </div>
            </motion.div>

            {/* Card 3: Scope Exclusions */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-50/90 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between hover:bg-white hover:border-[#f95738]/50 hover:shadow-lg transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-5 font-bold">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">Scope Exclusions</h3>
                <p className="text-[#555555] text-sm leading-relaxed">
                  Paid advertising management, community/DM management, and guaranteed lead/revenue targets are explicitly outside the scope of these retainers unless a separate performance contract is signed.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Rule #3</span>
                <span className="text-purple-600 font-bold">Clear Scope Boundaries</span>
              </div>
            </motion.div>

          </div>

          {/* Footer banner inside guidelines */}
          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All terms engineered for fast execution, predictable posting schedules, and maximum content output.</span>
            </div>
            <a
              href="#plans"
              className="text-[#f95738] hover:text-[#e0482b] font-bold underline underline-offset-4 transition-colors shrink-0"
            >
              Select your retainer plan below &rarr;
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
