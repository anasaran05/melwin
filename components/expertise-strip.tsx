'use client'

const EXPERTISE_ITEMS = [
  'Zero-Capital Execution',
  'Venture Zero-to-One',
  'Pitch Deck Architecture',
  'International Pipelines',
  'Career Repositioning',
  'Global Distribution',
]

export function ExpertiseStrip() {
  const items = [...EXPERTISE_ITEMS, ...EXPERTISE_ITEMS]

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-zinc-50 border-y border-zinc-200 overflow-hidden">
      <div className="marquee">
        <div className="marquee-content">
          {items.map((item, idx) => (
            <span
              key={`${idx}-${item}`}
              className="font-sans font-medium text-sm md:text-base text-zinc-400 whitespace-nowrap hover:text-zinc-900 transition-colors uppercase tracking-widest"
            >
              {item} •
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
