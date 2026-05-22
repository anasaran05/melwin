import Image from 'next/image'
import Link from 'next/link'
import ShinyText from './ui/shiny-text'

export function BioSection() {
  return (
    <section id="bio" className="py-24 max-md:py-16 md:py-32 bg-[#f2f2f2] px-6 md:px-12 w-full z-10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-center max-md:gap-12">
        {/* Left Column: Heading & Short Intro */}
        <div className="flex flex-col gap-8 md:gap-32 justify-between h-full md:pr-8 max-md:gap-6">
          <h2 className="text-7xl max-md:text-6xl md:text-8xl font-bold tracking-tighter text-[#111111]">Hey!</h2>
          <p className="text-xl max-md:text-lg md:text-2xl font-medium text-[#111111] leading-snug">
            This is <ShinyText text="Dr. Melwin" speed={3} color="#111111" shineColor="#8a8a8a" />, a mentor dedicated to guiding students toward a successful career and a brighter future.
          </p>
        </div>

        {/* Center Column: Image Placeholder (Hero image will scroll down into this space) */}
        <div className="relative w-full aspect-square md:aspect-[4/5] rounded-[2rem] mx-auto max-w-md hidden md:block opacity-0">
          {/* This empty space ensures the 3-column grid stays balanced while the Hero image animates into this spot */}
        </div>

        {/* Right Column: Detailed Bio */}
        <div className="flex flex-col gap-6 md:pl-12 justify-end h-full pt-8 md:pt-0">
          <p className="text-lg md:text-xl text-[#111111]/80 leading-relaxed font-medium">
            I'm a professional educator and mentor with a strong focus on building modern, scalable, and conversion-driven educational experiences.
          </p>
          <p className="text-lg md:text-xl text-[#111111]/80 leading-relaxed">
            Over the years, I've created and shipped multiple programs and templates used by global students, helping them achieve success faster.
          </p>
          <div className="flex flex-col gap-3 mt-4">
            <button className="bg-[#111111] text-white rounded-xl py-4 px-8 font-medium hover:bg-neutral-800 transition-colors">
              Book for $99
            </button>
            <Link href="/services" className="bg-white text-[#111111] rounded-xl py-4 px-8 font-medium hover:bg-gray-50 transition-colors border border-gray-200 text-center">
              More Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
