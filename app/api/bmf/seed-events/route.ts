import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { INITIAL_BMF_EVENTS } from '@/lib/supabase/bmf-events'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: true,
        message: 'No Supabase credentials configured. Running in memory mode.',
        seededCount: INITIAL_BMF_EVENTS.length,
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check existing count
    const { count, error: countErr } = await supabase
      .from('bmf_events')
      .select('*', { count: 'exact', head: true })

    if (countErr) {
      console.warn('bmf_events count check warning:', countErr.message)
    }

    // Upsert initial events
    const { data, error: upsertErr } = await supabase
      .from('bmf_events')
      .upsert(
        INITIAL_BMF_EVENTS.map((e) => ({
          title: e.title,
          slug: e.slug,
          tagline: e.tagline,
          description: e.description,
          cover_image: e.cover_image,
          event_date: e.event_date,
          event_time: e.event_time,
          location_type: e.location_type,
          location_venue: e.location_venue,
          location_city: e.location_city,
          category: e.category,
          total_capacity: e.total_capacity,
          registered_count: e.registered_count,
          is_published: e.is_published,
          status: e.status,
          cta_type: e.cta_type,
          external_cta_url: e.external_cta_url,
          external_cta_text: e.external_cta_text,
          pricing_type: e.pricing_type,
          price_inr: e.price_inr,
          requirements: e.requirements,
          tags: e.tags,
        })),
        { onConflict: 'slug' }
      )
      .select()

    if (upsertErr) {
      return NextResponse.json({ success: false, error: upsertErr.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      seededCount: data?.length || INITIAL_BMF_EVENTS.length,
      data,
    })
  } catch (err: any) {
    console.error('Seed events API error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function GET() {
  return POST(new Request('http://localhost/api/bmf/seed-events', { method: 'POST' }))
}
