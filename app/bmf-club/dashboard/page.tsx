'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  BmfMember, 
  BmfJob, 
  INITIAL_BMF_MEMBERS, 
  saveBmfMemberProfile, 
  fetchMemberJobs, 
  saveBmfJob, 
  deleteBmfJob, 
  getSupabaseBrowserClient, 
  ensureOrFetchUserProfile 
} from '@/lib/supabase/bmf-members'
import { 
  BmfCard, 
  CardTier, 
  CARD_TIERS, 
  fetchMemberCard, 
  generateDefaultCard, 
  submitCardPassApplication 
} from '@/lib/supabase/bmf-cards'
import { MemberFlipCard } from '@/components/bmf-club/member-flip-card'
import { ExecutiveMetalCard } from '@/components/bmf-club/executive-metal-card'
import { ImageUploader } from '@/components/bmf-club/image-uploader'
import { normalizeR2Url, DEFAULT_FOUNDER_AVATAR } from '@/lib/image-utils'
import { AuthForm } from '@/components/ui/sign-in-1'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  LogOut, 
  Briefcase, 
  User, 
  Sliders, 
  AlertCircle, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Send, 
  LayoutDashboard, 
  Calendar, 
  Menu, 
  X, 
  CreditCard, 
  Clock, 
  Wifi, 
  QrCode,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Edit3
} from 'lucide-react'

const CATEGORIES = [
  'Technology & Software',
  'Healthcare & Life Sciences',
  'Finance & FinTech',
  'E-commerce & Consumer Brands',
  'Manufacturing & Industrial',
  'Education & EdTech',
  'Real Estate & Construction',
  'Food, Agriculture & Hospitality',
  'Professional & Business Services',
  'Media, Entertainment & Creative',
]

const STAGES = [
  'Idea / Prototyping',
  'Pre-Seed / Angel Funded',
  'Seed Stage ($1M - $3M)',
  'Series A ($3M - $10M)',
  'Series B+ Growth',
  'Bootstrapped & Profitable',
  'Grant & Academic Lab'
]

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

export default function BmfMemberDashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'jobs' | 'events' | 'settings'>('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  // Profile State
  const [profile, setProfile] = useState<BmfMember>(INITIAL_BMF_MEMBERS[0])
  const [jobs, setJobs] = useState<BmfJob[]>([])
  
  // Executive Metal Card State
  const [card, setCard] = useState<BmfCard>(generateDefaultCard())
  const [nfcSimulated, setNfcSimulated] = useState(false)

  // Card Application Form State
  const [isCardAppModalOpen, setIsCardAppModalOpen] = useState(false)
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false)
  const [cardAppForm, setCardAppForm] = useState({
    requested_tier: 'obsidian' as CardTier,
    traction_metric: '',
    pitch_tagline: '',
    portfolio_or_linkedin: '',
    why_join: '',
  })
  const [isSubmittingCardApp, setIsSubmittingCardApp] = useState(false)
  const [cardAppError, setCardAppError] = useState('')

  // Profile Form Save State
  const [profileForm, setProfileForm] = useState<Partial<BmfMember>>(INITIAL_BMF_MEMBERS[0])
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  const [customCategoryInput, setCustomCategoryInput] = useState('')
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null)
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [saveMessage, setSaveMessage] = useState('')

  // Job Form state
  const [isCreatingJob, setIsCreatingJob] = useState(false)
  const [jobForm, setJobForm] = useState<Partial<BmfJob>>({
    title: '',
    job_type: 'Full-time',
    location: 'Remote / Bangalore',
    salary: 'Competitive + Equity',
    description: '',
    tags: ['Next.js', 'React', 'TypeScript'],
    apply_url_or_email: '',
  })
  const [tagInput, setTagInput] = useState('')
  const [isSavingJob, setIsSavingJob] = useState(false)

  // Universal Auth Form State
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [authMessage, setAuthMessage] = useState('')

  // Pass Gating Modal State (for Jobs & Events)
  const [isPassModalOpen, setIsPassModalOpen] = useState(false)
  const [passModalFeature, setPassModalFeature] = useState<'job' | 'event'>('job')

  // Check if current user has an active / approved BMF Club Pass
  const hasActivePass = card?.approval_status === 'approved' || profile.role === 'admin'

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuthAndLoadData() {
      try {
        const supabase = getSupabaseBrowserClient()
        let authedUser: any = null

        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            authedUser = user
          }
        }

        if (authedUser) {
          setIsAuthenticated(true)
          const memberProfile = await ensureOrFetchUserProfile(authedUser)
          setProfile(memberProfile)
          setProfileForm(memberProfile)
          if (memberProfile.category && !CATEGORIES.includes(memberProfile.category)) {
            setIsCustomCategory(true)
            setCustomCategoryInput(memberProfile.category)
          } else {
            setIsCustomCategory(false)
            setCustomCategoryInput('')
          }

          // Fetch or generate membership card
          const memberCard = await fetchMemberCard(authedUser.id)
          const syncedCard: BmfCard = {
            ...memberCard,
            card_holder_name: memberProfile.full_name.toUpperCase(),
            company_name: memberProfile.company_name.toUpperCase(),
            user_id: authedUser.id,
            member_id: memberProfile.id,
          }
          setCard(syncedCard)
          setCardAppForm((prev) => ({
            ...prev,
            requested_tier: syncedCard.card_tier,
            traction_metric: memberProfile.metrics || '',
            pitch_tagline: memberProfile.tagline || '',
            portfolio_or_linkedin: memberProfile.linkedin_url || '',
          }))
        } else {
          // Check local demo persistence
          if (typeof window !== 'undefined') {
            const demoEmail = localStorage.getItem('bmf_current_user_email')
            if (demoEmail) {
              setIsAuthenticated(true)
              const stored = localStorage.getItem('bmf_current_member')
              if (stored) {
                const parsed = JSON.parse(stored)
                setProfile(parsed)
                setProfileForm(parsed)
                if (parsed.category && !CATEGORIES.includes(parsed.category)) {
                  setIsCustomCategory(true)
                  setCustomCategoryInput(parsed.category)
                } else {
                  setIsCustomCategory(false)
                  setCustomCategoryInput('')
                }
                const fallbackCard = generateDefaultCard(parsed)
                setCard(fallbackCard)
              } else {
                const demoProfile = {
                  ...INITIAL_BMF_MEMBERS[0],
                  email: demoEmail,
                  full_name: demoEmail.split('@')[0].toUpperCase(),
                }
                setProfile(demoProfile)
                setProfileForm(demoProfile)
                setIsCustomCategory(false)
                setCustomCategoryInput('')
                const fallbackCard = generateDefaultCard(demoProfile)
                setCard(fallbackCard)
              }
            } else {
              setIsAuthenticated(false)
            }
          } else {
            setIsAuthenticated(false)
          }
        }

        // Fetch jobs
        const memberJobs = await fetchMemberJobs()
        setJobs(memberJobs)
      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [])

  // Universal Auth Handlers
  const handleGoogleSignIn = async () => {
    setAuthStatus('loading')
    setAuthMessage('')
    try {
      const supabase = getSupabaseBrowserClient()
      if (supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=/bmf-club/dashboard`,
          },
        })
        if (error) {
          setAuthStatus('error')
          setAuthMessage(error.message)
        }
      } else {
        if (typeof window !== 'undefined') {
          localStorage.setItem('bmf_current_user_email', 'google.founder@bmf.club')
        }
        setIsAuthenticated(true)
      }
    } catch (err: any) {
      setAuthStatus('error')
      setAuthMessage(err.message || 'Google authentication failed')
    }
  }

  const handleGithubSignIn = async () => {
    setAuthStatus('loading')
    setAuthMessage('')
    try {
      const supabase = getSupabaseBrowserClient()
      if (supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=/bmf-club/dashboard`,
          },
        })
        if (error) {
          setAuthStatus('error')
          setAuthMessage(error.message)
        }
      } else {
        if (typeof window !== 'undefined') {
          localStorage.setItem('bmf_current_user_email', 'github.founder@bmf.club')
        }
        setIsAuthenticated(true)
      }
    } catch (err: any) {
      setAuthStatus('error')
      setAuthMessage(err.message || 'GitHub authentication failed')
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authEmail.trim()) {
      setAuthStatus('error')
      setAuthMessage('Please enter your email address.')
      return
    }
    setAuthStatus('loading')
    setAuthMessage('')

    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('bmf_current_user_email', authEmail)
        }
        setIsAuthenticated(true)
        return
      }

      if (authPassword.trim()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        })
        if (error) {
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email: authEmail,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback?next=/bmf-club/dashboard`,
            },
          })
          if (otpError) {
            setAuthStatus('error')
            setAuthMessage(error.message || otpError.message)
          } else {
            setAuthStatus('success')
            setAuthMessage('Magic login link sent to your email! Click the link to access your dashboard.')
          }
        } else if (data.user) {
          setIsAuthenticated(true)
          const memberProfile = await ensureOrFetchUserProfile(data.user)
          setProfile(memberProfile)
          setProfileForm(memberProfile)
        }
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email: authEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/bmf-club/dashboard`,
          },
        })
        if (error) {
          setAuthStatus('error')
          setAuthMessage(error.message)
        } else {
          setAuthStatus('success')
          setAuthMessage('Magic login link sent to your email! Check your inbox.')
        }
      }
    } catch (err: any) {
      setAuthStatus('error')
      setAuthMessage(err.message || 'Email authentication failed')
    }
  }

  const handleDemoAccess = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bmf_current_user_email', 'founder@bmf.club')
    }
    setIsAuthenticated(true)
  }

  // Profile Save / Update Handler with Deferred Cloudflare Upload & Supabase Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    setSaveStatus('idle')
    setSaveMessage('')

    try {
      let updatedAvatarUrl = profileForm.avatar_url
      let updatedLogoUrl = profileForm.company_logo

      // Upload staged WebP portrait if changed
      if (pendingAvatarFile) {
        const formData = new FormData()
        formData.append('file', pendingAvatarFile)
        formData.append('folder', 'founders')
        formData.append('userId', profile.user_id || profile.id || 'founder')

        const uploadRes = await fetch('/api/bmf/upload-media', {
          method: 'POST',
          body: formData,
        })
        const uploadData = await uploadRes.json()
        if (uploadRes.ok && uploadData.success && uploadData.url) {
          updatedAvatarUrl = uploadData.url
        } else {
          throw new Error(uploadData.error || 'Failed to upload portrait image to Cloudflare.')
        }
      }

      // Upload staged WebP company logo if changed
      if (pendingLogoFile) {
        const formData = new FormData()
        formData.append('file', pendingLogoFile)
        formData.append('folder', 'companies')
        formData.append('userId', profile.user_id || profile.id || 'founder')

        const uploadRes = await fetch('/api/bmf/upload-media', {
          method: 'POST',
          body: formData,
        })
        const uploadData = await uploadRes.json()
        if (uploadRes.ok && uploadData.success && uploadData.url) {
          updatedLogoUrl = uploadData.url
        } else {
          throw new Error(uploadData.error || 'Failed to upload company logo to Cloudflare.')
        }
      }

      const finalProfileData = {
        ...profileForm,
        avatar_url: updatedAvatarUrl,
        company_logo: updatedLogoUrl,
      }

      const res = await saveBmfMemberProfile(finalProfileData)
      if (res.success) {
        setSaveStatus('success')
        setSaveMessage('Profile & optimized images saved to database successfully!')
        setPendingAvatarFile(null)
        setPendingLogoFile(null)
        setProfile((prev) => ({
          ...prev,
          ...finalProfileData,
          avatar_url: finalProfileData.avatar_url ?? prev.avatar_url ?? '',
          company_logo: finalProfileData.company_logo ?? prev.company_logo ?? '',
          updated_at: new Date().toISOString(),
        }))
        setProfileForm(finalProfileData)
        // Update name on membership card
        setCard((prev) => ({
          ...prev,
          card_holder_name: (finalProfileData.full_name || prev.card_holder_name).toUpperCase(),
          company_name: (finalProfileData.company_name || prev.company_name).toUpperCase(),
        }))
        if (typeof window !== 'undefined') {
          localStorage.setItem('bmf_current_member', JSON.stringify({ ...profile, ...finalProfileData }))
        }
      } else {
        setSaveStatus('error')
        setSaveMessage(res.error || 'Failed to save profile.')
      }
    } catch (err: any) {
      setSaveStatus('error')
      setSaveMessage(err.message || 'Save error.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Card Pass Application Submission Handler
  const handleSubmitCardApp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardAppForm.traction_metric.trim() || !cardAppForm.why_join.trim()) {
      setCardAppError('Please provide your key traction metric and value to the syndicate.')
      return
    }

    setIsSubmittingCardApp(true)
    setCardAppError('')

    try {
      const res = await submitCardPassApplication(card, {
        requested_tier: cardAppForm.requested_tier,
        traction_metric: cardAppForm.traction_metric,
        pitch_tagline: cardAppForm.pitch_tagline || profile.tagline || '',
        portfolio_or_linkedin: cardAppForm.portfolio_or_linkedin || profile.linkedin_url || '',
        why_join: cardAppForm.why_join,
      })

      if (res.success && res.card) {
        setCard(res.card)
        setIsCardAppModalOpen(false)
      } else {
        setCardAppError(res.error || 'Failed to submit card pass application.')
      }
    } catch (err: any) {
      setCardAppError(err.message || 'Application submission error.')
    } finally {
      setIsSubmittingCardApp(false)
    }
  }

  // NFC Tap Simulation
  const handleSimulateNfc = () => {
    setNfcSimulated(true)
    setTimeout(() => setNfcSimulated(false), 3500)
  }

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingJob(true)

    try {
      const res = await saveBmfJob({
        ...jobForm,
        company_name: profile.company_name,
        company_logo: profile.company_logo,
      })

      if (res.success && res.job) {
        setJobs((prev) => [res.job!, ...prev.filter((j) => j.id !== res.job!.id)])
        setIsCreatingJob(false)
        setJobForm({
          title: '',
          job_type: 'Full-time',
          location: 'Remote',
          salary: '',
          description: '',
          tags: ['React', 'Next.js'],
          apply_url_or_email: '',
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSavingJob(false)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to remove this job opening?')) return
    await deleteBmfJob(jobId)
    setJobs((prev) => prev.filter((j) => j.id !== jobId))
  }

  const handleAddTag = () => {
    if (!tagInput.trim()) return
    const currentTags = jobForm.tags || []
    if (!currentTags.includes(tagInput.trim())) {
      setJobForm({ ...jobForm, tags: [...currentTags, tagInput.trim()] })
    }
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setJobForm({
      ...jobForm,
      tags: (jobForm.tags || []).filter((t) => t !== tagToRemove),
    })
  }

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bmf_current_user_email')
      localStorage.removeItem('bmf_current_member')
      localStorage.removeItem('bmf_member_card')
    }
    setIsAuthenticated(false)
    setAuthStatus('idle')
    setAuthMessage('')
    router.push('/bmf-club')
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08080a] text-white flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-xl">
          <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
        </div>
        <p className="text-xs font-mono text-neutral-400 tracking-wider uppercase">
          Initializing Founder Studio...
        </p>
      </div>
    )
  }

  // Unauthenticated Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#08080a] text-white p-4 relative overflow-hidden select-none font-sans">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12)_0%,transparent_70%)] pointer-events-none" />

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
            title="BMF Universal Auth"
            description="Sign in with your verified account to access the private Founder Studio."
            primaryAction={{
              label: authStatus === 'loading' ? "Authenticating..." : "Continue with Google",
              icon: authStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <IconGoogle />,
              onClick: handleGoogleSignIn,
              disabled: authStatus === 'loading',
            }}
            secondaryActions={[
              {
                label: "Continue with GitHub",
                icon: <IconGithub />,
                onClick: handleGithubSignIn,
                disabled: authStatus === 'loading',
              },
              {
                label: showEmailForm ? "Hide Email Login" : "Continue with Email",
                icon: <IconMail />,
                onClick: () => setShowEmailForm(!showEmailForm),
                disabled: authStatus === 'loading',
              },
            ]}
            skipAction={{
              label: "Instant Studio Preview (Demo Access)",
              onClick: handleDemoAccess,
            }}
            footerContent={
              <>
                By logging in, you agree to the{" "}
                <Link href="/about" className="cursor-pointer transition-colors hover:text-white underline underline-offset-2">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/about" className="cursor-pointer transition-colors hover:text-white underline underline-offset-2">Privacy Policy</Link>.
              </>
            }
          >
            {showEmailForm && (
              <form onSubmit={handleEmailSignIn} className="space-y-3 pt-1 pb-2 text-left animate-in fade-in-0 duration-300">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-300">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="founder@yourcompany.com"
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
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Sign In with Email / Magic Link</span>
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

  interface NavItem {
    id: 'overview' | 'profile' | 'jobs' | 'events' | 'settings'
    label: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string | number
    badgeColor?: string
  }

  const isCardLive = card.approval_status === 'approved'

  // NAV ITEMS
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Studio & 3D Card', icon: LayoutDashboard },
    { id: 'profile', label: 'Founder Profile Editor', icon: User },
    { id: 'jobs', label: 'Post Startup Jobs', icon: Briefcase, badge: jobs.length },
    { id: 'events', label: 'Masterminds & Events', icon: Calendar, badge: 'Live' },
    { id: 'settings', label: 'Account Settings', icon: Sliders },
  ]

  return (
    <div className="min-h-screen bg-[#08080a] text-white font-sans flex flex-col md:flex-row antialiased selection:bg-white selection:text-black">
      
      {/* ======================================================================= */}
      {/* MOBILE TOP BAR */}
      {/* ======================================================================= */}
      <div className="md:hidden sticky top-0 z-50 bg-[#101014]/90 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={BMF_LOGO_URL} alt="BMF" className="w-6 h-6 object-contain" />
          <span className="font-black text-sm text-white tracking-tight">BMF Studio</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ======================================================================= */}
      {/* DESKTOP & MOBILE SIDEBAR */}
      {/* ======================================================================= */}
      <aside className={`
        ${mobileMenuOpen ? 'block' : 'hidden'} md:flex
        fixed md:sticky top-0 left-0 z-40
        w-full md:w-72 h-screen
        bg-[#0d0d10] border-r border-neutral-800/80
        flex-col justify-between p-4 sm:p-6
        overflow-y-auto
      `}>
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="pb-2 border-b border-neutral-800/60">
            <Link href="/bmf-club" className="block group">
              <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                BMF Club
                <img src={BMF_LOGO_URL} alt="Verified" className="w-3.5 h-3.5 object-contain" />
              </h2>
              <p className="text-[10px] font-mono text-neutral-400">Founder Studio</p>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-left">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 px-3 py-1.5">
              Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer
                    ${isActive 
                      ? 'bg-white text-black font-bold shadow-md' 
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/80'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor 
                        ? item.badgeColor 
                        : isActive 
                        ? 'bg-neutral-200 text-black' 
                        : 'bg-neutral-800 text-neutral-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-4 border-t border-neutral-800/60 space-y-2.5 relative">
          
          {/* Dropup Menu */}
          {isUserMenuOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 p-1.5 rounded-2xl bg-[#141418] border border-neutral-700 shadow-2xl space-y-1 animate-in zoom-in-95 duration-150 z-50">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('profile')
                  setIsUserMenuOpen(false)
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer text-left"
              >
                <User className="w-4 h-4 text-neutral-400" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('settings')
                  setIsUserMenuOpen(false)
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer text-left"
              >
                <Sliders className="w-4 h-4 text-neutral-400" />
                <span>Account Settings</span>
              </button>

              <div className="border-t border-neutral-800 my-1" />

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer text-left font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* User Profile Card Dropup Trigger */}
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`w-full p-2.5 rounded-2xl border transition-all flex items-center gap-3 text-left cursor-pointer group ${
              isUserMenuOpen 
                ? 'bg-neutral-800/90 border-neutral-600 ring-1 ring-white/10' 
                : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/60'
            }`}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-800 border border-white/10 shrink-0 shadow-inner">
              <img
                src={normalizeR2Url(profile.avatar_url)}
                alt={profile.full_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_FOUNDER_AVATAR
                }}
              />
            </div>
            <div className="overflow-hidden text-left flex-1 min-w-0">
              <h3 className="text-xs font-bold text-white truncate">
                {profile.full_name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase ${
                  isCardLive 
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' 
                    : card.approval_status === 'pending'
                    ? 'bg-sky-950/80 text-sky-300 border border-sky-800/60'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                }`}>
                  {isCardLive ? `${card.card_tier} pass` : card.approval_status === 'pending' ? 'in review' : 'founder pass'}
                </span>
              </div>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-neutral-400 group-hover:text-white shrink-0 transition-colors" />
          </button>

          <Link
            href="/bmf-club"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <span>Live Showcase Directory</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </Link>
        </div>
      </aside>

      {/* ======================================================================= */}
      {/* MAIN CONTENT WORKSPACE */}
      {/* ======================================================================= */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-6xl overflow-y-auto">
        
        {/* Workspace Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-neutral-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Welcome, {profile.full_name.split(' ')[0]}
              <img src={BMF_LOGO_URL} alt="Verified" className="w-5 h-5 object-contain" />
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              BMF Founder Studio &bull; {profile.company_name}
            </p>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* TAB 1: STUDIO OVERVIEW & 3D CARD */}
        {/* ======================================================================= */}
        {activeTab === 'overview' && (
          <div className="py-8 space-y-8 animate-in fade-in-0 duration-300">
            
            {/* Main Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Live 3D Perspective Member Card */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center text-center gap-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 text-center">
                    Member Card
                  </span>
                  <MemberFlipCard member={profile} />
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-600 text-neutral-200 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm mt-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Edit Founder Card Details</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Founder Hub & Pass Card Snapshot */}
              <div className="lg:col-span-7 space-y-6 text-left">
                
                {/* Physical Pass Card Banner */}
                <div className="bg-gradient-to-br from-[#18181c] to-[#101014] rounded-3xl p-6 border border-neutral-800 space-y-4 shadow-xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-amber-400" />
                        <h3 className="text-base font-bold text-white">Executive BMF Club Pass</h3>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Laser-engraved physical metal pass with syndicate privileges.
                      </p>
                    </div>
                  </div>

                  {/* Card Display (Fully Unblurred) */}
                  <div className="pt-2 flex flex-col items-center justify-center space-y-3">
                    <div className="w-full flex justify-center">
                      <ExecutiveMetalCard card={card} showControls={false} />
                    </div>
                    {isCardLive && (
                      <>
                        {nfcSimulated && (
                          <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-600/70 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in zoom-in-95 duration-200">
                            <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
                            <span>NFC UID {card.nfc_uid} Verified &bull; Access Granted</span>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleSimulateNfc}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
                          >
                            <Wifi className="w-3.5 h-3.5 text-cyan-400 rotate-90" />
                            <span>Simulate NFC Tap</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => alert(`Digital Pass Token: ${card.card_number} (Added to Wallet)`)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow-md cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Add to Wallet</span>
                          </button>
                        </div>
                      </>
                    )}
                    {!isCardLive && (
                      <div className="pt-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => setIsComingSoonModalOpen(true)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold transition-all shadow-md cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Apply for Pass (Coming Soon)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-600 transition-all text-left space-y-2 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-sky-300">
                      Edit Profile & Bio &rarr;
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Upload portrait photos and elevator pitch.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      if (!hasActivePass) {
                        setPassModalFeature('job')
                        setIsPassModalOpen(true)
                      } else {
                        setActiveTab('jobs')
                        setIsCreatingJob(true)
                      }
                    }}
                    className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-600 transition-all text-left space-y-2 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">
                      Post a Startup Opening &rarr;
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Broadcast open roles directly to talent.
                    </p>
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 2: FOUNDER PROFILE EDITOR */}
        {/* ======================================================================= */}
        {activeTab === 'profile' && (
          <div className="py-8 animate-in fade-in-0 duration-300 max-w-4xl text-left space-y-8">
            <div className="space-y-1 border-b border-neutral-800 pb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Edit Founder Profile
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Update your photos, company information, and links.
              </p>
            </div>

            {saveStatus === 'success' && (
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-700/60 text-emerald-300 text-xs leading-relaxed flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-semibold">{saveMessage}</span>
              </div>
            )}

            {saveStatus === 'error' && (
              <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-700/60 text-rose-300 text-xs leading-relaxed flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="font-semibold">{saveMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Section 1: Photos */}
              <div className="bg-[#121216] p-6 rounded-3xl border border-neutral-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Photos & Logos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUploader
                    label="Founder Portrait"
                    description="Vertical portrait photo"
                    currentUrl={profileForm.avatar_url}
                    aspectRatio="portrait"
                    isPendingSave={Boolean(pendingAvatarFile)}
                    isUploading={isSavingProfile}
                    onFileSelect={(file, previewUrl) => {
                      setPendingAvatarFile(file)
                      setProfileForm((prev) => ({ ...prev, avatar_url: previewUrl }))
                    }}
                  />

                  <ImageUploader
                    label="Company Logo"
                    description="Square company logo icon"
                    currentUrl={profileForm.company_logo}
                    aspectRatio="square"
                    isPendingSave={Boolean(pendingLogoFile)}
                    isUploading={isSavingProfile}
                    onFileSelect={(file, previewUrl) => {
                      setPendingLogoFile(file)
                      setProfileForm((prev) => ({ ...prev, company_logo: previewUrl }))
                    }}
                  />
                </div>
              </div>

              {/* Section 2: Basic Identity */}
              <div className="bg-[#121216] p-6 rounded-3xl border border-neutral-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zane ProEd"
                      value={profileForm.full_name || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      Role / Title <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Founder & CEO"
                      value={profileForm.role || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      Company Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PharmPulse Health"
                      value={profileForm.company_name || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-300">
                      Industry Category <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      value={
                        isCustomCategory 
                          ? 'Other (Specify)' 
                          : (CATEGORIES.includes(profileForm.category || '') ? profileForm.category : 'Other (Specify)')
                      }
                      onChange={(e) => {
                        const val = e.target.value
                        if (val === 'Other (Specify)') {
                          setIsCustomCategory(true)
                          setProfileForm({ ...profileForm, category: customCategoryInput || '' })
                        } else {
                          setIsCustomCategory(false)
                          setProfileForm({ ...profileForm, category: val })
                        }
                      }}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="Other (Specify)">Other (Specify / Custom)</option>
                    </select>

                    {isCustomCategory && (
                      <div className="pt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                        <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                          Specify Custom Industry <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. AgriTech, Aerospace, Cybersecurity, Web3..."
                          value={customCategoryInput}
                          onChange={(e) => {
                            const val = e.target.value
                            setCustomCategoryInput(val)
                            setProfileForm({ ...profileForm, category: val })
                          }}
                          className="w-full bg-neutral-900 border border-emerald-500/60 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Pitch & Bio */}
              <div className="bg-[#121216] p-6 rounded-3xl border border-neutral-800 space-y-4">
                <h3 className="text-sm font-bold text-white">About & Pitch</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      1-Line Pitch / Tagline <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Autonomous AI tools accelerating clinical trials."
                      value={profileForm.tagline || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      Founder Bio & Background
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe what you are building and your experience..."
                      value={profileForm.description || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Stage & Metrics */}
              <div className="bg-[#121216] p-6 rounded-3xl border border-neutral-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Stage & Traction</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Stage</label>
                    <select
                      value={profileForm.stage || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, stage: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                    >
                      <option value="">None / Not Specified</option>
                      {STAGES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Key Metric / ARR</label>
                    <input
                      type="text"
                      placeholder="e.g. $250k ARR"
                      value={profileForm.metrics || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, metrics: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore & SF"
                      value={profileForm.location || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Team Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 12 Engineers"
                      value={profileForm.team_size || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, team_size: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Links */}
              <div className="bg-[#121216] p-6 rounded-3xl border border-neutral-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Social & Web Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">LinkedIn URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={profileForm.linkedin_url || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Twitter / X URL</label>
                    <input
                      type="url"
                      placeholder="https://x.com/..."
                      value={profileForm.twitter_url || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, twitter_url: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Company Website</label>
                    <input
                      type="url"
                      placeholder="https://yourcompany.com"
                      value={profileForm.website_url || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, website_url: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end">
                <Button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-white hover:bg-neutral-200 text-black px-8 py-3 rounded-full font-bold text-xs transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Save Profile</span>
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 3: STARTUP JOBS MANAGER */}
        {/* ======================================================================= */}
        {activeTab === 'jobs' && (
          <div className="py-8 animate-in fade-in-0 duration-300 max-w-4xl text-left space-y-8">
            
            {/* Exclusive Pass Gating Banner if Not Approved */}
            {!hasActivePass && (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#16161c] to-[#121216] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">Executive Pass Required</h4>
                      <span className="text-[9px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                        Exclusive Member Perk
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Only verified BMF Club Pass holders can publish hiring opportunities to the talent network.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsComingSoonModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply for Pass</span>
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white">Startup Job Manager</h2>
                <p className="text-xs sm:text-sm text-neutral-400">
                  Post open roles from <strong>{profile.company_name}</strong> to the public Jobs & Talent Hub.
                </p>
              </div>

              {!isCreatingJob && (
                <Button
                  type="button"
                  onClick={() => {
                    if (!hasActivePass) {
                      setPassModalFeature('job')
                      setIsPassModalOpen(true)
                    } else {
                      setIsCreatingJob(true)
                    }
                  }}
                  className="bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-full font-bold text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post New Opening</span>
                </Button>
              )}
            </div>

            {isCreatingJob && (
              <div className="bg-[#121216] rounded-3xl p-6 sm:p-8 border border-neutral-700 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <h3 className="text-lg font-bold text-white">Post a New Startup Role</h3>
                  <button
                    type="button"
                    onClick={() => setIsCreatingJob(false)}
                    className="text-xs text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateJob} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Job Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lead AI Systems Engineer"
                        value={jobForm.title || ''}
                        onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Job Type</label>
                      <select
                        value={jobForm.job_type || 'Full-time'}
                        onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract / Freelance">Contract / Freelance</option>
                        <option value="Internship / Resident">Internship / Resident</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Location</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Remote / Bangalore"
                        value={jobForm.location || ''}
                        onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Salary / Equity</label>
                      <input
                        type="text"
                        placeholder="e.g. $90k - $120k + 1.5% Equity"
                        value={jobForm.salary || ''}
                        onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Job Description & Responsibilities</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Outline core responsibilities, key milestones, and candidate requirements..."
                      value={jobForm.description || ''}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Apply Link or Email</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. https://careers.yourcompany.com/apply or jobs@yourcompany.com"
                      value={jobForm.apply_url_or_email || ''}
                      onChange={(e) => setJobForm({ ...jobForm, apply_url_or_email: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  {/* Skills / Tags */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-300">Skills / Tech Stack Tags</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add skill (e.g. PyTorch, Next.js)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                        className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                      <Button type="button" onClick={handleAddTag} className="bg-neutral-800 text-white text-xs px-4 rounded-xl">
                        Add
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {jobForm.tags?.map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 bg-neutral-800 text-neutral-300 text-xs px-3 py-1 rounded-full border border-neutral-700">
                          {t}
                          <button type="button" onClick={() => handleRemoveTag(t)} className="text-neutral-500 hover:text-white">
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <Button
                      type="submit"
                      disabled={isSavingJob}
                      className="bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-full font-bold text-xs"
                    >
                      {isSavingJob ? 'Publishing...' : 'Publish Job Opening'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Active Jobs List */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-neutral-400">
                Your Published Job Openings ({jobs.length})
              </h3>

              {jobs.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#121216] border border-neutral-800 text-center space-y-2">
                  <Briefcase className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400">No active job postings yet.</p>
                  <button
                    onClick={() => {
                      if (!hasActivePass) {
                        setPassModalFeature('job')
                        setIsPassModalOpen(true)
                      } else {
                        setIsCreatingJob(true)
                      }
                    }}
                    className="text-xs font-bold text-white hover:underline mt-1 cursor-pointer"
                  >
                    + Post your first role
                  </button>
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-[#121216] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{job.title}</h4>
                        <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full">
                          {job.job_type}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-mono">
                        {job.location} {job.salary ? `&bull; ${job.salary}` : ''}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {job.tags?.map((tag) => (
                          <span key={tag} className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={job.apply_url_or_email.startsWith('http') ? job.apply_url_or_email : `mailto:${job.apply_url_or_email}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-300 hover:text-white px-4 py-2 rounded-full border border-neutral-700 hover:border-neutral-500 transition-colors"
                      >
                        <span>Apply Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-neutral-500 hover:text-rose-400 p-2 transition-colors cursor-pointer"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 4: PRIVATE MASTERMINDS & EVENTS */}
        {/* ======================================================================= */}
        {activeTab === 'events' && (
          <div className="py-8 animate-in fade-in-0 duration-300 max-w-4xl text-left space-y-8">
            
            {/* Exclusive Pass Gating Banner if Not Approved */}
            {!hasActivePass && (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#16161c] to-[#121216] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">Executive Pass Required for Masterminds</h4>
                      <span className="text-[9px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                        Syndicate Access
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Closed-door masterminds, investor dinners, and event hosting are reserved for active BMF Club Pass holders.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsComingSoonModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply for Pass</span>
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white">Private Founder Masterminds</h2>
                <p className="text-xs sm:text-sm text-neutral-400">
                  Closed-door sessions, strategic roundtables, and VIP investor dinners across Bangalore and Silicon Valley.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => {
                  if (!hasActivePass) {
                    setPassModalFeature('event')
                    setIsPassModalOpen(true)
                  } else {
                    alert('Founder Mastermind Host Portal is active. Our concierge team will reach out to schedule your session.')
                  }
                }}
                className="bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-full font-bold text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Propose Mastermind</span>
              </Button>
            </div>

            {/* Empty Masterminds State */}
            <div className="p-10 rounded-3xl bg-[#121216] border border-neutral-800 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700/80 text-neutral-400 flex items-center justify-center mx-auto shadow-inner">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-bold text-white">No Active Masterminds Scheduled</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Upcoming closed-door roundtables and VIP founder sessions will appear here once announced.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!hasActivePass) {
                    setPassModalFeature('event')
                    setIsPassModalOpen(true)
                  } else {
                    alert('Mastermind Proposal portal is active. Our concierge team will reach out to schedule your session.')
                  }
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Propose a Session</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 5: ACCOUNT SETTINGS */}
        {/* ======================================================================= */}
        {activeTab === 'settings' && (
          <div className="py-8 animate-in fade-in-0 duration-300 max-w-2xl text-left space-y-6">
            <div className="space-y-1 border-b border-neutral-800 pb-4">
              <h2 className="text-2xl font-bold text-white">Founder Account Settings</h2>
              <p className="text-xs text-neutral-400">
                Manage your credentials, notification channels, and privacy preferences.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Registered Email</label>
                <input
                  type="email"
                  disabled
                  value={profile.email || 'founder@company.com'}
                  className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-400 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">WhatsApp Notification Alerts</label>
                <div className="flex items-center justify-between p-3.5 bg-neutral-900 rounded-xl border border-neutral-800">
                  <span className="text-xs text-neutral-300">Instant mastermind & dinner RSVPs</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">Active</span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors cursor-pointer"
                >
                  Sign Out of Founder Studio
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ======================================================================= */}
      {/* GLOBAL APPLICATION MODAL */}
      {/* ======================================================================= */}
      {isCardAppModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121216] border border-neutral-700 w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-left my-8 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-400 text-[10px] font-mono font-bold uppercase">
                  Executive Pass Intake
                </div>
                <h3 className="text-xl font-bold text-white">
                  Apply for BMF Club Membership Pass
                </h3>
              </div>

              <button
                onClick={() => setIsCardAppModalOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cardAppError && (
              <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-700/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{cardAppError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitCardApp} className="space-y-4">
              
              {/* Select Requested Tier */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Requested Membership Pass Tier <span className="text-amber-400">*</span>
                </label>
                <select
                  value={cardAppForm.requested_tier}
                  onChange={(e) => setCardAppForm({ ...cardAppForm, requested_tier: e.target.value as CardTier })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                >
                  {(Object.keys(CARD_TIERS) as CardTier[]).map((tierKey) => (
                    <option key={tierKey} value={tierKey}>
                      {CARD_TIERS[tierKey].name} ({CARD_TIERS[tierKey].subtitle})
                    </option>
                  ))}
                </select>
              </div>

              {/* Venture Traction Metric */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Key Traction Metric / ARR / Funding <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. $400k ARR, 15k MAU, or Seed Funded ($1.5M)"
                  value={cardAppForm.traction_metric}
                  onChange={(e) => setCardAppForm({ ...cardAppForm, traction_metric: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                />
              </div>

              {/* Pitch Tagline */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  1-Line Pitch / Innovation Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Autonomous agent pipelines for distributed bio-molecular research"
                  value={cardAppForm.pitch_tagline}
                  onChange={(e) => setCardAppForm({ ...cardAppForm, pitch_tagline: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                />
              </div>

              {/* LinkedIn / Portfolio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Founder LinkedIn or Personal Portfolio
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={cardAppForm.portfolio_or_linkedin}
                  onChange={(e) => setCardAppForm({ ...cardAppForm, portfolio_or_linkedin: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                />
              </div>

              {/* Value to Syndicate */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Why do you want to join and what value can you bring to the mastermind? <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share your technical expertise, domain knowledge, or how you intend to collaborate with other founders..."
                  value={cardAppForm.why_join}
                  onChange={(e) => setCardAppForm({ ...cardAppForm, why_join: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCardAppModalOpen(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>

                <Button
                  type="submit"
                  disabled={isSubmittingCardApp}
                  className="bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-full font-bold text-xs transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  {isSubmittingCardApp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Application for Review</span>
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* PASS GATING MODAL (FOR JOBS & EVENTS) */}
      {/* ======================================================================= */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in-0 duration-200">
          <div className="bg-[#141418] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 text-left border-t-amber-500/40">
            
            <button
              type="button"
              onClick={() => setIsPassModalOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white p-2 rounded-full bg-neutral-900 border border-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Pass Header Icon */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-900/40 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                  BMF CLUB PASS PRIVILEGE
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {passModalFeature === 'job' 
                    ? 'Executive Pass Required to Post Jobs' 
                    : 'Executive Pass Required to Host Masterminds'}
                </h3>
              </div>
            </div>

            {/* Explanation */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {passModalFeature === 'job'
                ? 'Startup Job Postings are reserved exclusively for active BMF Club Pass holders to maintain the highest quality signal across our ecosystem and talent directory.'
                : 'Hosting private closed-door masterminds and investor roundtables is an exclusive benefit reserved for active BMF Club Pass holders.'}
            </p>

            {/* Pass Benefits List */}
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                Included with BMF Executive Pass:
              </span>
              <div className="space-y-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited verified job posts with direct founder branding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Host closed-door masterminds & VIP investor dinners</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Laser-engraved physical metal pass with NFC syndicate credentials</span>
                </div>
              </div>
            </div>

            {/* Modal CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                type="button"
                onClick={() => {
                  setIsPassModalOpen(false)
                  setIsComingSoonModalOpen(true)
                }}
                className="w-full sm:w-auto flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black px-6 py-3 rounded-full font-bold text-xs transition-all shadow-lg shadow-amber-500/10 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Apply for Founder Pass</span>
              </Button>

              <button
                type="button"
                onClick={() => setIsPassModalOpen(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Maybe Later
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* PASS COMING SOON MODAL */}
      {/* ======================================================================= */}
      {isComingSoonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in-0 duration-200">
          <div className="bg-[#141418] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6 text-center border-t-amber-500/40">
            
            <button
              type="button"
              onClick={() => setIsComingSoonModalOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white p-2 rounded-full bg-neutral-900 border border-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-900/40 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                EXCLUSIVE FOUNDER PASS
              </span>
              <h3 className="text-xl font-bold text-white">
                Pass Applications Opening Soon
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed pt-1">
                The laser-engraved BMF Executive Metal Pass with NFC syndicate access is currently in private minting. Pass intake will open soon for founding members.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2 text-left text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Priority Talent & Verified Hiring Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Closed-Door Mastermind & Dinner Invites</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct Syndicate & Investor Connections</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => {
                setIsComingSoonModalOpen(false)
                alert('You are on the priority founding member list! We will notify you when passes go live.')
              }}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black py-3 rounded-full font-bold text-xs transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              Join Priority Waitlist
            </Button>

          </div>
        </div>
      )}

    </div>
  )
}
