import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { BmfMember, INITIAL_BMF_MEMBERS, sortBmfMembers, normalizeCategory } from '@/lib/supabase/bmf-members'
import { checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limiter'

interface ServerCacheEntry {
  data: BmfMember[]
  timestamp: number
}

// In-memory cache on the Node.js server instance (60 seconds TTL)
let cachedMembers: ServerCacheEntry | null = null
const CACHE_TTL_MS = 60 * 1000 // 60 seconds

/**
 * Invalidate server-side cache (invoked when admin approves/rejects/updates a member)
 */
export function clearMembersServerCache() {
  cachedMembers = null
}

async function getApprovedMembersFromSupabase(): Promise<BmfMember[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return INITIAL_BMF_MEMBERS
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase
      .from('bmf_members')
      .select('*')
      .eq('is_approved', true)
      .order('priority_order', { ascending: true, nullsFirst: false })
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return INITIAL_BMF_MEMBERS
    }

    return sortBmfMembers(data as BmfMember[])
  } catch (err) {
    console.error('[API Members Fetch Error]:', err)
    return INITIAL_BMF_MEMBERS
  }
}

export async function GET(request: NextRequest) {
  // 1. Rate Limiting (60 requests/minute per client IP)
  const rateLimitResult = checkRateLimit(request, { limit: 60, windowMs: 60 * 1000 })
  if (!rateLimitResult.success) {
    return rateLimitExceededResponse(rateLimitResult)
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)))
  const tier = (searchParams.get('tier') || 'all').toLowerCase()
  const category = searchParams.get('category') || 'All'
  const search = (searchParams.get('search') || '').trim().toLowerCase()
  const forceFresh = searchParams.get('fresh') === 'true'

  const now = Date.now()
  let allApprovedMembers: BmfMember[]

  // 2. In-Memory Server Cache Check
  if (!forceFresh && cachedMembers && (now - cachedMembers.timestamp < CACHE_TTL_MS)) {
    allApprovedMembers = cachedMembers.data
  } else {
    allApprovedMembers = await getApprovedMembersFromSupabase()
    cachedMembers = {
      data: allApprovedMembers,
      timestamp: now,
    }
  }

  // 3. Extract unique normalized categories that currently exist in the dataset
  const normalizedCategoryCounts = new Map<string, number>()
  allApprovedMembers.forEach((m) => {
    const norm = normalizeCategory(m.category)
    normalizedCategoryCounts.set(norm, (normalizedCategoryCounts.get(norm) || 0) + 1)
  })

  // List only categories that have at least 1 member (keeping standard categories first, then 'Others')
  const availableCategoriesList = Array.from(normalizedCategoryCounts.keys()).filter((c) => c !== 'Others')
  availableCategoriesList.sort()
  const hasOthers = (normalizedCategoryCounts.get('Others') || 0) > 0
  const uniqueCategories = ['All', ...availableCategoriesList, ...(hasOthers ? ['Others'] : [])]

  // 4. Overall counts
  const totalPremium = allApprovedMembers.filter((m) => m.is_featured).length
  const totalRegular = allApprovedMembers.filter((m) => !m.is_featured).length

  // 5. Filter pipeline
  let filtered = allApprovedMembers.filter((member) => {
    // Tier filter
    if (tier === 'premium' && !member.is_featured) return false
    if (tier === 'regular' && member.is_featured) return false

    // Category filter using normalized category
    if (category !== 'All') {
      const memberNormCat = normalizeCategory(member.category)
      if (category === 'Others') {
        if (memberNormCat !== 'Others') return false
      } else {
        if (memberNormCat !== category && member.category !== category) return false
      }
    }

    // Search query filter
    if (search) {
      const match =
        member.full_name?.toLowerCase().includes(search) ||
        member.company_name?.toLowerCase().includes(search) ||
        member.role?.toLowerCase().includes(search) ||
        member.tagline?.toLowerCase().includes(search) ||
        member.description?.toLowerCase().includes(search) ||
        member.location?.toLowerCase().includes(search) ||
        member.category?.toLowerCase().includes(search) ||
        normalizeCategory(member.category).toLowerCase().includes(search)

      if (!match) return false
    }

    return true
  })

  // Ensure sorting consistency
  filtered = sortBmfMembers(filtered)

  // 6. Pagination calculation
  const totalFiltered = filtered.length
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const rawPaginatedMembers = filtered.slice(startIndex, endIndex)
  
  // Explicitly sanitize private contact details for public directory
  const sanitizedMembers = rawPaginatedMembers.map((m) => {
    const { 
      phone_number, 
      whatsapp_number, 
      telegram_handle, 
      preferred_contact_method, 
      contact_privacy_accepted,
      email,
      ...publicProfile 
    } = m
    return publicProfile
  })

  const hasMore = endIndex < totalFiltered
  const totalPages = Math.ceil(totalFiltered / limit)

  // 7. Response with Cache-Control headers
  return NextResponse.json(
    {
      success: true,
      members: sanitizedMembers,
      pagination: {
        page,
        limit,
        total: totalFiltered,
        totalPages,
        hasMore,
      },
      meta: {
        categories: uniqueCategories,
        totalMembers: allApprovedMembers.length,
        totalPremium,
        totalRegular,
      },
    },
    {
      status: 200,
      headers: {
        ...rateLimitResult.headers,
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    }
  )
}
