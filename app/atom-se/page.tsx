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
  AtomSeFooter,
} from '@/components/atom-se'

export default function AtomSePage() {
  const [introState, setIntroState] = useState<'animating' | 'done'>('animating')

  useEffect(() => {
    // Hold cinematic intro reveal, then auto dismiss
    const timer = setTimeout(() => {
      setIntroState('done')
    }, 2800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden bg-[#f2f2f2] text-[#111111]">
      {/* Background texture */}
      <div className="grain-overlay" />

      {/* Cinematic Logo Splash Intro */}
      <AtomSeIntroOverlay 
        isVisible={introState === 'animating'} 
        onDismiss={() => setIntroState('done')} 
      />

      {/* Top Navbar with Atom SE Logo on top-left, Navigation links & CTA */}
      <AtomSeNavbar />

      {/* Hero Section */}
      <AtomSeHeroSection ready={introState === 'done'} />

      {/* Why Choose Atom SE */}
      <AtomSeWhyChooseSection />

      {/* Services Grid */}
      <AtomSeServicesSection />

      {/* 3-Step Process */}
      <AtomSeProcessSection />

      {/* Project Inquiry Stepper / Form */}
      <AtomSeInquiryFormSection />

      {/* Dedicated Atom SE Footer */}
      <AtomSeFooter />
    </main>
  )
}
