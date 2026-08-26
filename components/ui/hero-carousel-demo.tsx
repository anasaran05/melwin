"use client"

import * as React from "react"
import {   
  HeroCarousel,
  type HeroCarouselItem,
} from "@/components/ui/hero-carousel"

const LOOKS: HeroCarouselItem[] = [
  {
    title: "Modern\nWeb Experience",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    credit: "BY ATOM SE DIGITAL.",
    meta: ["NEXT.JS", "TAILWIND", "GLOBAL"],
    accent: "#6366f1",
  },
  {
    title: "High Performance\nE-Commerce",
    image: "https://images.unsplash.com/photo-1556742049-0a67e55722c0?auto=format&fit=crop&w=1400&q=80",
    credit: "BY ATOM SE COMMERCE.",
    meta: ["CONVERSION", "PAYMENTS", "SCALE"],
    accent: "#ff4114",
  },
  {
    title: "Bespoke\nDigital Platforms",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    credit: "BY ATOM SE LABS.",
    meta: ["REACT", "FULLSTACK", "CLOUD"],
    accent: "#00c8ff",
  },
  {
    title: "Google Search\nDominance",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1400&q=80",
    credit: "BY ATOM SE GROWTH.",
    meta: ["SEO", "CORE VITALS", "TRAFFIC"],
    accent: "#e5231b",
  },
  {
    title: "Brand Identity\n& Systems",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=80",
    credit: "BY ATOM SE DESIGN.",
    meta: ["UI / UX", "DESIGN SYSTEM", "PREMIUM"],
    accent: "#2f7bff",
  },
  {
    title: "Cinematic\nCreative Motion",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    credit: "BY ATOM SE MOTION.",
    meta: ["FRAMER", "MICRO-INTERACTIONS", "3D"],
    accent: "#ff2f9c",
  },
  {
    title: "Cloud & Data\nArchitecture",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
    credit: "BY ATOM SE INFRA.",
    meta: ["POSTGRESQL", "AWS", "DEV-OPS"],
    accent: "#4356c8",
  },
]

export default function DemoOne() {
  return (
    <div className="w-full h-[600px] sm:h-[700px] md:h-[800px] relative">
      <HeroCarousel
        items={LOOKS}
        defaultIndex={2}
        brand="ATOM SE"
        autoplay={true}
        autoplayDelay={5000}
        onBack={() => {}}
        onMenu={() => {}}
      />
    </div>
  )
}
