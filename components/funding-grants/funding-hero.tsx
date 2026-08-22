'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowDown } from 'lucide-react'

export function FundingHero() {
  return (
    <>
      {/* Top Logo */}
      <div className="absolute top-7 md:top-10 left-1/2 -translate-x-1/2 z-30">
        <Link href="/">
          <Image
            src="/logo-2.png"
            alt="Logo"
            width={180}
            height={60}
            className="object-contain w-auto h-8 md:h-10 hover:opacity-80 transition-opacity"
            priority
          />
        </Link>
      </div>

      {/* Hero Header - Full Viewport Fit */}
      <section className="min-h-[100dvh] w-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 relative pt-24 pb-16">
        <div className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8 my-auto">
          
          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#111111] max-w-4xl mx-auto leading-[1.05]"
          >
            Funding & Grants <br />
            <span className="text-[#777777]">Fuel Your Venture Without Early Dilution.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-[#555555] max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Unlock non-dilutive government schemes, prestigious research grants, incubator seed pools, and direct founder-investor matching syndicates across India, UAE, and global ecosystems.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <a
              href="#apply"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Submit Venture for Grant Review</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#schemes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm transition-colors shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Browse Grant Directory</span>
            </a>
          </motion.div>

        </div>

        {/* Scroll Down Hint */}
        <motion.a
          href="#schemes"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400">Scroll to Explore</span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <ArrowDown className="w-3.5 h-3.5 text-neutral-400" />
          </motion.div>
        </motion.a>
      </section>
    </>
  )
}
