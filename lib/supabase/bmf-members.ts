import { createBrowserClient } from '@supabase/ssr'
import { getFounderFallbackAvatar } from '@/lib/image-utils'

export interface BmfMember {
  id: string
  user_id?: string | null
  full_name: string
  email?: string
  phone_number?: string | null
  whatsapp_number?: string | null
  telegram_handle?: string | null
  preferred_contact_method?: 'whatsapp' | 'phone' | 'email' | 'telegram' | string | null
  contact_privacy_accepted?: boolean | null
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
  is_onboarding_completed?: boolean
  priority_order?: number
  badge_title?: string | null
  card_theme?: 'obsidian' | 'gold_prestige' | 'midnight_sapphire' | 'royal_amethyst' | 'emerald_matrix' | 'sunset_rose' | 'titanium_carbon' | string
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

export const BMF_STANDARD_CATEGORIES = [
  'AI & SaaS',
  'Technology & Software',
  'Logistics & Supply Chain',
  'EV, Automotive & Mobility',
  'Green Tech & Climate',
  'Healthcare & Life Sciences',
  'BioTech & DeepTech',
  'Finance & FinTech',
  'E-commerce & Consumer Brands',
  'Manufacturing & Robotics',
  'Education & EdTech',
  'Real Estate & Construction',
  'Food, Agriculture & Hospitality',
  'Aerospace & Defence',
  'Energy & Utilities',
  'Media, Entertainment & Gaming',
  'Cybersecurity & Infrastructure',
  'Professional & Business Services',
] as const

interface CategoryRule {
  category: typeof BMF_STANDARD_CATEGORIES[number]
  exactAliases: string[]
  patterns: { regex: RegExp; weight: number }[]
}

const CATEGORY_WEIGHT_RULES: CategoryRule[] = [
  {
    category: 'Media, Entertainment & Gaming',
    exactAliases: [
      'media',
      'media & entertainment',
      'media and entertainment',
      'media, entertainment',
      'media, entertainment & creative',
      'entertainment',
      'entertainment & media',
      'gaming',
      'gaming & esports',
      'creative studio',
      'creative branding',
      'creative & branding',
      'digital marketing',
      'branding & marketing',
      'advertising & marketing',
      'events & marketing',
      'events | marketing',
      'events',
      'video production',
      'visual creators',
      'content creation',
      'creator economy',
    ],
    patterns: [
      { regex: /\b(entertainment|gaming|game|games|esports|animation|vfx|studio|studios|music|film|cinema|ott|streaming|creator|creators|influencer|influencers|podcast|podcasts|audio|creative|branding|videography|photography|visual)\b/i, weight: 15 },
      { regex: /\b(media|content|advertising|advertisement|marketing|pr|digital marketing|performance marketing|campaigns?|events?)\b/i, weight: 10 },
    ],
  },
  {
    category: 'Finance & FinTech',
    exactAliases: [
      'fintech',
      'finance',
      'financial services',
      'banking & finance',
      'wealth management',
      'tax & accounting',
      'accounting & tax',
      'taxation',
      'taxes',
      'tax & compliance',
      'tax consulting',
      'audit & tax',
      'accounting',
      'audit',
      'chartered accountant',
      'crypto & web3',
    ],
    patterns: [
      { regex: /\b(fintech|finance|financial|banking|payments?|treasury|escrow|wealth|investments?|crypto|web3|blockchain|defi|insurtech|tax|taxation|taxes|accounting|accountant|accountants|audit|auditing)\b/i, weight: 15 },
      { regex: /\b(capital|fund|fundraising|lending|loans?|credit|invoice|invoicing)\b/i, weight: 10 },
    ],
  },
  {
    category: 'Logistics & Supply Chain',
    exactAliases: [
      'logistics',
      'supply chain',
      'freight & logistics',
      'warehousing',
      'shipping & logistics',
      'transportation & logistics',
    ],
    patterns: [
      { regex: /\b(logistics|supply chain|freight|shipping|warehous(e|ing)|trucking|fleet|cargo|courier|transportation|cross-docking|last-mile)\b/i, weight: 15 },
    ],
  },
  {
    category: 'E-commerce & Consumer Brands',
    exactAliases: [
      'e-commerce',
      'ecommerce',
      'd2c',
      'consumer goods',
      'consumer brand',
      'consumer brands',
      'retail',
      'fashion & apparel',
      'apparel',
      'fmcg',
    ],
    patterns: [
      { regex: /\b(e-commerce|ecommerce|d2c|direct to consumer|retail|retailer|shopping|apparel|fashion|clothing|footwear|cosmetics|beauty|skincare|jewelry|consumer goods|fmcg|merchandise)\b/i, weight: 15 },
      { regex: /\b(consumer|brands?|store|boutique)\b/i, weight: 6 },
    ],
  },
  {
    category: 'Education & EdTech',
    exactAliases: [
      'edtech',
      'education',
      'e-learning',
      'elearning',
      'training & upskilling',
      'training',
      'academy',
      'coaching',
    ],
    patterns: [
      { regex: /\b(edtech|education|educational|e-learning|learning|school|schools|college|colleges|university|universities|academy|tutoring|training|upskilling|coaching|curriculum|pedagogy)\b/i, weight: 15 },
    ],
  },
  {
    category: 'EV, Automotive & Mobility',
    exactAliases: [
      'ev',
      'evs',
      'electric vehicles',
      'electric vehicle',
      'automotive',
      'mobility',
      'connected mobility',
    ],
    patterns: [
      { regex: /\b(electric vehicles?|evs?|automotive|automobile|motorcycle|scooter|battery tech(nology)?|charging station|charging infra|connected mobility|autonomous driving)\b/i, weight: 15 },
      { regex: /\b(mobility|vehicles?)\b/i, weight: 10 },
    ],
  },
  {
    category: 'Healthcare & Life Sciences',
    exactAliases: [
      'healthcare',
      'health',
      'health & wellness',
      'medtech',
      'pharma',
      'pharmaceuticals',
      'clinical research',
      'telemedicine',
    ],
    patterns: [
      { regex: /\b(healthcare|hospitals?|clinics?|clinical|doctors?|physician|patient|pharma|pharmaceuticals?|medicine|medtech|telemedicine|diagnostics|telehealth|wellness|mental health)\b/i, weight: 15 },
    ],
  },
  {
    category: 'BioTech & DeepTech',
    exactAliases: [
      'biotech',
      'deeptech',
      'deep tech',
      'genomics',
      'life sciences r&d',
      'synthetic biology',
      'quantum tech',
    ],
    patterns: [
      { regex: /\b(biotech|biotechnology|genomics|genetics|gene|molecular|protein|synthesis|peptide|deeptech|deep tech|quantum|nanotech(nology)?|materials science)\b/i, weight: 15 },
    ],
  },
  {
    category: 'Green Tech & Climate',
    exactAliases: [
      'greentech',
      'green tech',
      'cleantech',
      'clean tech',
      'climate tech',
      'sustainability',
      'renewable energy',
      'solar energy',
    ],
    patterns: [
      { regex: /\b(greentech|green tech|cleantech|clean tech|climate tech|climate|solar|wind energy|sustainability|sustainable|carbon|decarbonization|esg|renewables?|waste management|recycling)\b/i, weight: 15 },
    ],
  },
  {
    category: 'Cybersecurity & Infrastructure',
    exactAliases: [
      'cybersecurity',
      'infosec',
      'devops',
      'cloud infrastructure',
      'developer tools',
      'devtools',
    ],
    patterns: [
      { regex: /\b(cybersecurity|infosec|network security|data security|zero trust|encryption|devops|cloud infra(structure)?|developer tools|devtools|observability|kubernetes|docker|ci\/cd)\b/i, weight: 15 },
    ],
  },
  {
    category: 'Manufacturing & Robotics',
    exactAliases: [
      'manufacturing',
      'robotics',
      'industrial tech',
      'hardware',
      'industrial automation',
    ],
    patterns: [
      { regex: /\b(manufacturing|robotics?|robots?|robotic|factory|industrial automation|hardware|iot|embedded systems|semiconductor|3d printing|machinery)\b/i, weight: 15 },
    ],
  },
  {
    category: 'Food, Agriculture & Hospitality',
    exactAliases: [
      'agritech',
      'food & beverage',
      'food and beverage',
      'food & hospitality',
      'foodtech',
      'hospitality',
      'restaurants',
    ],
    patterns: [
      { regex: /\b(agritech|agriculture|farming|crops?|farm|farms|food|foodtech|beverages?|restaurants?|cafes?|dining|hospitality|hotels?|culinary)\b/i, weight: 15 },
    ],
  },
  {
    category: 'Real Estate & Construction',
    exactAliases: [
      'real estate',
      'proptech',
      'construction tech',
      'construction',
      'architecture',
      'interior design',
    ],
    patterns: [
      { regex: /\b(real estate|proptech|propert(y|ies)|realtor|construction|civil engineering|architecture|architectural|interior design|housing|commercial leasing)\b/i, weight: 15 },
    ],
  },
  {
    category: 'Aerospace & Defence',
    exactAliases: [
      'aerospace',
      'defense',
      'defence',
      'drone tech',
      'drones',
      'space tech',
      'spacetech',
      'aviation',
    ],
    patterns: [
      { regex: /\b(aerospace|defen[sc]e|military|drones?|uav|space tech|spacetech|satellites?|aviation|aircraft|avionics)\b/i, weight: 15 },
    ],
  },
  {
    category: 'Energy & Utilities',
    exactAliases: [
      'energy',
      'utilities',
      'oil & gas',
      'power & grid',
      'clean energy',
    ],
    patterns: [
      { regex: /\b(energy|utilities|power grid|grid|electricity|oil & gas|petroleum|natural gas|clean power|nuclear)\b/i, weight: 15 },
    ],
  },
  {
    category: 'Professional & Business Services',
    exactAliases: [
      'consulting',
      'business services',
      'legal services',
      'legal',
      'hr & recruiting',
      'staffing',
      'agency services',
      'corporate services',
    ],
    patterns: [
      { regex: /\b(consulting|consultancy|legal|law firm|compliance|recruitment|recruiting|staffing|hr tech|human resources|advisory|corporate services|business services)\b/i, weight: 15 },
      { regex: /\b(agency|services|outsourcing|bpo)\b/i, weight: 8 },
    ],
  },
  {
    category: 'AI & SaaS',
    exactAliases: [
      'ai & saas',
      'ai and saas',
      'ai/saas',
      'ai',
      'saas',
      'generative ai',
      'artificial intelligence',
      'b2b saas',
      'ai agents',
    ],
    patterns: [
      { regex: /\b(artificial intelligence|machine learning|deep learning|llms?|generative ai|computer vision|nlp|neural network|autonomous agents?|agentic)\b/i, weight: 15 },
      { regex: /\b(saas|b2b saas|software as a service)\b/i, weight: 14 },
      { regex: /\bai\b/i, weight: 12 },
    ],
  },
  {
    category: 'Technology & Software',
    exactAliases: [
      'technology & software',
      'software',
      'software development',
      'tech',
      'it services',
      'information technology',
      'web development',
      'mobile app development',
    ],
    patterns: [
      { regex: /\b(software( development)?|it services|web dev(elopment)?|mobile apps?|cloud computing|tech platform|application development)\b/i, weight: 10 },
      { regex: /\b(tech|technology)\b/i, weight: 6 },
    ],
  },
]

export function normalizeCategory(rawCategory?: string | null): string {
  if (!rawCategory) return 'Others'
  const trimmed = rawCategory.trim()
  if (
    !trimmed ||
    trimmed.toLowerCase() === 'other' ||
    trimmed.toLowerCase() === 'others' ||
    trimmed.toLowerCase() === 'other (specify)'
  ) {
    return 'Others'
  }

  // 1. Exact standard category match (case-insensitive)
  const exact = BMF_STANDARD_CATEGORIES.find(
    (c) => c.toLowerCase() === trimmed.toLowerCase()
  )
  if (exact) return exact

  // Normalize punctuation/delimiters for canonical comparison
  const normalizedText = trimmed
    .toLowerCase()
    .replace(/[&]/g, 'and')
    .replace(/[|/\\,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // 2. Canonical exact alias lookup
  for (const rule of CATEGORY_WEIGHT_RULES) {
    if (
      rule.exactAliases.some((alias) => {
        const normAlias = alias
          .toLowerCase()
          .replace(/[&]/g, 'and')
          .replace(/[|/\\,]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        return normAlias === normalizedText || alias.toLowerCase() === trimmed.toLowerCase()
      })
    ) {
      return rule.category
    }
  }

  // 3. Weighted Scoring with Word Boundaries
  let bestCategory = 'Others'
  let maxScore = 0

  for (const rule of CATEGORY_WEIGHT_RULES) {
    let score = 0
    for (const pattern of rule.patterns) {
      if (pattern.regex.test(trimmed) || pattern.regex.test(normalizedText)) {
        score += pattern.weight
      }
    }
    if (score > maxScore) {
      maxScore = score
      bestCategory = rule.category
    }
  }

  // Require minimum confidence score to avoid misclassification
  return maxScore >= 8 ? bestCategory : 'Others'
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
    created_at: '2026-06-14T09:00:00Z',
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
    created_at: '2026-07-02T10:30:00Z',
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
    created_at: '2026-07-18T14:15:00Z',
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
    created_at: '2026-08-01T11:00:00Z',
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
    created_at: '2026-08-05T16:20:00Z',
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
    created_at: '2026-08-11T12:00:00Z',
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
    created_at: '2026-08-15T15:40:00Z',
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
    created_at: '2026-08-18T18:00:00Z',
  }
]

export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return null
  return createBrowserClient(supabaseUrl, supabaseKey)
}

const userProfileCache = new Map<string, { profile: BmfMember; timestamp: number }>()

export async function ensureOrFetchUserProfile(user: any): Promise<BmfMember> {
  const defaultFallback = INITIAL_BMF_MEMBERS[0]
  if (!user) return defaultFallback

  const userId = user.id || user.email || 'guest'
  const cached = userProfileCache.get(userId)
  if (cached && (Date.now() - cached.timestamp < 5 * 60 * 1000)) {
    return cached.profile
  }

  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Verified Founder'
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || getFounderFallbackAvatar(fullName)
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

    let resultProfile: BmfMember
    if (existingMember) {
      if (!existingMember.user_id && user.id) {
        await supabase
          .from('bmf_members')
          .update({ user_id: user.id, updated_at: new Date().toISOString() })
          .eq('id', existingMember.id)
      }
      resultProfile = existingMember as BmfMember
    } else {
      // Create new founder profile from authenticated user metadata with clean empty fields
      const newProfile: Partial<BmfMember> = {
        user_id: user.id,
        email,
        full_name: fullName !== 'Verified Founder' ? fullName : '',
        role: '',
        company_name: '',
        company_logo: '',
        avatar_url: avatarUrl,
        category: '',
        tagline: '',
        description: '',
        stage: '',
        metrics: '',
        location: '',
        team_size: '',
        phone_number: '',
        whatsapp_number: '',
        is_verified: true,
        is_approved: false,
        review_status: 'pending',
        is_featured: false,
        card_theme: 'obsidian',
        is_onboarding_completed: false,
      }

      const { data: inserted, error: insertError } = await supabase
        .from('bmf_members')
        .insert([newProfile])
        .select()
        .single()

      if (inserted && !insertError) {
        resultProfile = inserted as BmfMember
      } else {
        resultProfile = {
          ...defaultFallback,
          ...newProfile,
          id: user.id,
        } as BmfMember
      }
    }

    userProfileCache.set(userId, { profile: resultProfile, timestamp: Date.now() })
    return resultProfile
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

export function isUploadedAvatar(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false
  const clean = url.trim().toLowerCase()
  if (!clean) return false
  if (
    clean.includes('api.dicebear.com') ||
    clean.includes('dicebear') ||
    clean.includes('googleusercontent.com') ||
    clean.includes('images.unsplash.com') ||
    clean.includes('wixstatic.com/media/6abdd9_') // avatar preset
  ) {
    return false
  }
  return (
    clean.includes('media.buildwithmelwin.com') ||
    clean.includes('r2.dev') ||
    clean.includes('cloudflarestorage.com') ||
    clean.includes('supabase.co/storage') ||
    clean.startsWith('http')
  )
}

export function isGoogleAvatar(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false
  const clean = url.trim().toLowerCase()
  return clean.includes('googleusercontent.com') || clean.includes('graph.facebook.com')
}

export function isCustomCompanyLogo(logo?: string | null): boolean {
  if (!logo || typeof logo !== 'string') return false
  const clean = logo.trim().toLowerCase()
  if (!clean) return false
  if (
    clean.includes('images.unsplash.com') ||
    clean.includes('api.dicebear.com') ||
    clean.includes('dicebear')
  ) {
    return false
  }
  return clean.startsWith('http') || clean.startsWith('/') || clean.length > 5
}

export function isCustomCompanyName(name?: string | null): boolean {
  if (!name || typeof name !== 'string') return false
  const clean = name.trim().toLowerCase()
  if (!clean || clean.length < 2) return false
  const genericPlaceholders = [
    'venture',
    'my venture',
    'stealth',
    'stealth startup',
    'company',
    'my company',
    'default',
    'founder',
    'startup',
    'n/a',
    'none',
  ]
  return !genericPlaceholders.includes(clean)
}

export function isValidWebUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false
  const clean = url.trim().toLowerCase()
  if (!clean || clean.length < 4) return false
  if (clean === '#' || clean === 'n/a' || clean === 'none' || clean === 'null' || clean === 'undefined') return false
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    const afterProtocol = clean.replace(/^https?:\/\//, '')
    return afterProtocol.length >= 3 && afterProtocol.includes('.')
  }
  return clean.includes('.') && clean.length >= 4 && !clean.includes(' ')
}

export function isValidLinkedInUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false
  const clean = url.trim().toLowerCase()
  if (!clean || clean.length < 5) return false
  if (clean === '#' || clean === 'n/a' || clean === 'none' || clean === 'null' || clean === 'undefined') return false
  return clean.includes('linkedin.com') || (clean.startsWith('http') && clean.includes('linkedin')) || clean.startsWith('in/')
}

export function isValidTwitterUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false
  const clean = url.trim().toLowerCase()
  if (!clean || clean.length < 4) return false
  if (clean === '#' || clean === 'n/a' || clean === 'none' || clean === 'null' || clean === 'undefined') return false
  return clean.includes('twitter.com') || clean.includes('x.com') || clean.startsWith('@')
}

/**
 * Computes profile completeness tier:
 * Tier 3: Fully completed profile (Website + LinkedIn + Portrait Avatar + Company Logo + Company Name + Bio)
 * Tier 2: High completeness with online presence (Has Website OR LinkedIn + Avatar + Company Logo + Company Name)
 * Tier 1: Incomplete online presence (Missing both Website and LinkedIn, e.g. Peelgood)
 * Tier 0: Placeholder or minimal profile
 */
export function getProfileCompletenessTier(member: BmfMember): number {
  const hasWebsite = isValidWebUrl(member.website_url)
  const hasLinkedIn = isValidLinkedInUrl(member.linkedin_url)
  const hasCustomLogo = isCustomCompanyLogo(member.company_logo)
  const hasCustomName = isCustomCompanyName(member.company_name)
  const hasRealAvatar = isUploadedAvatar(member.avatar_url) || isGoogleAvatar(member.avatar_url)
  const hasBio = Boolean(member.description && member.description.trim().length >= 15)
  const hasRole = Boolean(member.role && member.role.trim().length >= 2)

  // Tier 3: Fully complete gold standard (Website + LinkedIn + Logo + Photo + Name + Bio)
  if (hasWebsite && hasLinkedIn && hasCustomLogo && hasRealAvatar && hasCustomName && hasBio) {
    return 3
  }

  // Tier 2: Has at least one verified online anchor (Website OR LinkedIn) with venture assets
  if ((hasWebsite || hasLinkedIn) && hasCustomLogo && hasCustomName && (hasRealAvatar || hasBio)) {
    return 2
  }

  // Tier 1: Missing both Website and LinkedIn (or missing core logo/photo)
  if (hasCustomName && (hasCustomLogo || hasRealAvatar || hasRole)) {
    return 1
  }

  return 0
}

export function getProfileQualityScore(member: BmfMember): number {
  let score = 0

  // 1. Online Presence & Social Links (Up to 80 pts - primary trust & verification factors)
  if (isValidWebUrl(member.website_url)) {
    score += 35
  }
  if (isValidLinkedInUrl(member.linkedin_url)) {
    score += 35
  }
  if (isValidTwitterUrl(member.twitter_url)) {
    score += 10
  }

  // 2. Founder Portrait Photo (Up to 40 pts)
  if (isUploadedAvatar(member.avatar_url)) {
    score += 40
  } else if (isGoogleAvatar(member.avatar_url)) {
    score += 20
  } else if (member.avatar_url && member.avatar_url.trim() !== '' && !member.avatar_url.includes('api.dicebear.com')) {
    score += 5
  }

  // 3. Company Logo (35 pts)
  if (isCustomCompanyLogo(member.company_logo)) {
    score += 35
  }

  // 4. Company Name (30 pts)
  if (isCustomCompanyName(member.company_name)) {
    score += 30
  }

  // 5. Bio / Elevator Pitch (Up to 25 pts)
  const descLen = member.description?.trim().length || 0
  if (descLen >= 50) {
    score += 25
  } else if (descLen >= 15) {
    score += 15
  } else if (descLen > 0) {
    score += 5
  }

  // 6. Tagline & One-Liner (10 pts)
  if (member.tagline && member.tagline.trim().length >= 5) {
    score += 10
  }

  // 7. Venture Stage, Location & Team Size (Up to 15 pts)
  if (member.stage && member.stage.trim() !== '' && member.stage.toLowerCase() !== 'idea') {
    score += 5
  }
  if (member.location && member.location.trim().length >= 2) {
    score += 5
  }
  if (member.team_size && member.team_size.trim() !== '') {
    score += 5
  }

  // 8. Specific Category (10 pts)
  if (member.category && member.category !== 'Others' && member.category.trim() !== '') {
    score += 10
  }

  // 9. Verified Founder Status (15 pts)
  if (member.is_verified) {
    score += 15
  }

  return score
}

/**
 * Determines whether a member profile has completed all required venture details
 * (valid Company Name, Company Logo, Portrait Photo, and Role) to be eligible
 * for public showcase activation and card downloads.
 */
export function isProfileEligibleForShowcase(member?: BmfMember | null): boolean {
  if (!member) return false
  
  // Explicit administrative rejection check
  if (member.is_approved === false || member.review_status === 'rejected') {
    return false
  }

  // 1. Valid Company Name (non-placeholder)
  const hasValidCompany = isCustomCompanyName(member.company_name)

  // 2. Valid Company Logo (non-placeholder)
  const hasValidLogo = isCustomCompanyLogo(member.company_logo)

  // 3. Valid Founder Name & Role
  const hasValidName = Boolean(member.full_name && member.full_name.trim().length >= 2)
  const hasValidRole = Boolean(member.role && member.role.trim().length >= 2)

  // 4. Valid Founder Avatar
  const hasValidAvatar = Boolean(member.avatar_url && member.avatar_url.trim() !== '')

  return hasValidCompany && hasValidLogo && hasValidName && hasValidRole && hasValidAvatar
}

/**
 * Returns a list of missing required fields for incomplete profiles to guide the founder.
 */
export function getProfileMissingFields(member?: BmfMember | null): string[] {
  if (!member) return ['Full Profile Details']
  const missing: string[] = []

  if (!isCustomCompanyName(member.company_name)) {
    missing.push('Company Name')
  }
  if (!isCustomCompanyLogo(member.company_logo)) {
    missing.push('Company Logo')
  }
  if (!member.avatar_url || member.avatar_url.trim() === '' || member.avatar_url.includes('api.dicebear.com')) {
    missing.push('Profile Photo')
  }
  if (!member.role || member.role.trim().length < 2) {
    missing.push('Founder Role')
  }
  if (!isValidWebUrl(member.website_url)) {
    missing.push('Website URL')
  }
  if (!isValidLinkedInUrl(member.linkedin_url)) {
    missing.push('LinkedIn Profile')
  }
  if (!member.description || member.description.trim().length < 10) {
    missing.push('Founder Bio')
  }

  return missing
}

export function sortBmfMembers(members: BmfMember[]): BmfMember[] {
  return [...members].sort((a, b) => {
    // 1. Dr. Melwin is strictly pinned at #1 (or priority_order === 1)
    const isMelwinA = a.priority_order === 1 || 
      a.full_name?.toLowerCase().includes('melwin') || 
      a.role?.toLowerCase().includes('president')
    const isMelwinB = b.priority_order === 1 || 
      b.full_name?.toLowerCase().includes('melwin') || 
      b.role?.toLowerCase().includes('president')

    if (isMelwinA && !isMelwinB) return -1
    if (!isMelwinA && isMelwinB) return 1

    // Explicit manual priority rank set by Admin (if any other member is specifically pinned)
    const pA = a.priority_order !== undefined && a.priority_order !== null && a.priority_order > 1 ? a.priority_order : 100
    const pB = b.priority_order !== undefined && b.priority_order !== null && b.priority_order > 1 ? b.priority_order : 100
    if (pA !== pB) {
      return pA - pB
    }

    // 2. Profile Completeness Tier (Tier 3 = Full Website + LinkedIn + Logo + Photo + Bio first!)
    const tierA = getProfileCompletenessTier(a)
    const tierB = getProfileCompletenessTier(b)
    if (tierA !== tierB) {
      return tierB - tierA
    }

    // 3. Granular Profile Quality Score (Higher score first)
    const scoreA = getProfileQualityScore(a)
    const scoreB = getProfileQualityScore(b)
    if (scoreA !== scoreB) {
      return scoreB - scoreA
    }

    // 4. Featured spotlight status
    const featA = a.is_featured ? 1 : 0
    const featB = b.is_featured ? 1 : 0
    if (featA !== featB) {
      return featB - featA
    }

    // 5. Most recent first as tie-breaker
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateB - dateA
  })
}

export interface PaginatedMembersResponse {
  members: BmfMember[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
  meta: {
    categories: string[]
    totalMembers: number
    totalPremium: number
    totalRegular: number
  }
}

// Client-side Memory Cache with 5-minute TTL
const CLIENT_CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes
const clientMemoryCache = new Map<string, { data: any; timestamp: number }>()

export function clearClientMembersCache() {
  clientMemoryCache.clear()
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && (key.startsWith('bmf_members_cache_') || key.startsWith('bmf_members_cache_v4_'))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((k) => sessionStorage.removeItem(k))
    } catch {}
  }
}

function getFromClientCache<T>(cacheKey: string): T | null {
  const now = Date.now()
  // 1. Check in-memory Map
  const inMemory = clientMemoryCache.get(cacheKey)
  if (inMemory && (now - inMemory.timestamp < CLIENT_CACHE_TTL_MS)) {
    return inMemory.data as T
  }

  // 2. Check SessionStorage
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const stored = sessionStorage.getItem(`bmf_members_cache_v4_${cacheKey}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && (now - parsed.timestamp < CLIENT_CACHE_TTL_MS)) {
          // Re-populate in-memory map
          clientMemoryCache.set(cacheKey, parsed)
          return parsed.data as T
        }
      }
    } catch {}
  }

  return null
}

function saveToClientCache<T>(cacheKey: string, data: T): void {
  const payload = { data, timestamp: Date.now() }
  clientMemoryCache.set(cacheKey, payload)
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      sessionStorage.setItem(`bmf_members_cache_v4_${cacheKey}`, JSON.stringify(payload))
    } catch {}
  }
}

export async function fetchPaginatedMembers(params: {
  page?: number
  limit?: number
  tier?: 'all' | 'premium' | 'regular'
  category?: string
  search?: string
  forceFresh?: boolean
}): Promise<PaginatedMembersResponse> {
  const page = params.page || 1
  const limit = params.limit || 20
  const tier = params.tier || 'all'
  const category = params.category || 'All'
  const search = params.search || ''
  const forceFresh = params.forceFresh || false

  const cacheKey = `p_${page}_l_${limit}_t_${tier}_c_${category}_s_${search}`

  if (!forceFresh) {
    const cached = getFromClientCache<PaginatedMembersResponse>(cacheKey)
    if (cached) {
      return cached
    }
  }

  try {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      tier,
      category,
      search,
      ...(forceFresh ? { fresh: 'true' } : {}),
    })

    const res = await fetch(`/api/bmf/members?${query.toString()}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data: PaginatedMembersResponse = await res.json()
    if (data && data.members) {
      saveToClientCache(cacheKey, data)
      return data
    }
    throw new Error('Invalid response structure from members API')
  } catch (err) {
    console.warn('[fetchPaginatedMembers API fallback]:', err)

    // Fallback: local processing from INITIAL_BMF_MEMBERS or direct Supabase
    const fallbackAll = INITIAL_BMF_MEMBERS
    const filtered = fallbackAll.filter((m) => {
      if (tier === 'premium' && !m.is_featured) return false
      if (tier === 'regular' && m.is_featured) return false
      if (category !== 'All') {
        const norm = normalizeCategory(m.category)
        if (category === 'Others') {
          if (norm !== 'Others') return false
        } else {
          if (norm !== category && m.category !== category) return false
        }
      }
      if (search) {
        const s = search.toLowerCase()
        const match =
          m.full_name.toLowerCase().includes(s) ||
          m.company_name.toLowerCase().includes(s) ||
          m.role.toLowerCase().includes(s)
        if (!match) return false
      }
      return true
    })

    const total = filtered.length
    const startIndex = (page - 1) * limit
    const paginated = filtered.slice(startIndex, startIndex + limit)

    const fallbackCatCounts = new Map<string, number>()
    fallbackAll.forEach((m) => {
      const norm = normalizeCategory(m.category)
      fallbackCatCounts.set(norm, (fallbackCatCounts.get(norm) || 0) + 1)
    })
    const availCats = Array.from(fallbackCatCounts.keys()).filter((c) => c !== 'Others')
    availCats.sort()
    const hasOthersFallback = (fallbackCatCounts.get('Others') || 0) > 0

    return {
      members: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: startIndex + limit < total,
      },
      meta: {
        categories: ['All', ...availCats, ...(hasOthersFallback ? ['Others'] : [])],
        totalMembers: fallbackAll.length,
        totalPremium: fallbackAll.filter((m) => m.is_featured).length,
        totalRegular: fallbackAll.filter((m) => !m.is_featured).length,
      },
    }
  }
}

export async function fetchBmfMembers(options?: { onlyFeatured?: boolean; limit?: number }): Promise<BmfMember[]> {
  try {
    const cacheKey = `featured_${options?.onlyFeatured || false}_limit_${options?.limit || 0}`
    const cached = getFromClientCache<BmfMember[]>(cacheKey)
    if (cached) {
      return cached
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      let data = INITIAL_BMF_MEMBERS
      if (options?.onlyFeatured) data = data.filter((m) => m.is_featured)
      if (options?.limit) data = data.slice(0, options.limit)
      return sortBmfMembers(data)
    }

    let query = supabase
      .from('bmf_members')
      .select('*')
      .eq('is_approved', true)

    if (options?.onlyFeatured) {
      query = query.eq('is_featured', true)
    }

    query = query
      .order('priority_order', { ascending: true, nullsFirst: false })
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error || !data) {
      console.warn('Could not fetch members from bmf_members:', error?.message)
      return []
    }

    const sorted = sortBmfMembers(data as BmfMember[])
    saveToClientCache(cacheKey, sorted)
    return sorted
  } catch (err) {
    console.error('Error fetching BMF members:', err)
    return []
  }
}

export function slugifyFounderName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function fetchBmfMemberByIdOrSlug(idOrSlug: string): Promise<BmfMember | null> {
  if (!idOrSlug) return null
  const clean = decodeURIComponent(idOrSlug).trim().toLowerCase()

  // 1. Check in initial fallback members first if exact ID match
  const fallbackMatch = INITIAL_BMF_MEMBERS.find(
    (m) => m.id.toLowerCase() === clean || slugifyFounderName(m.full_name) === clean
  )

  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('bmf_current_member')
        if (stored) {
          const parsed = JSON.parse(stored) as BmfMember
          if (parsed.id?.toLowerCase() === clean || parsed.user_id?.toLowerCase() === clean || slugifyFounderName(parsed.full_name) === clean) {
            return parsed
          }
        }
      }
      return fallbackMatch || null
    }

    // Try Supabase lookup by id, user_id, or full_name ilike
    const { data: member, error } = await supabase
      .from('bmf_members')
      .select('*')
      .or(`id.eq.${idOrSlug},user_id.eq.${idOrSlug}`)
      .limit(1)
      .maybeSingle()

    if (member && !error) {
      return member as BmfMember
    }

    // Try finding by name slug
    const { data: allApproved } = await supabase
      .from('bmf_members')
      .select('*')
      .eq('is_approved', true)

    if (allApproved && allApproved.length > 0) {
      const match = allApproved.find(
        (m: BmfMember) => slugifyFounderName(m.full_name) === clean || m.id.toLowerCase() === clean
      )
      if (match) return match as BmfMember
    }

    return fallbackMatch || null
  } catch (err) {
    console.error('Error fetching member by id or slug:', err)
    return fallbackMatch || null
  }
}


async function ensureHostedMediaUrl(url: string | undefined, folder: 'founders' | 'companies', userId: string): Promise<string | undefined> {
  if (!url || !url.startsWith('data:image/')) {
    return url
  }
  try {
    const res = await fetch('/api/bmf/upload-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base64Data: url,
        folder,
        userId,
      }),
    })
    if (!res.ok) {
      console.warn('[Base64 Auto-Upload Warning]: HTTP status', res.status)
      return url
    }
    const data = await res.json().catch(() => null)
    if (data && data.success && data.url) {
      return data.url
    }
  } catch (e) {
    console.error('[Base64 Auto-Upload Error]:', e)
  }
  return url
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

    // Auto-convert any base64 image data to hosted CDN storage URL before database write
    const sanitizedMember = { ...member }
    if (sanitizedMember.avatar_url && sanitizedMember.avatar_url.startsWith('data:image/')) {
      sanitizedMember.avatar_url = await ensureHostedMediaUrl(sanitizedMember.avatar_url, 'founders', user.id)
    }
    if (sanitizedMember.company_logo && sanitizedMember.company_logo.startsWith('data:image/')) {
      sanitizedMember.company_logo = await ensureHostedMediaUrl(sanitizedMember.company_logo, 'companies', user.id)
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
          ...sanitizedMember,
          user_id: user.id,
          email: user.email || sanitizedMember.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
      saveErr = error
    } else {
      const { error } = await supabase
        .from('bmf_members')
        .insert({
          id: sanitizedMember.id || user.id,
          user_id: user.id,
          email: user.email || sanitizedMember.email,
          ...sanitizedMember,
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

export async function saveFounderContactDetails(
  memberIdOrUserId: string,
  contactData: {
    phone_number?: string | null
    whatsapp_number?: string | null
    telegram_handle?: string | null
    preferred_contact_method?: string | null
    contact_privacy_accepted?: boolean | null
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('bmf_current_member')
        const current = stored ? JSON.parse(stored) : INITIAL_BMF_MEMBERS[0]
        const updated = { ...current, ...contactData, updated_at: new Date().toISOString() }
        localStorage.setItem('bmf_current_member', JSON.stringify(updated))
      }
      return { success: true }
    }

    const { data: { user } } = await supabase.auth.getUser()
    const targetUserId = user?.id || memberIdOrUserId

    const { data: existing } = await supabase
      .from('bmf_members')
      .select('id')
      .or(`user_id.eq.${targetUserId},id.eq.${memberIdOrUserId}`)
      .limit(1)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase
        .from('bmf_members')
        .update({
          ...contactData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      if (error) return { success: false, error: error.message }
      return { success: true }
    }

    return { success: false, error: 'Member record not found' }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save contact details' }
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

