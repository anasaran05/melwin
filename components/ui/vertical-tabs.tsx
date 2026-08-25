"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  title: string;
  description: string;
  image?: string;
}

const DEFAULT_SERVICES: TabItem[] = [
  {
    id: "01",
    title: "Founder Podcasts",
    description:
      "Exclusive deep-dive founder stories, tactical growth breakdowns, and raw insights broadcasted across premier entrepreneurial media channels.",
  },
  {
    id: "02",
    title: "Founder Conferences",
    description:
      "Flagship annual summits, regional conclaves, and high-impact stages bringing together Tamil Nadu's boldest visionaries and industry pioneers.",
  },
  {
    id: "03",
    title: "Funding & Investment Access",
    description:
      "Direct bridge to angel syndicates, institutional VCs, seed funds, and grant programs actively deploying capital in emerging ventures.",
  },
  {
    id: "04",
    title: "Expert Masterclasses",
    description:
      "Hands-on tactical workshops on scale, unit economics, regulatory compliance, product architecture, and enterprise sales led by proven operators.",
  },
  {
    id: "05",
    title: "Access to Top Agencies",
    description:
      "Curated partnerships with elite design studios, tech talent providers, PR firms, and legal/tax advisors at pre-negotiated founder rates.",
  },
  {
    id: "06",
    title: "Founder Networking",
    description:
      "High-signal closed-door meetups, peer advisory circles, and regional chapter gatherings with fellow relentless builders and mentors.",
  },
  {
    id: "07",
    title: "Business Opportunities",
    description:
      "Unlock B2B vendor deals, institutional pilots, cross-border expansions, government enterprise connects, and co-creation synergies.",
  },
];

const AUTO_PLAY_DURATION = 5000;

interface VerticalTabsProps {
  items?: TabItem[];
  title?: React.ReactNode;
  badge?: string;
  className?: string;
}

export function VerticalTabs({
  items = DEFAULT_SERVICES,
  title = (
    <>
      Be a part of the most reliable startup ecosystem of{" "}
      <span className="font-semibold tracking-normal">தமிழ்நாடு</span>
    </>
  ),
  badge = "MEMBERSHIP EXPERIENCE",
  className,
}: VerticalTabsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setIsPaused(false);
  };

  useEffect(() => {
    // If paused by user or if the section is not visible in the viewport, pause the autoplay animation
    if (isPaused || !isInView) return;

    const interval = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_DURATION);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, isInView, handleNext]);

  return (
    <section ref={sectionRef} className={cn("w-full py-12 md:py-20 lg:py-28", className)}>
      <div className="w-full max-w-5xl px-4 md:px-8 lg:px-12 mx-auto">
        {/* Full Width Center-Aligned Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 md:mb-16 lg:mb-20">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#666666] block">
            ({badge})
          </span>
          <h2 className="tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#111111] leading-[1.08]">
            {title}
          </h2>
        </div>

        {/* Content Tabs */}
        <div
          className="max-w-3xl mx-auto flex flex-col space-y-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {items.map((service, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={service.id}
                onClick={() => handleTabClick(index)}
                className={cn(
                  "group relative flex items-start gap-4 py-4 md:py-5 text-left transition-all duration-300 border-t border-black/10 first:border-0",
                  isActive
                    ? "text-[#111111]"
                    : "text-neutral-400 hover:text-neutral-800"
                )}
              >
                <div className="absolute left-[-16px] md:left-[-20px] top-0 bottom-0 w-[2.5px] bg-black/10 rounded-full overflow-hidden">
                  {isActive && (
                    <motion.div
                      key={`progress-${index}-${isPaused}-${isInView}`}
                      className="absolute top-0 left-0 w-full bg-[#111111] origin-top"
                      initial={{ height: "0%" }}
                      animate={
                        isPaused || !isInView ? { height: "0%" } : { height: "100%" }
                      }
                      transition={{
                        duration: AUTO_PLAY_DURATION / 1000,
                        ease: "linear",
                      }}
                    />
                  )}
                </div>

                <span className="text-[10px] md:text-xs font-mono font-bold mt-1 tabular-nums opacity-60">
                  /{service.id}
                </span>

                <div className="flex flex-col gap-1.5 flex-1">
                  <span
                    className={cn(
                      "text-xl md:text-2xl lg:text-3xl font-bold tracking-tight transition-colors duration-300",
                      isActive ? "text-[#111111]" : "text-neutral-400"
                    )}
                  >
                    {service.title}
                  </span>

                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.23, 1, 0.32, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <p className="text-[#555555] text-sm sm:text-base font-normal leading-relaxed max-w-2xl pb-2 pt-1">
                          {service.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default VerticalTabs;
