import { Hero } from '@/components/hero'
import { BioSection } from '@/components/bio-section'
import { QuoteSection } from '@/components/quote-section'
import { ServicesGrid } from '@/components/services-grid'
import { ExpertiseStrip } from '@/components/expertise-strip'
import { FAQ } from '@/components/faq'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden">
      <div className="grain-overlay" />
      <Hero />
      <BioSection />
      <QuoteSection />
      <ExpertiseStrip />
      <ServicesGrid />
      <FAQ />
      <Footer />
    </main>
  )
}
