import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendShowcaseApprovedEmail, sendShowcaseRevisionEmail } from '@/lib/email/resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { memberId, action, feedback } = body

    if (!memberId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing memberId or action' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    let memberData: any = null

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Fetch current member details
      const { data: member, error: fetchErr } = await supabase
        .from('bmf_members')
        .select('*')
        .eq('id', memberId)
        .single()

      if (fetchErr || !member) {
        return NextResponse.json(
          { success: false, error: 'Member not found in database' },
          { status: 404 }
        )
      }

      memberData = member

      let updatePayload: any = { updated_at: new Date().toISOString() }

      if (action === 'approve') {
        updatePayload.is_approved = true
        updatePayload.review_status = 'approved'
        updatePayload.admin_feedback = null
      } else if (action === 'reject') {
        updatePayload.is_approved = false
        updatePayload.review_status = 'rejected'
        updatePayload.admin_feedback = feedback || 'Please provide more details regarding traction and clear company bio.'
      } else if (action === 'toggle_verify') {
        updatePayload.is_verified = !member.is_verified
      } else if (action === 'toggle_featured') {
        updatePayload.is_featured = !member.is_featured
      }

      const { error: updateErr } = await supabase
        .from('bmf_members')
        .update(updatePayload)
        .eq('id', memberId)

      if (updateErr) {
        return NextResponse.json(
          { success: false, error: updateErr.message },
          { status: 500 }
        )
      }
    } else {
      // Local fallback mock
      memberData = {
        email: 'founder@example.com',
        full_name: 'Founder Name',
        company_name: 'Startup Inc',
      }
    }

    // Trigger Resend email notification if email exists
    if (memberData?.email) {
      if (action === 'approve') {
        await sendShowcaseApprovedEmail({
          to: memberData.email,
          founderName: memberData.full_name,
          companyName: memberData.company_name,
          showcaseUrl: `${request.nextUrl.origin}/bmf-club`,
        })
      } else if (action === 'reject') {
        await sendShowcaseRevisionEmail({
          to: memberData.email,
          founderName: memberData.full_name,
          companyName: memberData.company_name,
          feedback: feedback || 'Please provide clearer traction metrics and high-res founder portrait.',
          studioUrl: `${request.nextUrl.origin}/bmf-club/login`,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Member action '${action}' completed successfully.`,
    })
  } catch (error: any) {
    console.error('[API Admin Action Error]:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
