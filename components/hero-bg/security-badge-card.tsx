'use client'

import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

export function SecurityBadgeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="bg-white/80 backdrop-blur-xl border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-2xl p-4 w-60 text-[#111111] select-none"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-500 uppercase">
          Secured Brand Positioning
        </span>
      </div>

      <div className="flex items-center gap-3 p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/60">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-xs font-bold text-emerald-950">Guaranteed Delivery</span>
          <span className="block text-[10px] text-emerald-700/80 font-mono">100% Quality & SLA</span>
        </div>
      </div>
    </motion.div>
  )
}
