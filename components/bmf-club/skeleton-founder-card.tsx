'use client'

import React from 'react'

export function SkeletonFounderCard() {
  return (
    <div className="w-[155px] sm:w-[210px] md:w-[220px] h-[225px] sm:h-[315px] rounded-xl sm:rounded-2xl bg-neutral-200 border border-black/5 overflow-hidden relative shadow-xs shrink-0 animate-pulse select-none">
      {/* Background shimmer layer */}
      <div className="w-full h-full bg-gradient-to-br from-neutral-300 via-neutral-200 to-neutral-300" />

      {/* Vignette Shadow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

      {/* Bottom Info Shimmer Placeholders */}
      <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3.5 z-10 flex flex-col justify-end space-y-1.5 text-left">
        {/* Name Bar */}
        <div className="h-3.5 sm:h-4 bg-white/60 rounded-md w-3/4 animate-pulse" />
        {/* Role Bar */}
        <div className="h-2.5 sm:h-3 bg-white/40 rounded-md w-1/2 animate-pulse" />
      </div>
    </div>
  )
}
