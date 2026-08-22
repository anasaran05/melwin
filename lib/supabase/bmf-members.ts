import { createBrowserClient } from '@supabase/ssr'

export interface BmfMember {
  id: string
  user_id?: string | null
  full_name: string
  email?: string
  role: string
  company_name: string
  company_logo?: string
  avatar_url: string
  category: string
  tagline: string
  description?: string
  stage: string
  metrics: string
  location: string
  team_size: string
  linkedin_url?: string
  twitter_url?: string
  website_url?: string
  is_verified: boolean
  is_approved: boolean
  is_featured?: boolean
  review_status?: 'pending' | 'approved' | 'rejected'
  admin_feedback?: string | null
  created_at?: string
  updated_at?: string
}

export interface BmfJob {
  id: string
  member_id?: string
  user_id?: string | null
  company_name: string
  company_logo?: string
  title: string
  job_type: string
  location: string
  salary?: string
  description: string
  tags: string[]
  apply_url_or_email: string
  is_approved?: boolean
  status?: 'active' | 'paused' | 'closed'
  created_at?: string
  updated_at?: string
}

export const INITIAL_BMF_MEMBERS: BmfMember[] = [
  {
    id: 'bmf-1',
    full_name: 'S Kishore',
    role: 'Founder & CEO',
    company_name: 'PharmPulse Health',
    company_logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=150&auto=format&fit=crop',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    category: 'Healthcare AI',
    tagline: 'Autonomous AI pipelines accelerating clinical trials documentation and dosage validation.',
    description: 'Pharm D candidate & healthcare innovator building autonomous multimodal agent systems for global pharma compliance.',
    stage: 'Series A ($3.8M)',
    metrics: '$210k ARR in 8 mos',
    location: 'Bangalore & SF',
    team_size: '18 Engineers',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://twitter.com',
    website_url: 'https://pharmpulse.ai',
    is_verified: true,
    is_approved: true,
    is_featured: true,
  },
  {
    id: 'bmf-2',
    full_name: 'Preeti Shah',
    role: 'Co-founder & Chief Scientist',
    company_name: 'GeneVeda Therapeutics',
    company_logo: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=150&auto=format&fit=crop',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    category: 'BioTech',
    tagline: 'High-throughput computational protein folding and targeted nanoparticle drug delivery.',
    description: 'Research Scholar at MMMUT specializing in M.Pharm molecular synthesis and active bio-marker diagnostics.',
    stage: 'Seed ($1.9M)',
    metrics: '4 Patent Filings',
    location: 'Mumbai & Boston',
    team_size: '11 PhDs',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://twitter.com',
    website_url: 'https://geneveda.bio',
    is_verified: true,
    is_approved: true,
    is_featured: true,
  },
  {
    id: 'bmf-3',
    full_name: 'Pavithran P',
    role: 'Founder & Product Lead',
    company_name: 'AetherMed Anesthesia',
    company_logo: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=150&auto=format&fit=crop',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    category: 'MedTech',
    tagline: 'Next-generation closed-loop automated hemodynamic monitoring for critical care ICUs.',
    description: 'PGDM Healthcare candidate bridging the gap between clinical anesthesia workflows and smart bedside telemetry.',
    stage: 'Grant + Angel Check',
    metrics: '14 Hospital Pilots',
    location: 'Indore & Hyderabad',
    team_size: '14 Specialists',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://twitter.com',
    website_url: 'https://aethermed.tech',
    is_verified: true,
    is_approved: true,
    is_featured: true,
  },
  {
    id: 'bmf-4',
    full_name: 'Sanvi Patel',
    role: 'Co-founder & Head of R&D',
    company_name: 'MoleculeX Synthesis',
    company_logo: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=150&auto=format&fit=crop',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
    category: 'BioTech',
    tagline: 'Automated green chemistry catalyst discovery using graph neural networks.',
    description: 'MSc in Organic Chemistry at M.G. University developing zero-waste peptide formulations for sustainable agritech and cosmetics.',
    stage: 'Pre-Series A ($2.4M)',
    metrics: '₹3.2 Cr Annual Run Rate',
    location: 'Ahmedabad & London',
    team_size: '22 Team Members',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://twitter.com',
    website_url: 'https://moleculex.co',
    is_verified: true,
    is_approved: true,
    is_featured: true,
  },
  {
    id: 'bmf-5',
    full_name: 'Arjun Mehta',
    role: 'Founder & CEO',
    company_name: 'SynapsePulse AI',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150&auto=format&fit=crop',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    category: 'Developer Tools',
    tagline: 'Zero-latency vector caching & memory management infrastructure for high-throughput LLM clusters.',
    description: 'Distributed systems architect helping Fortune 500 AI teams cut inference compute costs by 68%.',
    stage: 'Series A ($4.2M)',
    metrics: '48,000+ GitHub Stars',
    location: 'Bangalore & San Francisco',
    team_size: '28 Engineers',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://twitter.com',
    website_url: 'https://synapsepulse.ai',
    is_verified: true,
    is_approved: true,
    is_featured: false,
  },
  {
    id: 'bmf-6',
    full_name: 'Elena Rostova',
    role: 'Founder & Managing Director',
    company_name: 'OmniLedger Fin',
    company_logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=150&auto=format&fit=crop',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    category: 'FinTech',
    tagline: 'Multi-currency corporate escrow rails and instant cross-border treasury clearance.',
    description: 'Former Tier-1 investment banker modernizing venture capital drawdown mechanics across Dubai, Singapore, and London.',
    stage: 'Bootstrapped / Profitable',
    metrics: '$1.4M Annual Profit',
    location: 'Singapore & Dubai',
    team_size: '19 Core Team',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://twitter.com',
    website_url: 'https://omniledger.io',
    is_verified: true,
    is_approved: true,
    is_featured: false,
  },
  {
    id: 'bmf-7',
    full_name: 'Siddharth Roy',
    role: 'Founder & CEO',
    company_name: 'Zenith Logistics OS',
    company_logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=150&auto=format&fit=crop',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
    category: 'Logistics Tech',
    tagline: 'Predictive multi-modal freight consolidation and cross-docking intelligence.',
    description: 'Operating system connecting 1,200+ fleet owners across India and Southeast Asia with automated spot bidding.',
    stage: 'Series A ($5.5M)',
    metrics: '₹4.8 Cr Monthly GMV',
    location: 'Mumbai & Singapore',
    team_size: '42 Employees',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://twitter.com',
    website_url: 'https://zenithlogistics.ai',
    is_verified: true,
    is_approved: true,
    is_featured: false,
  },
  {
    id: 'bmf-8',
    full_name: 'Chloe Bennett',
    role: 'Founder & Creative Lead',
    company_name: 'OrbitWave Studio',
    company_logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=150&auto=format&fit=crop',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    category: 'Creative Tech',
    tagline: 'Generative emotional voice synthesis and automated localized video rendering.',
    description: 'Building AI voice avatars commanding human-level inflection for global media studios and creators.',
    stage: 'Seed ($2.3M)',
    metrics: '850k+ Active Creators',
    location: 'Austin & Berlin',
    team_size: '16 Engineers',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://twitter.com',
    website_url: 'https://orbitwave.studio',
    is_verified: true,
    is_approved: true,
    is_featured: false,
  }
]

export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return null
  return createBrowserClient(supabaseUrl, supabaseKey)
}

export async function ensureOrFetchUserProfile(user: any): Promise<BmfMember> {
  const defaultFallback = INITIAL_BMF_MEMBERS[0]
  if (!user) return defaultFallback

  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Verified Founder'
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
  const email = user.email || ''

  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('bmf_current_member')
        if (stored) {
          const parsed = JSON.parse(stored)
          return { ...parsed, email: email || parsed.email, full_name: parsed.full_name || fullName, avatar_url: parsed.avatar_url || avatarUrl }
        }
      }
      return {
        ...defaultFallback,
        id: user.id || 'demo-user',
        user_id: user.id || null,
        full_name: fullName,
        email,
        avatar_url: avatarUrl,
      }
    }

    // Check if member profile exists by user_id or email
    const { data: existingMember } = await supabase
      .from('bmf_members')
      .select('*')
      .or(`user_id.eq.${user.id},email.eq.${email}`)
      .limit(1)
      .maybeSingle()

    if (existingMember) {
      if (!existingMember.user_id && user.id) {
        await supabase
              .from('bmf_members')
          .update({ user_id: user.id, updated_at: new Date().toISOString() })
          .eq('id', existingMember.id)
      }
      return existingMember as BmfMember
    }

    // Create new founder profile from authenticated user metadata
    const newProfile: Partial<BmfMember> = {
      user_id: user.id,
      email,
      full_name: fullName,
      role: 'Founder & CEO',
      company_name: `${fullName.split(' ')[0]}'s Venture`,
      company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150&auto=format&fit=crop',
      avatar_url: avatarUrl,
      category: 'AI & SaaS',
      tagline: 'Building high-impact technology solutions for global markets.',
      description: 'Founder bio and company mission statement.',
      stage: 'Early Traction / Seed',
      metrics: 'Active Product & Pilots',
      location: 'Global',
      team_size: '5-10 Builders',
      is_verified: true,
      is_approved: true,
      is_featured: false,
      review_status: 'approved',
    }

    const { data: inserted, error: insertError } = await supabase
      .from('bmf_members')
      .insert([newProfile])
      .select()
      .single()

    if (inserted && !insertError) {
      return inserted as BmfMember
    }

    return {
      ...defaultFallback,
      ...newProfile,
      id: user.id,
    } as BmfMember
  } catch (err) {
    console.error('Error ensuring member profile:', err)
    return {
      ...defaultFallback,
      id: user.id || 'demo-user',
      user_id: user.id || null,
      full_name: fullName,
      email,
      avatar_url: avatarUrl,
    }
  }
}

export async function fetchBmfMembers(options?: { onlyFeatured?: boolean; limit?: number }): Promise<BmfMember[]> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      if (options?.onlyFeatured) {
        return INITIAL_BMF_MEMBERS.filter((m) => m.is_featured).slice(0, options.limit || 5)
      }
      return INITIAL_BMF_MEMBERS
    }

    let query = supabase
      .from('bmf_members')
      .select('*')
      .eq('is_approved', true)

    if (options?.onlyFeatured) {
      query = query.eq('is_featured', true).order('created_at', { ascending: false })
      if (options.limit) {
        query = query.limit(options.limit)
      }
    } else {
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
      if (options?.limit) {
        query = query.limit(options.limit)
      }
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      if (options?.onlyFeatured) {
        return INITIAL_BMF_MEMBERS.filter((m) => m.is_featured).slice(0, options?.limit || 5)
      }
      return INITIAL_BMF_MEMBERS
    }

    return data as BmfMember[]
  } catch (err) {
    console.error('Error fetching BMF members:', err)
    return options?.onlyFeatured 
      ? INITIAL_BMF_MEMBERS.filter((m) => m.is_featured).slice(0, options?.limit || 5)
      : INITIAL_BMF_MEMBERS
  }
}

export async function saveBmfMemberProfile(member: Partial<BmfMember>): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      // Local demo mode storage fallback
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('bmf_current_member')
        const current = stored ? JSON.parse(stored) : INITIAL_BMF_MEMBERS[0]
        const updated = { ...current, ...member, updated_at: new Date().toISOString() }
        localStorage.setItem('bmf_current_member', JSON.stringify(updated))
        return { success: true }
      }
      return { success: true }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'User must be authenticated to update profile' }
    }

    // Check if profile exists by user_id or id
    const { data: existing } = await supabase
      .from('bmf_members')
      .select('id')
      .or(`user_id.eq.${user.id},id.eq.${member.id || user.id}`)
      .limit(1)
      .maybeSingle()

    let saveErr
    if (existing) {
      const { error } = await supabase
        .from('bmf_members')
        .update({
          ...member,
          user_id: user.id,
          email: user.email || member.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
      saveErr = error
    } else {
      const { error } = await supabase
        .from('bmf_members')
        .insert({
          id: member.id || user.id,
          user_id: user.id,
          email: user.email || member.email,
          ...member,
          updated_at: new Date().toISOString(),
        })
      saveErr = error
    }

    if (saveErr) {
      return { success: false, error: saveErr.message }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save member profile' }
  }
}

export async function fetchAllMembersForAdmin(): Promise<BmfMember[]> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return INITIAL_BMF_MEMBERS

    const { data, error } = await supabase
      .from('bmf_members')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return INITIAL_BMF_MEMBERS
    }

    return data as BmfMember[]
  } catch (err) {
    console.error('Error fetching admin BMF members:', err)
    return INITIAL_BMF_MEMBERS
  }
}

export async function submitShowcaseApplication(
  member: Partial<BmfMember>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseBrowserClient()
    const payload = {
      ...member,
      is_approved: false,
      review_status: 'pending' as const,
      admin_feedback: null,
      updated_at: new Date().toISOString(),
    }

    if (!supabase) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('bmf_current_member')
        const current = stored ? JSON.parse(stored) : INITIAL_BMF_MEMBERS[0]
        const updated = { ...current, ...payload }
        localStorage.setItem('bmf_current_member', JSON.stringify(updated))
        return { success: true }
      }
      return { success: true }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'You must be logged in to submit a showcase application.' }
    }

    const { data: existing } = await supabase
      .from('bmf_members')
      .select('id')
      .or(`user_id.eq.${user.id},id.eq.${member.id || user.id}`)
      .limit(1)
      .maybeSingle()

    let appErr
    if (existing) {
      const { error } = await supabase
        .from('bmf_members')
        .update({
          ...payload,
          user_id: user.id,
          email: user.email || member.email,
        })
        .eq('id', existing.id)
      appErr = error
    } else {
      const { error } = await supabase
        .from('bmf_members')
        .insert({
          id: member.id || user.id,
          user_id: user.id,
          email: user.email || member.email,
          ...payload,
        })
      appErr = error
    }

    if (appErr) {
      return { success: false, error: appErr.message }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to submit showcase application' }
  }
}

export async function fetchBmfJobs(): Promise<BmfJob[]> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('bmf_jobs')
      .select('*')
      .eq('is_approved', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error || !data) return []
    return data as BmfJob[]
  } catch (err) {
    console.error('Error fetching BMF jobs:', err)
    return []
  }
}

export async function fetchMemberJobs(): Promise<BmfJob[]> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('bmf_member_jobs')
        return local ? JSON.parse(local) : []
      }
      return []
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('bmf_jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error || !data) return []
    return data as BmfJob[]
  } catch (err) {
    console.error('Error fetching member jobs:', err)
    return []
  }
}

export async function saveBmfJob(job: Partial<BmfJob>): Promise<{ success: boolean; job?: BmfJob; error?: string }> {
  try {
    const supabase = getSupabaseBrowserClient()
    const newJob: BmfJob = {
      id: job.id || `job-${Date.now()}`,
      company_name: job.company_name || 'My Startup',
      company_logo: job.company_logo || '',
      title: job.title || 'Software Engineer',
      job_type: job.job_type || 'Full-time',
      location: job.location || 'Remote',
      salary: job.salary || 'Competitive',
      description: job.description || '',
      tags: job.tags || [],
      apply_url_or_email: job.apply_url_or_email || '',
      is_approved: true,
      status: job.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (!supabase) {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('bmf_member_jobs')
        const current: BmfJob[] = local ? JSON.parse(local) : []
        const existsIndex = current.findIndex((j) => j.id === newJob.id)
        if (existsIndex >= 0) {
          current[existsIndex] = newJob
        } else {
          current.unshift(newJob)
        }
        localStorage.setItem('bmf_member_jobs', JSON.stringify(current))
        return { success: true, job: newJob }
      }
      return { success: true, job: newJob }
    }

    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('bmf_jobs')
      .upsert({
        ...newJob,
        user_id: user?.id || null,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, job: data as BmfJob }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save job' }
  }
}

export async function deleteBmfJob(jobId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('bmf_member_jobs')
        const current: BmfJob[] = local ? JSON.parse(local) : []
        const filtered = current.filter((j) => j.id !== jobId)
        localStorage.setItem('bmf_member_jobs', JSON.stringify(filtered))
      }
      return { success: true }
    }

    const { error } = await supabase
      .from('bmf_jobs')
      .delete()
      .eq('id', jobId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete job' }
  }
}

