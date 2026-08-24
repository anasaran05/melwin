import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendAdminIntroResponseAlert } from '@/lib/notifications/admin-alerts'
import { sendMutualWarmIntroEmail } from '@/lib/email/resend'

function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return null
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { request_id, action, founder_note } = body

    if (!request_id || !action || !['accepted', 'declined'].includes(action)) {
      return NextResponse.json(
        { error: 'Valid request_id and action (accepted | declined) are required.' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()
    let requestRecord: any = null

    if (supabase) {
      // 1. Fetch current intro request record
      const { data: existingReq, error: fetchErr } = await supabase
        .from('bmf_intro_requests')
        .select('*')
        .eq('id', request_id)
        .single()

      if (fetchErr || !existingReq) {
        return NextResponse.json({ error: 'Intro request not found.' }, { status: 404 })
      }

      requestRecord = existingReq

      // 2. Fetch founder contact details (phone, whatsapp, etc.)
      const { data: targetMember } = await supabase
        .from('bmf_members')
        .select('full_name, company_name, email, phone_number, whatsapp_number')
        .eq('id', existingReq.target_member_id)
        .maybeSingle()

      // 3. Update status in database
      const { data: updatedData, error: updateErr } = await supabase
        .from('bmf_intro_requests')
        .update({
          status: action,
          founder_response_note: founder_note || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', request_id)
        .select()
        .single()

      if (updateErr) {
        console.error('[Supabase Intro Update Error]:', updateErr)
      } else {
        requestRecord = updatedData
      }

      // 4. If Accepted -> Dispatch Mutual Warm Introduction Email via Resend
      if (action === 'accepted') {
        const founderEmail = targetMember?.email || existingReq.target_member_email
        const founderPhone = targetMember?.phone_number || targetMember?.whatsapp_number

        if (founderEmail && existingReq.requester_email) {
          await sendMutualWarmIntroEmail({
            founderEmail,
            founderName: existingReq.target_member_name,
            founderCompany: existingReq.target_member_company,
            founderPhone,
            requesterEmail: existingReq.requester_email,
            requesterName: existingReq.requester_name,
            requesterCompany: existingReq.requester_company,
            requesterPhone: existingReq.requester_phone,
            purpose: existingReq.purpose,
            message: existingReq.message,
          })
        }
      }
    }

    // 5. Dispatch Real-Time Alert to Telegram & Discord
    if (requestRecord) {
      await sendAdminIntroResponseAlert({
        requestId: request_id,
        targetMemberName: requestRecord.target_member_name,
        targetMemberCompany: requestRecord.target_member_company,
        requesterName: requestRecord.requester_name,
        requesterEmail: requestRecord.requester_email,
        action,
        responseNote: founder_note,
      })
    }

    return NextResponse.json({
      success: true,
      data: requestRecord,
      message: action === 'accepted' ? 'Warm introduction email sent to both parties!' : 'Intro request passed.',
    })
  } catch (err: any) {
    console.error('[API Respond Intro Error]:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to update intro request.' },
      { status: 500 }
    )
  }
}
