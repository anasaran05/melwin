import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const projects = [
  {
    title: "Zane ProEd",
    category: "Edu-Tech",
    color: "from-fuchsia-200 to-purple-300",
    image: "/zaneproed.png",
    link: "https://zaneproed.com"
  },
  {
    title: "Alphatic Labs",
    category: "Patient Management Software Company",
    color: "from-sky-100 to-blue-200",
    image: "/alphaticlabs.png",
    link: "https://alphaticlabs.com"
  }
]

interface ProjectsSectionProps {
  hideViewAll?: boolean;
  title?: React.ReactNode;
}

export function ProjectsSection({ hideViewAll = false, title = <>Featured<br />Projects</> }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-24 max-md:py-16 md:py-32 px-6 max-md:px-4 md:px-12 bg-[#f2f2f2]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative">
          <h2 className="text-5xl max-md:text-4xl md:text-7xl font-medium tracking-tight text-[#111111] leading-[1.1] whitespace-pre-line">
            {title}
          </h2>
          {!hideViewAll && (
            <Link href="/projects" className="flex items-center gap-2 text-sm font-medium text-[#111111] hover:opacity-70 transition-opacity pb-2 md:pb-4">
              View All Work 
              <div className="border border-neutral-300 rounded p-0.5">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12 max-md:gap-y-8 md:gap-x-10 md:gap-y-16">
          {projects.map((project, index) => (
            <div key={index} className="group cursor-pointer flex flex-col gap-4">
              <div className={`w-full aspect-[4/3] max-md:aspect-[1/1] rounded-[32px] bg-gradient-to-br ${project.color} overflow-hidden relative transition-transform duration-500 group-hover:scale-[1.02] shadow-sm flex items-end justify-center pt-8 px-8 max-md:pt-6 max-md:px-6 md:pt-12 md:px-12`}>
                {project.image ? (
                  <div className="relative w-full h-full rounded-t-2xl overflow-hidden shadow-2xl border border-black/5">
                    <Image 
                      src={project.image} 
                      alt={project.title} 
                      fill 
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full rounded-t-2xl overflow-hidden bg-white/20 shadow-2xl backdrop-blur-sm border border-white/30" />
                )}
                {/* Overlay for hover effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-black pointer-events-none" />
              </div>
              <div className="px-2 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl max-md:text-xl font-medium text-[#111111]">{project.title}</h3>
                  <p className="text-gray-500 mt-1">{project.category}</p>
                </div>
                {project.link && (
                  <Link 
                    href={project.link}
                    target="_blank"
                    className="flex items-center gap-1 text-sm font-medium bg-[#111111] text-white px-4 py-2 rounded-full hover:bg-black/80 transition-colors"
                  >
                    View <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
