'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  const { scrollY } = useScroll()
  const imgY = useTransform(scrollY, [0, 800], [0, 750])
  const imgRotateY = useTransform(scrollY, [0, 800], [0, 360])
  const imgScale = useTransform(scrollY, [0, 800], [0.75, 1])

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center text-[#111111] pt-20 md:pt-24 pb-8 md:pb-12 z-30">
      
      {/* Top Logo */}
      <div className="absolute top-7 md:top-12 left-1/2 -translate-x-1/2 z-50">
        <Image src="/logo-2.png" alt="Logo" width={180} height={60} className="object-contain w-auto h-8 md:h-10" priority />
      </div>

      {/* Decorative Star 1 */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 1.4, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-20 top-[12%] sm:top-[15%] left-[5%] sm:left-[8%] w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z" fill="#111" />
        </svg>
      </motion.div>

      {/* Massive Typography (Responsive on Mobile & Desktop) */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 mt-4 sm:mt-2 md:mt-0">
        <motion.h1 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-[7.5vw] leading-[1] sm:leading-[0.9] font-black tracking-tighter flex flex-row items-center justify-center whitespace-nowrap"
        >
          Build with Melwin
          <img 
            src="https://img.icons8.com/stickers/500/verified-badge.png" 
            alt="Verified Badge" 
            className="w-7 h-7 sm:w-12 sm:h-12 md:w-[6vw] md:h-[6vw] ml-2.5 sm:ml-4 object-contain shrink-0"
          />
        </motion.h1>
      </div>

      {/* Decorative Star 2 */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: 45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 1.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-20 top-[40%] sm:top-[45%] right-[5%] sm:right-[12%] w-8 h-8 sm:w-12 sm:h-12 md:w-20 md:h-20"
      >
        <svg viewBox="-10 -10 120 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
          <path d="M43.3013 0L56.6987 35.3392L93.3013 25L67.1472 55.454L93.3013 85L56.6987 74.6608L43.3013 110L29.9038 74.6608L-6.69873 85L19.4553 55.454L-6.69873 25L29.9038 35.3392L43.3013 0Z" fill="#111" />
        </svg>
      </motion.div>

      {/* Central Profile 3D Rotating Image (Responsive on Mobile & Desktop) */}
      <div style={{ perspective: "1200px" }} className="relative z-40 mt-6 sm:mt-8 md:mt-4 mb-8 sm:mb-12 flex flex-col items-center">
        <motion.div style={{ y: imgY, scale: imgScale }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateY: imgRotateY, transformStyle: "preserve-3d" }}
            className="relative w-[260px] h-[290px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] rounded-[24px] sm:rounded-[32px] shadow-2xl mx-auto"
          >
            <div className="absolute inset-0 rounded-[24px] sm:rounded-[32px] overflow-hidden">
              <Image 
                src="/melwin.jpeg" 
                alt="Dr. Melwin Vincent"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Floating Details */}
      <div className="w-full px-4 sm:px-8 md:px-16 flex flex-row justify-between items-end text-xs font-semibold tracking-wider uppercase z-30 md:absolute md:bottom-8 mt-4 md:mt-0 pb-6 md:pb-0 gap-2">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-left mb-0 flex flex-col shrink-0"
        >
          <span className="text-lg sm:text-2xl font-black leading-none">©2026</span>
          <span className="text-[#666] text-[9.5px] sm:text-xs mt-0.5 sm:mt-1 block max-w-[150px] sm:max-w-[200px]">building since 2022</span>
          
          <Link 
            href="" 
            className="bg-white hover:bg-neutral-100 active:scale-95 text-black px-2.5 py-1 sm:px-4 sm:py-2 rounded-md shadow-xs border border-neutral-200 mt-1.5 sm:mt-3 inline-flex items-center gap-1.5 sm:gap-2 w-max transition-all cursor-pointer text-[10px] sm:text-xs shrink-0 whitespace-nowrap"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
               <path d="M12 2L2 22h20L12 2z"/>
            </svg>
            <span>Built by Atom SE</span>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-2 items-end shrink-0"
        >
          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-0 sm:mb-2 relative p-[1.5px] sm:p-[2px] rounded-full overflow-hidden shrink-0"
          >
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#25D366_50%,#ffffff_100%)]" />
            <a
              href="https://whatsapp.com/channel/0029Vb7Y5f00wajjbzlEfQ1Z"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center gap-1.5 sm:gap-2 bg-white text-[#111111] hover:scale-[1.02] active:scale-[0.98] transition-all py-1.5 px-3 sm:py-3 sm:px-6 rounded-full font-semibold text-[11px] sm:text-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] normal-case tracking-normal z-10 whitespace-nowrap"
            >
              <svg viewBox="0 0 24 24" fill="#25D366" className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span>Join 24k+ Community</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

    </section>
  )
}
