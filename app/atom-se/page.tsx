'use client'

import { useState, useEffect } from 'react'
import {
  AtomSeNavbar,
  AtomSeIntroOverlay,
  AtomSeHeroSection,
  AtomSeWhyChooseSection,
  AtomSeServicesSection,
  AtomSeProcessSection,
  AtomSeInquiryFormSection,
} from '@/components/atom-se'
import { Footer } from '@/components/footer'

export default function AtomSePage() {
  const [introState, setIntroState] = useState<'animating' | 'done'>('animating')

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    // Prevent body scroll during entry intro animation
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Hold cinematic intro reveal, then auto dismiss and restore scroll
    const timer = setTimeout(() => {
      setIntroState('done')
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.body.style.overflow = originalOverflow || ''
    }, 2800)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = originalOverflow || ''
    }
  }, [])

  const handleDismissIntro = () => {
    setIntroState('done')
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.body.style.overflow = ''
  }

  return (
    <main className="font-sans min-h-screen relative overflow-x-clip bg-[#f2f2f2] text-[#111111]">
      {/* Background texture */}
      <div className="grain-overlay" />

      {/* Cinematic Logo Splash Intro */}
      <AtomSeIntroOverlay 
        isVisible={introState === 'animating'} 
        onDismiss={handleDismissIntro} 
      />

      {/* Global Floating Smart Navbar (Scroll up to show, scroll down to hide) */}
      <AtomSeNavbar />

      {/* Hero Section */}
      <AtomSeHeroSection ready={introState === 'done'} />

      {/* Why Choose Atom SE (with integrated capabilities) */}
      <AtomSeWhyChooseSection />

      {/* Services Grid */}
      <AtomSeServicesSection />

      {/* 3-Step Process */}
      <AtomSeProcessSection />

      {/* Project Inquiry Stepper / Form */}
      <AtomSeInquiryFormSection />

      {/* Main Dr. Melwin Footer */}
      <Footer />
    </main>
  )
}
