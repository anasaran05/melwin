'use client'

import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

const companies = [
  { name: "Zane ProEd", logo: "/ventures logos/zaneproed.png" },
  { name: "Alphatic Labs", logo: "/ventures logos/alphaticlabs.png" },
  { name: "Wocha", logo: "/ventures logos/wocha.png" },
  { name: "Academy", logo: "/ventures logos/academy.png" },
]

interface ProjectsSectionProps {
  hideViewAll?: boolean;
  title?: React.ReactNode;
}

export function ProjectsSection({ hideViewAll = false, title = <>Ventures<br />Built</> }: ProjectsSectionProps) {
  // Duplicate the items to ensure the marquee is wide enough for a seamless loop
  const marqueeItems = [...companies, ...companies, ...companies, ...companies];

  return (
    <section id="projects" className="py-24 max-md:py-16 md:py-32 bg-[#f2f2f2] overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 max-md:px-4 md:px-12">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-16 gap-6 relative text-center">
          <h2 className="text-5xl max-md:text-4xl md:text-7xl font-medium tracking-tight text-[#111111] leading-[1.1] whitespace-pre-line">
            {title}
          </h2>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative w-full flex overflow-hidden pt-8 pb-12">
        {/* Gradients for fade effect at edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#f2f2f2] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#f2f2f2] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex whitespace-nowrap items-center w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {marqueeItems.map((company, index) => (
            <div key={index} className="flex-shrink-0 px-8 md:px-16 flex items-center justify-center">
              <div className="relative h-16 md:h-24 w-40 md:w-56 flex items-center justify-center transition-all duration-300">
                <Image 
                  src={company.logo}
                  alt={company.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
