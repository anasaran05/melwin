import Image from 'next/image'
import Link from 'next/link'

export function AtomSeFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-black/10 bg-white/70 backdrop-blur-md py-12 px-4 sm:px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Logo */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="relative h-8 w-28 flex items-center">
            <Image
              src="/ventures logos/atomse.png"
              alt="Atom SE"
              width={140}
              height={40}
              className="h-full w-auto object-contain object-left"
            />
          </div>
          <span className="text-xs text-[#777777]">
            &mdash; High-performance digital engineering & software architecture.
          </span>
        </div>

        {/* Navigation & Links */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-xs text-[#555555]">
          <a href="#showcase" className="hover:text-black transition-colors">Showcase & Capabilities</a>
          <a href="#why-atom-se" className="hover:text-black transition-colors">Engineering</a>
          <a href="#process" className="hover:text-black transition-colors">Process</a>
          <a href="#project-form" className="hover:text-black font-semibold text-neutral-900 transition-colors">
            Get Quotation
          </a>
          <a href="#project-form" className="hover:text-black transition-colors font-semibold text-black">Start Project</a>
          <Link href="/" className="hover:text-black transition-colors text-neutral-400">
            Dr. Melwin's Home
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-black/[0.06] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-400">
        <p>&copy; {currentYear} Atom SE. All rights reserved.</p>
        <p>Built for founders, brands & enterprises worldwide.</p>
      </div>
    </footer>
  )
}
