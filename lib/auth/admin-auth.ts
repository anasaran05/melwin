import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

export interface AdminAuthResult {
  authorized: boolean
  error?: string
  user?: any
}

/**
 * Validates whether the incoming API request belongs to an authenticated Admin.
 * Used to protect privileged BMF operations (approving founders, toggling verified badges, issuing cards, etc.)
 */
export async function verifyAdminAuth(): Promise<AdminAuthResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()

    if (authErr || !user) {
      return { authorized: false, error: 'Unauthorized: Valid session required.' }
    }

    const email = user.email?.toLowerCase().trim() || ''

    // 1. Environment whitelist check
    const configuredAdmins = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
      .toLowerCase()
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean)

    // Known default team admin emails
    const defaultAdmins = [
      'admin@buildwithmelwin.com',
      'melwin@buildwithmelwin.com',
      'buildwithmelwin@gmail.com',
      'anasaran05@gmail.com',
    ]

    const allAdminEmails = new Set([...configuredAdmins, ...defaultAdmins])

    if (allAdminEmails.has(email) || email.endsWith('@buildwithmelwin.com')) {
      return { authorized: true, user }
    }

    // 2. Check Database role in bmf_members
    const adminDb = getSupabaseAdminClient()
    const { data: member } = await adminDb
      .from('bmf_members')
      .select('role, is_approved')
      .eq('user_id', user.id)
      .maybeSingle()

    if (member && member.role === 'admin') {
      return { authorized: true, user }
    }

    return { authorized: false, error: 'Forbidden: Admin privileges required to perform this action.' }
  } catch (err: any) {
    return { authorized: false, error: err.message || 'Authentication check failed.' }
  }
}
