'use client'

import { Card } from '@/components/ui/card'

const reviews = [
  {
    id: 'VALIDATION-01',
    quote: 'Melwin helped us restructure our entire GTM strategy. What took our team 3 months to conceptualize, he debugged in a single call.',
    attribution: '— Founder, AI-First Startup',
  },
  {
    id: 'VALIDATION-02',
    quote: 'The pitch deck he architected secured us commitments from tier-1 investors. Pure clarity and impact.',
    attribution: '— CEO, Deep Tech Venture',
  },
  {
    id: 'VALIDATION-03',
    quote: 'Career repositioning advice that actually led to a role that aligned with my vision, not just a salary bump.',
    attribution: '— Engineer, Healthcare Tech',
  },
]

export function SocialProof() {
  return (
    <section className="py-20 md:py-32 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest mb-12">// Validation</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="border border-zinc-200 bg-zinc-50 p-8 rounded-2xl space-y-6 shadow-sm"
            >
              <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest">{review.id}</p>
              <p className="font-sans font-medium text-lg leading-relaxed text-zinc-900 text-pretty">&ldquo;{review.quote}&rdquo;</p>
              <p className="font-sans text-xs text-zinc-500 font-medium uppercase tracking-wide">{review.attribution}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
