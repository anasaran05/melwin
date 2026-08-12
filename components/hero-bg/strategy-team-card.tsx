'use client'

import { motion } from 'framer-motion'
import { Award, UserCheck } from 'lucide-react'

export function StrategyTeamCard() {
  const roles = [
    'Creative Director',
    'Scriptwriter',
    'Post-Production Team',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="bg-white/85 backdrop-blur-xl border border-black/10 shadow-[0_25px_60px_rgba(0,0,0,0.09)] rounded-3xl p-5 w-64 text-[#111111]"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-neutral-800">Your Retainer Team</span>
        <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
          <Award className="w-3.5 h-3.5" />
        </span>
      </div>

      <div className="space-y-2">
        {roles.map((role, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] shrink-0">
                <UserCheck className="w-3 h-3" />
              </div>
              <span className="text-xs font-semibold text-neutral-800">{role}</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          </div>
        ))}
      </div>
    </motion.div>
  )
}
