import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { CARD_TIERS, CardTier } from '@/lib/supabase/bmf-cards'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cardId, action, feedback, tier } = body

    if (!cardId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing cardId or action' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: true, message: 'Simulated admin card action (demo)' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch existing card
    const { data: card, error: fetchErr } = await supabase
      .from('bmf_cards')
      .select('*')
      .eq('id', cardId)
      .single()

    if (fetchErr || !card) {
      return NextResponse.json(
        { success: false, error: 'Card record not found in database' },
        { status: 404 }
      )
    }

    let updatePayload: any = {
      updated_at: new Date().toISOString(),
    }

    if (action === 'approve') {
      updatePayload.approval_status = 'approved'
      updatePayload.is_active = true
      updatePayload.reviewed_at = new Date().toISOString()
      updatePayload.admin_feedback = null
    } else if (action === 'reject') {
      updatePayload.approval_status = 'rejected'
      updatePayload.is_active = false
      updatePayload.reviewed_at = new Date().toISOString()
      updatePayload.admin_feedback = feedback || 'Application did not meet current syndicate intake criteria.'
    } else if (action === 'set_tier' && tier && CARD_TIERS[tier as CardTier]) {
      updatePayload.card_tier = tier
      updatePayload.tier_perks = CARD_TIERS[tier as CardTier].perks
    } else if (action === 'toggle_active') {
      updatePayload.is_active = !card.is_active
    }

    const { data: updatedCard, error: updateErr } = await supabase
      .from('bmf_cards')
      .update(updatePayload)
      .eq('id', cardId)
      .select()
      .single()

    if (updateErr) {
      return NextResponse.json(
        { success: false, error: updateErr.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      card: updatedCard,
      message: `Card ${action === 'approve' ? 'approved & unlocked' : action === 'reject' ? 'rejected' : 'updated'} successfully`,
    })
  } catch (err: any) {
    console.error('Error handling admin card action:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
