import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendAdminIntroRequestAlert } from '@/lib/notifications/admin-alerts'
import { 
  sendNewIntroRequestEmail, 
  sendIntroRequestConfirmationEmail 
} from '@/lib/email/resend'

function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return null
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      target_member_id,
      target_member_name,
      target_member_company,
      target_member_email,
      requester_user_id,
      requester_name,
      requester_email,
      requester_phone,
      requester_company,
      requester_role,
      requester_linkedin,
      purpose,
      message,
    } = body

    if (!target_member_id || !requester_name || !requester_email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields (target_member_id, requester_name, requester_email, message).' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()
    let savedRequest: any = null

    if (supabase) {
      // 1. Fetch fresh target founder details if not supplied
      let targetEmail = target_member_email
      let targetName = target_member_name
      let targetCompany = target_member_company

      if (!targetEmail) {
        const { data: memberData } = await supabase
          .from('bmf_members')
          .select('full_name, company_name, email')
          .eq('id', target_member_id)
          .maybeSingle()

        if (memberData) {
          targetEmail = memberData.email
          targetName = targetName || memberData.full_name
          targetCompany = targetCompany || memberData.company_name
        }
      }

      // 2. Insert into bmf_club.bmf_intro_requests
      const { data, error } = await supabase
        .from('bmf_intro_requests')
        .insert({
          target_member_id,
          target_member_name: targetName || 'BMF Founder',
          target_member_company: targetCompany || 'Startup',
          target_member_email: targetEmail || '',
          requester_user_id: requester_user_id || null,
          requester_name,
          requester_email,
          requester_phone: requester_phone || null,
          requester_company: requester_company || null,
          requester_role: requester_role || null,
          requester_linkedin: requester_linkedin || null,
          purpose: purpose || 'Founder Chat',
          message,
          status: 'pending',
        })
        .select()
        .single()

      if (error) {
        console.error('[Supabase Intro Request Insert Error]:', error)
      } else {
        savedRequest = data
      }
    }

    // 3. Dispatch Admin Alert (Telegram Bot & Discord Webhook)
    await sendAdminIntroRequestAlert({
      requestId: savedRequest?.id || 'demo-request-id',
      requesterName: requester_name,
      requesterEmail: requester_email,
      requesterPhone: requester_phone,
      requesterCompany: requester_company,
      requesterRole: requester_role,
      targetMemberName: target_member_name || 'BMF Founder',
      targetMemberCompany: target_member_company || 'Startup',
      targetMemberEmail: target_member_email || '',
      purpose: purpose || 'Founder Chat',
      message,
    })

    // 4. Dispatch Email to Target Founder
    if (target_member_email) {
      await sendNewIntroRequestEmail({
        to: target_member_email,
        targetFounderName: target_member_name,
        requesterName: requester_name,
        requesterCompany: requester_company,
        requesterRole: requester_role,
        purpose: purpose || 'Founder Chat',
        message,
      })
    }

    // 5. Dispatch Confirmation Email to Requester
    if (requester_email) {
      await sendIntroRequestConfirmationEmail({
        to: requester_email,
        requesterName: requester_name,
        targetFounderName: target_member_name,
        targetFounderCompany: target_member_company,
      })
    }

    return NextResponse.json({
      success: true,
      data: savedRequest || {
        id: 'local-' + Date.now(),
        target_member_name,
        requester_name,
        status: 'pending',
      },
    })
  } catch (err: any) {
    console.error('[API Request Intro Error]:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to process intro request.' },
      { status: 500 }
    )
  }
}
