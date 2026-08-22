'use client'

import Image from 'next/image'
import Link from 'next/link'
import ShinyText from './ui/shiny-text'

export function BioSection() {
  return (
    <section id="bio" className="py-24 max-md:py-16 md:py-32 bg-[#f2f2f2] px-6 md:px-12 w-full z-10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-center max-md:gap-12">
        {/* Left Column: Heading & Short Intro */}
        <div className="flex flex-col gap-8 md:gap-32 justify-start md:pr-8 max-md:gap-6">
          <h2 className="text-7xl max-md:text-5xl md:text-8xl font-bold tracking-tighter text-[#111111]">Hey!</h2>
          <p className="text-xl max-md:text-base md:text-2xl font-medium text-[#111111] leading-snug">
            I’m <span className="inline-flex items-center gap-1.5"><ShinyText text="Dr. Melwin" speed={3} color="#111111" shineColor="#8a8a8a" /></span>, a global entrepreneur & educator.
          </p>
        </div>

        {/* Center Column: Image Placeholder (Hero image will scroll down into this space) */}
        <div className="relative w-full aspect-square md:aspect-[4/5] rounded-[2rem] mx-auto max-w-md hidden md:block opacity-0">
          {/* This empty space ensures the 3-column grid stays balanced while the Hero image animates into this spot */}
        </div>

        {/* Right Column: Detailed Bio */}
        <div className="flex flex-col gap-6 md:pl-12 justify-end h-full pt-8 md:pt-0">
          <p className="text-base md:text-xl text-[#111111]/80 leading-relaxed font-medium">
            As the Founder & CEO of Zane ProEd and Alphatic Labs, I build tech-driven companies solving real-world problems across biosciences education, healthcare innovation, and AI.
          </p>
          <p className="text-base md:text-xl text-[#111111]/80 leading-relaxed font-normal">
            Beyond building companies, my mission is creating a founder-first startup ecosystem where entrepreneurs learn, collaborate, and scale together to make lasting impact.
          </p>
          <div className="flex flex-col gap-3 mt-4">
            <Link 
              href="/bmf-club" 
              className="bg-[#111111] text-white rounded-xl py-4 px-8 font-medium hover:bg-neutral-800 transition-all text-center flex items-center justify-center gap-2 group shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Join founder's club (Free)</span>
            </Link>
            <button 
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('openConsultation', { detail: 'consult_melwin' }));
                const el = document.getElementById('consultation') || document.getElementById('services');
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="bg-white text-[#111111] rounded-xl py-4 px-8 font-medium hover:bg-gray-100 transition-colors border border-gray-300 text-center"
            >
              Consult with Melwin 1-1
            </button>
            <Link 
              href="/services" 
              className="bg-white text-[#111111] rounded-xl py-4 px-8 font-medium hover:bg-gray-100 transition-colors border border-gray-200 text-center"
            >
              Explore services
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
