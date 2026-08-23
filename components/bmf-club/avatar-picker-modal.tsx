'use client'

import React from 'react'
import { X, Check } from 'lucide-react'
import { FOUNDER_AVATAR_PRESETS } from '@/lib/image-utils'

interface AvatarPickerModalProps {
  isOpen: boolean
  onClose: () => void
  currentAvatarUrl?: string
  onSelectAvatar: (avatarUrl: string) => void
}

export function AvatarPickerModal({
  isOpen,
  onClose,
  currentAvatarUrl = '',
  onSelectAvatar,
}: AvatarPickerModalProps) {
  if (!isOpen) return null

  const handleSelect = (url: string) => {
    onSelectAvatar(url)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in-0 duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-[#0f0f13] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-2xl z-10 overflow-hidden text-left">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-1/4 w-56 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800/80">
          <h2 className="text-base font-bold text-white tracking-tight">
            Select Avatar
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar Grid (Responsive 3/4 cols with smooth scroll) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-3.5 py-1 max-h-[440px] overflow-y-auto pr-1">
          {FOUNDER_AVATAR_PRESETS.map((preset) => {
            const isSelected = currentAvatarUrl === preset.url
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelect(preset.url)}
                className={`group relative aspect-square rounded-2xl overflow-hidden border p-1.5 transition-all cursor-pointer focus:outline-none ${
                  isSelected
                    ? 'bg-sky-950/30 border-sky-500 ring-2 ring-sky-500/40 scale-[1.02]'
                    : 'bg-[#141418] border-neutral-800/90 hover:border-sky-500/50 hover:bg-[#181820] hover:scale-[1.03]'
                }`}
              >
                <div className="w-full h-full rounded-xl overflow-hidden bg-neutral-950/60 flex items-center justify-center">
                  <img
                    src={preset.url}
                    alt="Founder Avatar"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>

                {/* Selected Checkmark Indicator */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-150">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

      </div>
    </div>
  )
}
