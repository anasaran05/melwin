'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreHorizontal, X } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Me', href: '/#about' },
  { name: 'Services', href: '/services' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Contact', href: '/services#consultation' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex justify-center"
    >
      <motion.div
        layout
        animate={{
          borderRadius: 16,
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
        className="bg-[#111111] text-white overflow-hidden shadow-2xl border border-white/10 flex flex-col min-w-[180px]"
      >
        <motion.div layout className="flex justify-between items-center px-4 h-[44px] gap-8 min-w-[160px]">
          <span className="font-semibold tracking-tight text-sm pl-1 whitespace-nowrap">
            Dr. Melwin
          </span>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="bg-white text-black p-1 rounded-full hover:scale-105 transition-transform flex items-center justify-center shrink-0"
          >
            {isOpen ? <X className="w-4 h-4" /> : <MoreHorizontal className="w-4 h-4" />}
          </button>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="px-4 pb-4 flex flex-col gap-2 items-start"
            >
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="bg-white text-black px-4 py-1.5 rounded-lg text-[13px] font-medium hover:bg-neutral-200 transition-colors inline-block"
                >
                  {link.name}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
