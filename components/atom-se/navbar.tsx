'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function AtomSeNavbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [isLightSection, setIsLightSection] = useState(false)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Check if user has reached the second section (Why Choose / Philosophy)
      const whySection = document.getElementById('why-atom-se')
      if (whySection) {
        const rect = whySection.getBoundingClientRect()
        setIsLightSection(rect.top <= 100)
      } else {
        setIsLightSection(currentScrollY > window.innerHeight * 0.8)
      }

      // Scroll direction: show on scroll-up, hide on scroll-down
      if (currentScrollY <= 20) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollYRef.current + 6) {
        // Scrolling down -> hide
        setIsVisible(false)
      } else if (currentScrollY < lastScrollYRef.current - 6) {
        // Scrolling up -> show
        setIsVisible(true)
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] py-4 sm:py-5 bg-transparent ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-4 sm:gap-6">
        {/* Brand Logo - Changes dynamically based on section */}
        <Link
          href="/atom-se"
          className="inline-flex items-center hover:opacity-85 transition-opacity duration-300"
        >
          <Image
            src={
              isLightSection
                ? '/ventures%20logos/atomse.png'
                : '/ventures%20logos/atom-se-white.png'
            }
            alt="Atom SE"
            width={240}
            height={80}
            className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-all duration-300"
            priority
          />
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 transition-colors duration-300">
          <a
            href="#project-form"
            className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-lg hover:scale-[1.03] active:scale-[0.98] ${
              isLightSection
                ? 'bg-[#111111] text-white hover:bg-neutral-800'
                : 'bg-white text-black hover:bg-neutral-200'
            }`}
          >
            <span>Start a Project</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>

          <a
            href="#why-atom-se"
            className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all hover:scale-[1.03] active:scale-[0.98] ${
              isLightSection
                ? 'bg-white/90 hover:bg-white text-[#111111] border border-neutral-300 shadow-sm backdrop-blur-md'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm shadow-md'
            }`}
          >
            <span>Services</span>
          </a>
        </div>
      </div>
    </header>
  )
}

export default AtomSeNavbar
