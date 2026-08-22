'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'
import { AuthForm } from '@/components/ui/sign-in-1'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  Globe, 
  User, 
  Mail, 
  Layers, 
  AlertTriangle,
  Lock
} from 'lucide-react'

interface ScopeInfo {
  name: string
  description: string
}

const SCOPE_DESCRIPTIONS: Record<string, string> = {
  openid: 'Verify your digital identity via OpenID Connect',
  email: 'View your registered account email address',
  profile: 'Read your public executive bio, name, and company details',
  offline_access: 'Maintain persistent token access when you are offline',
  'bmf:read': 'Access your BMF Club membership & founder showcase info',
  'bmf:write': 'Update showcase profiles and post venture job openings',
}

function ConsentScreenContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const authorizationId = searchParams.get('authorization_id') || searchParams.get('authorizationId') || ''
  
  const [user, setUser] = useState<any>(null)
  const [authDetails, setAuthDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Universal Auth State for unauthenticated visitors
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [authMessage, setAuthMessage] = useState('')

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      setError(null)
      try {
        const supabase = getSupabaseBrowserClient()
        if (!supabase) {
          setError('Supabase connection is not configured.')
          setIsLoading(false)
          return
        }

        // Check active session
        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user || null
        setUser(currentUser)

        if (!authorizationId) {
          // If no authorization_id provided (e.g. previewing consent page)
          setAuthDetails({
            client: {
              name: 'BMF Developer Application',
              website: 'https://bmf.club',
              logo_url: 'https://img.icons8.com/stickers/500/verified-badge.png',
            },
            scopes: ['openid', 'email', 'profile', 'offline_access'],
          })
          setIsLoading(false)
          return
        }

        if (currentUser) {
          // Fetch authorization details from Supabase
          try {
            // Attempt using SDK method if available
            const authSdk = supabase.auth as any
            if (typeof authSdk?.oauth?.getAuthorizationDetails === 'function') {
              const res = await authSdk.oauth.getAuthorizationDetails(authorizationId)
              if (res?.data) {
                setAuthDetails(res.data)
                setIsLoading(false)
                return
              }
            }

            // Direct API fallback
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
            const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            const res = await fetch(`${supabaseUrl}/auth/v1/oauth/authorizations/${authorizationId}`, {
              headers: {
                apikey: anonKey || '',
                Authorization: `Bearer ${session?.access_token}`,
              },
            })

            if (res.ok) {
              const data = await res.json()
              setAuthDetails(data)
            } else {
              // Graceful mock details for demo / dev preview
              setAuthDetails({
                client: {
                  name: 'Third-Party Agent Client',
                  website: 'https://oauth.client',
                  logo_url: 'https://img.icons8.com/stickers/500/verified-badge.png',
                },
                scopes: ['openid', 'email', 'profile'],
              })
            }
          } catch (fetchErr) {
            console.warn('Could not fetch remote auth details, using preview fallback', fetchErr)
            setAuthDetails({
              client: {
                name: 'Third-Party Agent Client',
                website: 'https://oauth.client',
                logo_url: 'https://img.icons8.com/stickers/500/verified-badge.png',
              },
              scopes: ['openid', 'email', 'profile'],
            })
          }
        }
      } catch (err: any) {
        console.error('Error in OAuth Consent:', err)
        setError(err.message || 'Failed to initialize authorization session.')
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [authorizationId])

  // Handle Approve Authorization
  const handleApprove = async () => {
    setIsProcessing(true)
    setError(null)
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) throw new Error('Supabase client unavailable.')

      const authSdk = supabase.auth as any
      if (typeof authSdk?.oauth?.approveAuthorization === 'function') {
        const { data, error } = await authSdk.oauth.approveAuthorization(authorizationId)
        if (error) throw error
        if (data?.redirect_url) {
          window.location.href = data.redirect_url
          return
        }
      }

      // Direct API fallback
      const { data: { session } } = await supabase.auth.getSession()
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      const res = await fetch(`${supabaseUrl}/auth/v1/oauth/authorizations/${authorizationId}/approve`, {
        method: 'POST',
        headers: {
          apikey: anonKey || '',
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      const json = await res.json()
      if (json?.redirect_url) {
        window.location.href = json.redirect_url
      } else {
        alert('Authorization approved! (Preview mode - no external redirect configured)')
        router.push('/bmf-club/dashboard')
      }
    } catch (err: any) {
      console.error('Approve failed:', err)
      setError(err.message || 'Approval could not be processed.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle Deny Authorization
  const handleDeny = async () => {
    setIsProcessing(true)
    setError(null)
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) throw new Error('Supabase client unavailable.')

      const authSdk = supabase.auth as any
      if (typeof authSdk?.oauth?.denyAuthorization === 'function') {
        const { data, error } = await authSdk.oauth.denyAuthorization(authorizationId)
        if (error) throw error
        if (data?.redirect_url) {
          window.location.href = data.redirect_url
          return
        }
      }

      // Direct API fallback
      const { data: { session } } = await supabase.auth.getSession()
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      const res = await fetch(`${supabaseUrl}/auth/v1/oauth/authorizations/${authorizationId}/deny`, {
        method: 'POST',
        headers: {
          apikey: anonKey || '',
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      const json = await res.json()
      if (json?.redirect_url) {
        window.location.href = json.redirect_url
      } else {
        router.push('/bmf-club')
      }
    } catch (err: any) {
      console.error('Deny failed:', err)
      setError(err.message || 'Denial could not be processed.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Sign In handlers for unauthenticated users
  const handleGoogleSignIn = async () => {
    setAuthStatus('loading')
    try {
      const supabase = getSupabaseBrowserClient()
      if (supabase) {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.href,
          },
        })
      }
    } catch (err: any) {
      setAuthStatus('error')
      setAuthMessage(err.message || 'Google sign in failed')
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthStatus('loading')
    setAuthMessage('')
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) return

      if (authPassword.trim()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        })
        if (error) {
          setAuthStatus('error')
          setAuthMessage(error.message)
        } else if (data.user) {
          setUser(data.user)
          setAuthStatus('success')
        }
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email: authEmail,
          options: {
            emailRedirectTo: window.location.href,
          },
        })
        if (error) {
          setAuthStatus('error')
          setAuthMessage(error.message)
        } else {
          setAuthStatus('success')
          setAuthMessage('Magic link sent to your email! Click it to continue authorization.')
        }
      }
    } catch (err: any) {
      setAuthStatus('error')
      setAuthMessage(err.message || 'Email authentication failed')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-white flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-xl">
          <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
        </div>
        <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
          Loading Authorization Details...
        </p>
      </div>
    )
  }

  // 1. If User is NOT authenticated, require login first
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0c0e] text-white p-4 relative overflow-hidden select-none font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12)_0%,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-sm mb-6 relative z-10">
          <Link 
            href="/bmf-club"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>&larr; Cancel and return to home</span>
          </Link>
        </div>

        <div className="w-full max-w-sm relative z-10">
          <AuthForm
            logoSrc="https://img.icons8.com/stickers/500/verified-badge.png"
            logoAlt="BMF Logo"
            title="Sign In to Authorize"
            description="An external application is requesting access. Please sign in to review permissions."
            primaryAction={{
              label: "Continue with Google",
              onClick: handleGoogleSignIn,
              disabled: authStatus === 'loading',
            }}
            secondaryActions={[
              {
                label: showEmailForm ? "Hide Email Login" : "Continue with Email",
                onClick: () => setShowEmailForm(!showEmailForm),
                disabled: authStatus === 'loading',
              },
            ]}
          >
            {showEmailForm && (
              <form onSubmit={handleEmailSignIn} className="space-y-3 pt-1 pb-2 text-left animate-in fade-in-0 duration-300">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-300">Account Email</label>
                  <input
                    type="email"
                    required
                    placeholder="founder@company.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-300">Password (optional for Magic Link)</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={authStatus === 'loading'}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs py-4 rounded-xl transition-all shadow-md mt-1 cursor-pointer"
                >
                  {authStatus === 'loading' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In & Continue</span>
                  )}
                </Button>
              </form>
            )}

            {authMessage && (
              <div className={`p-3 text-xs rounded-xl text-center leading-relaxed ${
                authStatus === 'error' 
                  ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' 
                  : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              }`}>
                {authMessage}
              </div>
            )}
          </AuthForm>
        </div>
      </div>
    )
  }

  // 2. Render OAuth Consent UI for Authenticated Users
  const clientName = authDetails?.client?.name || 'Third-Party Application'
  const clientWebsite = authDetails?.client?.website || ''
  const scopesList = authDetails?.scopes || ['openid', 'email', 'profile']

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0c] text-white p-4 relative overflow-hidden select-none font-sans">
      {/* Ambient background atmosphere */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15)_0%,transparent_70%)] pointer-events-none" />

      <Card className="w-full max-w-md bg-[#141417] border border-neutral-800 text-neutral-100 shadow-2xl rounded-3xl overflow-hidden relative z-10">
        
        {/* Header with App Connection Visual */}
        <CardHeader className="text-center pt-8 pb-4 border-b border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-center gap-3">
            {/* Third-Party App Icon */}
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center shadow-lg p-2.5">
              <img 
                src={authDetails?.client?.logo_url || "https://img.icons8.com/stickers/500/verified-badge.png"} 
                alt={clientName} 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Connecting Indicator */}
            <div className="flex items-center gap-1 text-neutral-600">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <div className="w-5 h-px bg-neutral-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Supabase / BMF Identity Provider Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-white/10 flex items-center justify-center shadow-lg p-2.5">
              <ShieldCheck className="w-7 h-7 text-sky-400" />
            </div>
          </div>

          <div className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Authorize {clientName}
            </CardTitle>
            <CardDescription className="text-xs text-neutral-400 max-w-xs mx-auto">
              This application is requesting permission to link with your verified account.
            </CardDescription>
          </div>

          {/* User Account Pill */}
          <div className="inline-flex items-center gap-2 bg-neutral-900/90 border border-neutral-700/80 px-3.5 py-1.5 rounded-full text-xs text-neutral-300">
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono text-[11px] truncate max-w-[200px]">{user.email}</span>
          </div>
        </CardHeader>

        {/* Permissions / Scope List */}
        <CardContent className="p-6 space-y-5 text-left">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
              Permissions Requested
            </span>

            <div className="space-y-2.5 bg-neutral-900/60 rounded-2xl p-4 border border-neutral-800/80">
              {scopesList.map((scope: string) => (
                <div key={scope} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-white capitalize">
                      {scope.replace(':', ' ')}
                    </p>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      {SCOPE_DESCRIPTIONS[scope] || `Access ${scope} capabilities.`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-500 bg-neutral-900/30 p-3 rounded-xl border border-neutral-800/40">
            <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>You can revoke this application&apos;s access at any time in your dashboard settings.</span>
          </div>
        </CardContent>

        {/* Actions Footer */}
        <CardFooter className="flex flex-col gap-2.5 p-6 pt-0 border-t border-neutral-800/60 mt-2">
          <Button
            onClick={handleApprove}
            disabled={isProcessing}
            className="w-full bg-white hover:bg-neutral-200 text-black font-bold text-xs py-5 rounded-xl transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Authorizing Application...</span>
              </>
            ) : (
              <span>Allow & Authorize</span>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleDeny}
            disabled={isProcessing}
            className="w-full bg-transparent hover:bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800 text-xs py-5 rounded-xl transition-all cursor-pointer"
          >
            Cancel / Deny
          </Button>
        </CardFooter>
      </Card>

      {/* Footer Meta */}
      <div className="mt-6 text-center text-xs text-neutral-500 font-mono">
        Secured with Supabase OAuth 2.1 Server &bull; BMF Identity Protocol
      </div>
    </div>
  )
}

export default function OAuthConsentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0c0c0e] text-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
      </div>
    }>
      <ConsentScreenContent />
    </Suspense>
  )
}
