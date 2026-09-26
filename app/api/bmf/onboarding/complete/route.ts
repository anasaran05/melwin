import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { clearMembersServerCache } from '@/app/api/bmf/members/route'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      userEmail,
      full_name,
      role,
      company_name,
      category,
      phone_number,
      whatsapp_number,
      location,
      team_size,
      stage,
      description,
      website_url,
      linkedin_url,
      twitter_url,
      avatar_url,
      company_logo,
      tagline,
      card_theme,
    } = body

    if (!full_name || !company_name || !role) {
      return NextResponse.json(
        { success: false, error: 'Full name, company name, and role are required.' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: 'Database credentials not configured.' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if member exists by user_id or email
    let existingQuery = supabase.from('bmf_members').select('id, user_id, email')
    if (userId && userEmail) {
      existingQuery = existingQuery.or(`user_id.eq.${userId},email.eq.${userEmail}`)
    } else if (userId) {
      existingQuery = existingQuery.eq('user_id', userId)
    } else if (userEmail) {
      existingQuery = existingQuery.eq('email', userEmail)
    }

    const { data: existing } = await existingQuery.limit(1).maybeSingle()

    const updatePayload = {
      full_name: full_name.trim(),
      role: role.trim(),
      company_name: company_name.trim(),
      category: category || 'Technology & Software',
      phone_number: phone_number ? phone_number.trim() : null,
      whatsapp_number: whatsapp_number ? whatsapp_number.trim() : (phone_number ? phone_number.trim() : null),
      location: location ? location.trim() : '',
      team_size: team_size ? team_size.trim() : '',
      stage: stage && stage !== 'None / Not Specified' ? stage.trim() : '',
      description: description ? description.trim() : '',
      website_url: website_url ? website_url.trim() : null,
      linkedin_url: linkedin_url ? linkedin_url.trim() : null,
      twitter_url: twitter_url ? twitter_url.trim() : null,
      avatar_url: avatar_url || null,
      company_logo: company_logo || null,
      tagline: tagline || `Building ${company_name.trim()} in ${category || 'Tech'}`,
      card_theme: card_theme || 'obsidian',
      is_onboarding_completed: true,
      is_approved: true,
      is_verified: true,
      review_status: 'approved',
      admin_feedback: null,
      updated_at: new Date().toISOString(),
    }

    let savedMember = null

    if (existing) {
      const { data, error } = await supabase
        .from('bmf_members')
        .update({
          ...updatePayload,
          user_id: userId || existing.user_id,
          email: userEmail || existing.email,
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }
      savedMember = data
    } else {
      const { data, error } = await supabase
        .from('bmf_members')
        .insert({
          id: userId,
          user_id: userId,
          email: userEmail,
          ...updatePayload,
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }
      savedMember = data
    }

    // Invalidate server cache so directory reflects the new member immediately
    clearMembersServerCache()

    return NextResponse.json({
      success: true,
      member: savedMember,
    })
  } catch (err: any) {
    console.error('Error completing onboarding:', err)
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 })
  }
}
