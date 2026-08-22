import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEventRsvpConfirmationEmail } from '@/lib/email/resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      event_id,
      full_name,
      email,
      phone,
      company_name,
      role,
      linkedin_url,
      notes,
    } = body

    if (!event_id || !full_name || !email) {
      return NextResponse.json(
        { success: false, error: 'Event ID, full name, and email are required.' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    let eventTitle = 'BMF Private Gathering'
    let eventDate = 'Upcoming Date'
    let eventVenue = 'Bangalore'
    let registrationStatus: 'pending' | 'approved' | 'waitlisted' = 'pending'
    const ticketCode = `BMF-${Math.floor(100000 + Math.random() * 900000)}`

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Fetch target event
      const { data: event, error: eventErr } = await supabase
        .from('bmf_events')
        .select('*')
        .eq('id', event_id)
        .single()

      if (eventErr || !event) {
        return NextResponse.json(
          { success: false, error: 'Event not found in directory.' },
          { status: 404 }
        )
      }

      eventTitle = event.title
      eventDate = event.event_date
      eventVenue = event.location_venue || event.location_city || 'Bangalore'

      // Check slot limits / capacity
      const isFull = event.total_capacity > 0 && event.registered_count >= event.total_capacity

      if (isFull) {
        registrationStatus = 'waitlisted'
      } else {
        registrationStatus = 'pending'
        // Increment registered count
        await supabase
            .from('bmf_events')
          .update({ registered_count: (event.registered_count || 0) + 1 })
          .eq('id', event_id)
      }

      // Insert registration record
      const { data: reg, error: regErr } = await supabase
        .from('bmf_event_registrations')
        .insert({
          event_id,
          full_name,
          email,
          phone,
          company_name,
          role,
          linkedin_url,
          notes,
          status: registrationStatus,
          ticket_code: ticketCode,
        })
        .select()
        .single()

      if (regErr) {
        return NextResponse.json(
          { success: false, error: regErr.message },
          { status: 500 }
        )
      }
    } else {
      // Local fallback
      eventTitle = 'BMF Founders Gathering'
    }

    // Trigger Resend email
    await sendEventRsvpConfirmationEmail({
      to: email,
      attendeeName: full_name,
      eventTitle,
      eventDate,
      location: eventVenue,
      status: registrationStatus,
      ticketCode,
    })

    return NextResponse.json({
      success: true,
      registrationStatus,
      message:
        registrationStatus === 'waitlisted'
          ? 'Event capacity has been reached. You have been placed on the priority waitlist.'
          : 'Your application has been received! Check your inbox for confirmation details.',
    })
  } catch (error: any) {
    console.error('[Event Register Error]:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
