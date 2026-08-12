'use client'

import { motion } from 'framer-motion'
import { Video, Linkedin, Youtube, Instagram, Sparkles } from 'lucide-react'

export function ContentEngineHub() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="bg-white/85 backdrop-blur-xl border border-black/10 shadow-[0_25px_60px_rgba(0,0,0,0.09)] rounded-3xl p-5 w-full max-w-sm text-[#111111]"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-neutral-800">Content Engine Pipeline</span>
        <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-semibold">
          LIVE FLOW
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 relative">
        {/* Source: Raw Shoot */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-xs">
            <Video className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono font-medium text-neutral-600">Raw Shoot</span>
        </div>

        {/* Arrow connector */}
        <div className="flex-1 h-0.5 bg-gradient-to-r from-neutral-200 via-blue-400 to-blue-600 relative">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute top-1/2 -translate-y-1/2"
            animate={{ x: [0, 60, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Central Hub */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 ring-4 ring-blue-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono font-bold text-blue-700">Brand Hub</span>
        </div>

        {/* Arrow connector */}
        <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-600 via-blue-400 to-neutral-200 relative">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute top-1/2 -translate-y-1/2"
            animate={{ x: [0, 60, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
          />
        </div>

        {/* Destinations */}
        <div className="flex flex-col gap-1 shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-700">
            <Linkedin className="w-3.5 h-3.5 text-[#0a66c2]" />
            <span>LinkedIn</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-700">
            <Youtube className="w-3.5 h-3.5 text-[#ff0000]" />
            <span>YouTube</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-700">
            <Instagram className="w-3.5 h-3.5 text-[#e4405f]" />
            <span>Reels</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
