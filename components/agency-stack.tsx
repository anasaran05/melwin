'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, Video, Share2, Crown, Target } from 'lucide-react'

type StackLayer = {
  id: number
  title: string
  subtitle: string
  bgGradient: string
  glowColor: string
  badgeBg: string
  icon: React.ElementType
}

export function AgencyStack() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null)

  const layers: StackLayer[] = [
    {
      id: 1,
      title: 'Personal Brand Positioning & Narrative',
      subtitle: 'Authority mapping, target audience profiling, and brand voice definition.',
      bgGradient: 'from-[#ff5e43] via-[#ff7c3f] to-[#e040fb]',
      glowColor: '#ff5e43',
      badgeBg: 'bg-[#ff5e43]',
      icon: Compass,
    },
    {
      id: 2,
      title: 'High-Retention Video Production',
      subtitle: '4K remote editing, DFY physical shoots, hooks, motion graphics, and subtitles.',
      bgGradient: 'from-[#ff7c3f] via-[#f472b6] to-[#a855f7]',
      glowColor: '#ff7c3f',
      badgeBg: 'bg-[#ff7c3f]',
      icon: Video,
    },
    {
      id: 3,
      title: 'Multi-Platform Distribution Engine',
      subtitle: 'Consistent publishing across LinkedIn, YouTube, and Instagram Shorts/Reels.',
      bgGradient: 'from-[#f472b6] via-[#e056fd] to-[#3b82f6]',
      glowColor: '#f472b6',
      badgeBg: 'bg-[#f472b6]',
      icon: Share2,
    },
    {
      id: 4,
      title: 'Executive Positioning & PR Outreach',
      subtitle: 'Thought-leadership positioning, podcast guest placements, and creator collabs.',
      bgGradient: 'from-[#e056fd] via-[#a855f7] to-[#10b981]',
      glowColor: '#e056fd',
      badgeBg: 'bg-[#e056fd]',
      icon: Crown,
    },
    {
      id: 5,
      title: 'Revenue Engine & Sales Enablement',
      subtitle: 'Founder-led funnels, objection-handling video assets, and ROI attribution.',
      bgGradient: 'from-[#a855f7] via-[#7e22ce] to-[#1d4ed8]',
      glowColor: '#a855f7',
      badgeBg: 'bg-[#a855f7]',
      icon: Target,
    },
  ]

  return (
    <section className="py-20 md:py-32 px-6 md:px-16 w-full text-[#111111] bg-[#fafafa] relative overflow-hidden scroll-mt-24 border-y border-black/5">
      <div className="max-w-[1300px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <h2 className="text-3xl max-md:text-2xl md:text-5xl font-black tracking-tight text-[#111111]">
            The <span className="text-[#888888]">Complete Production Stack</span>
          </h2>
          <p className="text-[#666666] text-base md:text-lg max-w-xl mx-auto">
            Five integrated layers engineered to elevate founder authority from positioning to revenue attribution.
          </p>
        </div>

        {/* 3D Interactive Isometric Stack Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-5xl mx-auto">
          
          {/* Left Column: 3D Isometric Stack Graphic */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center py-4 relative">
            <div className="relative w-full max-w-xs h-[420px] flex flex-col items-center justify-center">
              
              {/* Stacked 3D Isometric Plates */}
              {layers.map((layer, index) => {
                const isActive = activeLayer === layer.id
                const IconComp = layer.icon

                return (
                  <motion.div
                    key={layer.id}
                    onMouseEnter={() => setActiveLayer(layer.id)}
                    onMouseLeave={() => setActiveLayer(null)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    style={{
                      zIndex: 10 - index,
                      marginTop: index === 0 ? 0 : -28,
                    }}
                    animate={{
                      y: isActive ? -12 : 0,
                      scale: isActive ? 1.06 : 1,
                    }}
                    className={`w-64 md:w-72 h-20 rounded-2xl bg-gradient-to-r ${layer.bgGradient} p-0.5 shadow-lg transition-all duration-300 cursor-pointer relative group`}
                  >
                    {/* Inner 3D Plate Glass Fill */}
                    <div className="w-full h-full rounded-[0.9rem] bg-white/25 backdrop-blur-md border border-white/40 px-5 py-3.5 flex items-center justify-between text-white shadow-inner">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-center text-xs font-mono font-bold text-white shadow-xs">
                          0{layer.id}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold font-sans tracking-wide text-white drop-shadow-xs">
                            {layer.title.split(' ')[0]} {layer.title.split(' ')[1]}
                          </span>
                          <span className="text-[10px] text-white/80 font-mono">
                            Layer 0{layer.id}
                          </span>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>


          {/* Right Column: Pointer Cards */}
          <div className="lg:col-span-7 space-y-3.5">
            {layers.map((layer) => {
              const isActive = activeLayer === layer.id
              const IconComp = layer.icon

              return (
                <motion.div
                  key={layer.id}
                  onMouseEnter={() => setActiveLayer(layer.id)}
                  onMouseLeave={() => setActiveLayer(null)}
                  className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-4 ${
                    isActive
                      ? 'bg-white border-black shadow-xl translate-x-2'
                      : 'bg-white/80 border-black/10 hover:bg-white hover:border-black/20'
                  }`}
                >
                  {/* Layer Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-[#111111] text-white shadow-md scale-105'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    0{layer.id}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-bold transition-colors ${isActive ? 'text-black' : 'text-[#111111]'}`}>
                        {layer.title}
                      </h3>
                      <IconComp
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-black' : 'text-neutral-400'
                        }`}
                      />
                    </div>
                    <p className="text-xs text-[#666666] leading-relaxed">
                      {layer.subtitle}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}
