'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ShieldCheck, Sparkles, Loader2, KeyRound } from 'lucide-react'

export default function BmfMemberLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const supabase = getSupabaseBrowserClient()

      if (!supabase) {
        // Local demo access fallback if Supabase env is not configured
        if (typeof window !== 'undefined') {
          localStorage.setItem('bmf_current_user_email', email)
        }
        setStatus('success')
        setMessage('Demo login successful! Redirecting to your member dashboard...')
        setTimeout(() => {
          router.push('/bmf-club/dashboard')
        }, 800)
        return
      }

      // Try Password sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // If password fails or user wants magic link, try OTP magic link
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/bmf-club/dashboard`,
          },
        })

        if (otpError) {
          setStatus('error')
          setMessage(error.message || 'Invalid credentials. If you are a new member, please contact the admissions team.')
        } else {
          setStatus('success')
          setMessage('Magic login link sent to your email! Click the link to access your dashboard.')
        }
      } else if (data.user) {
        setStatus('success')
        setMessage('Signed in successfully!')
        router.push('/bmf-club/dashboard')
      }
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'An unexpected error occurred.')
    }
  }

  // Quick Demo Access Handler
  const handleQuickDemoAccess = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bmf_current_user_email', 'kishore@pharmpulse.ai')
    }
    router.push('/bmf-club/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] text-white p-4 relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Back button */}
      <div className="w-full max-w-md mb-6">
        <Link 
          href="/bmf-club"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&larr; Back to BMF Club Directory</span>
        </Link>
      </div>

      <Card className="w-full max-w-md bg-[#161616] border-neutral-800 text-neutral-100 shadow-2xl rounded-3xl overflow-hidden relative z-10">
        <CardHeader className="space-y-2 text-center pb-4 pt-8">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto border border-white/10 shadow-md">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-white">
            BMF Member Portal
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-neutral-400 max-w-xs mx-auto">
            Log in to manage your executive profile card, company bio, and venture metrics.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-6 sm:px-8 pb-8">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <Label htmlFor="email" className="text-xs font-medium text-neutral-300">
                Registered Member Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="founder@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 rounded-xl px-4 py-2.5 text-xs focus-visible:ring-sky-500"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-neutral-300">
                  Password (or leave blank for Magic Link)
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 rounded-xl px-4 py-2.5 text-xs focus-visible:ring-sky-500"
              />
            </div>

            {message && (
              <div className={`p-3 text-xs rounded-xl text-center ${
                status === 'error' 
                  ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' 
                  : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              }`}>
                {message}
              </div>
            )}

            <Button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-white text-black hover:bg-neutral-200 font-bold text-xs py-5 rounded-full transition-all shadow-md"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Access Member Dashboard</span>
              )}
            </Button>
          </form>

          {/* Quick Demo Instant Access */}
          <div className="pt-2 border-t border-neutral-800 text-center space-y-3">
            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 px-4 py-2.5 rounded-full text-xs font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Member Studio Preview (Demo Mode)</span>
            </button>

            <p className="text-[11px] text-neutral-500">
              Not a member yet?{' '}
              <Link href="/bmf-club#apply" className="text-white hover:underline font-semibold">
                Apply for admission &rarr;
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
