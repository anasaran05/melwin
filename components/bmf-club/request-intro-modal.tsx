'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Briefcase, 
  Mail, 
  Phone, 
  Linkedin,
  ShieldCheck,
  Loader2,
  LogIn,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Lock
} from 'lucide-react'
import { 
  BmfMember, 
  getSupabaseBrowserClient, 
  ensureOrFetchUserProfile,
  isProfileEligibleForShowcase,
  getProfileMissingFields
} from '@/lib/supabase/bmf-members'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import handshakeLoopData from '@/public/assets/Handshake Loop.json'

interface RequestIntroModalProps {
  isOpen: boolean
  onClose: () => void
  member: BmfMember | null
}

const PURPOSES = [
  { id: 'Partnership', label: 'Partnership', placeholder: 'Describe potential synergy or collaboration idea...' },
  { id: 'Investment', label: 'Investment', placeholder: 'Share your syndicate/fund thesis or investment inquiry...' },
  { id: 'Customer / Pilot', label: 'Customer / Pilot', placeholder: 'Explain how you could use their product or run a trial...' },
  { id: 'Founder Chat', label: 'Founder Chat', placeholder: 'Say hello and mention what you are currently building...' },
  { id: 'Advisory / Talent', label: 'Advisory / Talent', placeholder: 'Describe advisory, mentorship, or leadership inquiry...' },
]

const DAILY_APPROACH_LIMIT = 3

function getTodayStorageKey(userIdentifier: string) {
  const todayStr = new Date().toISOString().slice(0, 10)
  return `bmf_daily_approaches_${userIdentifier.toLowerCase()}_${todayStr}`
}

function getStoredDailyApproaches(userIdentifier: string): number {
  if (typeof window === 'undefined' || !userIdentifier) return 0
  try {
    const key = getTodayStorageKey(userIdentifier)
    const val = localStorage.getItem(key)
    return val ? parseInt(val, 10) || 0 : 0
  } catch {
    return 0
  }
}

function incrementStoredDailyApproaches(userIdentifier: string): number {
  if (typeof window === 'undefined' || !userIdentifier) return 1
  try {
    const key = getTodayStorageKey(userIdentifier)
    const current = getStoredDailyApproaches(userIdentifier)
    const next = current + 1
    localStorage.setItem(key, next.toString())
    return next
  } catch {
    return 1
  }
}

export function RequestIntroModal({ isOpen, onClose, member }: RequestIntroModalProps) {
  const [mounted, setMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentMemberProfile, setCurrentMemberProfile] = useState<BmfMember | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [authView, setAuthView] = useState<'form' | 'login'>('form')

  // In-modal login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Sender details state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [purpose, setPurpose] = useState('Founder Chat')
  const [message, setMessage] = useState('')

  // Daily Limit state
  const [dailyUsed, setDailyUsed] = useState(0)

  // Submission & Post-submit details
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [targetEmailResolved, setTargetEmailResolved] = useState('')
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Check auth session & pre-populate sender details from member profile
  const checkAuthAndPopulate = async () => {
    setIsCheckingAuth(true)
    setLoginError('')
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        if (typeof window !== 'undefined') {
          const storedEmail = localStorage.getItem('bmf_current_user_email') || ''
          const storedName = localStorage.getItem('bmf_current_user_name') || ''
          if (storedEmail) {
            setEmail(storedEmail)
            if (storedName) setName(storedName)
            const used = getStoredDailyApproaches(storedEmail)
            setDailyUsed(used)
            setAuthView('form')
          } else {
            setAuthView('login')
          }
        }
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUser(user)
        const profile = await ensureOrFetchUserProfile(user)
        if (profile) {
          setCurrentMemberProfile(profile)
          setName(profile.full_name || '')
          setEmail(profile.email || user.email || '')
          setPhone(profile.phone_number || profile.whatsapp_number || '')
          setCompany(profile.company_name || '')
          setRole(profile.role || '')
          setLinkedin(profile.linkedin_url || '')
        } else {
          setName(user.user_metadata?.full_name || user.email?.split('@')[0] || '')
          setEmail(user.email || '')
        }

        // Calculate daily approaches used today
        const userIdentifier = user.email || user.id
        let used = getStoredDailyApproaches(userIdentifier)

        // Query Supabase for exact daily count if available
        try {
          const todayStart = new Date()
          todayStart.setHours(0, 0, 0, 0)
          const { count } = await supabase
            .from('bmf_intro_requests')
            .select('id', { count: 'exact', head: true })
            .eq('requester_user_id', user.id)
            .gte('created_at', todayStart.toISOString())

          if (typeof count === 'number') {
            used = count
            if (typeof window !== 'undefined') {
              localStorage.setItem(getTodayStorageKey(userIdentifier), count.toString())
            }
          }
        } catch (e) {
          // fallback to localStorage
        }

        setDailyUsed(used)
        setAuthView('form')
      } else {
        setCurrentUser(null)
        setCurrentMemberProfile(null)
        setAuthView('login')
      }
    } catch (err) {
      console.error('Error checking user session in intro modal:', err)
      setAuthView('login')
    } finally {
      setIsCheckingAuth(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      checkAuthAndPopulate()
    }
  }, [isOpen])

  if (!isOpen || !member || !mounted) return null

  const isSenderVerified = Boolean(
    currentMemberProfile && isProfileEligibleForShowcase(currentMemberProfile)
  )
  const missingSenderFields = currentMemberProfile 
    ? getProfileMissingFields(currentMemberProfile) 
    : ['Company Name', 'Company Logo', 'Role', 'Profile Avatar']

  const activePurposeObj = PURPOSES.find(p => p.id === purpose) || PURPOSES[3]
  const remainingApproaches = Math.max(0, DAILY_APPROACH_LIMIT - dailyUsed)
  const isDailyLimitReached = remainingApproaches <= 0

  // In-modal Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true)
    setLoginError('')
    try {
      const supabase = getSupabaseBrowserClient()
      if (supabase) {
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '/bmf-club/directory'
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: currentUrl,
          },
        })
        if (error) {
          setLoginError(error.message)
          setIsLoggingIn(false)
        }
      } else {
        localStorage.setItem('bmf_current_user_email', 'founder@bmf.club')
        localStorage.setItem('bmf_current_user_name', 'Verified Founder')
        await checkAuthAndPopulate()
      }
    } catch (err: any) {
      setLoginError(err.message || 'Google sign in failed')
      setIsLoggingIn(false)
    }
  }

  // In-modal Email & Password Sign-In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both email and password.')
      return
    }

    setIsLoggingIn(true)
    setLoginError('')
    try {
      const supabase = getSupabaseBrowserClient()
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword,
        })
        if (error) {
          setLoginError(error.message || 'Invalid credentials.')
          setIsLoggingIn(false)
          return
        }

        if (data.user) {
          setCurrentUser(data.user)
          const profile = await ensureOrFetchUserProfile(data.user)
          if (profile) {
            setCurrentMemberProfile(profile)
            setName(profile.full_name || '')
            setEmail(profile.email || data.user.email || '')
            setPhone(profile.phone_number || profile.whatsapp_number || '')
            setCompany(profile.company_name || '')
            setRole(profile.role || '')
          }
          const userIdentifier = data.user.email || data.user.id
          setDailyUsed(getStoredDailyApproaches(userIdentifier))
          setAuthView('form')
        }
      } else {
        localStorage.setItem('bmf_current_user_email', loginEmail.trim())
        setDailyUsed(getStoredDailyApproaches(loginEmail.trim()))
        setAuthView('form')
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const isSelfIntro = Boolean(
    (currentUser?.id && (member.user_id === currentUser.id || member.id === currentUser.id)) ||
    (currentMemberProfile?.id && (currentMemberProfile.id === member.id || (currentMemberProfile.user_id && member.user_id && currentMemberProfile.user_id === member.user_id))) ||
    (email && member.email && email.trim().toLowerCase() === member.email.trim().toLowerCase()) ||
    (currentUser?.email && member.email && currentUser.email.trim().toLowerCase() === member.email.trim().toLowerCase())
  )

  // Construct Direct `mailto:` URL for client email opening
  const buildMailtoUrl = (targetEmail: string) => {
    const subject = `🤝 BMF Founder Connection: ${name || 'Fellow Founder'} <> ${member.full_name} (${purpose})`
    const body = `Hi ${member.full_name},

I came across your profile on the BMF Club Founder Directory and wanted to connect directly.

🎯 Reason for Connecting: ${purpose}

"${message.trim()}"

---
Connecting Founder Details:
• Name: ${name || 'Fellow Founder'}
• Role & Company: ${role ? `${role}, ` : ''}${company || 'Venture'}
• Email: ${email || currentUser?.email || ''}
${phone ? `• WhatsApp / Phone: ${phone}\n` : ''}${linkedin ? `• LinkedIn: ${linkedin}\n` : ''}
Sent via BMF Founders Club Showcase Directory`

    return `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const triggerDirectMailto = (targetEmail: string) => {
    if (!targetEmail || typeof window === 'undefined') return
    const mailtoUrl = buildMailtoUrl(targetEmail)
    try {
      const link = document.createElement('a')
      link.href = mailtoUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      window.location.href = mailtoUrl
    }
  }

  // Submit Intro Request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (isDailyLimitReached) {
      setErrorMsg('Daily limit reached: You have used your 3 daily founder approaches. Your limit resets at midnight.')
      return
    }

    if (isSelfIntro) {
      setErrorMsg('You cannot request an introduction to your own profile.')
      return
    }

    if (!isSenderVerified) {
      setErrorMsg('You must complete your own venture profile details (company logo & name) in the dashboard before approaching founders.')
      return
    }

    if (!message.trim()) {
      setErrorMsg('Please write a short message before sending.')
      return
    }

    setIsSubmitting(true)
    try {
      const effectiveTargetEmail = member.email || ''

      const res = await fetch('/api/bmf/request-intro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_member_id: member.id,
          target_member_name: member.full_name,
          target_member_company: member.company_name,
          target_member_email: effectiveTargetEmail,
          requester_user_id: currentUser?.id || null,
          requester_name: name.trim() || 'Fellow Founder',
          requester_email: email.trim() || currentUser?.email || 'founder@bmf.club',
          requester_phone: phone.trim() || null,
          requester_company: company.trim() || null,
          requester_role: role.trim() || null,
          requester_linkedin: linkedin.trim() || null,
          purpose,
          message: message.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        if (data.dailyLimitReached) {
          setDailyUsed(3)
        }
        throw new Error(data.error || 'Failed to submit introduction request.')
      }

      // Record daily count increment
      const userIdentifier = currentUser?.email || currentUser?.id || email
      const newCount = incrementStoredDailyApproaches(userIdentifier)
      setDailyUsed(newCount)

      const finalTargetEmail = data.targetEmail || effectiveTargetEmail
      setTargetEmailResolved(finalTargetEmail)

      // Open user's default email client pre-filled automatically
      if (finalTargetEmail) {
        triggerDirectMailto(finalTargetEmail)
      }

      setIsSuccess(true)
    } catch (err: any) {
      console.error('[Request Intro Submit Error]:', err)
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyEmailAndDetails = () => {
    if (!targetEmailResolved) return
    const textToCopy = `To: ${targetEmailResolved}
Subject: 🤝 BMF Founder Connection: ${name} <> ${member.full_name} (${purpose})

Hi ${member.full_name},

${message.trim()}

Best regards,
${name} (${email})`

    navigator.clipboard.writeText(textToCopy)
    setHasCopiedEmail(true)
    setTimeout(() => setHasCopiedEmail(false), 2000)
  }

  const handleResetAndClose = () => {
    setIsSuccess(false)
    setErrorMsg('')
    setMessage('')
    onClose()
  }

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Full-screen Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[-1]"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-[#121215] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        >
          {/* Top Bar with Clean Close Button & Daily Limit Indicator */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02] shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-mono">
                Founder Connection
              </span>
            </div>

            {/* Daily Quota Tag */}
            {authView === 'form' && !isSuccess && (
              <div 
                className={`text-[10.5px] font-mono px-2.5 py-0.5 rounded-full border ${
                  remainingApproaches > 1 
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                    : remainingApproaches === 1
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : 'bg-red-500/15 text-red-300 border-red-500/30'
                }`}
                title="Max 3 founder approach requests per calendar day"
              >
                ⚡ {remainingApproaches} / {DAILY_APPROACH_LIMIT} daily left
              </div>
            )}

            <button
              onClick={handleResetAndClose}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto space-y-4 text-left">
            {isCheckingAuth ? (
              /* Loading auth check state */
              <div className="py-12 text-center space-y-3">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mx-auto" />
                <p className="text-xs text-neutral-400">Verifying founder membership session...</p>
              </div>
            ) : isSuccess ? (
              /* ========================================================================= */
              /* SUCCESS SCREEN WITH DIRECT TARGET EMAIL & PREFILLED MAIL CLIENT LAUNCHER */
              /* ========================================================================= */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="space-y-1 max-w-sm mx-auto">
                  <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">Request Sent & Email Ready!</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Your request was recorded and dispatched on behalf of BMF Club. You can also connect directly via email below.
                  </p>
                </div>

                {/* Target Founder Direct Email Box */}
                {targetEmailResolved && (
                  <div className="p-4 rounded-2xl bg-neutral-900/90 border border-emerald-500/30 text-left max-w-sm mx-auto space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        Target Founder Email
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">Direct Contact</span>
                    </div>

                    <div className="bg-neutral-950 p-2.5 rounded-xl border border-white/10 flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-mono font-bold text-white truncate">
                        {targetEmailResolved}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyEmailAndDetails}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 text-[11px] font-mono flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                      >
                        {hasCopiedEmail ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Launch Mail Client Button */}
                    <button
                      type="button"
                      onClick={() => triggerDirectMailto(targetEmailResolved)}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in Mail Client ({member.full_name})</span>
                    </button>
                  </div>
                )}

                {/* Daily limit reminder */}
                <div className="text-[11px] font-mono text-neutral-400">
                  ⚡ <strong>{remainingApproaches}</strong> of {DAILY_APPROACH_LIMIT} daily approaches remaining today
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleResetAndClose}
                    className="w-full max-w-xs bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all border border-white/15 cursor-pointer mx-auto block"
                  >
                    Done & Return to Directory
                  </button>
                </div>
              </motion.div>
            ) : authView === 'login' ? (
              /* ========================================================================= */
              /* IN-MODAL LOGIN VIEW (Must be authenticated before approaching)           */
              /* ========================================================================= */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/10 space-y-3.5">
                  <div className="space-y-1 text-center">
                    <h4 className="text-sm font-bold text-white">Sign in to Approach Founders</h4>
                    <p className="text-[11px] text-neutral-400">
                      Sign in so your verified sender profile & credentials are attached to this direct connection.
                    </p>
                  </div>

                  {/* 1-Click Google Sign In */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoggingIn}
                    className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-60"
                  >
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
                  </button>

                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-white/10 w-full" />
                    <span className="bg-neutral-900 px-2 text-[10px] uppercase font-mono text-neutral-500 shrink-0">
                      or sign in with email
                    </span>
                    <div className="border-t border-white/10 w-full" />
                  </div>

                  <form onSubmit={handleEmailSignIn} className="space-y-2.5">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="founder@company.com"
                      className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                    />

                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                    />

                    {loginError && (
                      <p className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-center">
                        {loginError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer disabled:opacity-60"
                    >
                      {isLoggingIn ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <LogIn className="w-3.5 h-3.5" />
                      )}
                      <span>Sign In & Continue</span>
                    </button>
                  </form>
                </div>
              </div>
            ) : !isSenderVerified ? (
              /* ========================================================================= */
              /* SENDER PROFILE INCOMPLETE: MUST COMPLETE PROFILE BEFORE APPROACHING       */
              /* ========================================================================= */
              <div className="py-6 px-2 text-center space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/10">
                  <Lock className="w-8 h-8 text-amber-400" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                    <span>Verification Required</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Complete Your Profile to Approach
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    To maintain the highest level of network trust and ensure reciprocal founder value, all syndicate members must complete their own venture profile before approaching verified founders like <strong className="text-white">{member.full_name}</strong>.
                  </p>
                </div>

                {/* Missing Requirements List */}
                <div className="p-4 rounded-2xl bg-neutral-900/80 border border-amber-500/25 text-left max-w-sm mx-auto space-y-2.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                    Required Details to Complete:
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-300">
                    {missingSenderFields.map((field) => (
                      <li key={field} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{field}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA to Dashboard */}
                <div className="pt-2 max-w-sm mx-auto space-y-2">
                  <a
                    href="/bmf-club/dashboard"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black px-6 py-3 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Complete Profile in Dashboard →</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ========================================================================= */
              /* DUAL FOUNDER MATCHUP HERO + APPROACH FORM                                 */
              /* ========================================================================= */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 🤝 Dual Founders Animated Connection Hero */}
                <div className="relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white/[0.03] via-emerald-500/[0.08] to-white/[0.03] border border-white/10 overflow-hidden shadow-inner">
                  {/* Ambient glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 pointer-events-none animate-pulse" />

                  {/* Left: Sender Profile (You) */}
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center text-center w-[40%] min-w-0 z-10"
                  >
                    <div className="relative">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-neutral-800 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20">
                        {currentMemberProfile?.avatar_url ? (
                          <img
                            src={currentMemberProfile.avatar_url}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-white text-base bg-emerald-700">
                            {name ? name.charAt(0).toUpperCase() : 'You'}
                          </div>
                        )}
                      </div>
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-emerald-500 text-black text-[9px] font-mono font-bold tracking-tight uppercase shadow-xs">
                        You
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-full mt-2.5">
                      {name || 'Your Name'}
                    </h4>
                    <p className="text-[10px] text-neutral-400 truncate max-w-full">
                      {company || role || 'Founder'}
                    </p>
                  </motion.div>

                  {/* Center: Animated Lottie Handshake Connection */}
                  <div className="flex items-center justify-center relative shrink-0 z-10 w-20 sm:w-28 h-16 sm:h-20 -my-2 overflow-visible">
                    <DotLottieReact
                      data={handshakeLoopData}
                      loop
                      autoplay
                      className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                    />
                  </div>

                  {/* Right: Target Founder */}
                  <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center text-center w-[40%] min-w-0 z-10"
                  >
                    <div className="relative">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-neutral-800 border-2 border-white/25 shadow-lg">
                        <img
                          src={member.avatar_url}
                          alt={member.full_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-full mt-2.5">
                      {member.full_name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 truncate max-w-full">
                      {member.company_name}
                    </p>
                  </motion.div>
                </div>

                {/* Daily limit alert if reached */}
                {isDailyLimitReached && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Daily Limit Reached (3/3)</span>
                      <span>You have reached your 3 founder approach limit for today. Your quota will reset at midnight.</span>
                    </div>
                  </div>
                )}

                {/* Reason for Connecting Chips */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300 block">
                    Reason for Connecting <span className="text-red-400">*</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PURPOSES.map((p) => {
                      const isSelected = purpose === p.id
                      return (
                        <button
                          key={p.id}
                          type="button"
                          disabled={isDailyLimitReached}
                          onClick={() => setPurpose(p.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white text-black font-bold shadow-sm'
                              : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5'
                          } ${isDailyLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {p.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Message Box */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-400 flex items-center justify-between">
                    <span>Message to {member.full_name} <span className="text-red-400">*</span></span>
                    <span className="text-[10px] font-mono text-neutral-500">Prefills direct email</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    disabled={isDailyLimitReached}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={activePurposeObj.placeholder}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 resize-none disabled:opacity-50"
                  />
                </div>

                {isSelfIntro && (
                  <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-lg text-center font-mono">
                    ● This is your own card. Introductions can only be requested to fellow founders.
                  </p>
                )}

                {errorMsg && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-center">
                    {errorMsg}
                  </p>
                )}

                {/* Footer Send Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting || isSelfIntro || isDailyLimitReached}
                    className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Sending Request & Preparing Email...</span>
                      </>
                    ) : isDailyLimitReached ? (
                      <span>Daily Limit Reached (3/3)</span>
                    ) : isSelfIntro ? (
                      <span>Cannot Request Intro to Yourself</span>
                    ) : (
                      <>
                        <span>Send Request & Open Email</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}
