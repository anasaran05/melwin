'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'

// High-resolution founder avatar portraits curated for BMF Club
const streamImages = [
  {
    id: 'img-1',
    src: 'https://media.buildwithmelwin.com/bmf-club/founders/7145b6e3-daa4-42a0-a3f8-3a88bdede32a/portrait_1787453692759.webp',
    fallbackBg: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
    alt: 'Verified BMF Founder',
  },
  {
    id: 'img-2',
    src: 'https://media.buildwithmelwin.com/bmf-club/founders/b6660955-f9a3-4729-937b-955c4f698b1a/portrait_1787475932208.webp',
    fallbackBg: 'linear-gradient(135deg, #09090b 0%, #1c1917 100%)',
    alt: 'Verified BMF Founder',
  },
  {
    id: 'img-3',
    src: 'https://media.buildwithmelwin.com/bmf-club/founders/e6023e6d-536a-4cee-93fa-f552a8905bb6/portrait_1787416988042.webp',
    fallbackBg: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
    alt: 'Verified BMF Founder',
  },
  {
    id: 'img-4',
    src: 'https://media.buildwithmelwin.com/bmf-club/founders/f42ae309-5c32-4a34-bc0f-fb8f8e0d0a64/portrait_1787422210407.webp',
    fallbackBg: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
    alt: 'Verified BMF Founder',
  },
  {
    id: 'img-5',
    src: 'https://media.buildwithmelwin.com/bmf-club/founders/feb3e57f-2a7e-4fee-90a7-fb08cf421aca/portrait_1787461379653.webp',
    fallbackBg: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)',
    alt: 'Verified BMF Founder',
  },
  {
    id: 'img-6',
    src: 'https://media.buildwithmelwin.com/bmf-club/founders/28c5dfed-2d53-4327-8780-a487595b5a12/portrait_1787453095514.webp',
    fallbackBg: 'linear-gradient(135deg, #172554 0%, #1e3a8a 100%)',
    alt: 'Verified BMF Founder',
  },
  {
    id: 'img-7',
    src: 'https://media.buildwithmelwin.com/bmf-club/founders/1fa0de76-f5be-4b26-a91f-b5bbea3c495c/portrait_1787475429085.webp',
    fallbackBg: 'linear-gradient(135deg, #3b0764 0%, #581c87 100%)',
    alt: 'Verified BMF Founder',
  },
  {
    id: 'img-8',
    src: 'https://media.buildwithmelwin.com/bmf-club/founders/PHOTO-2026-08-23-15-35-03.jpg',
    fallbackBg: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
    alt: 'Verified BMF Founder',
  },
]

export function BmfHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothMouseX = useSpring(mouseX, { stiffness: 90, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 90, damping: 20 })

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [3, -3])
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-6, 6])

  const numCards = streamImages.length
  const [desktopProgress, setDesktopProgress] = useState(0)
  const [mobileProgress, setMobileProgress] = useState(0)

  // Mobile Card Cycling State (cycles images one by one across the 3 cards)
  const [mobileCardIndex, setMobileCardIndex] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setMobileCardIndex((prev) => (prev + 1) % streamImages.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  const leftImage = streamImages[mobileCardIndex % streamImages.length]
  const centerImage = streamImages[(mobileCardIndex + 1) % streamImages.length]
  const rightImage = streamImages[(mobileCardIndex + 2) % streamImages.length]

  useEffect(() => {
    let isSubscribed = true
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user && isSubscribed) {
            setIsLoggedIn(true)
            return
          }

          supabase.auth.onAuthStateChange((_event, session) => {
            if (isSubscribed) {
              setIsLoggedIn(!!session?.user)
            }
          })
        }
        if (typeof window !== 'undefined') {
          const storedEmail = localStorage.getItem('bmf_current_user_email')
          if (storedEmail && isSubscribed) {
            setIsLoggedIn(true)
          }
        }
      } catch (err) {
        console.error('Error checking auth in BmfHeroSection:', err)
      }
    }
    checkAuth()
    return () => {
      isSubscribed = false
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)
    let animationFrameId: number
    let lastTime = performance.now()

    const step = (now: number) => {
      const delta = (now - lastTime) / 1000
      lastTime = now

      // Independent speed controllers:
      // Desktop: 30s period (smooth, dynamic flow)
      // Mobile: 60s period (calm, elegant glide)
      const desktopSpeed = (numCards / 30) * delta
      const mobileSpeed = (numCards / 60) * delta

      setDesktopProgress((prev) => (prev + desktopSpeed) % numCards)
      setMobileProgress((prev) => (prev + mobileSpeed) % numCards)

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

  if (!isMounted) return null

  // 14-item loop for snug, tight mobile card gap
  const mobileCardsList = [...streamImages, ...streamImages.slice(0, 5)]
  const totalMobile = mobileCardsList.length

  return (
    <section
      id="top"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full pt-16 sm:pt-20 md:pt-24 pb-16 px-0 overflow-hidden select-none flex flex-col items-center justify-between"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.03)_0%,transparent_70%)]" />
      </div>

      {/* ========================================================================= */}
      {/* 1. MOBILE VIEWPORT LAYOUT (sm:hidden) - Title -> Subtitle -> Buttons -> Rotating Cards */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-center w-full text-center sm:hidden space-y-4 pt-2">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl font-black tracking-tight text-[#111111] inline-flex items-center justify-center gap-2 px-4"
        >
          <span>BMF Club</span>
          <img
            src="https://img.icons8.com/stickers/500/verified-badge.png"
            alt="Verified Badge"
            className="w-9 h-9 object-contain select-none shrink-0"
          />
        </motion.h1>

        {/* Subtitle / Secondary Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl font-extrabold tracking-tight text-[#777777] max-w-xs mx-auto leading-tight px-4"
        >
          Where High-Conviction <br /> Builders Connect.
        </motion.h2>

        {/* CTA Buttons (Moved UP above cards on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col w-full max-w-xs items-center justify-center gap-2.5 px-4 pt-1 pb-3"
        >
          <Link
            href="/bmf-club/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-black/10 active:scale-[0.98]"
          >
            <span>{isLoggedIn ? 'Go to Dashboard' : 'Join Now (Free)'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/bmf-club/directory"
            className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-xs active:scale-[0.98]"
          >
            <span>Explore Founder Showcase</span>
          </Link>
        </motion.div>

        {/* Bottom 3D Concave Inside-Curve Carousel on Mobile (Big on sides, smaller in center) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[270px] overflow-hidden pt-4 pb-2 flex items-center justify-center [perspective:850px]"
        >
          {/* Subtle edge gradient fades */}
          <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-[#f2f2f2] to-transparent z-30 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-[#f2f2f2] to-transparent z-30 pointer-events-none" />

          {/* 3D Concave Amphitheatre Ring Stage */}
          <div
            style={{
              transform: `translateZ(315px) rotateX(0deg) rotateY(${((mobileProgress / numCards) * 360).toFixed(2)}deg)`,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-[155px] h-[212px] flex items-center justify-center pointer-events-none will-change-transform"
          >
            {mobileCardsList.map((item, idx) => {
              const cardAngle = (idx / totalMobile) * 360
              // Calculate angular offset from center (0 deg)
              const curAngle = (((cardAngle + (mobileProgress / numCards) * 360) % 360) + 360) % 360
              const diffFromCenter = curAngle > 180 ? 360 - curAngle : curAngle
              const centerCos = Math.cos((diffFromCenter * Math.PI) / 180)
              // Smooth dynamic scale: reduced in center (~0.92), expanded at sides (~1.03)
              const scale = 1.03 - 0.11 * Math.max(0, centerCos)

              return (
                <div
                  key={`mobile-concave-card-${item.id}-${idx}`}
                  style={{
                    transform: `rotateY(${cardAngle}deg) translateZ(-315px) scale(${scale.toFixed(3)})`,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                  }}
                  className="absolute inset-0 w-[155px] h-[212px] rounded-xl overflow-hidden shadow-lg will-change-transform"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover select-none pointer-events-none rounded-xl"
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

      {/* ========================================================================= */}
      {/* 2. DESKTOP VIEWPORT LAYOUT (hidden sm:block) - Original 3D Ribbon Stream */}
      {/* ========================================================================= */}
      <div className="hidden sm:flex flex-col items-center w-full">
        {/* Title Heading */}
        <div className="relative z-30 text-center max-w-5xl mx-auto px-4 -mb-5 md:-mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-8xl lg:text-[5.8rem] font-black tracking-tight text-[#111111] max-w-4xl mx-auto leading-[1.02] inline-flex items-center justify-center gap-3.5 md:gap-5"
          >
            <span>BMF Club</span>
            <img
              src="https://img.icons8.com/stickers/500/verified-badge.png"
              alt="Verified Badge"
              className="w-12 h-12 md:w-16 md:h-16 lg:w-[4.6rem] lg:h-[4.6rem] object-contain select-none shrink-0"
            />
          </motion.h1>
        </div>

        {/* 3D Dual-Sided Perspective Stream */}
        <div className="relative z-10 w-full overflow-visible my-0 py-0 flex items-center justify-center [perspective:1200px]">
          <motion.div
            style={{ rotateX, rotateY }}
            className="relative w-full h-[360px] md:h-[440px] flex items-center justify-center"
          >
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 flex items-center justify-end pointer-events-none">
              {streamImages.map((item, idx) => {
                const pos = ((idx + desktopProgress) % numCards + numCards) % numCards
                const t = pos / numCards
                const curve = Math.pow(t, 1.25)
                const scale = 0.28 + t * 0.88
                const rotateYAngle = 16 + t * 40
                const zIndex = Math.floor(t * 1000) + 1
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
                    className="absolute w-36 md:w-48 lg:w-56 h-52 md:h-68 lg:h-80 rounded-lg shadow-2xl overflow-hidden transition-shadow duration-300 bg-neutral-900 will-change-transform"
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

            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 flex items-center justify-start pointer-events-none">
              {streamImages.map((item, idx) => {
                const pos = ((idx + desktopProgress) % numCards + numCards) % numCards
                const t = pos / numCards
                const curve = Math.pow(t, 1.25)
                const scale = 0.28 + t * 0.88
                const rotateYAngle = -16 - t * 40
                const zIndex = Math.floor(t * 1000) + 1
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
                    className="absolute w-36 md:w-48 lg:w-56 h-52 md:h-68 lg:h-80 rounded-lg shadow-2xl overflow-hidden transition-shadow duration-300 bg-neutral-900 will-change-transform"
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

        {/* Desktop Bottom Section: Heading + Buttons */}
        <div className="relative z-30 text-center space-y-6 max-w-5xl mx-auto px-4 -mt-6 md:-mt-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl font-black tracking-tight text-[#777777] max-w-4xl mx-auto leading-[1.08]"
          >
            Where High-Conviction <br className="hidden sm:inline" />
            Builders Connect.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-row items-center justify-center gap-3 pt-2"
          >
            <Link
              href="/bmf-club/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isLoggedIn ? 'Go to Dashboard' : 'Join Now (Free)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/bmf-club/directory"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 px-7 py-4 rounded-xl font-semibold text-sm transition-colors shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Founder Showcase</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export { BmfHeroSection as FoundersHeroSection }
export default BmfHeroSection
