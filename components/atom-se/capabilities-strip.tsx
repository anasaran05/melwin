'use client'

import React from 'react'
import { 
  Globe, 
  ShoppingCart, 
  LayoutGrid, 
  Sparkles 
} from 'lucide-react'

interface StripItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
  iconClassName?: string
}

const STRIP_ITEMS: StripItem[] = [
  {
    id: 'web-dev',
    label: 'Web development',
    icon: Globe,
    iconColor: 'text-neutral-800',
  },
  {
    id: 'ecommerce',
    label: 'eCommerce',
    icon: ShoppingCart,
    iconColor: 'text-neutral-800',
  },
  {
    id: 'app-dev',
    label: 'Application development',
    icon: LayoutGrid,
    iconColor: 'text-neutral-800',
  },
  {
    id: 'ai-automation',
    label: 'AI Automation',
    icon: Sparkles,
    iconColor: 'text-neutral-800',
  },
]

export function AtomSeCapabilitiesStrip() {
  return (
    <div className="w-full bg-white border-y border-black/[0.08] py-5 sm:py-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between sm:justify-center flex-wrap gap-x-8 sm:gap-x-10 md:gap-x-12 lg:gap-x-16 gap-y-4">
          {STRIP_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="group flex items-center gap-2.5 sm:gap-3 text-neutral-800 transition-all duration-300 hover:text-black cursor-default"
              >
                <div className={`transition-transform duration-300 group-hover:scale-110 ${item.iconColor || 'text-neutral-800'}`}>
                  <Icon className={`w-[18px] h-[18px] sm:w-5 sm:h-5 ${item.iconClassName || 'stroke-[1.8]'}`} />
                </div>
                <span className="text-xs sm:text-sm md:text-[15px] font-medium tracking-tight text-neutral-800 group-hover:text-black transition-colors whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AtomSeCapabilitiesStrip
