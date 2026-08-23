'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button, type ButtonProps } from '@/components/ui/button'

export interface CtaProps {
  ctaEnabled?: boolean
  text: string
  link?: string
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  onClick?: () => void
}

export function Cta({ cta }: { cta: CtaProps }) {
  if (!cta || !cta.ctaEnabled) return null

  if (cta.link) {
    return (
      <Button variant={cta.variant} size={cta.size} asChild>
        <Link href={cta.link}>
          {cta.text}
        </Link>
      </Button>
    )
  }

  return (
    <Button variant={cta.variant} size={cta.size} onClick={cta.onClick}>
      {cta.text}
    </Button>
  )
}
