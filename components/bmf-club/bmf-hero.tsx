'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

// High-resolution visual cards curated for BMF Club
const streamImages = [
  {
    id: 'img-1',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    fallbackBg: 'linear-gradient(135deg, #f97316 0%, #dc2626 50%, #7c2d12 100%)',
    alt: 'Founder Leadership',
  },
  {
    id: 'img-2',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    fallbackBg: 'linear-gradient(135deg, #09090b 0%, #ef4444 50%, #000000 100%)',
    alt: 'Obsidian Neon Arc',
  },
  {
    id: 'img-3',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    fallbackBg: 'linear-gradient(135deg, #0284c7 0%, #1e3a8a 50%, #0f172a 100%)',
    alt: 'Twilight Horizon',
  },
  {
    id: 'img-4',
    src: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
    fallbackBg: 'linear-gradient(135deg, #9333ea 0%, #4c1d95 50%, #000000 100%)',
    alt: 'Cosmic Vortex Aura',
  },
  {
    id: 'img-5',
    src: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    fallbackBg: 'linear-gradient(135deg, #f59e0b 0%, #b45309 50%, #78350f 100%)',
    alt: 'Surreal Gold Art',
  },
  {
    id: 'img-6',
    src: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    fallbackBg: 'linear-gradient(135deg, #52525b 0%, #27272a 50%, #09090b 100%)',
    alt: 'Monochrome Horizon',
  },
  {
    id: 'img-7',
    src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    fallbackBg: 'linear-gradient(135deg, #3b82f6 0%, #ec4899 50%, #8b5cf6 100%)',
    alt: 'Iridescent Innovation',
  },
  {
    id: 'img-8',
    src: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    fallbackBg: 'linear-gradient(135deg, #10b981 0%, #047857 50%, #064e3b 100%)',
    alt: 'Cyber Hardware Interface',
  },
  {
    id: 'img-9',
    src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    fallbackBg: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 50%, #082f49 100%)',
    alt: 'Cyan Velocity Streak',
  },
]

export function BmfHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothMouseX = useSpring(mouseX, { stiffness: 90, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 90, damping: 20 })

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [3, -3])
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-6, 6])

  const numCards = streamImages.length
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setIsMounted(true)
    let animationFrameId: number
    let lastTime = performance.now()

    const step = (now: number) => {
      const delta = (now - lastTime) / 1000
      lastTime = now
      // Smooth continuous outward drift: cards travel seamlessly from center depth outward
      const speed = (numCards / 22) * delta
      setProgress((prev) => (prev + speed) % numCards)
      animationFrameId = requestAnimationFrame(step)
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [numCards])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const activeProgress = isMounted ? progress : 0

  return (
    <section
      id="top"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full pt-16 sm:pt-20 md:pt-24 pb-16 px-0 overflow-hidden select-none flex flex-col items-center justify-between"
    >
      {/* Subtle Radial Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.03)_0%,transparent_70%)]" />
      </div>

      {/* 1. TOP OF MARQUEE: "BMF Club" Title (tucked inward closer to marquee) */}
      <div className="relative z-30 text-center max-w-5xl mx-auto px-4 -mb-2 sm:-mb-5 md:-mb-8">
        {/* Top Title Only */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.8rem] font-black tracking-tight text-[#111111] max-w-4xl mx-auto leading-[1.02]"
        >
          BMF Club
        </motion.h1>
      </div>

      {/* 2. 3D Perspective Image Stream Corridor (Full-bleed edge to edge) */}
      <div className="relative z-10 w-full overflow-visible my-0 py-0 flex items-center justify-center [perspective:1200px]">
        <motion.div
          style={{ rotateX, rotateY }}
          className="relative w-full h-[280px] sm:h-[360px] md:h-[440px] flex items-center justify-center"
        >
          {/* LEFT RAIL: Cards emerge from center vanishing point (behind) and travel outward to screen edge (front) */}
          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 flex items-center justify-end pointer-events-none">
            {streamImages.map((item, idx) => {
              // Normalized progress from center (0.0) to outer left edge (1.0)
              const pos = ((idx + activeProgress) % numCards + numCards) % numCards
              const t = pos / numCards

              // Distance & perspective easing curves
              const curve = Math.pow(t, 1.25)
              const scale = 0.28 + t * 0.88 // 0.28 at center to 1.16 at outer edge
              const rotateYAngle = 16 + t * 40 // 16deg at center to 56deg at outer edge
              
              // Stacking order: Outer foreground cards strictly on top of inner background cards
              const zIndex = Math.floor(t * 1000) + 1
              
              // Smooth fade-in as it emerges from center, smooth fade-out as it exits edge
              const opacity = t < 0.04 ? t / 0.04 : t > 0.88 ? (1 - t) / 0.12 : 1

              return (
                <div
                  key={`left-card-${item.id}`}
                  style={{
                    transform: `perspective(1000px) translateX(calc(-1 * (${curve.toFixed(4)} * min(48vw, 760px)) + 32px)) rotateY(${rotateYAngle.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
                    transformOrigin: 'right center',
                    zIndex,
                    opacity,
                  }}
                  className="absolute w-28 sm:w-36 md:w-48 lg:w-56 h-40 sm:h-52 md:h-68 lg:h-80 rounded-md sm:rounded-lg shadow-2xl overflow-hidden transition-shadow duration-300 bg-neutral-900 will-change-transform"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      if (e.currentTarget.parentElement) {
                        e.currentTarget.parentElement.style.background = item.fallbackBg
                      }
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* RIGHT RAIL: Mirrored twin images emerge from center vanishing point (behind) and travel outward to screen edge (front) */}
          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 flex items-center justify-start pointer-events-none">
            {streamImages.map((item, idx) => {
              // Normalized progress from center (0.0) to outer right edge (1.0)
              const pos = ((idx + activeProgress) % numCards + numCards) % numCards
              const t = pos / numCards

              // Distance & perspective easing curves
              const curve = Math.pow(t, 1.25)
              const scale = 0.28 + t * 0.88
              const rotateYAngle = -16 - t * 40 // -16deg at center to -56deg at outer edge
              
              // Stacking order: Outer foreground cards strictly on top of inner background cards
              const zIndex = Math.floor(t * 1000) + 1
              
              // Smooth fade-in as it emerges from center, smooth fade-out as it exits edge
              const opacity = t < 0.04 ? t / 0.04 : t > 0.88 ? (1 - t) / 0.12 : 1

              return (
                <div
                  key={`right-card-${item.id}`}
                  style={{
                    transform: `perspective(1000px) translateX(calc(${curve.toFixed(4)} * min(48vw, 760px) - 32px)) rotateY(${rotateYAngle.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
                    transformOrigin: 'left center',
                    zIndex,
                    opacity,
                  }}
                  className="absolute w-28 sm:w-36 md:w-48 lg:w-56 h-40 sm:h-52 md:h-68 lg:h-80 rounded-md sm:rounded-lg shadow-2xl overflow-hidden transition-shadow duration-300 bg-neutral-900 will-change-transform"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      if (e.currentTarget.parentElement) {
                        e.currentTarget.parentElement.style.background = item.fallbackBg
                      }
                    }}
                  />
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* 3. BOTTOM OF MARQUEE: "Where High-Conviction Builders Connect." (tucked inward closer to marquee) */}
      <div className="relative z-30 text-center space-y-6 max-w-5xl mx-auto px-4 -mt-3 sm:-mt-6 md:-mt-10">
        {/* Secondary Title Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#777777] max-w-4xl mx-auto leading-[1.08]"
        >
          Where High-Conviction <br className="hidden sm:inline" />
          Builders Connect.
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-[#555555] max-w-3xl mx-auto font-normal leading-relaxed"
        >
          A private network of extraordinary founders, technical innovators, and venture leaders. Company showcases, closed-door masterminds, peer-to-peer insights, and direct investor connections.
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
            <span>Apply for Membership</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#showcases"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm transition-colors shadow-xs hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore Founder Showcase</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export { BmfHeroSection as FoundersHeroSection }
export default BmfHeroSection
