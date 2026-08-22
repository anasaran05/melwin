'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BmfIntroAnimationProps {
  onComplete?: () => void
}

export function BmfIntroAnimation({ onComplete }: BmfIntroAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if animation has already been shown in this browser session
    try {
      const hasSeenIntro = sessionStorage.getItem('bmf_intro_seen')
      if (hasSeenIntro === 'true') {
        if (onComplete) onComplete()
        return
      }
      
      // Mark as seen for this session immediately
      sessionStorage.setItem('bmf_intro_seen', 'true')
      setIsVisible(true)
    } catch {
      // Fallback if sessionStorage is not accessible
      setIsVisible(true)
    }

    // Overall animation finishes and fades into hero section at 2.9s
    const timerExit = setTimeout(() => {
      setIsVisible(false)
      if (onComplete) onComplete()
    }, 2900)

    return () => {
      clearTimeout(timerExit)
    }
  }, [onComplete])

  const handleSkip = () => {
    setIsVisible(false)
    if (onComplete) onComplete()
  }

  const letterTransition = (delay: number) => ({
    duration: 0.5,
    delay,
    ease: [0.16, 1, 0.3, 1] as const,
  })

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="bmf-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 0.98,
            filter: 'blur(6px)',
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } 
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white select-none overflow-hidden"
        >
          {/* Main Logo Lockup Container */}
          <div className="relative flex flex-col items-center justify-center px-4">
            
            <div className="relative flex items-center">
              
              {/* BMF Letters Group */}
              <div className="relative z-20 flex items-center gap-0.5 sm:gap-1.5">
                
                {/* Letter 'B' Zoom Out */}
                <motion.span
                  initial={{ scale: 2.5, opacity: 0, filter: 'blur(10px)' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  transition={letterTransition(0.05)}
                  className="text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] font-black tracking-tighter text-[#111111] leading-none inline-block"
                >
                  B
                </motion.span>

                {/* Letter 'M' Zoom Out */}
                <motion.span
                  initial={{ scale: 2.5, opacity: 0, filter: 'blur(10px)' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  transition={letterTransition(0.35)}
                  className="text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] font-black tracking-tighter text-[#111111] leading-none inline-block"
                >
                  M
                </motion.span>

                {/* Letter 'F' Zoom Out */}
                <motion.span
                  initial={{ scale: 2.5, opacity: 0, filter: 'blur(10px)' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  transition={letterTransition(0.65)}
                  className="text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] font-black tracking-tighter text-[#111111] leading-none inline-block"
                >
                  F
                </motion.span>

              </div>

              {/* 'Club' word that emerges from behind 'BMF' sliding towards right */}
              <div className="relative z-10 overflow-hidden flex items-center pl-2 sm:pl-3">
                <motion.span
                  initial={{ x: '-100%', opacity: 0, filter: 'blur(4px)' }}
                  animate={{ x: '0%', opacity: 1, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.65,
                    delay: 1.05,
                    ease: [0.16, 1, 0.3, 1] as const,
                  }}
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-[8rem] font-extrabold tracking-tight text-[#111111] whitespace-nowrap leading-none inline-block"
                >
                  Club
                </motion.span>
                <motion.img
                  src="https://img.icons8.com/stickers/500/verified-badge.png"
                  alt="Verified Badge"
                  initial={{ scale: 0, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 1.3,
                    ease: [0.34, 1.56, 0.64, 1] as const,
                  }}
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 ml-2 sm:ml-3 object-contain select-none inline-block shrink-0"
                />
              </div>

            </div>

            {/* Underline - Draws cleanly with NO pre-existing grey track */}
            <div className="w-full relative mt-3 sm:mt-5 h-1 sm:h-1.5 overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.55,
                  delay: 1.75,
                  ease: [0.65, 0, 0.35, 1] as const,
                }}
                className="w-full h-full bg-[#111111] origin-left rounded-full"
              />
            </div>

            {/* Subtitle Badge */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.95 }}
              className="mt-4 flex items-center justify-center"
            >
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-neutral-500 font-semibold text-center">
                Where High-Conviction Builders Connect
              </span>
            </motion.div>

          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute bottom-6 right-6 text-[11px] font-mono uppercase tracking-wider text-neutral-500 hover:text-black transition-colors px-3.5 py-1.5 rounded-full border border-black/10 hover:border-black/30 bg-black/[0.02]"
          >
            Skip &rarr;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
