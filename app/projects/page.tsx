import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProjectsSection } from '@/components/projects-section'

export default function ProjectsPage() {
  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden flex flex-col bg-[#f2f2f2]">
      <div className="grain-overlay" />
      <Navbar />
      <div className="flex-1 pt-20 md:pt-24">
        <ProjectsSection hideViewAll={true} title="All Projects" />
      </div>
      <Footer />
    </main>
  )
}
