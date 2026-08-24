import { getSupabaseBrowserClient } from './bmf-members'

export interface BmfIntroRequest {
  id: string
  target_member_id: string
  target_member_name: string
  target_member_company: string
  target_member_email: string
  requester_user_id?: string | null
  requester_name: string
  requester_email: string
  requester_phone?: string | null
  requester_company?: string | null
  requester_role?: string | null
  requester_linkedin?: string | null
  purpose: string
  message: string
  status: 'pending' | 'accepted' | 'declined' | 'archived'
  founder_response_note?: string | null
  created_at: string
  updated_at: string
}

/**
 * Fetch received warm intros for a specific target member / founder
 */
export async function fetchReceivedIntros(targetMemberId?: string, targetEmail?: string): Promise<BmfIntroRequest[]> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return []

    let query = supabase
      .from('bmf_intro_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (targetMemberId && targetEmail) {
      query = query.or(`target_member_id.eq.${targetMemberId},target_member_email.eq.${targetEmail}`)
    } else if (targetMemberId) {
      query = query.eq('target_member_id', targetMemberId)
    } else if (targetEmail) {
      query = query.eq('target_member_email', targetEmail)
    }

    const { data, error } = await query
    if (error) {
      console.error('[fetchReceivedIntros Error]:', error)
      return []
    }
    return (data || []) as BmfIntroRequest[]
  } catch (err) {
    console.error('[fetchReceivedIntros Failed]:', err)
    return []
  }
}

/**
 * Fetch sent warm intros requested by the current user
 */
export async function fetchSentIntros(requesterEmail: string): Promise<BmfIntroRequest[]> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase || !requesterEmail) return []

    const { data, error } = await supabase
      .from('bmf_intro_requests')
      .select('*')
      .eq('requester_email', requesterEmail)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[fetchSentIntros Error]:', error)
      return []
    }
    return (data || []) as BmfIntroRequest[]
  } catch (err) {
    console.error('[fetchSentIntros Failed]:', err)
    return []
  }
}

/**
 * Fetch all intro requests across BMF Club for the Admin Console
 */
export async function fetchAllIntrosForAdmin(): Promise<BmfIntroRequest[]> {
  try {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('bmf_intro_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[fetchAllIntrosForAdmin Error]:', error)
      return []
    }
    return (data || []) as BmfIntroRequest[]
  } catch (err) {
    console.error('[fetchAllIntrosForAdmin Failed]:', err)
    return []
  }
}
