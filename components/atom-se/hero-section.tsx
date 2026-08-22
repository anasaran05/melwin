'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface AtomSeHeroSectionProps {
  ready?: boolean
}

export function AtomSeHeroSection({ ready = true }: AtomSeHeroSectionProps) {
  return (
    <section
      id="top"
      className="relative w-full pt-32 pb-20 sm:pt-40 sm:pb-28 md:pt-48 md:pb-36 px-4 sm:px-6 md:px-12 overflow-hidden select-none flex flex-col items-center justify-center text-center"
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.03)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Main Hero Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 25 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.4rem] font-extrabold tracking-tight text-[#111111] max-w-4xl mx-auto leading-[1.06]"
        >
          Simple, fast, and reliable <br />
          <span className="text-[#8e8e93]">digital solutions for your business.</span>
        </motion.h1>

        {/* Subtitle / Value Proposition */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-[#555555] max-w-2xl sm:max-w-3xl mx-auto font-normal leading-relaxed"
        >
          Atom SE takes care of all your technology needs — from building modern websites that turn visitors into customers, to helping you rank higher on Google search without technical confusion.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3"
        >
          <a
            href="#project-form"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#111111] hover:bg-black text-white px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-[15px] transition-all shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 px-8 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-[15px] transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>What We Offer</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default AtomSeHeroSection
