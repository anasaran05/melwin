'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Home } from 'lucide-react'
import { RetroTvError } from '@/components/ui/404-error-page'
import { Footer } from '@/components/footer'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#fafaf9] text-neutral-900 font-sans flex flex-col justify-between selection:bg-amber-400 selection:text-black relative overflow-x-hidden">
      {/* Background Subtle Light Grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Landing Page Center Logo */}
      <div className="relative z-20 pt-5 sm:pt-8 md:pt-10 flex justify-center items-center">
        <Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
          <Image 
            src="/logo-2.png" 
            alt="Dr. Melwin Vincent Logo" 
            width={180} 
            height={60} 
            className="object-contain w-auto h-7 sm:h-9 md:h-10" 
            priority 
          />
        </Link>
      </div>

      {/* Main 404 Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-4 sm:py-8 max-w-3xl mx-auto w-full text-center">
        
        {/* Retro TV 404 Animation Component */}
        <div className="relative flex items-center justify-center w-full overflow-visible my-1">
          <div className="transform scale-[0.68] xs:scale-[0.76] sm:scale-90 md:scale-100 transition-transform origin-center">
            <RetroTvError errorCode="404" errorMessage="PAGE NOT FOUND" />
          </div>
        </div>

        {/* Heading & Context Message */}
        <div className="space-y-2 max-w-lg mx-auto mb-6 sm:mb-8 mt-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 font-serif">
            Lost in Execution?
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-neutral-600 leading-relaxed px-2">
            The page you requested could not be found or has been moved. Let’s get you back on track to scale your venture.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 w-full max-w-[280px] sm:max-w-md">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs sm:text-sm font-semibold shadow-md shadow-neutral-900/10 hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Return to Home</span>
          </Link>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
