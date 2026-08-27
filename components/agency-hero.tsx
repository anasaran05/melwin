'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  Play,
  TrendingUp,
  Radio,
  MousePointer2,
  ChevronDown,
  Camera,
  Layers,
} from 'lucide-react'

export function AgencyHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll progress through the full 240vh section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Silky smooth physical spring inertia
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  })

  // -------------------------------------------------------------
  // PARALLAX LAYER 1: BACK ANCHOR (Stays Pinned / Subtle Scale & Depth)
  // -------------------------------------------------------------
  const yBack = useTransform(smoothProgress, [0, 1], [0, 60])
  const scaleBack = useTransform(smoothProgress, [0, 1], [1, 1.1])
  const opacityBack = useTransform(smoothProgress, [0, 0.8, 1], [0.85, 0.95, 0.4])

  // -------------------------------------------------------------
  // PARALLAX LAYER 2: CENTER VISUAL (Sinks DOWN on Scroll)
  // -------------------------------------------------------------
  const yCenter = useTransform(smoothProgress, [0, 1], [-30, 260])
  const scaleCenter = useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1.02, 0.96])
  const rotateCenter = useTransform(smoothProgress, [0, 1], [0, -3])

  // -------------------------------------------------------------
  // PARALLAX LAYER 3: FOREGROUND VISUAL (Floats UP on Scroll)
  // -------------------------------------------------------------
  const yFront = useTransform(smoothProgress, [0, 1], [180, -220])
  const scaleFront = useTransform(smoothProgress, [0, 0.5, 1], [0.94, 1.02, 1.06])
  const rotateFront = useTransform(smoothProgress, [0, 1], [0, 3.5])

  // -------------------------------------------------------------
  // TEXT & CONTENT OVERLAY MOTION
  // -------------------------------------------------------------
  const textOpacity = useTransform(smoothProgress, [0, 0.7, 0.95], [1, 0.9, 0.2])
  const textScale = useTransform(smoothProgress, [0, 0.8], [1, 0.96])
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[240vh] bg-[#0a0a0c] text-white select-none"
    >
      {/* Pinned Full Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* Background Atmospheric Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none z-0" />

        {/* ------------------------------------------------------------- */}
        {/* TOP BAR: STUDIO STATUS & BADGES                               */}
        {/* ------------------------------------------------------------- */}
        <header className="relative z-30 pt-6 px-6 sm:px-12 flex items-center justify-between max-w-[1400px] mx-auto w-full">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-neutral-300">
              Dr. Melwin Vincent Studio
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
            <span className="bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-neutral-300">
              FOUNDER AUTHORITY ENGINE
            </span>
            <span className="bg-neutral-900 border border-white/10 px-3 py-1 rounded-full text-emerald-400 font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              ACTIVE RETAINER
            </span>
          </div>
        </header>


        {/* ------------------------------------------------------------- */}
        {/* 3-LAYER PARALLAX CANVAS STAGE                                 */}
        {/* ------------------------------------------------------------- */}
        <div className="relative w-full flex-1 flex items-center justify-center max-w-[1400px] mx-auto px-4 sm:px-6">

          {/* ========================================================== */}
          {/* LAYER 1: BACK ANCHOR (Full Width/Stage Backdrop Image)      */}
          {/* ========================================================== */}
          <motion.div
            style={{ y: yBack, scale: scaleBack, opacity: opacityBack }}
            className="absolute inset-x-4 sm:inset-x-12 top-6 bottom-10 z-10 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-neutral-950"
          >
            <Image
              src="/images/personal-branding.webp"
              alt="Back Parallax Canvas"
              fill
              priority
              className="object-cover object-center opacity-40 brightness-75"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/40 to-[#0a0a0c]/80" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            {/* Back Layer Top Brand Tag */}
            <div className="absolute top-5 left-6 flex items-center gap-2 text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
              <Layers className="w-3.5 h-3.5 text-neutral-400" />
              <span>LAYER 01 // ANCHOR HORIZON</span>
            </div>
          </motion.div>


          {/* ========================================================== */}
          {/* LAYER 2: CENTER VISUAL (Sinks DOWN on Scroll)              */}
          {/* ========================================================== */}
          <motion.div
            style={{ y: yCenter, scale: scaleCenter, rotate: rotateCenter }}
            className="absolute z-20 w-[84%] sm:w-[58%] md:w-[46%] max-w-[500px] left-[6%] sm:left-[12%] md:left-[14%] top-[10%] sm:top-[8%] rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-white/20 p-3 sm:p-4 shadow-[0_35px_80px_-15px_rgba(0,0,0,0.8)]"
          >
            <div className="relative w-full h-[180px] sm:h-[240px] md:h-[280px] rounded-xl overflow-hidden bg-black border border-white/10">
              <Image
                src="/images/agency /step 1.png"
                alt="Production Shoot Studio"
                fill
                className="object-cover object-top opacity-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Badges */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 bg-red-600/90 text-white text-[10px] sm:text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md shadow-md backdrop-blur-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  ● REC 4K 60FPS
                </span>
                <span className="bg-black/70 backdrop-blur-md text-neutral-300 text-[10px] font-mono px-2 py-0.5 rounded border border-white/15">
                  PHYSICAL SHOOT
                </span>
              </div>

              {/* Center Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all cursor-pointer">
                  <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                </div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs">
                <div>
                  <span className="block font-bold text-white tracking-tight text-xs sm:text-sm">
                    Founder Production Framework
                  </span>
                  <span className="block text-[10px] text-neutral-400 font-mono">
                    Done-for-you shoots & video engine
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  ↓ Sinks Down
                </span>
              </div>
            </div>
          </motion.div>


          {/* ========================================================== */}
          {/* LAYER 3: FOREGROUND VISUAL (Floats UP on Scroll)           */}
          {/* ========================================================== */}
          <motion.div
            style={{ y: yFront, scale: scaleFront, rotate: rotateFront }}
            className="absolute z-25 w-[82%] sm:w-[56%] md:w-[44%] max-w-[480px] right-[6%] sm:right-[10%] md:right-[12%] bottom-[6%] sm:bottom-[8%] rounded-2xl bg-neutral-900/95 backdrop-blur-2xl border border-white/20 p-3 sm:p-4 shadow-[0_40px_90px_-10px_rgba(0,0,0,0.85)] text-white"
          >
            <div className="relative w-full h-[170px] sm:h-[220px] md:h-[260px] rounded-xl overflow-hidden bg-black border border-white/10">
              <Image
                src="/images/agency /step 2.png"
                alt="Authority Content Distribution"
                fill
                className="object-cover object-top opacity-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

              {/* Floating Metrics Pill */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="flex items-center gap-1 bg-purple-600/90 text-white text-[10px] sm:text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md shadow-md backdrop-blur-xs">
                  <Sparkles className="w-3 h-3 text-purple-200" />
                  HIGH INTENT REACH
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  +142% MOM
                </span>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs">
                <div>
                  <span className="block font-bold text-white tracking-tight text-xs sm:text-sm">
                    Executive Authority Engine
                  </span>
                  <span className="block text-[10px] text-neutral-400 font-mono">
                    High-Velocity LinkedIn & Video Growth
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                  ↑ Floats Up
                </span>
              </div>
            </div>
          </motion.div>


          {/* ========================================================== */}
          {/* MONUMENTAL TYPOGRAPHY & HERO ACTIONS (CENTER OVERLAY)      */}
          {/* ========================================================== */}
          <motion.div
            style={{ opacity: textOpacity, scale: textScale }}
            className="relative z-30 flex flex-col items-center text-center px-4 max-w-4xl mx-auto space-y-6"
          >
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg text-white">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-neutral-200">
                Turn Founders Into The #1 Acquisition Engine
              </span>
            </div>

            {/* Giant Title */}
            <h1 className="text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[6.75rem] font-black tracking-tight leading-[0.92] text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
              WE MAKE YOU <br />
              <span className="bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-500 bg-clip-text text-transparent">
                FAMOUS.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl font-normal leading-relaxed drop-shadow-md">
              Strategic personal brand positioning, done-for-you physical shoots, remote production frameworks, and revenue-generating sales enablement built specifically for founders.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 w-full sm:w-auto">
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-neutral-200 text-black px-8 py-4 rounded-full font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#guidelines"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md px-7 py-4 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95"
              >
                <span>Operating Guidelines</span>
              </a>

              <a
                href="#comparison"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-neutral-400 hover:text-white px-5 py-4 font-semibold text-sm transition-colors"
              >
                <span>Compare Retainers</span>
              </a>
            </div>
          </motion.div>

        </div>


        {/* ------------------------------------------------------------- */}
        {/* BOTTOM SCROLL PROMPT                                          */}
        {/* ------------------------------------------------------------- */}
        <motion.footer
          style={{ opacity: scrollIndicatorOpacity }}
          className="relative z-30 pb-6 flex flex-col items-center justify-center gap-1.5 text-neutral-400 font-mono text-[11px] uppercase tracking-widest pointer-events-none"
        >
          <span>Scroll to experience parallax</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-neutral-400" />
        </motion.footer>

      </div>
    </div>
  )
}


