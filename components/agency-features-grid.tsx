'use client'

import { motion } from 'framer-motion'
import { Video, Linkedin, Youtube, Camera, FileText, Target, Mic, Compass, Sparkles, TrendingUp, Play, CheckCircle2 } from 'lucide-react'

type FeatureCard = {
  title: string
  subtitle: string
  description: string
  gradient: string
  accentText: string
  icon: React.ElementType
  badgeText: string
  previewContent: React.ReactNode
}

export function AgencyFeaturesGrid() {
  const features: FeatureCard[] = [
    {
      title: 'Brand Positioning Strategy',
      subtitle: 'Category Leadership & Story',
      description: 'Define your unique authority angle, tone of voice, and audience positioning framework.',
      gradient: 'from-[#8b5cf6] via-[#a855f7] to-[#ec4899]',
      accentText: 'text-[#8b5cf6]',
      icon: Compass,
      badgeText: 'STRATEGY',
      previewContent: (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-white/60 text-[#111111] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-purple-700">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600" />
              AUTHORITY MAP
            </span>
            <span className="bg-purple-100 px-2 py-0.5 rounded-full text-purple-800">100% ACCELERATED</span>
          </div>
          <div className="w-full bg-purple-100/80 h-2.5 rounded-full overflow-hidden p-0.5">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-full w-[90%] rounded-full animate-pulse" />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-900">Category Dominance</span>
            <span className="font-mono text-purple-600 font-bold">TOP 1%</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Reels & Short-Form Content',
      subtitle: 'Viral Reach & High Retention',
      description: '10 to 15 high-retention Reels & Shorts designed for organic reach and brand awareness.',
      gradient: 'from-[#10b981] via-[#059669] to-[#047857]',
      accentText: 'text-[#10b981]',
      icon: Video,
      badgeText: 'SHORT-FORM',
      previewContent: (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-white/60 text-[#111111] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-700">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              RETENTION HOOK
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">+125k VIEWS</span>
          </div>
          <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Play className="w-3 h-3 fill-white" />
              </div>
              <span className="text-[11px] font-bold text-slate-900">Dynamic Captions & FX</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">4K 60FPS</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Long-Form YouTube Videos',
      subtitle: 'Deep Authority & Subscribers',
      description: '2 to 6 deep-dive authority videos per month with custom thumbnails and timestamps.',
      gradient: 'from-[#1e293b] via-[#334155] to-[#0f172a]',
      accentText: 'text-neutral-800',
      icon: Youtube,
      badgeText: 'YOUTUBE',
      previewContent: (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-white/60 text-[#111111] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-neutral-700">
            <span>CINEMA PRODUCTION</span>
            <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-full font-bold">4K EDIT</span>
          </div>
          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-[10px] font-mono flex items-center justify-between shadow-inner">
            <span className="truncate max-w-[140px]">Episode Script #04</span>
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
              READY
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'LinkedIn Thought Leadership',
      subtitle: 'B2B Authority & Inbound Leads',
      description: '3 to 5 targeted executive posts per week to establish B2B authority and drive inbound.',
      gradient: 'from-[#0284c7] via-[#0369a1] to-[#1e3a8a]',
      accentText: 'text-[#0284c7]',
      icon: Linkedin,
      badgeText: 'LINKEDIN',
      previewContent: (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-white/60 text-[#111111] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-sky-700">
            <span>EXECUTIVE CADENCE</span>
            <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">HIGH INTENT</span>
          </div>
          <div className="bg-sky-50/80 p-2 rounded-xl border border-sky-100">
            <span className="block text-[11px] font-semibold text-slate-800 line-clamp-1">
              "How we scaled without paid ads..."
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'End-to-End Physical Shoots',
      subtitle: 'On-Set DFY & Live Coaching',
      description: 'Up to 3 dedicated shoot days per month with on-site multi-cam, studio lighting, and direct coaching.',
      gradient: 'from-[#18181b] via-[#27272a] to-[#09090b]',
      accentText: 'text-neutral-900',
      icon: Camera,
      badgeText: 'ON-SET DFY',
      previewContent: (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-white/60 text-[#111111] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-neutral-700">
            <span>PHYSICAL SHOOT DAY</span>
            <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-full font-bold">6H ON SET</span>
          </div>
          <div className="flex items-center justify-between bg-neutral-900 text-white p-2 rounded-xl text-[10px]">
            <div className="flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Multi-Cam & Lighting</span>
            </div>
            <span className="font-mono text-emerald-400 font-bold">LIVE</span>
          </div>
        </div>
      ),
    },
    {
      title: 'SEO & Blog Articles',
      subtitle: 'AEO & Search Engine Traffic',
      description: '2 long-form optimized articles every 10 days for keyword rank and generative AI search.',
      gradient: 'from-[#a855f7] via-[#9333ea] to-[#4c1d95]',
      accentText: 'text-[#a855f7]',
      icon: FileText,
      badgeText: 'SEO & AEO',
      previewContent: (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-white/60 text-[#111111] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-purple-700">
            <span>GOOGLE RANKING</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">#1 PAGE</span>
          </div>
          <div className="bg-purple-50 p-2 rounded-xl border border-purple-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-900">2,500-Word Article</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
          </div>
        </div>
      ),
    },
    {
      title: 'Founder Sales Enablement',
      subtitle: 'Objection Handling & ROI',
      description: 'Turn buyer objections into video assets that your sales team uses directly to close high-ticket deals.',
      gradient: 'from-[#0f172a] via-[#1e293b] to-[#334155]',
      accentText: 'text-neutral-900',
      icon: Target,
      badgeText: 'REVENUE ENGINE',
      previewContent: (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-white/60 text-[#111111] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-neutral-700">
            <span>SALES FUNNEL</span>
            <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-full font-bold">LEAD MAGNET</span>
          </div>
          <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl text-[10px] font-bold border border-emerald-200 flex items-center justify-between">
            <span>Objection Asset Sent</span>
            <span className="font-mono text-emerald-700 font-extrabold">DEAL CLOSED</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Executive PR & Podcasts',
      subtitle: 'Industry Authority & Features',
      description: 'Active monthly pitching for creator collaborations, podcast guest spots, and media features.',
      gradient: 'from-[#14b8a6] via-[#0d9488] to-[#0f766e]',
      accentText: 'text-[#14b8a6]',
      icon: Mic,
      badgeText: 'MEDIA & PR',
      previewContent: (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-white/60 text-[#111111] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-teal-700">
            <span>PODCAST OUTREACH</span>
            <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">PITCH ACTIVE</span>
          </div>
          <div className="bg-teal-50 p-2 rounded-xl border border-teal-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-900">Top 1% Podcast Guest</span>
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-3 bg-teal-500 rounded-full animate-bounce" />
              <span className="w-1 h-4 bg-teal-600 rounded-full animate-bounce delay-100" />
              <span className="w-1 h-2 bg-teal-400 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section className="py-12 md:py-32 px-4 sm:px-6 md:px-16 w-full text-[#111111] relative overflow-hidden scroll-mt-24 border-b border-black/5">
      
      {/* Background ambient mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-neutral-500/5 via-blue-500/5 to-purple-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-[1350px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/10 text-[#666666] text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXECUTIVE DELIVERABLES MATRIX</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-[#111111]">
            Scale Your <span className="text-[#888888]">Founder Authority</span>
          </h2>
          <p className="text-[#666666] text-xs sm:text-base md:text-lg max-w-xl mx-auto">
            Eight specialized media & sales engines integrated into a seamless monthly retainer.
          </p>
        </div>

        {/* 4 Columns x 2 Rows Premium Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const IconComp = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-black/10 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Accent glow line on top border */}
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />

                <div>
                  {/* Top Graphic Banner */}
                  <div className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-5 mb-5 h-48 flex flex-col justify-between relative overflow-hidden shadow-md group-hover:shadow-lg transition-shadow`}>
                    
                    {/* Subtle grid pattern overlay */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1.2px,transparent_1.2px)] [background-size:14px_14px] pointer-events-none" />

                    {/* Top Row: Badge & Floating Icon */}
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-[10px] font-mono font-extrabold tracking-widest text-white bg-black/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-xs">
                        {feature.badgeText}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 shadow-xs group-hover:scale-110 transition-transform">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Interactive Preview Box */}
                    <div className="relative z-10 transform group-hover:scale-[1.03] transition-transform duration-300">
                      {feature.previewContent}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="px-2 pb-2">
                    <div className="mb-1">
                      <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                        {feature.subtitle}
                      </span>
                      <h3 className="text-lg font-extrabold text-[#111111] group-hover:text-black transition-colors leading-snug">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#666666] leading-relaxed pt-1">
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
