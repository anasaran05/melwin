import { Hero } from '@/components/hero'
import { BioSection } from '@/components/bio-section'
import { QuoteSection } from '@/components/quote-section'
import { ServicesGrid } from '@/components/services-grid'
import { ProjectsSection } from '@/components/projects-section'
import { ExpertiseStrip } from '@/components/expertise-strip'
import { SocialProof } from '@/components/social-proof'
import { FAQ } from '@/components/faq'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

export default function Home() {
  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden">
      <div className="grain-overlay" />
      <Navbar />
      <Hero />
      <BioSection />
      <QuoteSection />
      <ServicesGrid />
      <ProjectsSection />
      <ExpertiseStrip />
      <SocialProof />
      <FAQ />
      <Footer />
    </main>
  )
}
