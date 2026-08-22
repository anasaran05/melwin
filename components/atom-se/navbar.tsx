'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  MotionNavigationMenu,
  MotionNavigationMenuContent,
  MotionNavigationMenuItem,
  MotionNavigationMenuLink,
  MotionNavigationMenuList,
  MotionNavigationMenuTrigger,
} from '@/components/ui/motion-navigation-menu'
import {
  Globe,
  Sparkles,
  Cpu,
  Layers,
  Bot,
  Workflow,
  Code2,
  Server,
  Rocket,
  Zap,
  TrendingUp,
  Mail,
  Wrench,
  BookOpen,
  Award,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  DollarSign,
  ShoppingBag,
  BarChart3,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'

export function AtomSeNavbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY <= 60) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollYRef.current + 8) {
        setIsVisible(false)
        setMobileMenuOpen(false)
      } else if (currentScrollY < lastScrollYRef.current - 8) {
        setIsVisible(true)
      }
      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="relative flex items-center justify-between min-h-[48px]">
          {/* 1. Left: Atom SE Logo */}
          <div className="flex-shrink-0 z-20">
            <Link href="/atom-se" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
              <Image
                src="/ventures logos/atomse.png"
                alt="Atom SE Logo"
                width={240}
                height={70}
                className="h-10 sm:h-12 md:h-13 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* 2. Center: Cloudflare-Style Mega Navigation Pill */}
          <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none">
            <div className="pointer-events-auto rounded-full border border-black/10 bg-white/90 backdrop-blur-xl px-3 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <MotionNavigationMenu
                viewportClassName="bg-white/95 border border-black/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
                springBounce={0}
                springStiffness={360}
                springDamping={30}
              >
                <MotionNavigationMenuList>
                  {/* --- 1. SOLUTIONS --- */}
                  <MotionNavigationMenuItem value="solutions">
                    <MotionNavigationMenuTrigger className="text-neutral-700 hover:text-neutral-950 data-[state=open]:text-neutral-950 text-xs uppercase tracking-wider font-semibold rounded-full px-3.5 py-1.5">
                      Solutions
                    </MotionNavigationMenuTrigger>
                    <MotionNavigationMenuContent highlightClassName="bg-neutral-100 rounded-xl">
                      <div className="w-[740px] p-2">
                        <div className="grid grid-cols-3 gap-3 p-1">
                          {/* Column 1: Websites & Software */}
                          <div className="space-y-1">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1 flex items-center gap-1.5">
                              <Globe className="size-3.5 text-emerald-600" />
                              Web & Software
                            </div>
                            <MotionNavigationMenuLink
                              href="#services"
                              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors group block"
                            >
                              <div className="text-xs font-semibold text-neutral-900 group-hover:text-emerald-700 flex items-center justify-between">
                                Custom Websites
                                <ArrowUpRight className="size-3 text-neutral-400 group-hover:text-emerald-600" />
                              </div>
                              <p className="text-neutral-500 text-[11px] mt-0.5 leading-snug">
                                Single-page & multi-page business websites.
                              </p>
                            </MotionNavigationMenuLink>
                            <MotionNavigationMenuLink
                              href="#services"
                              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors group block"
                            >
                              <div className="text-xs font-semibold text-neutral-900 group-hover:text-emerald-700 flex items-center justify-between">
                                E-Commerce Stores
                                <ArrowUpRight className="size-3 text-neutral-400 group-hover:text-emerald-600" />
                              </div>
                              <p className="text-neutral-500 text-[11px] mt-0.5 leading-snug">
                                Product catalogs, shopping carts & Stripe checkout.
                              </p>
                            </MotionNavigationMenuLink>
                            <MotionNavigationMenuLink
                              href="#services"
                              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors group block"
                            >
                              <div className="text-xs font-semibold text-neutral-900 group-hover:text-emerald-700 flex items-center justify-between">
                                Startup MVPs & SaaS
                                <ArrowUpRight className="size-3 text-neutral-400 group-hover:text-emerald-600" />
                              </div>
                              <p className="text-neutral-500 text-[11px] mt-0.5 leading-snug">
                                Custom software, client dashboards & portals.
                              </p>
                            </MotionNavigationMenuLink>
                          </div>

                          {/* Column 2: AI & Automations */}
                          <div className="space-y-1">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1 flex items-center gap-1.5">
                              <Sparkles className="size-3.5 text-amber-500" />
                              AI & Automations
                            </div>
                            <MotionNavigationMenuLink
                              href="#services"
                              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors group block"
                            >
                              <div className="text-xs font-semibold text-neutral-900 group-hover:text-amber-700 flex items-center justify-between">
                                <span>AI Blog Automation</span>
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">NEW</span>
                              </div>
                              <p className="text-neutral-500 text-[11px] mt-0.5 leading-snug">
                                Auto-generated SEO articles published to your site.
                              </p>
                            </MotionNavigationMenuLink>
                            <MotionNavigationMenuLink
                              href="#services"
                              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors group block"
                            >
                              <div className="text-xs font-semibold text-neutral-900 group-hover:text-amber-700 flex items-center justify-between">
                                Workflow Pipelines
                                <ArrowUpRight className="size-3 text-neutral-400 group-hover:text-amber-600" />
                              </div>
                              <p className="text-neutral-500 text-[11px] mt-0.5 leading-snug">
                                Lead sync, automated notifications & CRM setup.
                              </p>
                            </MotionNavigationMenuLink>
                            <MotionNavigationMenuLink
                              href="#services"
                              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors group block"
                            >
                              <div className="text-xs font-semibold text-neutral-900 group-hover:text-amber-700 flex items-center justify-between">
                                AI Support Assistants
                                <ArrowUpRight className="size-3 text-neutral-400 group-hover:text-amber-600" />
                              </div>
                              <p className="text-neutral-500 text-[11px] mt-0.5 leading-snug">
                                24/7 intelligent chat assistants for customer questions.
                              </p>
                            </MotionNavigationMenuLink>
                          </div>

                          {/* Column 3: Growth & Support */}
                          <div className="space-y-1">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1 flex items-center gap-1.5">
                              <ShieldCheck className="size-3.5 text-blue-600" />
                              Growth & Support
                            </div>
                            <MotionNavigationMenuLink
                              href="#services"
                              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors group block"
                            >
                              <div className="text-xs font-semibold text-neutral-900 group-hover:text-blue-700 flex items-center justify-between">
                                360° Technical SEO
                                <ArrowUpRight className="size-3 text-neutral-400 group-hover:text-blue-600" />
                              </div>
                              <p className="text-neutral-500 text-[11px] mt-0.5 leading-snug">
                                Boost Google search visibility and organic ranking.
                              </p>
                            </MotionNavigationMenuLink>
                            <MotionNavigationMenuLink
                              href="#services"
                              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors group block"
                            >
                              <div className="text-xs font-semibold text-neutral-900 group-hover:text-blue-700 flex items-center justify-between">
                                Domain & Email Setup
                                <ArrowUpRight className="size-3 text-neutral-400 group-hover:text-blue-600" />
                              </div>
                              <p className="text-neutral-500 text-[11px] mt-0.5 leading-snug">
                                Domain connection & professional business email.
                              </p>
                            </MotionNavigationMenuLink>
                            <MotionNavigationMenuLink
                              href="#services"
                              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors group block"
                            >
                              <div className="text-xs font-semibold text-neutral-900 group-hover:text-blue-700 flex items-center justify-between">
                                Website Maintenance
                                <ArrowUpRight className="size-3 text-neutral-400 group-hover:text-blue-600" />
                              </div>
                              <p className="text-neutral-500 text-[11px] mt-0.5 leading-snug">
                                Continuous backups, security checks & updates.
                              </p>
                            </MotionNavigationMenuLink>
                          </div>
                        </div>

                        {/* Bottom Banner */}
                        <div className="mt-2 pt-2 border-t border-neutral-200/80 flex items-center justify-between px-2">
                          <span className="text-[11px] text-neutral-500 font-medium">
                            Have a specific idea or custom project?
                          </span>
                          <Link
                            href="#project-form"
                            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            Talk to our engineering team <ArrowRight className="size-3" />
                          </Link>
                        </div>
                      </div>
                    </MotionNavigationMenuContent>
                  </MotionNavigationMenuItem>

                  {/* --- 2. RESOURCES --- */}
                  <MotionNavigationMenuItem value="resources">
                    <MotionNavigationMenuTrigger className="text-neutral-700 hover:text-neutral-950 data-[state=open]:text-neutral-950 text-xs uppercase tracking-wider font-semibold rounded-full px-3.5 py-1.5">
                      Resources
                    </MotionNavigationMenuTrigger>
                    <MotionNavigationMenuContent highlightClassName="bg-neutral-100 rounded-xl">
                      <div className="grid w-[540px] grid-cols-2 gap-3 p-3">
                        <div className="space-y-1">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1">
                            Articles & Proof
                          </div>
                          <MotionNavigationMenuLink href="#process" className="p-2.5 rounded-lg hover:bg-neutral-100 transition-colors flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                              <BookOpen className="size-4" />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-neutral-900 block">Blog & Articles</span>
                              <span className="text-neutral-500 text-[11px] block mt-0.5">Practical tips on websites, AI, and growth.</span>
                            </div>
                          </MotionNavigationMenuLink>
                          <MotionNavigationMenuLink href="#why-atom-se" className="p-2.5 rounded-lg hover:bg-neutral-100 transition-colors flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                              <Award className="size-4" />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-neutral-900 block">Our Work & Results</span>
                              <span className="text-neutral-500 text-[11px] block mt-0.5">See examples of projects we've built.</span>
                            </div>
                          </MotionNavigationMenuLink>
                        </div>

                        <div className="space-y-1">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1">
                            How We Work
                          </div>
                          <MotionNavigationMenuLink href="#process" className="p-2.5 rounded-lg hover:bg-neutral-100 transition-colors flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
                              <Workflow className="size-4" />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-neutral-900 block">3-Step Process</span>
                              <span className="text-neutral-500 text-[11px] block mt-0.5">From initial discussion to final launch.</span>
                            </div>
                          </MotionNavigationMenuLink>
                          <MotionNavigationMenuLink href="#project-form" className="p-2.5 rounded-lg hover:bg-neutral-100 transition-colors flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                              <BarChart3 className="size-4" />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-neutral-900 block">Free Website Review</span>
                              <span className="text-neutral-500 text-[11px] block mt-0.5">Get expert feedback on your current site.</span>
                            </div>
                          </MotionNavigationMenuLink>
                        </div>
                      </div>
                    </MotionNavigationMenuContent>
                  </MotionNavigationMenuItem>

                  {/* --- 3. PRICING (Direct Link Button, No Dropdown) --- */}
                  <MotionNavigationMenuItem>
                    <Link
                      href="/atom-se/pricing"
                      className="inline-flex items-center justify-center text-neutral-700 hover:text-neutral-950 text-xs uppercase tracking-wider font-semibold rounded-full px-3.5 py-1.5 transition-colors hover:bg-neutral-100/80"
                    >
                      Pricing & Scope
                    </Link>
                  </MotionNavigationMenuItem>
                </MotionNavigationMenuList>
              </MotionNavigationMenu>
            </div>
          </div>

          {/* 3. Right: CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 z-20">
            <Link
              href="#project-form"
              className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-4 sm:px-5 py-2 text-xs font-semibold text-white transition-all hover:bg-neutral-800 active:scale-95 shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
            >
              <Rocket className="size-3.5 text-emerald-400" />
              <span>Start Project</span>
            </Link>

            {/* Mobile Burger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full border border-neutral-300/80 bg-white/90 text-neutral-800 hover:bg-neutral-100 active:scale-95"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur-2xl p-4 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2">Solutions</div>
              <Link
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 text-xs font-medium text-neutral-900"
              >
                <span>Custom Websites</span>
                <ChevronRight className="size-4 text-neutral-400" />
              </Link>
              <Link
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 text-xs font-medium text-neutral-900"
              >
                <span>E-Commerce Stores</span>
                <ChevronRight className="size-4 text-neutral-400" />
              </Link>
              <Link
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 text-xs font-medium text-neutral-900"
              >
                <span>Startup MVPs & Custom SaaS</span>
                <ChevronRight className="size-4 text-neutral-400" />
              </Link>
              <Link
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 text-xs font-medium text-neutral-900"
              >
                <span className="flex items-center gap-2">
                  AI Blog Automation
                  <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded">NEW</span>
                </span>
                <ChevronRight className="size-4 text-neutral-400" />
              </Link>
              <Link
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 text-xs font-medium text-neutral-900"
              >
                <span>SEO, Domain & Email Setup</span>
                <ChevronRight className="size-4 text-neutral-400" />
              </Link>
            </div>

            <div className="border-t border-neutral-100 pt-3 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2">Resources & Pricing</div>
              <Link
                href="/atom-se/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 text-xs font-medium text-neutral-900"
              >
                <span>Pricing Plans & Quotations</span>
                <ChevronRight className="size-4 text-neutral-400" />
              </Link>
              <Link
                href="#why-atom-se"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 text-xs font-medium text-neutral-900"
              >
                <span>Our Work & Results</span>
                <ChevronRight className="size-4 text-neutral-400" />
              </Link>
              <Link
                href="#process"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 text-xs font-medium text-neutral-900"
              >
                <span>3-Step Process</span>
                <ChevronRight className="size-4 text-neutral-400" />
              </Link>
            </div>

            <div className="border-t border-neutral-100 pt-3">
              <Link
                href="#project-form"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800"
              >
                <Rocket className="size-4 text-emerald-400" />
                <span>Start Your Project</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default AtomSeNavbar

