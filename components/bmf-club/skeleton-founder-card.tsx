'use client'

import React from 'react'

interface SkeletonFounderCardProps {
  className?: string
  aspectRatio?: 'standard' | 'tall' | 'compact'
}

export function SkeletonFounderCard({ className, aspectRatio = 'standard' }: SkeletonFounderCardProps) {
  const heightClasses =
    aspectRatio === 'tall'
      ? 'h-[260px] sm:h-[360px]'
      : aspectRatio === 'compact'
      ? 'h-[200px] sm:h-[280px]'
      : 'h-[225px] sm:h-[315px]'

  return (
    <div
      className={`w-[155px] sm:w-[210px] md:w-[220px] ${heightClasses} rounded-xl sm:rounded-2xl bg-neutral-200 border border-black/5 overflow-hidden relative shadow-xs shrink-0 animate-pulse select-none ${className || ''}`}
    >
      {/* Background shimmer layer */}
      <div className="w-full h-full bg-gradient-to-br from-neutral-300 via-neutral-200 to-neutral-300" />

      {/* Top company badge shimmer */}
      <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-7 h-7 sm:w-9 sm:h-9 rounded-md bg-white/40 animate-pulse" />

      {/* Vignette Shadow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

      {/* Bottom Info Shimmer Placeholders */}
      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3.5 z-10 flex flex-col justify-end space-y-1.5 text-left">
        {/* Name Bar */}
        <div className="h-3.5 sm:h-4 bg-white/70 rounded-md w-3/4 animate-pulse" />
        {/* Role & Company Bar */}
        <div className="h-2.5 sm:h-3 bg-white/50 rounded-md w-1/2 animate-pulse" />
        <div className="h-2 sm:h-2.5 bg-white/30 rounded-md w-2/3 animate-pulse" />
      </div>
    </div>
  )
}

