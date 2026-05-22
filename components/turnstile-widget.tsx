"use client"

import { Turnstile } from '@marsidev/react-turnstile'

export function TurnstileWidget() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  if (!siteKey || siteKey === 'your_site_key_here') {
    return (
      <div className="p-3 text-sm text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-center mb-4">
        Turnstile Site Key is missing.
      </div>
    )
  }

  return (
    <div className="flex justify-center w-full mb-4">
      <Turnstile siteKey={siteKey} options={{ theme: 'dark' }} />
    </div>
  )
}
