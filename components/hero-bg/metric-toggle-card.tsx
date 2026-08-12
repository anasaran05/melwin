'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

export function MetricToggleCard() {
  const [enabled, setEnabled] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-xl border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-2xl p-4 w-64 text-[#111111] select-none"
    >
      <div className="flex items-center justify-between mb-3 text-[11px] font-mono font-bold tracking-wider text-[#666666] uppercase">
        <span className="flex items-center gap-1.5 text-blue-600">
          <TrendingUp className="w-3.5 h-3.5" />
          BRAND AUTHORITY INDEX
        </span>
      </div>

      <div className="space-y-2.5 text-xs font-sans">
        {/* Row 1: Without Retainer */}
        <div className={`flex items-center justify-between p-2 rounded-xl transition-all ${!enabled ? 'bg-neutral-100 font-semibold' : 'text-neutral-500'}`}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-mono">8%</span>
            <span className="text-[11px]">Without Retainer</span>
          </div>
          <button
            onClick={() => setEnabled(false)}
            className={`w-7 h-4 rounded-full p-0.5 transition-colors ${!enabled ? 'bg-neutral-400' : 'bg-neutral-200'}`}
          >
            <motion.div
              layout
              className="w-3 h-3 rounded-full bg-white shadow-xs"
              animate={{ x: !enabled ? 12 : 0 }}
            />
          </button>
        </div>

        {/* Row 2: With Personal Brand */}
        <div className={`flex items-center justify-between p-2 rounded-xl transition-all ${enabled ? 'bg-blue-50/90 text-blue-900 font-bold border border-blue-200/60' : 'text-neutral-500'}`}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-mono text-blue-600">75%</span>
            <span className="text-[11px]">With Personal Brand</span>
          </div>
          <button
            onClick={() => setEnabled(true)}
            className={`w-7 h-4 rounded-full p-0.5 transition-colors ${enabled ? 'bg-blue-600' : 'bg-neutral-200'}`}
          >
            <motion.div
              layout
              className="w-3 h-3 rounded-full bg-white shadow-xs"
              animate={{ x: enabled ? 12 : 0 }}
            />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
