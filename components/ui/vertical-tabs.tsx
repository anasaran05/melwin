"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export interface TabItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

const DEFAULT_SERVICES: TabItem[] = [
  {
    id: "01",
    title: "Founder-to-Founder Circles",
    description:
      "Unfiltered, confidential peer advisory groups. Get direct insights on hiring executives, term sheet negotiations, and enterprise sales from founders who did it.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "Private Dinners & Masterminds",
    description:
      "Curated, closed-door dinners in Bangalore, Dubai, London, and Singapore with fellow top operators, angel investors, and venture partners.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "03",
    title: "Company Showcases & Demo Days",
    description:
      "Present your product directly to an exclusive syndicate of tier-1 angels, syndicate leads, and enterprise buyers looking to adopt new technology.",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "04",
    title: "23,000+ Operator Community",
    description:
      "Direct access to vetted WhatsApp circles, private resource archives, pitch teardowns, and instant co-founder/advisory matchmaking.",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "05",
    title: "Zero Noise, High Signal",
    description:
      "Strict vetting criteria ensures discussions stay actionable. No spam, no low-effort pitches, only high-conviction collaboration.",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "06",
    title: "1-on-1 Strategy with Dr. Melwin",
    description:
      "Quarterly strategic audits, growth diagnosis, and direct introductions across global health, education, and venture capital networks.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop",
  },
];

const AUTO_PLAY_DURATION = 5000;

interface VerticalTabsProps {
  items?: TabItem[];
  title?: string;
  badge?: string;
  className?: string;
}

export function VerticalTabs({
  items = DEFAULT_SERVICES,
  title = "Why the World’s Best Founders Join",
  badge = "MEMBERSHIP EXPERIENCE",
  className,
}: VerticalTabsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
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

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <section ref={sectionRef} className={cn("w-full py-12 md:py-20 lg:py-28", className)}>
      <div className="w-full max-w-7xl px-4 md:px-8 lg:px-12 mx-auto">
        {/* Full Width Center-Aligned Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 md:mb-16 lg:mb-20">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#666666] block">
            ({badge})
          </span>
          <h2 className="tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#111111] leading-[1.08]">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Content Tabs */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
            <div className="flex flex-col space-y-0">
              {items.map((service, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleTabClick(index)}
                    className={cn(
                      "group relative flex items-start gap-4 py-5 md:py-6 text-left transition-all duration-300 border-t border-black/10 first:border-0",
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
                            <p className="text-[#555555] text-xs sm:text-sm font-normal leading-relaxed max-w-md pb-2 pt-1">
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

          {/* Right Column: Dynamic Visual Showcase with controls */}
          <div className="lg:col-span-7 flex flex-col justify-center h-full order-1 lg:order-2">
            <div
              className="relative group/gallery"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative aspect-4/3 sm:aspect-16/11 lg:aspect-16/11 rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-neutral-900 border border-black/10 shadow-2xl">
                <AnimatePresence
                  initial={false}
                  custom={direction}
                  mode="popLayout"
                >
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      y: { type: "spring", stiffness: 260, damping: 32 },
                      opacity: { duration: 0.4 },
                    }}
                    className="absolute inset-0 w-full h-full cursor-pointer"
                    onClick={handleNext}
                  >
                    <img
                      src={items[activeIndex].image}
                      alt={items[activeIndex].title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 m-0 p-0 block select-none"
                    />

                    {/* Gradient Overlay & Active Benefit Title Pill */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 md:p-8">
                      <div className="space-y-1 text-white">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-white/70 uppercase">
                          FEATURED BENEFIT /{items[activeIndex].id}
                        </span>
                        <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-sm">
                          {items[activeIndex].title}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Left / Right Carousel Navigation Controls */}
                <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex gap-2 md:gap-3 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-black backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all active:scale-90 hover:scale-105"
                    aria-label="Previous Benefit"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-black backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all active:scale-90 hover:scale-105"
                    aria-label="Next Benefit"
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerticalTabs;
