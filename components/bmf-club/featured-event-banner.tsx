'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Ticket,
  Video,
  Flame
} from 'lucide-react'

interface FeaturedEventBannerProps {
  className?: string
}

export function FeaturedEventBanner({ className = '' }: FeaturedEventBannerProps) {
  const eventId = '9c2225b0-e13a-4450-b5df-1082e0da0d89'
  const eventSlug = 'from-idea-to-first-1-lakh-early-stage-founder-playbook'
  const eventUrl = `/bmf-club/events/${eventId}`
  const registrationUrl = 'https://payments.cashfree.com/forms?code=from-idea-to-1-lakh-webinar'
  const coverImageUrl = 'https://static.wixstatic.com/media/6abdd9_45fd1f766dab4c88a57eea4ef5de2c08~mv2.png'

  return (
    <section className={`w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8 ${className}`}>
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl overflow-hidden bg-[#0a0a0a] text-white border border-white/15 shadow-2xl group"
      >
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-amber-500/10 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-emerald-500/10 blur-[90px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Left Text & Information Column */}
          <div className="flex-1 space-y-5 text-left w-full">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-amber-400 text-black shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                Featured Masterclass
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-white/10 text-white border border-white/15">
                <Video className="w-3 h-3 text-emerald-400" />
                <span>Live Interactive Webinar</span>
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span>Pass: ₹99</span>
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <Link href={eventUrl} className="group/title block">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black tracking-tight text-white group-hover/title:text-neutral-200 transition-colors leading-[1.15]">
                  How to Go from a Business Idea to Making Your First ₹1 Lakh
                </h2>
              </Link>
              <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-sans leading-relaxed">
                Starting a business is easy. Getting your first paying customers is where the real game begins.
              </p>
            </div>

            {/* Date, Time, Logistics Chips */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm font-mono text-neutral-300 pt-1">
              <div className="flex items-center gap-1.5 text-white font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>September 26–27, 2026</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>4:00 PM – 5:00 PM IST</span>
              </div>
            </div>

            {/* Key Topics Covered Chips */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-neutral-300">
              <span className="font-mono text-neutral-400 text-[10px] uppercase font-bold mr-1">Curriculum:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">Idea Validation</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">Building MVP</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">First 10 Customers</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">₹0 Marketing</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">30-Day Plan</span>
            </div>

            {/* CTA Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={eventUrl}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-black px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>View Event Overview</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>

              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-neutral-900/90 hover:bg-neutral-800 text-white border border-white/20 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all hover:border-white/40"
              >
                <span>Book Pass Directly &bull; ₹99</span>
                <ExternalLink className="w-4 h-4 text-neutral-400" />
              </a>
            </div>

          </div>

          {/* Right Visual Graphic Column (Responsive & Preserved) */}
          <div className="w-full lg:w-[420px] xl:w-[460px] shrink-0">
            <Link href={eventUrl} className="block group/image relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-neutral-900 shadow-xl group-hover/image:border-white/40 transition-all">
                <img
                  src={coverImageUrl}
                  alt="How to Go from a Business Idea to Making Your First ₹1 Lakh"
                  className="w-full h-auto object-cover transform group-hover/image:scale-[1.02] transition-transform duration-500"
                />
                
                {/* Subtle Overlay pill */}
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white flex items-center gap-1.5 shadow-md">
                  <span>BMF Club Masterclass</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                </div>
              </div>
            </Link>
          </div>

        </div>
      </motion.div>
    </section>
  )
}
