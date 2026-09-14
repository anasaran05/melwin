import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Footer } from '@/components/footer'
import { 
  Stethoscope, 
  Zap,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Music
} from 'lucide-react'

export const metadata = {
  title: 'About Dr. Melwin Vincent | Healthcare & EdTech Innovator',
  description: 'Founder building at the intersection of biosciences education, healthcare AI, and technology. Leading ZANE ProEd and Alphatic Labs while building a founder community in public.',
}

export default function AboutPage() {
  const stats = [
    { label: 'Content Reach', value: '2.2M+', subtext: 'Business & strategy impressions' },
    { label: 'Startup Network', value: '23,000+', subtext: 'WhatsApp community members' },
    { label: 'Personal Brand', value: '60,000+', subtext: 'Followers across platforms' },
    { label: 'Global Hubs', value: '6+', subtext: 'India, USA, Europe, Australia' },
  ]

  const ventures = [
    {
      role: 'Founder & CEO',
      company: 'ZANE ProEd',
      website: 'ZaneProEd.com',
      url: 'https://zaneproed.com',
      badge: 'EdTech & Bioscience',
      logo: '/ventures logos/zaneproed.png',
      highlights: [
        'Built ZANE ProEd from zero into a biosciences-focused education platform serving learners across the US, UK, and India.',
        'Grew from $0 to seven-figure organic revenue within six months, without paid advertising or outside capital.',
        'Focused on helping students and professionals understand bioscience careers through practical, industry-relevant learning.',
        'Lead the business across product, growth, partnerships, and strategy.'
      ],
      icon: GraduationCap
    },
    {
      role: 'Co-founder & Executive Chairman',
      company: 'Alphatic Labs Pvt Ltd',
      website: 'AlphaticLabs.com',
      url: 'https://alphaticlabs.com',
      badge: 'Healthcare AI & Hardware',
      logo: '/alphaticlabs-logo.png',
      highlights: [
        'Building healthcare AI hardware that transcribes physician-patient conversations in real time and turns them into structured clinical documentation.',
        'Designed to reduce administrative work and give clinicians more time to focus on patients.',
        'Involved across R&D, product direction, and early clinical partnerships.'
      ],
      icon: Stethoscope
    }
  ]

  const competencies = [
    {
      category: 'Growth & Strategy',
      items: [
        '0-to-1 Venture Building',
        'Go-to-Market Strategy & International Market Expansion',
        'Organic, Community-Led & B2B/B2C Growth Execution',
        'Revenue Growth, Enterprise Sales & Strategic Partnerships',
        'Investor Relations & Fundraising'
      ]
    },
    {
      category: 'Product & Brand',
      items: [
        'Product Strategy',
        'Brand Strategy & Positioning — Corporate and Personal',
        'Content Strategy, Thought Leadership & Public Speaking',
        'Audience & Community Building',
        'Founder-Led & Digital Marketing'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#111111] relative overflow-x-hidden selection:bg-[#111111] selection:text-white font-sans">
      
      {/* Back to Home Navigation Bar */}
      <div className="pt-6 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111]/70 hover:text-[#111111] transition-colors py-2 px-3.5 rounded-full bg-white border border-neutral-200/80 shadow-2xs"
        >
          <ArrowUpRight className="w-4 h-4 rotate-[225deg]" /> Back to Home
        </Link>
        <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest hidden sm:inline-block">
          Dr. Melwin Vincent — About
        </span>
      </div>

      {/* Hero Header Section */}
      <section className="pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-white text-[#111111] text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-6 shadow-2xs max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-[#111111] shrink-0" /> <span className="truncate">Healthcare & EdTech Innovator</span>
        </div>
        
        <h1 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tighter text-[#111111] mb-6 sm:mb-8 leading-[0.95] flex items-center justify-center flex-wrap gap-2 sm:gap-4">
          <span>Dr. Melwin Vincent</span>
          <svg 
            className="w-7 h-7 sm:w-12 sm:h-12 md:w-14 md:h-14 inline-block shrink-0 drop-shadow-sm select-none" 
            viewBox="0 0 24 24" 
            fill="none" 
            aria-label="Verified Account"
          >
            <path
              d="M22.5 12c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 1.975 13.18 1.1 11.6 1.1s-2.95.875-3.6 2.148c-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.05.7 10.42.7 12s.875 2.95 2.148 3.6c-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238.65 1.273 2.02 2.148 3.6 2.148s2.95-.875 3.6-2.148c.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6z"
              fill="#0095F6"
            />
            <path
              d="M10.2 16.2l-3.8-3.8 1.4-1.4 2.4 2.4 5.9-5.9 1.4 1.4-7.3 7.3z"
              fill="#FFFFFF"
            />
          </svg>
        </h1>
        
        <p className="text-lg sm:text-2xl text-[#111111]/80 max-w-4xl mx-auto font-medium leading-relaxed mb-10 sm:mb-14 px-2">
          Founder building at the intersection of <span className="text-[#111111] font-bold underline decoration-neutral-400 decoration-2 underline-offset-4 sm:underline-offset-8">biosciences education</span>, <span className="text-[#111111] font-bold underline decoration-neutral-400 decoration-2 underline-offset-4 sm:underline-offset-8">healthcare AI</span>, and <span className="text-[#111111] font-bold underline decoration-neutral-400 decoration-2 underline-offset-4 sm:underline-offset-8">technology</span>. Leading ZANE ProEd and Alphatic Labs while building a founder community in public.
        </p>

        {/* Quick Highlights Grid (Bento Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12 text-left">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="p-6 sm:p-7 rounded-[1.5rem] bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-neutral-400 transition-all duration-300 group overflow-hidden"
            >
              <p className="text-4xl sm:text-5xl font-black tracking-tighter text-[#111111] mb-1.5 group-hover:translate-x-1 transition-transform">{stat.value}</p>
              <p className="text-sm font-bold text-[#111111] mb-1">{stat.label}</p>
              <p className="text-xs text-neutral-500 font-mono leading-tight">{stat.subtext}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience / Ventures Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-mono text-neutral-500 font-bold uppercase tracking-widest block mb-2">Ventures & Leadership</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-[#111111]">Executive Experience</h2>
          </div>
          <p className="text-[#111111]/70 text-sm sm:text-base max-w-md mt-3 md:mt-0 font-medium leading-relaxed">
            Architecting solutions at the intersection of AI hardware, medical workflows, and bioscience workforce readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {ventures.map((venture, index) => {
            return (
              <div 
                key={index}
                className="rounded-[2rem] bg-white border border-neutral-200/90 p-6 sm:p-10 flex flex-col justify-between shadow-2xs hover:shadow-lg hover:border-neutral-400 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-6 sm:mb-8">
                    <div className="h-12 sm:h-14 w-auto min-w-[56px] max-w-[200px] px-3.5 py-2 rounded-2xl bg-[#f8f8f8] border border-neutral-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                      <Image 
                        src={venture.logo} 
                        alt={`${venture.company} logo`} 
                        width={160} 
                        height={48} 
                        className="object-contain h-full w-auto"
                      />
                    </div>
                    <span className="text-[11px] sm:text-xs font-mono font-semibold px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#f8f8f8] text-[#111111] border border-neutral-200 truncate">
                      {venture.badge}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs font-mono text-neutral-500 font-bold uppercase tracking-wider mb-1.5 sm:mb-2">{venture.role}</p>
                  <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                    <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#111111]">{venture.company}</h3>
                    <a 
                      href={venture.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 sm:p-2.5 rounded-full bg-[#f8f8f8] border border-neutral-200 text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all shrink-0"
                      aria-label={`Visit ${venture.company}`}
                    >
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  </div>

                  <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-[#111111]/80 text-xs sm:text-base leading-relaxed font-normal">
                    {venture.highlights.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 sm:gap-3">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#111111] mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 sm:pt-6 border-t border-neutral-100 flex justify-between items-center text-xs font-mono text-neutral-500">
                  <span>Official Website</span>
                  <a href={venture.url} target="_blank" rel="noopener noreferrer" className="text-[#111111] font-bold hover:underline flex items-center gap-1.5">
                    {venture.website} <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Core Competencies Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <span className="text-xs font-mono text-neutral-500 font-bold uppercase tracking-widest block mb-2">Expertise</span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-[#111111]">Core Competencies</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {competencies.map((comp, index) => (
            <div key={index} className="p-6 sm:p-9 rounded-[2rem] border border-neutral-200/90 bg-white shadow-2xs hover:border-neutral-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111] mb-6 flex items-center gap-3">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-[#f8f8f8] text-[#111111] border border-neutral-200">
                    <Zap className="w-5 h-5" />
                  </div>
                  {comp.category}
                </h3>
                <ul className="space-y-3.5">
                  {comp.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm md:text-base font-medium text-[#111111]/85 leading-snug">
                      <CheckCircle2 className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Beyond Work Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="p-8 sm:p-14 rounded-[2rem] bg-white border border-neutral-200/90 shadow-2xs relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute -top-8 -right-8 p-8 text-neutral-100 pointer-events-none group-hover:text-neutral-200/60 transition-colors duration-500 hidden sm:block">
            <Music className="w-64 h-64" />
          </div>

          <span className="text-xs font-mono text-neutral-500 font-bold uppercase tracking-widest block mb-2 sm:mb-3">Passions & Life</span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-[#111111] mb-6 sm:mb-8">Beyond work</h2>

          <p className="text-lg sm:text-2xl text-[#111111]/85 font-medium leading-relaxed max-w-4xl">
            I am a guitarist and a pianist, and whenever time allows, I perform and teach both. It’s one of the few things in my life that has nothing to do with growth, strategy, or startups. Pure love. And I’m grateful to have it.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-[#111111] pt-6 sm:pt-8 border-t border-neutral-100">
            <div className="flex items-center gap-2.5 bg-[#f8f8f8] px-4 py-2 rounded-full border border-neutral-200">
              <Music className="w-4 h-4 text-[#111111] shrink-0" />
              <span>Guitarist & Pianist</span>
            </div>
            <div className="flex items-center gap-2.5 bg-[#f8f8f8] px-4 py-2 rounded-full border border-neutral-200">
              <Sparkles className="w-4 h-4 text-[#111111] shrink-0" />
              <span>Performer & Educator</span>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Footer Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-16 rounded-[2rem] bg-[#111111] text-white shadow-xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter mb-3 sm:mb-4">Let's Connect & Innovate</h2>
          <p className="text-neutral-300 max-w-xl mx-auto mb-8 sm:mb-10 font-normal text-sm sm:text-lg leading-relaxed">
            Interested in venture collaboration, healthcare AI innovation, keynote speaking, or advisory?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 relative z-10">
            <Link 
              href="/#consultation" 
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl bg-white text-[#111111] font-bold text-sm hover:bg-neutral-200 transition-all shadow-md text-center"
            >
              Book a Consultation
            </Link>
            <Link 
              href="/" 
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl bg-neutral-900 text-neutral-200 font-medium text-sm border border-neutral-700 hover:bg-neutral-800 hover:text-white transition-all text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
