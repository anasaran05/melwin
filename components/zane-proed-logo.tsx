import Image from 'next/image'
import Link from 'next/link'

interface ZaneProEdLogoProps {
  href?: string
  logoSrc?: string
  className?: string
  target?: string
  rel?: string
}

export function ZaneProEdLogo({
  href = 'https://zaneproed.com',
  logoSrc = '/ventures logos/zaneproed.png',
  className = '',
  target = '_blank',
  rel = 'noopener noreferrer',
}: ZaneProEdLogoProps) {
  const content = (
    <div className={`flex items-center shrink-0 group ${className}`}>
      {/* Logo Crest Image */}
      <div className="relative h-9 sm:h-11 md:h-13 w-auto flex items-center justify-center">
        <Image
          src={logoSrc}
          alt="ZANE ProEd Crest"
          width={65}
          height={65}
          className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          draggable={false}
        />
      </div>

      {/* Styled Text Section */}
      <div className="flex flex-col leading-[1] pt-0.5 ml-2.5 sm:ml-3 text-left select-none">
        <span className="text-base sm:text-lg md:text-xl font-serif font-normal tracking-tight text-[#111111] leading-none">
          Zane <span className="text-[#E11D48]">ProEd.</span>
        </span>

        <span className="mt-1 text-[6.5px] sm:text-[7.5px] md:text-[8px] font-bold tracking-[0.26em] uppercase text-[#555555] font-sans">
          EDUCATION & CAREERS
        </span>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className="inline-flex items-center">
        {content}
      </Link>
    )
  }

  return content
}
