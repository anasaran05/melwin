'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { 
  Sparkles, 
  ArrowRight, 
  Globe, 
  Search, 
  Zap, 
  Code2, 
  Headphones, 
  CheckCircle2, 
  Layers,
  Laptop
} from 'lucide-react'

export default function AtomSePage() {
  const [introState, setIntroState] = useState<'animating' | 'done'>('animating')

  useEffect(() => {
    // 0.0s - 1.0s: Smooth zoom-in / settle logo into center
    // 1.0s - 2.2s: Hold logo comfortably on screen (in full clarity)
    // 2.2s - 2.8s: Blur and dissolve away
    const timer = setTimeout(() => {
      setIntroState('done')
    }, 2800)

    return () => clearTimeout(timer)
  }, [])

  // Staggered hierarchical animation for the Hero section
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.22,
        delayChildren: 0.15,
      },
    },
  }

  const heroItemVariants = {
    hidden: { 
      opacity: 0, 
      y: 28, 
      filter: 'blur(8px)' 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { 
        duration: 0.9, 
        ease: [0.16, 1, 0.3, 1] as const 
      } 
    },
  }

  const services = [
    {
      icon: Globe,
      title: 'Modern Website Building',
      badge: 'WEBSITES',
      description: 'We design and build clean, fast, and easy-to-use websites for your company or brand that look stunning on phones, tablets, and computers.',
      points: ['Custom modern designs', 'Mobile & tablet friendly', 'Easy for you to update'],
    },
    {
      icon: Search,
      title: 'Google Search (SEO) Growth',
      badge: 'GET FOUND',
      description: 'We help your business appear higher on Google search results so new customers can discover your services instead of going to competitors.',
      points: ['Keyword optimization', 'Local Google Maps ranking', 'More organic visitors'],
    },
    {
      icon: Code2,
      title: 'Custom Web Apps & Software',
      badge: 'DIGITAL TOOLS',
      description: 'Need a custom portal, client dashboard, or booking system? We build simple software tailored to how your business actually runs.',
      points: ['Client portals & dashboards', 'Automated workflows', 'Secure database setup'],
    },
    {
      icon: Zap,
      title: 'Speed & Performance Boost',
      badge: 'FAST LOADING',
      description: 'Nobody likes slow websites. We speed up your existing website so pages open instantly and visitors stay engaged.',
      points: ['Lightning-fast load times', 'Better visitor conversion', 'Smooth browsing'],
    },
    {
      icon: Layers,
      title: 'Website Redesigns',
      badge: 'MODERN LOOK',
      description: 'If your current website feels old or difficult to navigate, we give it a fresh, trustworthy look that builds instant credibility.',
      points: ['Modern visual upgrade', 'Clearer call-to-actions', 'Professional branding'],
    },
    {
      icon: Headphones,
      title: 'Maintenance & Friendly Support',
      badge: 'PEACE OF MIND',
      description: 'We handle regular security updates, backups, and small edits so you never have to worry about technical headaches.',
      points: ['Daily backups & security', 'Quick help whenever needed', 'Zero downtime guarantee'],
    },
  ]

  const processSteps = [
    {
      number: '01',
      title: 'Tell Us Your Goal',
      desc: 'We have a friendly chat in simple words to understand your business, what you want to achieve, and who your customers are.',
    },
    {
      number: '02',
      title: 'We Build & Show You Progress',
      desc: 'Our team designs and builds your website or software step by step, sharing previews so you can give feedback easily.',
    },
    {
      number: '03',
      title: 'Launch & Grow',
      desc: 'We take your project live, make sure everything works perfectly, and stay by your side for ongoing support and growth.',
    },
  ]

  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden bg-[#f2f2f2] text-[#111111]">
      <div className="grain-overlay" />

      {/* ========================================================================= */}
      {/* Fullscreen Cinematic Logo Intro Animation (2.5s - 3s on screen) */}
      {/* ========================================================================= */}
      <AnimatePresence mode="wait">
        {introState === 'animating' && (
          <motion.div
            key="atom-intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
            }}
            className="fixed inset-0 z-[9999] bg-[#f2f2f2] flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => setIntroState('done')}
          >
            {/* Texture overlay for intro */}
            <div className="grain-overlay" />

            {/* Subtle ambient backdrop glow */}
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

            {/* Hero Logo Animation: Zoom-out into center, hold comfortably, then blur and dissolve away */}
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

      {/* Floating Navbar */}
      <Navbar />

      {/* Hero Section with Staggered Hierarchical Animation */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 md:px-12 w-full relative">
        <motion.div 
          variants={heroContainerVariants}
          initial="hidden"
          animate={introState === 'done' ? 'visible' : 'hidden'}
          className="max-w-5xl mx-auto text-center space-y-6"
        >
          
          {/* Hierarchy Level 1: Brand Badge & Logo */}
          <motion.div variants={heroItemVariants} className="flex flex-col items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/10 text-[#666666] text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FULL-SERVICE DIGITAL & TECH VENTURE</span>
            </div>

            <div className="py-2">
              <Image 
                src="/ventures logos/atomse.png" 
                alt="Atom SE Logo" 
                width={180} 
                height={60} 
                className="h-10 md:h-14 w-auto object-contain mx-auto"
                priority
              />
            </div>
          </motion.div>

          {/* Hierarchy Level 2: Main Title */}
          <motion.h1 
            variants={heroItemVariants}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#111111] max-w-4xl mx-auto leading-[1.08]"
          >
            Simple, fast, and reliable <br className="hidden sm:inline" />
            <span className="text-[#888888]">digital solutions for your business.</span>
          </motion.h1>

          {/* Hierarchy Level 3: Subtitle Explanation */}
          <motion.p 
            variants={heroItemVariants}
            className="text-sm sm:text-base md:text-lg text-[#555555] max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Atom SE takes care of all your technology needs &mdash; from building modern websites that turn visitors into customers, to helping you rank higher on Google search without technical confusion.
          </motion.p>

          {/* Hierarchy Level 4: Action Buttons */}
          <motion.div 
            variants={heroItemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <Link
              href="/#consultation"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm transition-colors shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>What We Offer</span>
            </a>
          </motion.div>

        </motion.div>
      </section>

      {/* Why Choose Atom SE - Plain Benefits */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 w-full border-t border-b border-black/[0.04]">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 md:p-14 border border-black/10 shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
            <Laptop className="w-4 h-4 text-[#111111]" />
            <span>HOW WE ARE DIFFERENT</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight">
            Technology made simple, straightforward, and stress-free.
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-[#555555] leading-relaxed">
            <p>
              Many tech agencies use confusing words, charge hidden fees, and deliver websites that break easily. At <strong className="text-[#111111]">Atom SE</strong>, we believe technology should be easy for anyone to understand and manage.
            </p>
            <p>
              We speak regular human language, explain every step clearly, and build clean digital products that work reliably day after day &mdash; allowing you to focus on running your business.
            </p>
          </div>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section id="services" className="py-12 md:py-24 px-4 sm:px-6 md:px-12 w-full">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
              OUR SERVICES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#111111] tracking-tight">
              Everything you need to succeed online
            </h2>
            <p className="text-sm sm:text-base text-[#666666] max-w-xl mx-auto">
              Clear, practical digital services tailored to grow your revenue and online authority.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center text-[#111111]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#111111]">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[#555555] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 space-y-2">
                    {item.points.map((pt) => (
                      <div key={pt} className="flex items-center gap-2 text-xs text-[#444444]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Simple 3-Step Process */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 w-full border-t border-black/[0.04]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight">
              Simple 3-Step Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processSteps.map((step) => (
              <div 
                key={step.number}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-md space-y-3"
              >
                <span className="text-3xl sm:text-4xl font-black text-[#888888] font-mono block">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-[#111111]">{step.title}</h3>
                <p className="text-sm text-[#555555] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 w-full">
        <div className="max-w-4xl mx-auto bg-[#111111] text-white rounded-3xl p-8 sm:p-12 md:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              READY TO BUILD?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              Let's build something remarkable for your business.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed pt-1">
              Have an idea or need an existing website upgraded? Contact Dr. Melwin and the Atom SE engineering team today for a free project consultation.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#consultation"
              className="w-full sm:w-auto bg-white hover:bg-neutral-200 text-black px-8 py-3.5 rounded-full font-bold text-sm transition-all"
            >
              Request a Free Quote
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white border border-white/20 px-6 py-3.5 rounded-full font-medium text-sm transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
