'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  BmfMember, 
  BmfJob, 
  INITIAL_BMF_MEMBERS, 
  saveBmfMemberProfile, 
  submitShowcaseApplication,
  fetchMemberJobs,
  saveBmfJob,
  deleteBmfJob,
  getSupabaseBrowserClient
} from '@/lib/supabase/bmf-members'
import { MemberFlipCard } from '@/components/bmf-club/member-flip-card'
import { ImageUploader } from '@/components/bmf-club/image-uploader'
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Globe, 
  Linkedin, 
  Twitter, 
  ShieldCheck, 
  RefreshCw,
  LogOut,
  Briefcase,
  User,
  Sliders,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Send,
  Building2,
  Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const CATEGORIES = [
  'Healthcare AI',
  'BioTech',
  'MedTech',
  'FinTech',
  'Developer Tools',
  'AI Infrastructure',
  'Logistics Tech',
  'Creative Tech',
  'Enterprise SaaS',
  'CleanTech / Energy',
  'D2C Consumer',
  'EdTech'
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

export default function BmfMemberDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'showcase' | 'jobs' | 'settings'>('overview')
  const [profile, setProfile] = useState<BmfMember>(INITIAL_BMF_MEMBERS[0])
  const [jobs, setJobs] = useState<BmfJob[]>([])
  
  // Showcase Form state
  const [showcaseForm, setShowcaseForm] = useState<Partial<BmfMember>>(INITIAL_BMF_MEMBERS[0])
  const [isSubmittingShowcase, setIsSubmittingShowcase] = useState(false)
  const [showcaseStatus, setShowcaseStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showcaseMessage, setShowcaseMessage] = useState('')

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

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = getSupabaseBrowserClient()
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: member } = await supabase
              .from('bmf_members')
              .select('*')
              .eq('user_id', user.id)
              .single()

            if (member) {
              setProfile(member as BmfMember)
              setShowcaseForm(member as BmfMember)
            }
          }
        } else {
          // Local demo storage fallback
          if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('bmf_current_member')
            if (stored) {
              const parsed = JSON.parse(stored)
              setProfile(parsed)
              setShowcaseForm(parsed)
            }
          }
        }

        // Fetch jobs
        const memberJobs = await fetchMemberJobs()
        setJobs(memberJobs)
      } catch (err) {
        console.error('Error loading dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleShowcaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingShowcase(true)
    setShowcaseStatus('idle')
    setShowcaseMessage('')

    try {
      const res = await submitShowcaseApplication(showcaseForm)
      if (res.success) {
        setShowcaseStatus('success')
        setShowcaseMessage('Showcase application submitted! Dr. Melwin’s admissions desk will review your profile and send an email notification upon approval.')
        setProfile((prev) => ({
          ...prev,
          ...showcaseForm,
          review_status: 'pending',
          is_approved: false,
        }))
      } else {
        setShowcaseStatus('error')
        setShowcaseMessage(res.error || 'Failed to submit showcase application.')
      }
    } catch (err: any) {
      setShowcaseStatus('error')
      setShowcaseMessage(err.message || 'Submission error.')
    } finally {
      setIsSubmittingShowcase(false)
    }
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
    }
    router.push('/bmf-club')
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white font-sans selection:bg-white selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#121215]/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/bmf-club"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">BMF Directory</span>
          </Link>
          <div className="h-4 w-px bg-neutral-700 hidden sm:block" />
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-200">
              Founder Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/bmf-club"
            className="text-xs text-neutral-300 hover:text-white px-3.5 py-1.5 rounded-full border border-neutral-700 hover:border-neutral-500 transition-colors hidden sm:inline-block"
          >
            Live Showcase
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-xs text-neutral-400 hover:text-rose-400 px-3 py-1.5 rounded-full border border-neutral-800 hover:border-rose-900/50 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Profile Header Bar */}
        <div className="bg-[#151518] rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-neutral-800 border border-white/10 shrink-0 shadow-lg">
              <img
                src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.full_name}</h1>
                <img 
                  src="https://img.icons8.com/stickers/500/verified-badge.png" 
                  alt="Verified" 
                  className="w-5 h-5 object-contain" 
                />
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 font-mono">
                {profile.role} &bull; <span className="text-white font-semibold">{profile.company_name}</span>
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded-full border border-neutral-700">
                  {profile.category}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                  {profile.stage}
                </span>
              </div>
            </div>
          </div>

          {/* Review Status Badge */}
          <div className="flex flex-col md:items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400">Showcase Status:</span>
              {profile.review_status === 'approved' || profile.is_approved ? (
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Live in Directory
                </span>
              ) : profile.review_status === 'rejected' ? (
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/80 border border-rose-700/60 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Revision Requested
                </span>
              ) : (
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-700/60 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Pending Review
                </span>
              )}
            </div>

            <p className="text-[11px] text-neutral-500 font-mono">
              Member ID: {profile.id.slice(0, 12)}
            </p>
          </div>
        </div>

        {/* Rejection / Revision Feedback Alert */}
        {profile.review_status === 'rejected' && profile.admin_feedback && (
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-5 text-left space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Admissions Committee Feedback</span>
            </div>
            <p className="text-xs text-rose-200 leading-relaxed font-mono whitespace-pre-wrap">
              {profile.admin_feedback}
            </p>
            <button
              onClick={() => setActiveTab('showcase')}
              className="text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white px-4 py-1.5 rounded-full transition-colors mt-1 inline-flex items-center gap-1"
            >
              <span>Update Showcase Submission</span>
              &rarr;
            </button>
          </div>
        )}

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Studio Overview & Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'showcase'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-900/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Showcase Application Form</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'jobs'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-900/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Post Startup Jobs ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-900/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>

        {/* TAB 1: STUDIO OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Card Live Preview */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Live 3D Card Preview
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  Hover / Click to Flip
                </span>
              </div>

              {/* Render Interactive Card */}
              <div className="max-w-[340px] mx-auto lg:mx-0">
                <MemberFlipCard member={profile} />
              </div>
            </div>

            {/* Right: Actions & Ecosystem Hub */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="bg-[#151518] rounded-3xl p-6 sm:p-8 border border-neutral-800 space-y-5">
                <h3 className="text-xl font-bold text-white">Founder Quick Actions</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Welcome to the BMF Club Founder Studio. Manage your directory appearance, syndicate deal memos, and discover high-signal candidates for your team.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('showcase')}
                    className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-all text-left space-y-2 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-sky-300">
                      Apply for Directory Showcase &rarr;
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Upload your portrait and company bio to be featured.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('jobs')
                      setIsCreatingJob(true)
                    }}
                    className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-all text-left space-y-2 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">
                      Post a Startup Opening &rarr;
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Broadcast open roles directly to the Jobs & Talent hub.
                    </p>
                  </button>
                </div>
              </div>

              {/* Founder Perks Checklist */}
              <div className="bg-[#151518] rounded-3xl p-6 sm:p-8 border border-neutral-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-neutral-400">
                  BMF Club Membership Inclusions
                </h3>
                <ul className="space-y-3 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Verified Founder Badge on global directory & deal syndicates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Private Founder-to-Founder WhatsApp Mastermind access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited job & internship postings on Jobs & Talent Marketplace</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Quarterly Strategic Growth Audit with Dr. Melwin’s team</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SHOWCASE APPLICATION FORM */}
        {activeTab === 'showcase' && (
          <div className="bg-[#151518] rounded-3xl p-6 sm:p-10 border border-neutral-800 shadow-2xl max-w-4xl mx-auto text-left space-y-8">
            <div className="space-y-2 border-b border-neutral-800 pb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800/50 text-sky-400 text-[11px] font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Showcase Admission Submission</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Submit Your Founder Showcase Card
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Upload your portrait photo and company details. All images are securely stored on Cloudflare R2 and submitted for admissions review.
              </p>
            </div>

            {showcaseStatus === 'success' && (
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-700/60 text-emerald-300 text-xs leading-relaxed flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Application Received!</p>
                  <p>{showcaseMessage}</p>
                </div>
              </div>
            )}

            {showcaseStatus === 'error' && (
              <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-700/60 text-rose-300 text-xs leading-relaxed flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Submission Error</p>
                  <p>{showcaseMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleShowcaseSubmit} className="space-y-6">
              
              {/* SECTION: Cloudflare R2 Media Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800">
                {/* Founder Photo */}
                <ImageUploader
                  label="Founder Portrait Photo"
                  description="High-resolution vertical portrait image (Cloudflare R2)"
                  currentUrl={showcaseForm.avatar_url}
                  folder="founders"
                  userId={profile.user_id || profile.id}
                  aspectRatio="portrait"
                  onUploadComplete={(url) => setShowcaseForm({ ...showcaseForm, avatar_url: url })}
                />

                {/* Company Logo */}
                <ImageUploader
                  label="Company / Startup Logo"
                  description="Square logo icon with transparent or dark background"
                  currentUrl={showcaseForm.company_logo}
                  folder="companies"
                  userId={profile.user_id || profile.id}
                  aspectRatio="square"
                  onUploadComplete={(url) => setShowcaseForm({ ...showcaseForm, company_logo: url })}
                />
              </div>

              {/* SECTION: Basic Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Founder Full Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. S Kishore"
                    value={showcaseForm.full_name || ''}
                    onChange={(e) => setShowcaseForm({ ...showcaseForm, full_name: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Official Role / Designation <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Founder & CEO"
                    value={showcaseForm.role || ''}
                    onChange={(e) => setShowcaseForm({ ...showcaseForm, role: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Company / Startup Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PharmPulse Health"
                    value={showcaseForm.company_name || ''}
                    onChange={(e) => setShowcaseForm({ ...showcaseForm, company_name: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Industry Category <span className="text-emerald-400">*</span>
                  </label>
                  <select
                    value={showcaseForm.category || 'Healthcare AI'}
                    onChange={(e) => setShowcaseForm({ ...showcaseForm, category: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SECTION: Elevator Pitch & Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  1-Line Elevator Hook / Tagline <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous AI pipelines accelerating clinical trial documentation and dosage validation."
                  value={showcaseForm.tagline || ''}
                  onChange={(e) => setShowcaseForm({ ...showcaseForm, tagline: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Founder Background & Tech Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly state your technical innovation, market impact, and what you are building..."
                  value={showcaseForm.description || ''}
                  onChange={(e) => setShowcaseForm({ ...showcaseForm, description: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white resize-none"
                />
              </div>

              {/* SECTION: Venture Stage & Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Venture Stage</label>
                  <select
                    value={showcaseForm.stage || 'Seed Stage ($1M - $3M)'}
                    onChange={(e) => setShowcaseForm({ ...showcaseForm, stage: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Traction Metric</label>
                  <input
                    type="text"
                    placeholder="e.g. $210k ARR in 8 mos"
                    value={showcaseForm.metrics || ''}
                    onChange={(e) => setShowcaseForm({ ...showcaseForm, metrics: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore & SF"
                    value={showcaseForm.location || ''}
                    onChange={(e) => setShowcaseForm({ ...showcaseForm, location: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Team Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 18 Engineers"
                    value={showcaseForm.team_size || ''}
                    onChange={(e) => setShowcaseForm({ ...showcaseForm, team_size: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* SECTION: Social & Web URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">LinkedIn Profile</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={showcaseForm.linkedin_url || ''}
                    onChange={(e) => setShowcaseForm({ ...showcaseForm, linkedin_url: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Twitter / X URL</label>
                  <input
                    type="url"
                    placeholder="https://x.com/..."
                    value={showcaseForm.twitter_url || ''}
                    onChange={(e) => setShowcaseForm({ ...showcaseForm, twitter_url: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Company Website</label>
                  <input
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={showcaseForm.website_url || ''}
                    onChange={(e) => setShowcaseForm({ ...showcaseForm, website_url: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-neutral-800">
                <p className="text-[11px] text-neutral-500 font-mono">
                  Submissions are reviewed by Dr. Melwin’s admissions desk within 24h.
                </p>

                <Button
                  type="submit"
                  disabled={isSubmittingShowcase}
                  className="bg-white hover:bg-neutral-200 text-black px-8 py-3 rounded-full font-bold text-xs transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  {isSubmittingShowcase ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting to Admissions...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit for Showcase Review</span>
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: POST STARTUP JOBS */}
        {activeTab === 'jobs' && (
          <div className="space-y-8 max-w-5xl mx-auto text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white">Startup Job Manager</h2>
                <p className="text-xs sm:text-sm text-neutral-400">
                  Post open roles from <strong>{profile.company_name}</strong> to the public Jobs & Talent Hub for free.
                </p>
              </div>

              {!isCreatingJob && (
                <Button
                  type="button"
                  onClick={() => setIsCreatingJob(true)}
                  className="bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-full font-bold text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post New Opening</span>
                </Button>
              )}
            </div>

            {/* Create Job Form Modal/Section */}
            {isCreatingJob && (
              <div className="bg-[#151518] rounded-3xl p-6 sm:p-8 border border-neutral-700 shadow-xl space-y-6">
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
                      <label className="text-xs font-semibold text-neutral-300">Job Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Frontend Engineer"
                        value={jobForm.title}
                        onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Employment Type</label>
                      <select
                        value={jobForm.job_type}
                        onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship (Paid)">Internship (Paid)</option>
                        <option value="Contract / Freelance">Contract / Freelance</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Remote / Bangalore / Hybrid"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Compensation / Range</label>
                      <input
                        type="text"
                        placeholder="e.g. ₹12L - ₹18L / yr + ESOPs"
                        value={jobForm.salary}
                        onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Application Email or URL *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. jobs@yourcompany.com or https://careers.yourcompany.com"
                      value={jobForm.apply_url_or_email}
                      onChange={(e) => setJobForm({ ...jobForm, apply_url_or_email: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  {/* Skills / Tags */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-300">Tech Stack & Tags</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Python, PyTorch, LangChain"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                        className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Add Tag
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(jobForm.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-[11px] font-mono bg-neutral-800 text-neutral-200 px-2.5 py-1 rounded-full border border-neutral-700"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-neutral-400 hover:text-rose-400"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Role Summary & Requirements *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Detail the technical responsibilities, key milestones, and candidate requirements..."
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCreatingJob(false)}
                      className="px-5 py-2 rounded-full text-xs font-semibold text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      disabled={isSavingJob}
                      className="bg-white hover:bg-neutral-200 text-black px-6 py-2 rounded-full font-bold text-xs transition-all cursor-pointer"
                    >
                      {isSavingJob ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Publish Live Opening</span>
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* List of Posted Jobs */}
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="bg-[#151518] rounded-3xl p-12 border border-neutral-800 text-center space-y-3">
                  <Briefcase className="w-10 h-10 text-neutral-600 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No Open Roles Posted Yet</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Post your first opening to attract top software engineers, designers, and growth talent across the Tamil Nadu ecosystem.
                  </p>
                  <Button
                    onClick={() => setIsCreatingJob(true)}
                    className="bg-white hover:bg-neutral-200 text-black px-6 py-2 rounded-full font-bold text-xs transition-all cursor-pointer mt-2"
                  >
                    Post an Opening
                  </Button>
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-[#151518] rounded-3xl p-6 sm:p-7 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-neutral-700 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-neutral-400">
                          {job.company_name}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-neutral-800 text-emerald-400 px-2.5 py-0.5 rounded-full border border-neutral-700">
                          {job.job_type}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500">
                          📍 {job.location}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white">{job.title}</h3>

                      {job.salary && (
                        <p className="text-xs font-mono text-emerald-400 font-semibold">
                          💰 {job.salary}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(job.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded-md border border-neutral-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
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

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-[#151518] rounded-3xl p-6 sm:p-10 border border-neutral-800 shadow-2xl max-w-2xl mx-auto text-left space-y-6">
            <div className="space-y-1 border-b border-neutral-800 pb-4">
              <h2 className="text-xl font-bold text-white">Founder Account Settings</h2>
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

      </div>
    </div>
  )
}
