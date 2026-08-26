"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ArrowUpRight } from "lucide-react"

export interface Project {
  title: string
  description: string
  year: string
  link: string
  image: string
  category?: string
}

interface ProjectShowcaseProps {
  projects?: Project[]
  title?: string
  className?: string
}

export function ProjectShowcase({
  projects = [],
  title = "Selected Work",
  className = "",
}: ProjectShowcaseProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition])

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    })
  }

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setIsVisible(false)
  }

  return (
    <section 
      onMouseMove={handleMouseMove} 
      className={`relative w-full max-w-4xl mx-auto px-6 py-8 ${className}`}
    >
      <h2 className="text-neutral-500 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-8">
        {title}
      </h2>

      {/* Floating Cursor-Follower Preview Box */}
      <div
        className="pointer-events-none fixed z-50 left-0 top-0 overflow-hidden rounded-2xl shadow-2xl"
        style={{
          transform: `translate3d(${smoothPosition.x + 24}px, ${smoothPosition.y - 120}px, 0)`,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="relative w-[320px] h-[210px] bg-neutral-900 rounded-2xl overflow-hidden border border-black/20 shadow-2xl">
          {projects.map((project, index) => (
            <img
              key={project.title}
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
              style={{
                opacity: hoveredIndex === index ? 1 : 0,
                transform: hoveredIndex === index ? "scale(1)" : "scale(1.08)",
                filter: hoveredIndex === index ? "none" : "blur(8px)",
              }}
            />
          ))}
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      </div>

      <div className="space-y-0">
        {projects.map((project, index) => (
          <a
            key={project.title}
            href={project.link}
            target={project.link.startsWith("http") ? "_blank" : undefined}
            rel={project.link.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group block"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative py-6 border-t border-black/10 transition-all duration-300 ease-out">
              {/* Background highlight on hover */}
              <div
                className={`
                  absolute inset-0 -mx-4 px-4 bg-black/[0.04] rounded-xl
                  transition-all duration-300 ease-out
                  ${hoveredIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                `}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 pr-4">
                  {/* Title with animated underline */}
                  <div className="inline-flex items-center gap-2">
                    <h3 className="text-[#111111] font-semibold text-lg sm:text-xl tracking-tight">
                      <span className="relative">
                        {project.title}
                        {/* Animated underline */}
                        <span
                          className={`
                            absolute left-0 -bottom-0.5 h-px bg-black
                            transition-all duration-300 ease-out
                            ${hoveredIndex === index ? "w-full" : "w-0"}
                          `}
                        />
                      </span>
                    </h3>

                    {/* Arrow that slides in */}
                    <ArrowUpRight
                      className={`
                        w-4 h-4 text-neutral-400
                        transition-all duration-300 ease-out
                        ${
                          hoveredIndex === index
                            ? "opacity-100 translate-x-0 translate-y-0 text-black"
                            : "opacity-0 -translate-x-2 translate-y-2"
                        }
                      `}
                    />
                  </div>

                  {/* Description with fade effect */}
                  <p
                    className={`
                      text-neutral-600 text-xs sm:text-sm mt-1.5 leading-relaxed
                      transition-all duration-300 ease-out
                      ${hoveredIndex === index ? "text-[#111111]" : "text-neutral-600"}
                    `}
                  >
                    {project.description}
                  </p>
                </div>

                {/* Year / Category badge */}
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  {project.category && (
                    <span className="hidden sm:inline-block text-[11px] font-mono px-2.5 py-1 rounded-full bg-white border border-black/10 text-neutral-800 shadow-2xs">
                      {project.category}
                    </span>
                  )}
                  <span
                    className={`
                      text-xs font-mono text-neutral-400 tabular-nums
                      transition-all duration-300 ease-out
                      ${hoveredIndex === index ? "text-[#111111] font-bold" : ""}
                    `}
                  >
                    {project.year}
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}

        {/* Bottom border for last item */}
        <div className="border-t border-black/10" />
      </div>
    </section>
  )
}
export default ProjectShowcase
