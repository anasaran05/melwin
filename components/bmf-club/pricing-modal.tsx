'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PricingCards } from './pricing-cards'

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function PricingModal({ isOpen, onClose, onSuccess }: PricingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!max-w-5xl sm:!max-w-5xl w-[96vw] sm:w-[92vw] md:w-[90vw] lg:w-full max-h-[92vh] overflow-y-auto bg-[#fafafa] border border-stone-200 text-stone-900 p-4 sm:p-7 md:p-9 rounded-3xl shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>BMF Club Membership Pricing</DialogTitle>
        </DialogHeader>

        <PricingCards
          compact={false}
          showTitle={true}
          isModal={true}
          onSuccess={() => {
            if (onSuccess) onSuccess()
            onClose()
          }}
          onSelectFree={() => {
            onClose()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
