'use client'

import { motion } from 'framer-motion'
import { Sparkles, Video, Linkedin, Youtube, Camera, FileText, Target, Mic, Compass } from 'lucide-react'

type FeatureCard = {
  title: string
  description: string
  bgColor: string
  accentColor: string
  icon: React.ElementType
  badgeText: string
  previewContent: React.ReactNode
}

export function AgencyFeaturesGrid() {
  const features: FeatureCard[] = [
    {
      title: 'Brand Positioning Strategy',
      description: 'Define your unique authority angle, voice, and audience positioning framework.',
      bgColor: 'bg-[#a855f7]',
      accentColor: 'text-[#a855f7]',
      icon: Compass,
      badgeText: 'STRATEGY',
      previewContent: (
        <div className="bg-white/95 rounded-xl p-3 shadow-md border border-black/5 text-[#111111] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-purple-600">
            <span>POSITIONING MAP</span>
            <span>100% ACCELERATION</span>
          </div>
          <div className="w-full bg-purple-50 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full w-[85%]" />
          </div>
          <span className="block text-[11px] font-bold">Category Leadership</span>
        </div>
      ),
    },
    {
      title: 'Reels & Short-Form Content',
      description: '10 to 15 high-retention Reels & Shorts designed for viral reach and brand awareness.',
      bgColor: 'bg-[#22c55e]',
      accentColor: 'text-[#22c55e]',
      icon: Video,
      badgeText: 'SHORT-FORM',
      previewContent: (
        <div className="bg-white/95 rounded-xl p-3 shadow-md border border-black/5 text-[#111111] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-600">
            <span>RETENTION HOOK</span>
            <span>+85k VIEWS</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
              ▶
            </div>
            <span className="text-[11px] font-bold text-slate-800">Dynamic Captions & FX</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Long-Form YouTube Videos',
      description: '2 to 6 deep-dive authority videos per month with custom thumbnails and chapters.',
      bgColor: 'bg-[#f95738]',
      accentColor: 'text-[#f95738]',
      icon: Youtube,
      badgeText: 'YOUTUBE',
      previewContent: (
        <div className="bg-white/95 rounded-xl p-3 shadow-md border border-black/5 text-[#111111] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-orange-600">
            <span>FULL PRODUCTION</span>
            <span>4K EDITING</span>
          </div>
          <div className="bg-slate-900 text-white p-2 rounded-lg text-[10px] font-mono flex items-center justify-between">
            <span>Episode Script #04</span>
            <span className="text-orange-400 font-bold">READY</span>
          </div>
        </div>
      ),
    },
    {
      title: 'LinkedIn Thought Leadership',
      description: '3 to 5 targeted executive posts per week to establish B2B authority and drive inbound.',
      bgColor: 'bg-[#0a66c2]',
      accentColor: 'text-[#0a66c2]',
      icon: Linkedin,
      badgeText: 'LINKEDIN',
      previewContent: (
        <div className="bg-white/95 rounded-xl p-3 shadow-md border border-black/5 text-[#111111] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-blue-600">
            <span>B2B ENGAGEMENT</span>
            <span>HIGH INTENT</span>
          </div>
          <span className="block text-[11px] font-semibold text-slate-800">
            "How we scaled without paid ads..."
          </span>
        </div>
      ),
    },
    {
      title: 'End-to-End Physical Shoots',
      description: 'Up to 3 dedicated shoot days per month with on-site camera, lighting, and direct coaching.',
      bgColor: 'bg-[#f95738]',
      accentColor: 'text-[#f95738]',
      icon: Camera,
      badgeText: 'ON-SET DFY',
      previewContent: (
        <div className="bg-white/95 rounded-xl p-3 shadow-md border border-black/5 text-[#111111] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-orange-600">
            <span>SHOOT DAY</span>
            <span>6 HOURS ON SET</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Multi-Cam & Lighting Setup</span>
          </div>
        </div>
      ),
    },
    {
      title: 'SEO & Blog Articles',
      description: '2 long-form optimized articles every 10 days for keyword rank and generative AI search.',
      bgColor: 'bg-[#a855f7]',
      accentColor: 'text-[#a855f7]',
      icon: FileText,
      badgeText: 'SEO & AEO',
      previewContent: (
        <div className="bg-white/95 rounded-xl p-3 shadow-md border border-black/5 text-[#111111] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-purple-600">
            <span>GOOGLE RANKING</span>
            <span>#1 PAGE</span>
          </div>
          <span className="block text-[11px] font-bold text-slate-800">2,500 Word Strategic Article</span>
        </div>
      ),
    },
    {
      title: 'Founder Sales Enablement',
      description: 'Turn buyer objections into video assets that your sales team uses directly to close deals.',
      bgColor: 'bg-[#f95738]',
      accentColor: 'text-[#f95738]',
      icon: Target,
      badgeText: 'REVENUE ENGINE',
      previewContent: (
        <div className="bg-white/95 rounded-xl p-3 shadow-md border border-black/5 text-[#111111] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-orange-600">
            <span>SALES FUNNEL</span>
            <span>LEAD MAGNET</span>
          </div>
          <div className="bg-emerald-50 text-emerald-800 p-1.5 rounded-md text-[10px] font-bold">
            Objection Asset Sent → Deal Closed
          </div>
        </div>
      ),
    },
    {
      title: 'Executive PR & Podcasts',
      description: 'Active monthly pitching for creator collaborations, podcast guest spots, and media features.',
      bgColor: 'bg-[#22c55e]',
      accentColor: 'text-[#22c55e]',
      icon: Mic,
      badgeText: 'MEDIA & PR',
      previewContent: (
        <div className="bg-white/95 rounded-xl p-3 shadow-md border border-black/5 text-[#111111] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-600">
            <span>PODCAST OUTREACH</span>
            <span>MONTHLY PITCH</span>
          </div>
          <span className="block text-[11px] font-bold text-slate-800">Top 1% Industry Guest Spot</span>
        </div>
      ),
    },
  ]

  return (
    <section className="py-20 md:py-28 px-6 md:px-16 w-full text-[#111111] bg-white scroll-mt-24">
      <div className="max-w-[1300px] mx-auto">
        
        {/* Section Header matching reference */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl max-md:text-2xl md:text-5xl font-black tracking-tight text-[#111111]">
            Scale Your <span className="text-[#f95738]">Founder Authority</span>
          </h2>
          <p className="text-[#666666] text-base md:text-lg">
            Unlock your content's full potential with our end-to-end retainer architecture.
          </p>
        </div>

        {/* 4 Columns x 2 Rows Grid matching reference image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const IconComp = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-neutral-100/80 rounded-3xl p-4 flex flex-col justify-between border border-black/5 hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  {/* Top Graphic Banner */}
                  <div className={`${feature.bgColor} rounded-2xl p-5 mb-5 h-44 flex flex-col justify-between relative overflow-hidden shadow-inner`}>
                    
                    {/* Pattern Overlay Lines */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-[10px] font-mono font-extrabold tracking-widest text-white/90 bg-black/20 backdrop-blur-xs px-2.5 py-1 rounded-full">
                        {feature.badgeText}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Preview Interactive Box */}
                    <div className="relative z-10 transform group-hover:scale-[1.02] transition-transform">
                      {feature.previewContent}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="px-2 pb-2">
                    <h3 className="text-lg font-bold text-[#111111] mb-1.5 group-hover:text-[#f95738] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-[#666666] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
