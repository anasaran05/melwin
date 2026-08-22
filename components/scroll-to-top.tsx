'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function ScrollToTop() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // If there's a hash in the window location (e.g. #services, #consultation), handle scrolling to the target element
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash) {
        const targetElement = document.querySelector(hash)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
          return
        }
      }

      // If no hash or target element is not found, reset scroll to top immediately
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0

      // Re-check on next animation frame in case hydration or dynamic height shifted the position
      requestAnimationFrame(() => {
        if (!window.location.hash) {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' as ScrollBehavior,
          })
          document.documentElement.scrollTop = 0
          document.body.scrollTop = 0
        }
      })
    }
  }, [pathname, searchParams])

  return null
}
