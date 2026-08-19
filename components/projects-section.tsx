'use client'

import Image from "next/image"
import { motion } from "framer-motion"
import { ZaneProEdLogo } from "@/components/zane-proed-logo"

const companies = [
  { 
    name: "Wocha", 
    logo: "/ventures logos/wocha.png",
    alt: "Wocha Logo",
    heightClass: "h-14 md:h-20 sm:h-16",
    href: "/wocha",
  },
  { 
    name: "Zane ProEd", 
    logo: "/ventures logos/zaneproed.png",
    alt: "Zane ProEd Logo",
    heightClass: "h-14 md:h-20 sm:h-16",
    href: "https://zaneproed.com",
    customComponent: <ZaneProEdLogo href="https://zaneproed.com" />,
  },
  { 
    name: "Alphatic Labs", 
    logo: "/ventures logos/alphaticlabs.png",
    alt: "Alphatic Labs Logo",
    heightClass: "h-14 md:h-20 sm:h-16",
    href: "https://alphaticlabs.com",
  },
  { 
    name: "Atom SE", 
    logo: "/ventures logos/atomse.png",
    alt: "Atom SE Logo",
    heightClass: "h-14 md:h-20 sm:h-16",
    href: "/atom-se",
  },
]

interface ProjectsSectionProps {
  title?: React.ReactNode
  subtitle?: string
  hideViewAll?: boolean
}

export function ProjectsSection({ 
  title = <>Ventures<br />Built</>,
  subtitle = "High-impact companies and products founded and scaled across education, AI, and software.",
  hideViewAll = false
}: ProjectsSectionProps) {
  return (
    <section id="ventures" className="py-20 md:py-28 bg-[#f2f2f2] relative z-10 border-t border-b border-black/[0.04]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center mb-12 md:mb-16 gap-4 text-center">
         
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-[#111111] leading-[1.08]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base text-[#666666] max-w-lg mx-auto font-normal mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Static Centered Logos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center max-w-5xl mx-auto pt-4">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex items-center justify-center py-2 px-2"
            >
              {company.customComponent ? (
                <div className="flex items-center justify-center cursor-pointer">
                  {company.customComponent}
                </div>
              ) : (
                <a
                  href={company.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Visit ${company.name} (Opens in new tab)`}
                  className={`relative w-full ${company.heightClass} flex items-center justify-center cursor-pointer group`}
                >
                  <Image 
                    src={company.logo}
                    alt={company.alt}
                    width={280}
                    height={110}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-xs"
                    unoptimized={company.logo.endsWith('.svg')}
                  />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


