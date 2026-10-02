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
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Download,
  Loader2,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react'
import { toast } from 'sonner'

function StoreLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawNext = searchParams.get('next') || searchParams.get('redirectTo') || searchParams.get('redirect')
  const destination = rawNext && rawNext.startsWith('/') ? rawNext : '/store'

  // Auth Modes: 'signin' | 'signup' | 'magic-link' | 'forgot-password'
  const [mode, setMode] = useState<'signin' | 'signup' | 'magic-link' | 'forgot-password'>('signin')

  // Form Fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)

  // Helper to persist auth destination cookie so server callback routes always return here
  const setAuthDestinationCookie = (dest: string) => {
    if (typeof document !== 'undefined') {
      document.cookie = `auth_destination=${encodeURIComponent(dest)}; path=/; max-age=1800; SameSite=Lax`
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_destination', dest)
    }
  }

  // Check if user is already authenticated
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = getSupabaseBrowserClient()
        if (!supabase) return
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user) {
          router.replace(destination)
        }
      } catch (_) {}
    }
    checkAuth()
  }, [router, destination])

  // 1-Tap Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setAuthDestinationCookie(destination)

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

  // Handle Standard Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }
    if (!password.trim()) {
      toast.error('Please enter your password.')
      return
    }

    setIsLoading(true)
    setAuthDestinationCookie(destination)

    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        toast.error('Authentication service is unavailable.')
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      })

      if (error) {
        const errMsg = error.message.toLowerCase()
        if (
          errMsg.includes('invalid login credentials') ||
          errMsg.includes('invalid_grant') ||
          errMsg.includes('credentials')
        ) {
          toast.error('Incorrect email or password. Please check your credentials or reset your password.')
        } else {
          toast.error(error.message)
        }
      } else if (data?.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('store_customer_email', data.user.email || email.trim().toLowerCase())
        }
        toast.success(`Welcome back!`)
        router.replace(destination)
        router.refresh()
      }
    } catch (err: any) {
      console.error('[Store Email Sign In Error]:', err)
      toast.error(err.message || 'Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle New Customer Registration (Sign Up)
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }
    if (!password.trim() || password.trim().length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)
    setAuthDestinationCookie(destination)

    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        toast.error('Authentication service is unavailable.')
        setIsLoading(false)
        return
      }

      const returnUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password.trim(),
        options: {
          emailRedirectTo: returnUrl,
          data: {
            full_name: fullName.trim() || undefined,
          },
        },
      })

      if (error) {
        const errMsg = error.message.toLowerCase()
        if (errMsg.includes('already') || errMsg.includes('registered') || errMsg.includes('exists')) {
          toast.info('An account with this email already exists. Switched to Sign In.')
          setMode('signin')
        } else {
          toast.error(error.message)
        }
      } else if (data.session && data.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('store_customer_email', data.user.email || email.trim().toLowerCase())
        }
        toast.success('Account created successfully! Welcome to The Vault Store.')
        router.replace(destination)
        router.refresh()
      } else {
        toast.success('Account registered! Please check your email to confirm your account and sign in.')
        setMode('signin')
      }
    } catch (err: any) {
      console.error('[Store Email Sign Up Error]:', err)
      toast.error(err.message || 'Failed to create account.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Passwordless Magic Link Request
  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }

    setIsLoading(true)
    setAuthDestinationCookie(destination)

    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        toast.error('Authentication service is unavailable.')
        setIsLoading(false)
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
      setIsLoading(false)
    }
  }

  // Handle Forgot Password Reset Email
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter your account email address.')
      return
    }

    setIsLoading(true)
    setAuthDestinationCookie(destination)

    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        toast.error('Authentication service is unavailable.')
        setIsLoading(false)
        return
      }

      const returnUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: returnUrl,
      })

      if (error) {
        toast.error(error.message || 'Failed to send password reset email.')
      } else {
        setForgotPasswordSent(true)
        toast.success('Password reset instructions sent to your email!')
      }
    } catch (err: any) {
      console.error('[Store Forgot Password Error]:', err)
      toast.error(err.message || 'Failed to request password reset.')
    } finally {
      setIsLoading(false)
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
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-neutral-200/50 space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 mx-auto shadow-xs">
              <Lock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-neutral-950">
              {mode === 'signup'
                ? 'Create Customer Account'
                : mode === 'forgot-password'
                ? 'Reset Your Password'
                : mode === 'magic-link'
                ? 'Passwordless Sign In'
                : 'Customer Sign In'}
            </h1>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
              {mode === 'signup'
                ? 'Register your account to manage digital guides, receipts, and lifetime downloads.'
                : mode === 'forgot-password'
                ? 'Enter your email to receive a secure link to reset your account password.'
                : mode === 'magic-link'
                ? 'We will send a 1-tap sign-in link directly to your email inbox.'
                : 'Sign in to access your digital assets library, download links, and instant checkout.'}
            </p>
          </div>

          {/* Primary Action: One-Tap Google Sign-In (Always available except in forgot password) */}
          {mode !== 'forgot-password' && (
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
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

              {/* Divider */}
              <div className="relative flex items-center justify-center pt-2">
                <div className="border-t border-neutral-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0">
                  or continue with email
                </span>
              </div>
            </div>
          )}

          {/* Tab Selector: Sign In vs Create Account */}
          {(mode === 'signin' || mode === 'signup') && (
            <div className="flex bg-neutral-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* MODE 1: Standard Password Sign In */}
          {mode === 'signin' && (
            <form onSubmit={handleEmailSignIn} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-neutral-600">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot-password')
                      setForgotPasswordSent(false)
                    }}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99] mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Store</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE 2: Customer Registration / Sign Up */}
          {mode === 'signup' && (
            <form onSubmit={handleEmailSignUp} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600">Create Password (min 6 characters)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99] mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Customer Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE 3: Passwordless Magic Link */}
          {mode === 'magic-link' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Password Sign In</span>
                </button>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Passwordless
                </span>
              </div>

              {magicLinkSent ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-neutral-950">Check your inbox!</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    We sent a secure magic sign-in link to <strong>{email}</strong>. Click the link to complete your login.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMagicLinkSent(false)}
                    className="text-xs text-emerald-700 font-bold hover:underline pt-1 cursor-pointer"
                  >
                    Resend link or use another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMagicLink} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-600">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending Magic Link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Magic Sign-In Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MODE 4: Forgot Password */}
          {mode === 'forgot-password' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded-md">
                  Password Reset
                </span>
              </div>

              {forgotPasswordSent ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-neutral-950">Instructions dispatched!</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    If an account exists for <strong>{email}</strong>, you will receive an email with instructions to reset your password.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-xs text-emerald-700 font-bold hover:underline pt-1 cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-600">Registered Account Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending Instructions...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Password Reset Email</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

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
