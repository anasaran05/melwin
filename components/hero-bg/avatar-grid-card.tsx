'use client'

import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

export function AvatarGridCard() {
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="bg-white/85 backdrop-blur-xl border border-black/10 shadow-[0_25px_60px_rgba(0,0,0,0.09)] rounded-3xl p-5 w-64 text-[#111111]"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-neutral-800 font-sans">Your Target Audience</span>
        <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
          <Users className="w-3.5 h-3.5" />
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {avatars.map((url, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-black/5 shadow-xs hover:scale-105 transition-transform"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="Founder Avatar" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="aspect-square rounded-2xl bg-blue-50 border border-blue-200/50 flex flex-col items-center justify-center text-blue-600 font-mono text-xs font-bold">
          <span>+10k</span>
          <span className="text-[9px] font-sans font-normal text-blue-900/70">Leads</span>
        </div>
      </div>
    </motion.div>
  )
}
