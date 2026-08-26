'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface AtomSeIntroOverlayProps {
  isVisible: boolean
  onDismiss: () => void
}

export function AtomSeIntroOverlay({ isVisible, onDismiss }: AtomSeIntroOverlayProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="atom-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-[9999] bg-[#f2f2f2] flex items-center justify-center overflow-hidden cursor-pointer touch-none select-none overscroll-none"
          onClick={onDismiss}
          onTouchMove={(e) => e.preventDefault()}
          onWheel={(e) => e.preventDefault()}
        >
          {/* Subtle grain texture */}
          <div className="grain-overlay" />

          {/* Ambient backdrop glow */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.2, 1.05], 
              opacity: [0, 0.35, 0.2] 
            }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="absolute w-[500px] h-[500px] bg-gradient-to-r from-neutral-400/20 via-neutral-300/35 to-neutral-400/20 rounded-full blur-3xl pointer-events-none"
          />

          {/* Hero Logo Animation */}
          <motion.div
            initial={{ 
              scale: 2.2, 
              opacity: 0, 
              filter: 'blur(16px)' 
            }}
            animate={{ 
              scale: [2.2, 1, 1],
              opacity: [0, 1, 1],
              filter: ['blur(16px)', 'blur(0px)', 'blur(0px)']
            }}
            exit={{ 
              scale: 0.85, 
              opacity: 0, 
              filter: 'blur(28px)',
              transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
            }}
            transition={{ 
              duration: 2.0, 
              times: [0, 0.45, 1],
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="relative z-10 flex flex-col items-center justify-center p-6"
          >
            <div className="relative w-64 sm:w-80 md:w-96 h-28 sm:h-36 md:h-44 flex items-center justify-center">
              <Image
                src="/ventures logos/atomse.png"
                alt="Atom SE"
                width={380}
                height={140}
                className="w-full h-full object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
