'use client'

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white pt-24 pb-12 px-6 md:px-12 relative overflow-hidden flex flex-col items-center">
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col md:flex-row justify-between gap-16 md:gap-8 pb-32">
        {/* Left Column */}
        <div className="md:w-1/2">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1]">
            Scaling<br />
            Start-ups<br />
            for Growth.
          </h2>
        </div>

        {/* Right Columns */}
        <div className="md:w-1/2 flex flex-col sm:flex-row justify-between gap-12 sm:gap-8 pt-2">
          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <span className="text-gray-400 text-lg">/Quick links</span>
            <div className="flex flex-wrap gap-3 max-w-[280px]">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Me', href: '/#bio' },
                { name: 'Services', href: '/services' },
                { name: 'Works', href: '/#projects' },
                { name: 'Contact', href: '/services#consultation' }
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="bg-[#f2f2f2] text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-6">
            <span className="text-gray-400 text-lg">/Contact</span>
            <a href="mailto:melwin@zaneproed.com" className="text-white hover:text-gray-300 transition-colors text-lg">
              melwin@zaneproed.com
            </a>
          </div>
        </div>
      </div>

      {/* Massive Background Text */}
      <div className="absolute bottom-[-10%] md:bottom-[-20%] left-0 w-full text-center pointer-events-none select-none overflow-hidden flex justify-center">
        <span
          className="text-[25vw] md:text-[28vw] font-black tracking-tighter leading-none text-[#1a1a1a]"
          style={{ WebkitTextStroke: '1px #222' }}
        >
          MELWIN
        </span>
      </div>
    </footer>
  )
}
