'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { fetchBmfJobs, BmfJob } from '@/lib/supabase/bmf-members'
import {
  Briefcase,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Send,
  Loader2,
  Building2,
  Clock,
  MapPin,
  DollarSign,
  GraduationCap,
  PlusCircle,
  ExternalLink,
  Filter
} from 'lucide-react'

// Live demo talent profiles in Tamil Nadu startup ecosystem
const candidateList = [
  {
    id: 'c1',
    name: 'Kavitha Ramesh',
    role: 'Full-Stack Next.js & React Developer',
    type: 'Full-time / Remote',
    experience: '3 Years Experience',
    location: 'Chennai / Remote',
    skills: ['React.js', 'Next.js', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
    bio: 'Built 4 production web apps and real-time dashboards. Fast executor who loves shipping MVPs in days.',
    availability: 'Available Immediately',
  },
  {
    id: 'c2',
    name: 'Vignesh Balaji',
    role: 'AI / Python Engineer',
    type: 'Full-time / Hybrid',
    experience: '2 Years Experience',
    location: 'Coimbatore / Bangalore',
    skills: ['Python', 'FastAPI', 'LangChain', 'OpenAI APIs', 'Vector DBs'],
    bio: 'Experienced in fine-tuning LLMs, building custom retrieval chatbots, and automating internal workflows.',
    availability: '2 Weeks Notice',
  },
  {
    id: 'c3',
    name: 'Deepika S.',
    role: 'Product Designer (UI / UX)',
    type: 'Freelance / Contract',
    experience: '4 Years Experience',
    location: 'Madurai / Remote',
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Mobile Apps'],
    bio: 'Designed clean mobile apps and SaaS interfaces used by over 50,000 active users. Passionate about simple UX.',
    availability: 'Taking 2 Freelance Projects',
  },
  {
    id: 'c4',
    name: 'Rohan Daniel',
    role: 'Growth & Performance Marketer',
    type: 'Part-time / Freelance',
    experience: '3 Years Experience',
    location: 'Chennai',
    skills: ['Meta Ads', 'Google Ads', 'SEO Copywriting', 'Conversion Optimization'],
    bio: 'Scaled D2C and B2B startups from ₹0 to ₹15L monthly revenue with a healthy 3.5x average ROAS.',
    availability: 'Available Immediately',
  },
  {
    id: 'c5',
    name: 'Ananya Krishnan',
    role: 'Content & Social Media Specialist',
    type: 'Full-time / Remote',
    experience: '1.5 Years Experience',
    location: 'Trichy / Remote',
    skills: ['Reels Creation', 'LinkedIn Growth', 'Video Editing', 'Canva', 'Community'],
    bio: 'Grew startup Instagram pages from 0 to 45k followers with viral short-form reels and relatable tech storytelling.',
    availability: 'Available Immediately',
  },
  {
    id: 'c6',
    name: 'Mohammed Imran',
    role: 'Frontend Engineering Intern',
    type: 'Internship (3-6 Months)',
    experience: 'Final Year CS Student',
    location: 'Salem / Remote',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Git', 'REST APIs'],
    bio: 'Winner of 2 state-level hackathons. Looking for a high-intensity startup internship to learn and build real products.',
    availability: 'Immediate Joiner',
  },
]

// Open startup roles
const openRolesList = [
  {
    id: 'j1',
    company: 'SynapsePulse AI',
    title: 'Senior Frontend Engineer (React/Next.js)',
    type: 'Full-time',
    location: 'Chennai (Hybrid)',
    salary: '₹8L - ₹14L / annum',
    tags: ['Next.js', 'Tailwind', 'TypeScript'],
  },
  {
    id: 'j2',
    company: 'Zane ProEd',
    title: 'EdTech Community & Growth Lead',
    type: 'Full-time',
    location: 'Bangalore / Chennai',
    salary: '₹6L - ₹10L / annum + Incentives',
    tags: ['Community', 'Partnerships', 'Social'],
  },
  {
    id: 'j3',
    company: 'Alphatic Labs',
    title: 'Embedded Firmware / Hardware Engineer',
    type: 'Full-time',
    location: 'Bangalore',
    salary: '₹10L - ₹18L / annum + ESOPs',
    tags: ['C/C++', 'Microcontrollers', 'Medical Device'],
  },
  {
    id: 'j4',
    company: 'Wocha Lifestyle',
    title: 'Graphic & Apparel Designer',
    type: 'Part-time / Freelance',
    location: 'Remote',
    salary: '₹25,000 - ₹40,000 / month',
    tags: ['Photoshop', 'Illustrator', 'Apparel'],
  },
]

export default function JobsTalentPage() {
  const [activeTab, setActiveTab] = useState<'candidates' | 'jobs'>('candidates')
  const [candidateSearch, setCandidateSearch] = useState('')
  const [activeFormModal, setActiveFormModal] = useState<'none' | 'candidate' | 'job'>('none')

  // Candidate Profile Form State
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    experience: '1-3 Years',
    work_type: 'Full-time',
    portfolio_url: '',
    skills: '',
    message: '',
  })

  // Live Founder Jobs State
  const [founderJobs, setFounderJobs] = useState<BmfJob[]>([])

  useEffect(() => {
    async function loadJobs() {
      try {
        const live = await fetchBmfJobs()
        setFounderJobs(live)
      } catch (err) {
        console.error('Error loading founder jobs:', err)
      }
    }
    loadJobs()
  }, [])

  // Post a Job Form State
  const [jobForm, setJobForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    job_title: '',
    job_type: 'Full-time',
    location: 'Remote / Tamil Nadu',
    salary: '',
    message: '',
  })

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const filteredCandidates = candidateList.filter((c) => {
    const q = candidateSearch.toLowerCase()
    return c.name.toLowerCase().includes(q) ||
           c.role.toLowerCase().includes(q) ||
           c.skills.some((s) => s.toLowerCase().includes(q)) ||
           c.location.toLowerCase().includes(q)
  })

  const handleCandidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'talent_profile',
          name: candidateForm.name,
          email: candidateForm.email,
          phone: candidateForm.phone,
          role: candidateForm.role,
          experience: candidateForm.experience,
          work_type: candidateForm.work_type,
          portfolio_url: candidateForm.portfolio_url,
          skills: candidateForm.skills,
          message: candidateForm.message,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setFormStatus('success')
      } else {
        setFormStatus('error')
        setErrorMessage(data.error || 'Failed to create profile. Please try again.')
      }
    } catch {
      setFormStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'talent_job_post',
          name: jobForm.name,
          email: jobForm.email,
          phone: jobForm.phone,
          company: jobForm.company,
          job_title: jobForm.job_title,
          job_type: jobForm.job_type,
          location: jobForm.location,
          salary: jobForm.salary,
          message: jobForm.message,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setFormStatus('success')
      } else {
        setFormStatus('error')
        setErrorMessage(data.error || 'Failed to post job. Please try again.')
      }
    } catch {
      setFormStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden bg-[#f2f2f2] text-[#111111]">
      <div className="grain-overlay" />
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 md:px-12 w-full relative">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% FREE FOR TALENT & HIRING STARTUPS</span>
            </div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#111111] max-w-4xl mx-auto leading-[1.05]"
          >
            Jobs & Talent 💼 <br />
            <span className="text-[#777777]">The Startup Talent Hub for Tamil Nadu.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-[#555555] max-w-3xl mx-auto font-normal leading-relaxed"
          >
            A completely free platform connecting hungry developers, designers, interns, and marketers directly with innovative startup founders looking to hire.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <button
              type="button"
              onClick={() => {
                setActiveFormModal('candidate')
                setFormStatus('idle')
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Create Free Talent Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveFormModal('job')
                setFormStatus('idle')
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm transition-colors shadow-xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Post a Free Job / Internship</span>
            </button>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-left">
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">₹0 Fee</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">100% Free Forever</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">Direct</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">Talk to Founders</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">4 Roles</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">Full / Part / Intern / Gig</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">Local</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">TN Tech Ecosystem</span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Tabs: Candidates vs Open Jobs */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 w-full border-t border-black/[0.04]">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Tab Buttons */}
            <div className="flex items-center p-1.5 bg-white border border-black/10 rounded-full shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('candidates')}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'candidates'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-[#666666] hover:text-black'
                }`}
              >
                Browse Talent ({filteredCandidates.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('jobs')}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'jobs'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-[#666666] hover:text-black'
                }`}
              >
                Open Startup Roles ({openRolesList.length})
              </button>
            </div>

            {/* Search Input for Candidates */}
            {activeTab === 'candidates' && (
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search skills, roles or location..."
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-full pl-9 pr-4 py-2 text-xs text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            )}
          </div>

          {/* TAB 1: Candidates Directory */}
          {activeTab === 'candidates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidates.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-black/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-[#111111]">{c.name}</h3>
                        <p className="text-xs text-neutral-500 font-mono font-medium">{c.role}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0">
                        {c.type}
                      </span>
                    </div>

                    <p className="text-xs text-[#555555] leading-relaxed pt-1">
                      {c.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {c.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-mono bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>📍 {c.location}</span>
                    <span className="text-emerald-600 font-bold">{c.availability}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Open Startup Roles */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              {/* Combine dynamic founder jobs + default roles */}
              {[
                ...founderJobs.map((j) => ({
                  id: j.id,
                  company: j.company_name,
                  title: j.title,
                  type: j.job_type,
                  location: j.location,
                  salary: j.salary || 'Competitive',
                  tags: j.tags || [],
                  isBmfMember: true,
                  applyUrl: j.apply_url_or_email,
                })),
                ...openRolesList.map((j) => ({
                  ...j,
                  isBmfMember: false,
                  applyUrl: '',
                })),
              ].map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-black/30 transition-colors text-left"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">
                        {job.company}
                      </span>
                      {job.isBmfMember && (
                        <span className="text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> BMF Founder
                        </span>
                      )}
                      <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-800 px-2.5 py-0.5 rounded-full">
                        {job.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111111]">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500 pt-1">
                      <span>📍 {job.location}</span>
                      <span className="text-emerald-700 font-bold">💰 {job.salary}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.tags.map((t) => (
                        <span key={t} className="text-[10px] font-mono bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    {job.applyUrl && job.applyUrl.startsWith('http') ? (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-6 py-3 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <span>Apply on Startup Site</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveFormModal('candidate')
                          setCandidateForm({ ...candidateForm, role: job.title })
                        }}
                        className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-6 py-3 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <span>Apply for this Job</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Modal: Create Candidate Profile */}
      <AnimatePresence>
        {activeFormModal === 'candidate' && (
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111111] text-white rounded-3xl p-6 sm:p-10 max-w-2xl w-full my-8 relative shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setActiveFormModal('none')}
                className="absolute top-6 right-6 text-neutral-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>

              {formStatus === 'success' ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Profile Added to Talent Hub!</h3>
                  <p className="text-neutral-300 text-sm max-w-md mx-auto leading-relaxed">
                    Your profile is now registered with the Tamil Nadu startup network. Founders looking for your skillset will reach out directly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveFormModal('none')}
                    className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-xs hover:bg-neutral-200 transition-colors"
                  >
                    Done & Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCandidateSubmit} className="space-y-4">
                  <div className="text-left space-y-1">
                    <h3 className="text-xl font-black text-white">Create Your Free Talent Profile</h3>
                    <p className="text-xs text-neutral-400">Join Tamil Nadu's startup talent pool. Free forever.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1 text-left">
                      <label className="text-xs text-neutral-300">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vignesh Balaji"
                        value={candidateForm.name}
                        onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs text-neutral-300">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. vignesh@gmail.com"
                        value={candidateForm.email}
                        onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs text-neutral-300">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={candidateForm.phone}
                        onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs text-neutral-300">Target Role Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. React Developer / UI Designer"
                        value={candidateForm.role}
                        onChange={(e) => setCandidateForm({ ...candidateForm, role: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs text-neutral-300">Work Preference</label>
                      <select
                        value={candidateForm.work_type}
                        onChange={(e) => setCandidateForm({ ...candidateForm, work_type: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Freelance / Contract">Freelance / Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs text-neutral-300">Experience</label>
                      <select
                        value={candidateForm.experience}
                        onChange={(e) => setCandidateForm({ ...candidateForm, experience: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                      >
                        <option value="Student / Fresher">Student / Fresher</option>
                        <option value="1-3 Years">1-3 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5+ Years Senior">5+ Years Senior</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs text-neutral-300">Portfolio / GitHub / LinkedIn / Resume Link *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/... or https://linkedin.com/in/..."
                      value={candidateForm.portfolio_url}
                      onChange={(e) => setCandidateForm({ ...candidateForm, portfolio_url: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs text-neutral-300">Top 3-5 Key Skills (comma separated) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Next.js, TypeScript, PostgreSQL, Figma"
                      value={candidateForm.skills}
                      onChange={(e) => setCandidateForm({ ...candidateForm, skills: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs text-neutral-300">Short Bio / What you want to build</label>
                    <textarea
                      rows={3}
                      placeholder="Briefly state what projects you worked on, what tools you love, and your availability..."
                      value={candidateForm.message}
                      onChange={(e) => setCandidateForm({ ...candidateForm, message: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white resize-none"
                    />
                  </div>

                  {formStatus === 'error' && (
                    <p className="text-xs text-rose-400 text-left">{errorMessage}</p>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveFormModal('none')}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-full text-xs font-bold disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      {formStatus === 'submitting' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Publish Free Profile</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}

        {/* Modal: Post a Job */}
        {activeFormModal === 'job' && (
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111111] text-white rounded-3xl p-6 sm:p-10 max-w-2xl w-full my-8 relative shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setActiveFormModal('none')}
                className="absolute top-6 right-6 text-neutral-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>

              {formStatus === 'success' ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Job Opening Published!</h3>
                  <p className="text-neutral-300 text-sm max-w-md mx-auto leading-relaxed">
                    Your job opening is now active in the talent marketplace and being broadcasted across Dr. Melwin's founder and talent circles.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveFormModal('none')}
                    className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-xs hover:bg-neutral-200 transition-colors"
                  >
                    Done & Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleJobSubmit} className="space-y-4">
                  <div className="text-left space-y-1">
                    <h3 className="text-xl font-black text-white">Post a Free Startup Job Opening</h3>
                    <p className="text-xs text-neutral-400">Discover vetted developers, designers, interns, and marketers. Free forever.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1 text-left">
                      <label className="text-xs text-neutral-300">Your Name / Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Arun (Founder)"
                        value={jobForm.name}
                        onChange={(e) => setJobForm({ ...jobForm, name: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs text-neutral-300">Company / Startup Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. QuickLogistics"
                        value={jobForm.company}
                        onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs text-neutral-300">Official Work Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. arun@quicklogistics.in"
                        value={jobForm.email}
                        onChange={(e) => setJobForm({ ...jobForm, email: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs text-neutral-300">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={jobForm.phone}
                        onChange={(e) => setJobForm({ ...jobForm, phone: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs text-neutral-300">Job Title / Role *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Junior Frontend Developer"
                        value={jobForm.job_title}
                        onChange={(e) => setJobForm({ ...jobForm, job_title: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs text-neutral-300">Employment Type</label>
                      <select
                        value={jobForm.job_type}
                        onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship (Paid)">Internship (Paid)</option>
                        <option value="Freelance / Contract">Freelance / Contract</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1 text-left">
                      <label className="text-xs text-neutral-300">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Remote / Chennai / Hybrid"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs text-neutral-300">Salary / Stipend Range</label>
                      <input
                        type="text"
                        placeholder="e.g. ₹5L - ₹8L / year or ₹15k / mo"
                        value={jobForm.salary}
                        onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs text-neutral-300">Key Responsibilities & Required Skills *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Briefly describe what the candidate will work on, primary tech stack or skills, and how to apply..."
                      value={jobForm.message}
                      onChange={(e) => setJobForm({ ...jobForm, message: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white resize-none"
                    />
                  </div>

                  {formStatus === 'error' && (
                    <p className="text-xs text-rose-400 text-left">{errorMessage}</p>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveFormModal('none')}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-full text-xs font-bold disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      {formStatus === 'submitting' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Publish Job Free</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
