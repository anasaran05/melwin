'use client'

import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { useRouter, usePathname } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: (notification?: (notification: any) => void) => void
          renderButton?: (parent: HTMLElement, options: any) => void
          cancel?: () => void
        }
      }
    }
  }
}

interface GoogleOneTapProps {
  redirectTo?: string
  autoPrompt?: boolean
  onSuccess?: (user: any) => void
}

// Generates a cryptographically random raw nonce and its SHA-256 hash for Supabase + Google One Tap
async function generateNonce(): Promise<{ rawNonce: string; hashedNonce: string }> {
  const rawArray = new Uint8Array(16)
  crypto.getRandomValues(rawArray)
  const rawNonce = Array.from(rawArray, (b) => b.toString(16).padStart(2, '0')).join('')

  const encoder = new TextEncoder()
  const data = encoder.encode(rawNonce)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return { rawNonce, hashedNonce }
}

export function GoogleOneTap({ 
  redirectTo,
  autoPrompt = true,
  onSuccess
}: GoogleOneTapProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const initializedRef = React.useRef(false)

  const isBmfPage = pathname?.startsWith('/bmf') || false
  const isStorePage = pathname?.startsWith('/store') || false
  const isAllowedPage = isBmfPage || isStorePage

  const isAuthOrDashboardPage = 
    pathname?.includes('/dashboard') || 
    pathname?.includes('/reset-password') || 
    pathname?.includes('/admin') ||
    pathname?.includes('/login') ||
    pathname?.includes('/auth')

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  useEffect(() => {
    // If not on allowed pages, or on auth/dashboard, dismiss any open Google One Tap prompt
    if (!isAllowedPage || isAuthOrDashboardPage) {
      if (typeof window !== 'undefined' && window.google?.accounts?.id?.cancel) {
        try {
          window.google.accounts.id.cancel()
        } catch {}
      }
      initializedRef.current = false
      return
    }

    if (!scriptLoaded || initializedRef.current) return

    async function initializeGoogleOneTap() {
      try {
        const supabase = getSupabaseBrowserClient()
        if (!supabase) return

        // 1. Check if user is already authenticated
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          return // User already logged in, do not display One Tap prompt
        }

        // For BMF Club, also check demo storage
        if (isBmfPage && typeof window !== 'undefined' && localStorage.getItem('bmf_current_user_email')) {
          return
        }

        if (!window.google?.accounts?.id) return
        if (!googleClientId) {
          console.info('Google One Tap: NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured in .env yet.')
          return
        }

        initializedRef.current = true

        // 2. Generate matching SHA-256 nonce pair for Google and Supabase
        const { rawNonce, hashedNonce } = await generateNonce()

        // 3. Initialize Google Identity Services One Tap
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          nonce: hashedNonce,
          callback: async (response: any) => {
            try {
              // 4. Authenticate with Supabase using the Google ID token and rawNonce
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
                nonce: rawNonce,
              })

              if (error) {
                console.error('Supabase Google One Tap auth failed:', error.message)
                return
              }

              if (data?.user) {
                if (isBmfPage && typeof window !== 'undefined') {
                  localStorage.setItem('bmf_current_user_email', data.user.email || '')
                }
                if (isStorePage && typeof window !== 'undefined') {
                  localStorage.setItem('store_customer_email', data.user.email || '')
                }

                if (onSuccess) {
                  onSuccess(data.user)
                }

                const defaultDest = isStorePage ? '/store' : '/bmf-club/dashboard'
                const destination = redirectTo || (typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : defaultDest)
                router.push(destination)
                router.refresh()
              }
            } catch (authErr) {
              console.error('Error exchanging Google ID Token with Supabase:', authErr)
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          itp_support: true,
          use_fedcm_for_prompt: true,
        })

        // 5. Prompt the One Tap Floating Widget
        if (autoPrompt) {
          window.google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed()) {
              console.log('Google One Tap not displayed reason:', notification.getNotDisplayedReason())
            } else if (notification.isSkippedMoment()) {
              console.log('Google One Tap skipped reason:', notification.getSkippedReason())
            } else if (notification.isDismissedMoment()) {
              console.log('Google One Tap dismissed reason:', notification.getDismissedReason())
            }
          })
        }
      } catch (err) {
        console.error('Error initializing Google One Tap:', err)
      }
    }

    initializeGoogleOneTap()
  }, [scriptLoaded, googleClientId, autoPrompt, redirectTo, onSuccess, router, isAllowedPage, isBmfPage, isStorePage, isAuthOrDashboardPage, pathname])

  // Only load external script on allowed public routes
  if (!isAllowedPage || isAuthOrDashboardPage) {
    return null
  }

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={() => setScriptLoaded(true)}
    />
  )
}

export default GoogleOneTap
