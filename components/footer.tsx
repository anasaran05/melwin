'use client'

import Link from "next/link"
import { Lock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white pt-24 pb-12 px-6 md:px-12 relative overflow-hidden flex flex-col items-center">
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col md:flex-row justify-between gap-16 md:gap-8 pb-32">
        {/* Left Column */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1]">
            Scaling<br />
            Start-ups<br />
            for Growth.
          </h2>
          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-gray-400 text-sm font-medium">
            <span>© 2026 Dr. Melwin Vincent</span>
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Right Columns */}
        <div className="md:w-1/2 flex flex-col sm:flex-row justify-between gap-12 sm:gap-8 pt-2">
          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <span className="text-gray-400 text-lg">Quick links</span>
            <div className="flex flex-wrap gap-2.5 max-w-[480px]">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Me', href: '/about' },
                { name: 'Services', href: '/services' },
                { name: 'BMF Club', href: '/bmf-club' },
                { name: 'Directory', href: '/bmf-club/directory' },
                { name: 'Personal Branding', href: '/agency' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Atom SE (Tech)', href: '#', isLocked: true },
                { name: 'Funding & Grants', href: '#', isLocked: true },
                { name: 'Jobs & Talent', href: '#', isLocked: true },
                { name: 'Biz Registrations', href: '#', isLocked: true }
              ].map((link) => (
                link.isLocked ? (
                  <span
                    key={link.name}
                    title={`${link.name} is currently locked / available soon`}
                    className="bg-[#e5e5e5] text-neutral-600 px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-not-allowed select-none opacity-85"
                  >
                    <Lock className="w-3 h-3 text-neutral-500 shrink-0" />
                    <span>{link.name}</span>
                  </span>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="bg-[#f2f2f2] text-black px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold hover:bg-white hover:scale-105 active:scale-95 transition-all"
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Contact & Socials */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <span className="text-gray-400 text-lg">Contact</span>
              <a href="mailto:buildwithmelwin@gmail.com" className="text-white hover:text-gray-300 transition-colors text-lg">
                buildwithmelwin@gmail.com
              </a>
            </div>
            
            <div className="flex flex-col gap-4">
              <span className="text-gray-400 text-lg">Socials</span>
              <div className="flex gap-4">
                <a href="https://whatsapp.com/channel/0029Vb7Y5f00wajjbzlEfQ1Z" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/buildwithmelwin?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/dr-melwin-vincent-401726213/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
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
