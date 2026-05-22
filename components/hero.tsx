'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const { scrollY } = useScroll()
  const imgY = useTransform(scrollY, [0, 800], [0, 600])
  const imgRotateY = useTransform(scrollY, [0, 800], [0, 360])
  const imgGrayscale = useTransform(scrollY, [0, 600], [1, 0])
  const imgFilter = useTransform(imgGrayscale, g => `grayscale(${g * 100}%)`)

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center text-[#111111] pt-24 pb-12">
      
      {/* Decorative Star 1 */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 1.4, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[20%] left-[15%] w-16 h-16 md:w-24 md:h-24 hidden md:block"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z" fill="#111" />
        </svg>
      </motion.div>

      {/* Massive Typography */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4">
        <motion.h1 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[12vw] max-md:text-[18vw] leading-[0.9] font-black tracking-tighter uppercase"
        >
          DR. MELWIN
        </motion.h1>
        <motion.h1 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="text-[12vw] max-md:text-[18vw] leading-[0.9] font-black tracking-tighter uppercase"
        >
          VINCENT
        </motion.h1>
      </div>

      {/* Decorative Star 2 */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: 45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 1.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[45%] right-[12%] w-12 h-12 md:w-20 md:h-20 hidden md:block"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M43.3013 0L56.6987 35.3392L93.3013 25L67.1472 55.454L93.3013 85L56.6987 74.6608L43.3013 110L29.9038 74.6608L-6.69873 85L19.4553 55.454L-6.69873 25L29.9038 35.3392L43.3013 0Z" fill="#111" />
        </svg>
      </motion.div>

      {/* Central Profile Image */}
      <div style={{ perspective: "1200px" }} className="relative z-40 mt-8 md:mt-4 mb-12">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: imgY, rotateY: imgRotateY, filter: imgFilter, transformStyle: "preserve-3d" }}
          className="relative hidden md:block w-[280px] h-[320px] md:w-[320px] md:h-[360px] rounded-[32px] shadow-2xl mx-auto"
        >
          <div className="absolute inset-0 rounded-[32px] overflow-hidden">
            <Image 
              src="/melwin.jpeg" 
              alt="Dr. Melwin Vincent"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: imgFilter }}
          className="relative md:hidden w-[280px] h-[320px] md:w-[320px] md:h-[360px] rounded-[32px] shadow-2xl mx-auto"
        >
          <div className="absolute inset-0 rounded-[32px] overflow-hidden">
            <Image 
              src="/melwin.jpeg" 
              alt="Dr. Melwin Vincent"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Floating Details (like the footer in the reference) */}
      <div className="absolute bottom-8 max-md:bottom-4 w-full px-8 md:px-16 flex flex-col md:flex-row justify-between items-end md:items-center max-md:items-center max-md:text-center text-xs font-semibold tracking-wider uppercase z-30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-left mb-4 md:mb-0"
        >
          <span className="text-2xl font-black">©2026</span>
          <br />
          <span className="text-[#666] mt-1 block max-w-[200px]">building since 2022</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-2 items-end max-md:items-center"
        >
          <div className="bg-white text-black px-4 py-2 rounded-md shadow-sm border border-neutral-200 mt-1 flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 2L2 22h20L12 2z"/>
            </svg>
            Built by Atom SE
          </div>
        </motion.div>
      </div>

    </section>
  )
}
