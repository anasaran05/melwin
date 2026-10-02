'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'
import { Footer } from '@/components/footer'
import {
  Sparkles,
  ArrowLeft,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Download,
  Loader2,
  Lock,
} from 'lucide-react'
import { toast } from 'sonner'

function StoreLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawNext = searchParams.get('next') || searchParams.get('redirectTo')
  const destination = rawNext && rawNext.startsWith('/') ? rawNext : '/store'

  const [email, setEmail] = useState('')
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Check if already authenticated
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = getSupabaseBrowserClient()
        if (!supabase) return
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user) {
          setCurrentUser(session.user)
          router.replace(destination)
        }
      } catch (_) {}
    }
    checkAuth()
  }, [router, destination])

  // 1-Tap Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        toast.error('Authentication service is unavailable.')
        setIsGoogleLoading(false)
        return
      }

      const returnUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: returnUrl,
        },
      })

      if (error) {
        toast.error(error.message || 'Google sign-in failed.')
        setIsGoogleLoading(false)
      }
    } catch (err: any) {
      console.error('[Store Login Google Error]:', err)
      toast.error(err.message || 'Failed to connect with Google.')
      setIsGoogleLoading(false)
    }
  }

  // Passwordless Email Magic Link
  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }

    setIsSendingMagicLink(true)
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        toast.error('Authentication service is unavailable.')
        setIsSendingMagicLink(false)
        return
      }

      const returnUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: returnUrl,
        },
      })

      if (error) {
        toast.error(error.message || 'Failed to send login link.')
      } else {
        setMagicLinkSent(true)
        toast.success('Magic sign-in link dispatched to your email!')
        if (typeof window !== 'undefined') {
          localStorage.setItem('store_customer_email', email.trim().toLowerCase())
        }
      }
    } catch (err: any) {
      console.error('[Store Login Magic Link Error]:', err)
      toast.error(err.message || 'An unexpected error occurred.')
    } finally {
      setIsSendingMagicLink(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar */}
      <header className="w-full bg-white/90 backdrop-blur-xl border-b border-neutral-200/90 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/store"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store Catalog</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black tracking-tight text-neutral-900 uppercase">
              The Vault Store
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-neutral-200/50 space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 mx-auto shadow-xs">
              <Lock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-neutral-950">
              Customer Sign In
            </h1>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
              Sign in with your Google account to access your digital assets library, download links, and instant 1-tap checkout.
            </p>
          </div>

          {/* Primary Action: One-Tap Google Sign-In */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full bg-white hover:bg-neutral-50 active:bg-neutral-100 border border-neutral-300 text-neutral-800 font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xs hover:shadow-sm cursor-pointer active:scale-[0.99]"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
                  <span>Connecting Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-neutral-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0">
              or sign in with email link
            </span>
          </div>

          {/* Magic Link Form */}
          {magicLinkSent ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-neutral-950">Check your inbox!</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We sent a secure magic sign-in link to <strong>{email}</strong>. Click the link to complete your login.
              </p>
              <button
                onClick={() => setMagicLinkSent(false)}
                className="text-xs text-emerald-700 font-bold hover:underline pt-1 cursor-pointer"
              >
                Use another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMagicLink} className="space-y-3">
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 rounded-xl pl-10 pr-4 py-3 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSendingMagicLink}
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              >
                {isSendingMagicLink ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Dispatching Magic Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Magic Login Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Value Props & Trust Badges */}
          <div className="pt-3 border-t border-neutral-100 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Instant asset download links delivered directly to your email</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <Download className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Lifetime re-download access in your personal library</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function StoreLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] flex items-center justify-center">Loading Sign In...</div>}>
      <StoreLoginContent />
    </Suspense>
  )
}
