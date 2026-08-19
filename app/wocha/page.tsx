import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Sparkles, ArrowRight, ShieldCheck, Heart, Shirt, Compass, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wocha | Premium Everyday Clothing by Dr. Melwin Vincent',
  description: 'Wocha is an everyday luxury clothing brand focused on ultra-soft fabrics, clean minimalist design, and long-lasting quality.',
}

export default function WochaPage() {
  const brandHighlights = [
    {
      icon: Shirt,
      title: 'Premium Fabrics',
      description: 'We use high-grade, breathable cotton and natural blends that feel soft against your skin all day long.',
    },
    {
      icon: Compass,
      title: 'Comfortable Daily Fit',
      description: 'Carefully tailored cuts designed to look sharp whether you are working, relaxing, or traveling.',
    },
    {
      icon: ShieldCheck,
      title: 'Made to Last',
      description: 'Durable stitching and color-fast materials that keep their shape and feel fresh wash after wash.',
    },
    {
      icon: Star,
      title: 'Simple, Timeless Style',
      description: 'Clean designs without loud logos. Clothes that never go out of style and match everything in your wardrobe.',
    },
  ]

  const categories = [
    {
      name: 'Everyday Heavyweight Tees',
      tag: 'Best Seller',
      desc: 'Thick, ultra-soft combed cotton tees with a clean neckline that never sags.',
      details: '240 GSM • 100% Breathable Cotton • Pre-shrunk',
    },
    {
      name: 'Minimalist Hoodies & Sweats',
      tag: 'Cozy Essentials',
      desc: 'Plush fleece interior designed for all-day warmth and lightweight comfort.',
      details: 'French Terry Fleece • Ribbed Cuffs • Relaxed Fit',
    },
    {
      name: 'Structured Daily Trousers',
      tag: 'Smart Casual',
      desc: 'Versatile pants that look like formal trousers but feel as comfortable as sweatpants.',
      details: 'Four-way Stretch • Hidden Drawstring • Wrinkle-resistant',
    },
    {
      name: 'Lightweight Layering Jackets',
      tag: 'All-Season',
      desc: 'Modern outer layers that protect you from the breeze while keeping your outfit sharp.',
      details: 'Water-repellent • Matte Finish • Deep Utility Pockets',
    },
  ]

  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden bg-[#f2f2f2] text-[#111111]">
      <div className="grain-overlay" />

      {/* Floating Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 md:px-12 w-full relative">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          {/* Top Brand Logo & Label */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/10 text-[#666666] text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CLOTHING & LIFESTYLE VENTURE</span>
            </div>

            <div className="py-2">
              <Image 
                src="/ventures logos/wocha.png" 
                alt="Wocha Logo" 
                width={180} 
                height={60} 
                className="h-12 md:h-16 w-auto object-contain mx-auto"
                priority
              />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#111111] max-w-4xl mx-auto leading-[1.08]">
            Clothes that feel great, fit well, and <span className="text-[#888888]">last for years.</span>
          </h1>

          {/* Subtitle in Simple Plain English */}
          <p className="text-sm sm:text-base md:text-lg text-[#555555] max-w-2xl mx-auto font-normal leading-relaxed">
            Wocha is a clothing brand created to solve a simple problem: finding simple, high-quality clothes that look smart, feel comfortable from morning to night, and do not lose their shape after a few washes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href="#collection"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all shadow-lg shadow-black/10"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm transition-colors shadow-xs"
            >
              <span>Back to Melwin</span>
            </Link>
          </div>

        </div>
      </section>

      {/* Why Wocha Exists - Brand Story */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 w-full border-t border-b border-black/[0.04]">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 md:p-14 border border-black/10 shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
            <Heart className="w-4 h-4 text-[#111111]" />
            <span>THE PHILOSOPHY BEHIND WOCHA</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight">
            Simple clothing without any unnecessary complications.
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-[#555555] leading-relaxed">
            <p>
              Most fashion today is either too cheap and wears out quickly, or overpriced with huge logos all over it. We started Wocha because we wanted something in the sweet spot: <strong className="text-[#111111]">exceptionally well-made clothing</strong> that lets your personality take center stage.
            </p>
            <p>
              Every fabric is picked by hand, tested for breathability, and tailored with precise proportions so you never feel restricted &mdash; whether you are heading to a business meeting, traveling on a plane, or having dinner with family.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars Grid */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 w-full">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
              OUR QUALITY PROMISE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight">
              What makes Wocha special
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {brandHighlights.map((item) => {
              const Icon = item.icon
              return (
                <div 
                  key={item.title}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-black/10 shadow-md hover:shadow-lg transition-shadow space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-[#111111]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111111]">{item.title}</h3>
                  <p className="text-sm text-[#555555] leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Collection Highlights */}
      <section id="collection" className="py-12 md:py-20 px-4 sm:px-6 md:px-12 w-full border-t border-black/[0.04]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
              CORE LINEUP
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight">
              Everyday Wardrobe Essentials
            </h2>
            <p className="text-sm text-[#666666] max-w-lg mx-auto">
              Clean essentials made to mix and match easily with anything you own.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div 
                key={cat.name}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full">
                      {cat.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#111111]">{cat.name}</h3>
                  <p className="text-sm text-[#555555] leading-relaxed">{cat.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-[#777777]">
                  <span>{cat.details}</span>
                </div>
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
              STAY CONNECTED
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              Experience the comfort for yourself.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed pt-1">
              Interested in upcoming drops, custom sizing, or wholesale inquiries? Connect directly with Dr. Melwin and the Wocha design team.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#consultation"
              className="w-full sm:w-auto bg-white hover:bg-neutral-200 text-black px-8 py-3.5 rounded-full font-bold text-sm transition-all"
            >
              Get in Touch with Team
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white border border-white/20 px-6 py-3.5 rounded-full font-medium text-sm transition-colors"
            >
              View Other Ventures
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
