'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'
import { AuthForm } from '@/components/ui/sign-in-1'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react'

const IconGoogle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" {...props}><title>Google</title><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.386-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.85l3.25-3.138C18.189 1.186 15.479 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.885 0 11.954-4.823 11.954-12.015 0-.795-.084-1.588-.239-2.356H12.24z" fill="currentColor"/></svg>
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

  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot-password'>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Forgot password OTP states
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)

  const [showEmailForm, setShowEmailForm] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // 1-minute cooldown countdown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [cooldownSeconds])

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

      if (authMode === 'signup') {
        if (!password.trim() || password.trim().length < 6) {
          setStatus('error')
          setMessage('Please provide a password of at least 6 characters for sign up.')
          return
        }

        const res = await fetch('/api/bmf/auth/send-auth-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password: password.trim(),
            fullName: fullName.trim(),
            type: 'signup',
            redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,
          }),
        })

        const resData = await res.json()
        if (res.ok && resData.success) {
          setStatus('success')
          setMessage("Account created! We've sent a verification email to activate your founder pass. Please check your inbox.")
        } else if (resData.alreadyExists || resData.error?.toLowerCase().includes('already') || res.status === 409) {
          setStatus('error')
          setMessage('An account with this email already exists. Switched to Sign In — please enter your password.')
          setAuthMode('signin')
        } else {
          // Direct fallback to Supabase sign up
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,
              data: {
                full_name: fullName.trim() || undefined,
              },
            },
          })
          if (error) {
            const isExists = error.message.toLowerCase().includes('already') || error.message.toLowerCase().includes('exists')
            setStatus('error')
            setMessage(isExists ? 'An account with this email already exists. Switched to Sign In.' : error.message || resData.error)
            if (isExists) {
              setAuthMode('signin')
            }
          } else if (data.user && data.user.identities && data.user.identities.length === 0) {
            setStatus('error')
            setMessage('An account with this email already exists. Switched to Sign In.')
            setAuthMode('signin')
          } else if (data.session && data.user) {
            if (typeof window !== 'undefined' && data.user.email) {
              localStorage.setItem('bmf_current_user_email', data.user.email)
            }
            setStatus('success')
            setMessage('Account created successfully! Redirecting...')
            router.push(destination)
            router.refresh()
          } else {
            setStatus('success')
            setMessage('Account created! Please check your email inbox to confirm your account and sign in.')
          }
        }
        return
      }

      // STANDARD SIGN IN FLOW (Email + Password only)
      if (!password.trim()) {
        setStatus('error')
        setMessage('Please enter your password to sign in.')
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        setStatus('error')
        const errMsg = error.message.toLowerCase()
        if (errMsg.includes('invalid login credentials') || errMsg.includes('invalid_credentials') || errMsg.includes('invalid_grant')) {
          setMessage('Incorrect password. Please verify your credentials or reset your password below.')
        } else {
          setMessage(error.message)
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
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'An unexpected error occurred.')
    }
  }

  // FORGOT PASSWORD: Request OTP
  const handleRequestPasswordResetOtp = async (targetEmail?: string) => {
    const emailToUse = (targetEmail || email).trim()
    if (!emailToUse) {
      setStatus('error')
      setMessage('Please enter your email address to receive a verification code.')
      return
    }

    if (cooldownSeconds > 0) {
      setStatus('error')
      setMessage(`Please wait ${cooldownSeconds}s before requesting another code.`)
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/bmf/auth/send-auth-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToUse,
          type: 'recovery',
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,
        }),
      })

      const resData = await res.json()
      if (res.ok && resData.success) {
        setStatus('success')
        setMessage(resData.message || '6-digit verification code sent to your email!')
        setForgotStep('verify')
        setCooldownSeconds(60) // Enforce 1-minute timer
      } else if (res.status === 429) {
        setStatus('error')
        setMessage(resData.error || 'Please wait before requesting another code.')
        if (resData.retryAfter) {
          setCooldownSeconds(resData.retryAfter)
        }
      } else {
        setStatus('error')
        setMessage(resData.error || 'Failed to send reset code. Please ensure your email is registered.')
      }
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Failed to request reset code.')
    }
  }

  // FORGOT PASSWORD: Verify OTP and update password
  const handleVerifyOtpAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setStatus('error')
      setMessage('Email address is required.')
      return
    }

    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setStatus('error')
      setMessage('Please enter the verification code sent to your email.')
      return
    }

    if (!newPassword.trim() || newPassword.trim().length < 6) {
      setStatus('error')
      setMessage('New password must be at least 6 characters.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        setStatus('error')
        setMessage('Database configuration not available.')
        return
      }

      // 1. Verify OTP code for password recovery
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otpCode.trim(),
        type: 'recovery',
      })

      if (verifyError) {
        setStatus('error')
        setMessage(verifyError.message || 'Invalid or expired verification code. Please check your email or resend.')
        return
      }

      // 2. Set new password for the authenticated recovery session
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword.trim(),
      })

      if (updateError) {
        setStatus('error')
        setMessage(updateError.message || 'Failed to update password. Please try again.')
        return
      }

      if (typeof window !== 'undefined' && verifyData?.user?.email) {
        localStorage.setItem('bmf_current_user_email', verifyData.user.email)
      }

      setStatus('success')
      setMessage('Password updated successfully! Signing you in...')
      setTimeout(() => {
        router.push(destination)
        router.refresh()
      }, 900)
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Failed to complete password reset.')
    }
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
          title={authMode === 'forgot-password' ? "Reset Password" : "BMF Member Portal"}
          description={
            authMode === 'forgot-password'
              ? "Verify your account with the OTP code sent to your email to create a new password."
              : "Log in to manage your executive profile card, company bio, and venture metrics."
          }
          primaryAction={{
            label: status === 'loading' ? "Authenticating..." : "Continue with Google",
            icon: status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <IconGoogle />,
            onClick: handleGoogleSignIn,
            disabled: status === 'loading',
          }}
          secondaryActions={[
            {
              label: showEmailForm ? "Hide Email Login" : "Continue with Email & Password",
              icon: <IconMail />,
              onClick: () => setShowEmailForm(!showEmailForm),
              disabled: status === 'loading',
            },
          ]}
          footerContent={
            <>
              By logging in, you agree to the{" "}
              <Link href="/terms?from=/bmf-club/login" target="_blank" rel="noopener noreferrer" className="cursor-pointer transition-colors hover:text-white underline underline-offset-2">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy?from=/bmf-club/login" target="_blank" rel="noopener noreferrer" className="cursor-pointer transition-colors hover:text-white underline underline-offset-2">Privacy Policy</Link>.
            </>
          }
        >
          {showEmailForm && (
            <div className="pt-1 pb-2 text-left animate-in fade-in-0 duration-300">
              {/* FORGOT PASSWORD VIEW */}
              {authMode === 'forgot-password' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-white/10 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signin')
                        setForgotStep('request')
                        setMessage('')
                      }}
                      className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                    <span className="text-[10px] font-mono text-sky-400 font-semibold uppercase tracking-wider">
                      OTP Recovery
                    </span>
                  </div>

                  {forgotStep === 'request' ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleRequestPasswordResetOtp(); }} className="space-y-3">
                      <p className="text-[12px] text-neutral-400 leading-relaxed">
                        Enter your registered account email. We will dispatch an OTP verification code to your inbox.
                      </p>

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

                      <Button
                        type="submit"
                        disabled={status === 'loading' || cooldownSeconds > 0}
                        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs py-4 rounded-xl transition-all shadow-md mt-1 cursor-pointer"
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                            <span>Sending Code...</span>
                          </>
                        ) : cooldownSeconds > 0 ? (
                          <span>Resend code in {cooldownSeconds}s</span>
                        ) : (
                          <span>Send Verification Code &rarr;</span>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtpAndResetPassword} className="space-y-3">
                      <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-300 flex items-center justify-between">
                        <span className="truncate">Code sent to <strong>{email}</strong></span>
                        <button
                          type="button"
                          onClick={() => { setForgotStep('request'); setMessage(''); }}
                          className="text-[10px] text-sky-400 hover:text-sky-200 underline ml-2 shrink-0 cursor-pointer"
                        >
                          Change
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-neutral-300">Verification Code (OTP)</label>
                        <input
                          type="text"
                          required
                          maxLength={8}
                          placeholder="••••••••"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-600 rounded-xl px-3.5 py-2.5 text-sm font-mono tracking-[0.3em] text-center focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-neutral-300">New Password (min 6 chars)</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 rounded-xl pl-3.5 pr-10 py-2.5 text-xs focus:outline-none focus:border-sky-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 cursor-pointer"
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                          >
                            {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs py-4 rounded-xl transition-all shadow-md mt-1 cursor-pointer"
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                            <span>Updating Password...</span>
                          </>
                        ) : (
                          <span>Reset Password & Sign In</span>
                        )}
                      </Button>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-neutral-500">Didn&apos;t receive code?</span>
                        {cooldownSeconds > 0 ? (
                          <span className="text-neutral-400 font-mono text-[10px]">
                            Resend code in {cooldownSeconds}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRequestPasswordResetOtp()}
                            className="text-sky-400 hover:text-sky-300 font-medium cursor-pointer transition-colors"
                          >
                            Resend Code
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                /* STANDARD SIGN IN / SIGN UP FORM */
                <form onSubmit={handleEmailSignIn} className="space-y-3">
                  {/* Mode Switcher: Sign In vs Sign Up */}
                  <div className="flex rounded-xl bg-neutral-900/90 p-1 border border-neutral-800 mb-2">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signin'); setMessage(''); }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        authMode === 'signin' 
                          ? 'bg-neutral-800 text-white shadow-sm' 
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signup'); setMessage(''); }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        authMode === 'signup' 
                          ? 'bg-neutral-800 text-white shadow-sm' 
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {authMode === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-300">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Alex Johnson"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-300">Email Address</label>
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
                      <label className="text-[11px] font-medium text-neutral-300">
                        {authMode === 'signup' ? 'Create Password (min 6 chars)' : 'Password'}
                      </label>
                      {authMode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('forgot-password')
                            setForgotStep('request')
                            setMessage('')
                          }}
                          className="text-[10px] text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={authMode === 'signup' ? 6 : undefined}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 rounded-xl pl-3.5 pr-10 py-2.5 text-xs focus:outline-none focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs py-4 rounded-xl transition-all shadow-md mt-1 cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                        <span>{authMode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                      </>
                    ) : (
                      <span>{authMode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                    )}
                  </Button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
                        setMessage('')
                      }}
                      className="text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {authMode === 'signin' ? (
                        <>Don&apos;t have an account? <span className="text-sky-400 font-semibold underline underline-offset-2">Sign Up</span></>
                      ) : (
                        <>Already have an account? <span className="text-sky-400 font-semibold underline underline-offset-2">Sign In</span></>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
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
