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
  LogIn
} from 'lucide-react'
import { 
  BmfMember, 
  getSupabaseBrowserClient, 
  ensureOrFetchUserProfile 
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

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

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
          if (storedEmail) setEmail(storedEmail)
          if (storedName) setName(storedName)
          setAuthView(storedEmail ? 'form' : 'login')
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
        }
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

  const activePurposeObj = PURPOSES.find(p => p.id === purpose) || PURPOSES[3]

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
          setAuthView('form')
        }
      } else {
        localStorage.setItem('bmf_current_user_email', loginEmail.trim())
        setAuthView('form')
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Submit Intro Request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!message.trim()) {
      setErrorMsg('Please write a short message before sending.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/bmf/request-intro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_member_id: member.id,
          target_member_name: member.full_name,
          target_member_company: member.company_name,
          target_member_email: member.email,
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
        throw new Error(data.error || 'Failed to submit introduction request.')
      }

      setIsSuccess(true)
    } catch (err: any) {
      console.error('[Request Intro Submit Error]:', err)
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
          {/* Top Bar with Clean Close Button */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02] shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-mono">
                Founder Introduction
              </span>
            </div>

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
                <p className="text-xs text-neutral-400">Loading founder session...</p>
              </div>
            ) : isSuccess ? (
              /* Success Confirmation State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1.5 max-w-xs mx-auto">
                  <h4 className="text-xl font-black text-white tracking-tight">Request Sent!</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Your introduction request has been delivered to <strong>{member.full_name}</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-left max-w-sm mx-auto space-y-2 text-xs text-neutral-300">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>What happens next?</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Once {member.full_name} accepts your request, our system will automatically email a mutual introduction connecting both of your verified contacts.
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleResetAndClose}
                    className="w-full max-w-xs bg-white hover:bg-neutral-200 text-black font-bold py-3 px-6 rounded-xl text-sm transition-all cursor-pointer mx-auto block"
                  >
                    Done & Return to Directory
                  </button>
                </div>
              </motion.div>
            ) : authView === 'login' ? (
              /* ========================================================================= */
              /* IN-MODAL LOGIN VIEW (No Page Navigation)                                 */
              /* ========================================================================= */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/10 space-y-3.5">
                  <div className="space-y-1 text-center">
                    <h4 className="text-sm font-bold text-white">Sign in to Connect</h4>
                    <p className="text-[11px] text-neutral-400">
                      Sign in so your verified founder profile is attached to this introduction request.
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
            ) : (
              /* ========================================================================= */
              /* DUAL FOUNDER MATCHUP HERO + INTRO FORM                                    */
              /* ========================================================================= */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 🤝 Dual Founders Animated Connection Hero */}
                <div className="relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white/[0.03] via-emerald-500/[0.08] to-white/[0.03] border border-white/10 overflow-hidden shadow-inner">
                  {/* Subtle animated ambient glow */}
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
                          onClick={() => setPurpose(p.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white text-black font-bold shadow-sm'
                              : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5'
                          }`}
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
                  
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={activePurposeObj.placeholder}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 resize-none"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-center">
                    {errorMsg}
                  </p>
                )}

                {/* Footer Send Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Request</span>
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
