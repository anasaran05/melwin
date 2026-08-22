import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEventRsvpConfirmationEmail } from '@/lib/email/resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { registrationId, action, feedback } = body

    if (!registrationId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing registrationId or action' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    let regData: any = null

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { data: reg, error: fetchErr } = await supabase
        .from('bmf_event_registrations')
        .select('*, event:bmf_events(*)')
        .eq('id', registrationId)
        .single()

      if (fetchErr || !reg) {
        return NextResponse.json(
          { success: false, error: 'Registration not found' },
          { status: 404 }
        )
      }

      regData = reg

      let newStatus: 'pending' | 'approved' | 'rejected' | 'waitlisted' | 'attended' = 'pending'
      if (action === 'approve') newStatus = 'approved'
      if (action === 'reject') newStatus = 'rejected'
      if (action === 'waitlist') newStatus = 'waitlisted'
      if (action === 'mark_attended') newStatus = 'attended'

      const { error: updateErr } = await supabase
        .from('bmf_event_registrations')
        .update({
          status: newStatus,
          admin_feedback: feedback || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', registrationId)

      if (updateErr) {
        return NextResponse.json(
          { success: false, error: updateErr.message },
          { status: 500 }
        )
      }
    }

    // Trigger Resend notification if email is present
    if (regData?.email) {
      const isApproved = action === 'approve'
      const isWaitlist = action === 'waitlist'
      await sendEventRsvpConfirmationEmail({
        to: regData.email,
        attendeeName: regData.full_name,
        eventTitle: regData.event?.title || 'BMF Gathering',
        eventDate: regData.event?.event_date || 'Upcoming Date',
        location: regData.event?.location_venue || regData.event?.location_city || 'Bangalore',
        status: isApproved ? 'approved' : isWaitlist ? 'waitlisted' : 'pending',
        ticketCode: regData.ticket_code,
      })
    }

    return NextResponse.json({
      success: true,
      message: `Registration status updated to ${action}.`,
    })
  } catch (error: any) {
    console.error('[Admin Event Action Error]:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
