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
            I’m <span className="inline-flex items-center gap-1.5"><ShinyText text="Dr. Melwin" speed={3} color="#111111" shineColor="#8a8a8a" /><svg className="w-5 h-5 sm:w-6 sm:h-6 inline-block shrink-0 -mt-0.5" viewBox="0 0 24 24" fill="none" aria-label="Verified"><path d="M22.5 12c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 1.975 13.18 1.1 11.6 1.1s-2.95.875-3.6 2.148c-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.05.7 10.42.7 12s.875 2.95 2.148 3.6c-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238.65 1.273 2.02 2.148 3.6 2.148s2.95-.875 3.6-2.148c.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6z" fill="#0095F6"/><path d="M10.2 16.2l-3.8-3.8 1.4-1.4 2.4 2.4 5.9-5.9 1.4 1.4-7.3 7.3z" fill="#FFFFFF"/></svg></span>, a global entrepreneur & educator.
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
