'use client'

import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
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

export function GoogleOneTap({ 
  redirectTo = '/bmf-club/dashboard',
  autoPrompt = true,
  onSuccess
}: GoogleOneTapProps) {
  const router = useRouter()
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!scriptLoaded || isInitializing) return

    async function initializeGoogleOneTap() {
      try {
        const supabase = getSupabaseBrowserClient()
        if (!supabase) return

        // 1. Check if user is already authenticated
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          return // User already logged in, do not display One Tap prompt
        }

        // Also check local demo storage
        if (typeof window !== 'undefined' && localStorage.getItem('bmf_current_user_email')) {
          return
        }

        if (!window.google?.accounts?.id) return
        if (!googleClientId) {
          console.info('Google One Tap: NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured in .env yet.')
          return
        }

        setIsInitializing(true)

        // 2. Initialize Google Identity Services One Tap
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            try {
              // 3. Authenticate with Supabase using the Google ID token (Zero-redirect login)
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
              })

              if (error) {
                console.error('Supabase Google One Tap auth failed:', error.message)
                return
              }

              if (data?.user) {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('bmf_current_user_email', data.user.email || '')
                }
                if (onSuccess) {
                  onSuccess(data.user)
                }
                router.push(redirectTo)
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

        // 4. Prompt the One Tap Floating Widget
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
  }, [scriptLoaded, googleClientId, autoPrompt, redirectTo, onSuccess, router, isInitializing])

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={() => setScriptLoaded(true)}
    />
  )
}

export default GoogleOneTap
