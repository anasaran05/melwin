'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'
import { AuthForm } from '@/components/ui/sign-in-1'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'

const IconGoogle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" {...props}><title>Google</title><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.386-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.85l3.25-3.138C18.189 1.186 15.479 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.885 0 11.954-4.823 11.954-12.015 0-.795-.084-1.588-.239-2.356H12.24z" fill="currentColor"/></svg>
)

const IconGithub = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" {...props}><title>GitHub</title><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12Z" fill="currentColor"/></svg>
)

const IconMail = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" {...props}><title>Mail</title><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" fill="currentColor"/></svg>
)

const BMF_LOGO_URL = "https://img.icons8.com/stickers/500/verified-badge.png"

function BmfMemberLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawNext = searchParams.get('next') || searchParams.get('redirectTo') || searchParams.get('redirect')
  const destination = (rawNext && rawNext.startsWith('/')) ? rawNext : '/bmf-club/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    let isSubscribed = true
    const checkExistingSession = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user && isSubscribed) {
            router.replace(destination)
            return
          }
        }
        if (typeof window !== 'undefined') {
          const storedEmail = localStorage.getItem('bmf_current_user_email')
          if (storedEmail && isSubscribed) {
            router.replace(destination)
            return
          }
        }
      } catch (err) {
        console.error('Error checking login session:', err)
      } finally {
        if (isSubscribed) {
          setIsCheckingAuth(false)
        }
      }
    }
    checkExistingSession()
    return () => {
      isSubscribed = false
    }
  }, [router, destination])

  const handleGoogleSignIn = async () => {
    setStatus('loading')
    setMessage('')
    try {
      const supabase = getSupabaseBrowserClient()
      if (supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,
          },
        })
        if (error) {
          setStatus('error')
          setMessage(error.message)
        }
      } else {
        if (typeof window !== 'undefined') {
          localStorage.setItem('bmf_current_user_email', 'google.founder@bmf.club')
        }
        setStatus('success')
        router.push(destination)
      }
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Google authentication failed')
    }
  }

  const handleGithubSignIn = async () => {
    setStatus('loading')
    setMessage('')
    try {
      const supabase = getSupabaseBrowserClient()
      if (supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,
          },
        })
        if (error) {
          setStatus('error')
          setMessage(error.message)
        }
      } else {
        if (typeof window !== 'undefined') {
          localStorage.setItem('bmf_current_user_email', 'github.founder@bmf.club')
        }
        setStatus('success')
        router.push(destination)
      }
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'GitHub authentication failed')
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }
    setStatus('loading')
    setMessage('')

    try {
      const supabase = getSupabaseBrowserClient()

      if (!supabase) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('bmf_current_user_email', email)
        }
        setStatus('success')
        setMessage('Demo login successful! Redirecting...')
        setTimeout(() => {
          router.push(destination)
        }, 600)
        return
      }

      if (password.trim()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,
            },
          })

          if (otpError) {
            setStatus('error')
            setMessage(error.message || otpError.message)
          } else {
            setStatus('success')
            setMessage('Magic login link sent to your email! Click the link to access your dashboard.')
          }
        } else if (data.user) {
          if (typeof window !== 'undefined' && data.user.email) {
            localStorage.setItem('bmf_current_user_email', data.user.email)
          }
          setStatus('success')
          setMessage('Signed in successfully! Redirecting...')
          router.push(destination)
          router.refresh()
        }
      } else {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,
          },
        })

        if (otpError) {
          setStatus('error')
          setMessage(otpError.message)
        } else {
          setStatus('success')
          setMessage('Magic login link sent to your email! Click the link to access your dashboard.')
        }
      }
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'An unexpected error occurred.')
    }
  }

  const handleQuickDemoAccess = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bmf_current_user_email', 'kishore@pharmpulse.ai')
    }
    router.push(destination)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] text-white p-4 relative overflow-hidden select-none font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Back button */}
      <div className="w-full max-w-sm mb-6 relative z-10">
        <Link 
          href="/bmf-club"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <span>&larr; Back to BMF Club Directory</span>
        </Link>
      </div>

      <div className="w-full max-w-sm relative z-10">
        <AuthForm
          logoSrc={BMF_LOGO_URL}
          logoAlt="BMF Club Logo"
          title="BMF Member Portal"
          description="Log in to manage your executive profile card, company bio, and venture metrics."
          primaryAction={{
            label: status === 'loading' ? "Authenticating..." : "Continue with Google",
            icon: status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <IconGoogle />,
            onClick: handleGoogleSignIn,
            disabled: status === 'loading',
          }}
          secondaryActions={[
            {
              label: "Continue with GitHub",
              icon: <IconGithub />,
              onClick: handleGithubSignIn,
              disabled: status === 'loading',
            },
            {
              label: showEmailForm ? "Hide Email Login" : "Continue with Email",
              icon: <IconMail />,
              onClick: () => setShowEmailForm(!showEmailForm),
              disabled: status === 'loading',
            },
          ]}
          skipAction={{
            label: "Instant Member Studio Preview (Demo Mode)",
            onClick: handleQuickDemoAccess,
          }}
          footerContent={
            <>
              By logging in, you agree to the{" "}
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="cursor-pointer transition-colors hover:text-white underline underline-offset-2">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="cursor-pointer transition-colors hover:text-white underline underline-offset-2">Privacy Policy</Link>.
            </>
          }
        >
          {showEmailForm && (
            <form onSubmit={handleEmailSignIn} className="space-y-3 pt-1 pb-2 text-left animate-in fade-in-0 duration-300">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-neutral-300">Registered Email</label>
                <input
                  type="email"
                  required
                  placeholder="founder@yourcompany.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium text-neutral-300">Password (or leave blank for Magic Link)</label>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs py-4 rounded-xl transition-all shadow-md mt-1 cursor-pointer"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Access Member Dashboard</span>
                )}
              </Button>
            </form>
          )}

          {message && (
            <div className={`p-3 text-xs rounded-xl text-center leading-relaxed ${
              status === 'error' 
                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' 
                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
            }`}>
              {message}
            </div>
          )}
        </AuthForm>
      </div>
    </div>
  )
}

export default function BmfMemberLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
      </div>
    }>
      <BmfMemberLoginContent />
    </Suspense>
  )
}
