'use client'

import React from 'react'
import { HeroCarousel, type HeroCarouselItem } from '@/components/ui/hero-carousel'

interface AtomSeHeroSectionProps {
  ready?: boolean
}

const HERO_IMG = (fileName: string) =>
  `/images/atom-se%20images/herosection%20image/${fileName}`

const ATOM_SE_SHOWCASE_ITEMS: HeroCarouselItem[] = [
  {
    id: 'digital-solutions',
    title: 'Simple, Fast, &\nReliable Solutions',
    image: HERO_IMG('card1.jpg'),
    credit: 'ATOM SE DIGITAL LABS.',
    meta: ['NEXT.JS 16', 'TAILWIND CSS', 'GLOBAL EDGE'],
    accent: '#036b68ff',
  },
  {
    id: 'web-platforms',
    title: 'High-Conversion\nWeb Platforms',
    image: HERO_IMG('card2.jpg'),
    credit: 'ATOM SE DIGITAL.',
    meta: ['HIGH SPEED', 'SEO OPTIMIZED', 'MAX CONVERSION'],
    accent: '#ff4114',
  },
  {
    id: 'cloud-apps',
    title: 'Custom Web Apps\n& Cloud Systems',
    image: HERO_IMG('card3.jpg'),
    credit: 'ATOM SE ENGINEERING.',
    meta: ['REACT 19', 'POSTGRESQL', 'REALTIME DATA'],
    accent: '#00c8ff',
  },
  {
    id: 'ecommerce',
    title: 'High-Performance\nE-Commerce Engines',
    image: HERO_IMG('card4.jpg'),
    credit: 'ATOM SE COMMERCE.',
    meta: ['FAST CHECKOUT', 'PAYMENT GATEWAYS', 'SCALE'],
    accent: '#e5231b',
  },
  {
    id: 'google-seo',
    title: 'Top-Ranked\nGoogle Search SEO',
    image: HERO_IMG('card5.jpg'),
    credit: 'ATOM SE GROWTH.',
    meta: ['RANK #1', 'TECHNICAL SEO', 'ORGANIC TRAFFIC'],
    accent: '#020d1fff',
  },
  {
    id: 'brand-design',
    title: 'Bespoke Brand\nIdentity & Design',
    image: HERO_IMG('card6.png'),
    credit: 'ATOM SE CREATIVE.',
    meta: ['UI / UX DESIGN', 'DESIGN SYSTEM', 'EDITORIAL UI'],
    accent: '#63525bff',
  },
  {
    id: 'motion-experience',
    title: 'Cinematic Motion\n& Micro-Interactions',
    image: HERO_IMG('card7.jpg'),
    credit: 'ATOM SE MOTION.',
    meta: ['FRAMER MOTION', 'SMOOTH GESTURES', 'ZERO LAG'],
    accent: '#4356c8',
  },
  {
    id: 'cloud-infra',
    title: 'Enterprise Cloud\n& Infrastructure',
    image: HERO_IMG('card8.jpg'),
    credit: 'ATOM SE INFRASTRUCTURE.',
    meta: ['AWS • GCP • CLOUDFLARE', '99.99% UPTIME', 'ENTERPRISE SHIELD'],
    accent: '#ff3b6b',
  },
]

export function AtomSeHeroSection({ ready = true }: AtomSeHeroSectionProps) {
  return (
    <section
      id="top"
      className="relative w-full h-[100svh] min-h-[580px] max-h-[1080px] overflow-hidden bg-black select-none"
    >
      <HeroCarousel
        items={ATOM_SE_SHOWCASE_ITEMS}
        defaultIndex={0}
        autoplay={true}
        autoplayDelay={4500}
      />
    </section>
  )
}

export default AtomSeHeroSection
