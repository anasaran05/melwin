'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { SquigglyText } from '@/components/ui/squiggly-text'

export function Hero() {
  const scrollToSection = (id: string) => {
    // First dispatch the event to open the accordion
    window.dispatchEvent(new CustomEvent('openService', { detail: id }))
    
    // Then wait for the accordion to render/expand, and scroll to the inner content centered
    setTimeout(() => {
      const element = document.getElementById(`${id}-content`) || document.getElementById(id)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 350)
  }

  const { scrollY } = useScroll()
  const imgY = useTransform(scrollY, [0, 800], [0, 750])
  const imgRotateY = useTransform(scrollY, [0, 800], [0, 360])
  const imgScale = useTransform(scrollY, [0, 800], [0.75, 1])

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center text-[#111111] pt-24 pb-12">
      
      {/* Top Logo */}
      <div className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 z-50">
        <Image src="/logo-2.png" alt="Logo" width={180} height={60} className="object-contain w-auto h-8 md:h-10" priority />
      </div>

      {/* Decorative Star 1 */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 1.4, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-20 top-[15%] left-[8%] w-16 h-16 md:w-24 md:h-24 hidden md:block"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z" fill="#111" />
        </svg>
      </motion.div>

      {/* Desktop Massive Typography */}
      <div className="relative z-10 w-full hidden md:flex flex-col items-center justify-center text-center px-4">
        <motion.h1 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[7.5vw] leading-[0.9] font-black tracking-tighter flex flex-row items-center justify-center whitespace-nowrap"
        >
          Build with Melwin
          <img 
            src="https://img.icons8.com/stickers/500/verified-badge.png" 
            alt="Verified Badge" 
            className="w-[6vw] h-[6vw] ml-4 object-contain"
          />
        </motion.h1>
      </div>

      {/* Decorative Star 2 */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: 45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 1.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-20 top-[45%] right-[12%] w-12 h-12 md:w-20 md:h-20 hidden md:block"
      >
        <svg viewBox="-10 -10 120 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
          <path d="M43.3013 0L56.6987 35.3392L93.3013 25L67.1472 55.454L93.3013 85L56.6987 74.6608L43.3013 110L29.9038 74.6608L-6.69873 85L19.4553 55.454L-6.69873 25L29.9038 35.3392L43.3013 0Z" fill="#111" />
        </svg>
      </motion.div>

      {/* Desktop Central Profile Image */}
      <div style={{ perspective: "1200px" }} className="relative z-40 mt-8 md:mt-4 mb-12 hidden md:flex flex-col items-center">
        <motion.div style={{ y: imgY, scale: imgScale }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateY: imgRotateY, transformStyle: "preserve-3d" }}
            className="relative w-[360px] h-[400px] rounded-[32px] shadow-2xl mx-auto"
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
        </motion.div>
      </div>

      {/* Mobile Hero Content (Linktree Style) */}
      <div className="relative z-40 md:hidden flex flex-col items-center w-full px-4 mt-8 pb-16">
        {/* Mobile Circular Image */}
        <div className="relative mb-4 flex items-center justify-center">
          <motion.svg
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 1 }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              opacity: { duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
            }}
            className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)]"
            viewBox="0 0 100 100"
          >
            <circle 
              cx="50" 
              cy="50" 
              r="48" 
              fill="none" 
              stroke="#111111" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeDasharray="220 80" 
            />
          </motion.svg>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg z-10"
          >
            <Image 
              src="/melwin.jpeg" 
              alt="Dr. Melwin Vincent"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
        
        {/* Mobile Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-row items-center justify-center mb-6 w-full"
        >
          <h1 className="text-[22px] font-black tracking-tighter text-[#111111] leading-none flex items-center justify-center whitespace-nowrap">
            Build with Melwin
            <img 
              src="https://img.icons8.com/stickers/500/verified-badge.png" 
              alt="Verified Badge" 
              className="w-6 h-6 ml-2 object-contain"
            />
          </h1>
        </motion.div>

        {/* Mobile Linktree Style Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-3 w-full max-w-md"
        >
          {[
            { 
              icon: <span className="text-xl">🚀</span>, 
              name: 'Book a 1:1 Strategy Consultation', 
              href: '#consultation',
              onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('openConsultation', { detail: 'consult_melwin' }));
                scrollToSection('consultation');
              }
            },
            { 
              icon: (
                <svg viewBox="0 0 24 24" fill="#25D366" className="w-6 h-6">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              ), 
              name: 'Join 7k+ Members on WhatsApp', 
              href: 'https://whatsapp.com/channel/0029Vb7Y5f00wajjbzlEfQ1Z' 
            },
            { 
              icon: <span className="text-xl">🤝</span>, 
              name: "Explore Brand Collabs & Partnerships", 
              href: '#partnerships',
              onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                scrollToSection('partnerships');
              }
            },
            { 
              icon: <span className="text-xl">💼</span>, 
              name: "Unlock Expert Career Guidance", 
              href: '#career',
              onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                scrollToSection('career');
              }
            },
          ].map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={link.onClick}
              target={link.href.startsWith('http') ? "_blank" : undefined}
              rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
              className="relative w-full bg-white text-[#111111] py-4 px-12 rounded-xl text-center text-[15px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center min-h-[64px]"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                {link.icon}
              </div>
              <span className="leading-tight">{link.name}</span>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-[3px] text-gray-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </div>
            </a>
          ))}
        </motion.div>
      </div>



      {/* Bottom Floating Details */}
      <div className="absolute bottom-8 max-md:bottom-4 w-full px-8 md:px-16 flex flex-row justify-between items-end text-xs font-semibold tracking-wider uppercase z-30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-left mb-0 flex flex-col"
        >
          <span className="text-2xl font-black hidden md:inline">©2026</span>
          <span className="text-[#666] mt-1 block max-w-[200px]">building since 2022</span>
          
          <div className="bg-white text-black px-4 py-2 rounded-md shadow-sm border border-neutral-200 mt-4 md:hidden inline-flex items-center gap-2 w-max">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 2L2 22h20L12 2z"/>
            </svg>
            Built by Atom SE
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-2 items-end"
        >
          {/* Social Icons (Mobile Only, Bottom Right) */}
          <div className="flex gap-4 md:hidden text-black mb-2">
            <a href="https://whatsapp.com/channel/0029Vb7Y5f00wajjbzlEfQ1Z" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/buildwithmelwin" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/dr-melwin-vincent-401726213/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>

          <div className="bg-white text-black px-4 py-2 rounded-md shadow-sm border border-neutral-200 mt-1 hidden md:flex items-center gap-2">
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
