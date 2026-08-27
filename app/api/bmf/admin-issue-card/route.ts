import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { CARD_TIERS, CardTier } from '@/lib/supabase/bmf-cards'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      member_id,
      user_id,
      card_holder_name,
      company_name,
      card_tier = 'obsidian',
      card_number,
      nfc_uid,
      valid_thru = '12/28',
      member_since = '2026',
      card_customization = {},
      tier_perks,
      application_data,
      is_active = true,
      approval_status = 'approved',
    } = body

    if (!card_holder_name || !company_name) {
      return NextResponse.json(
        { success: false, error: 'Cardholder name and Company name are required.' },
        { status: 400 }
      )
    }

    const tierMeta = CARD_TIERS[card_tier as CardTier] || CARD_TIERS.obsidian
    const perks = tier_perks && Array.isArray(tier_perks) && tier_perks.length > 0
      ? tier_perks
      : tierMeta.perks

    // Generate card number if not provided
    const randomMid = Math.floor(1000 + Math.random() * 9000)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const finalCardNumber = card_number || `4592  8820  ${randomMid}  ${randomSuffix}`
    const finalNfcUid = nfc_uid || `BMF-NFC-${Math.floor(10000 + Math.random() * 90000)}`

    const now = new Date().toISOString()
    const cardPayload: any = {
      card_tier,
      card_holder_name: card_holder_name.trim().toUpperCase(),
      company_name: company_name.trim().toUpperCase(),
      card_number: finalCardNumber,
      nfc_uid: finalNfcUid,
      valid_thru,
      member_since,
      is_active: is_active ?? true,
      approval_status: approval_status || 'approved',
      tier_perks: perks,
      card_customization: card_customization || {},
      reviewed_at: now,
      updated_at: now,
    }

    if (member_id) cardPayload.member_id = member_id
    if (user_id) cardPayload.user_id = user_id
    if (application_data) cardPayload.application_data = application_data

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      const mockCard = {
        id: id || `card-${member_id || Date.now()}`,
        ...cardPayload,
        created_at: now,
      }
      return NextResponse.json({
        success: true,
        card: mockCard,
        message: 'Pass issued in local mode (Supabase credentials not configured)',
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Resolve user_id if we only have member_id
    let resolvedUserId = user_id
    if (!resolvedUserId && member_id) {
      const { data: memberData } = await supabase
        .from('bmf_members')
        .select('user_id')
        .eq('id', member_id)
        .maybeSingle()

      if (memberData?.user_id) {
        resolvedUserId = memberData.user_id
        cardPayload.user_id = resolvedUserId
      }
    }

    // Check if a card already exists for this member or user
    let existingCardId: string | null = id || null

    if (!existingCardId && (resolvedUserId || member_id)) {
      const query = supabase.from('bmf_cards').select('id')
      if (resolvedUserId && member_id) {
        query.or(`user_id.eq.${resolvedUserId},member_id.eq.${member_id}`)
      } else if (resolvedUserId) {
        query.eq('user_id', resolvedUserId)
      } else if (member_id) {
        query.eq('member_id', member_id)
      }

      const { data: existing } = await query.limit(1).maybeSingle()
      if (existing?.id) {
        existingCardId = existing.id
      }
    }

    let savedCard: any = null
    let saveError: any = null

    if (existingCardId) {
      const { data, error } = await supabase
        .from('bmf_cards')
        .update(cardPayload)
        .eq('id', existingCardId)
        .select()
        .single()

      savedCard = data
      saveError = error
    } else {
      const newCardId = (id && id.length > 20) ? id : undefined
      const insertData = newCardId
        ? { id: newCardId, ...cardPayload, created_at: now }
        : { ...cardPayload, created_at: now }

      const { data, error } = await supabase
        .from('bmf_cards')
        .insert(insertData)
        .select()
        .single()

      savedCard = data
      saveError = error
    }

    if (saveError) {
      console.error('Error saving card to Supabase:', saveError)
      return NextResponse.json(
        { success: false, error: saveError.message || 'Failed to persist card' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      card: savedCard,
      message: `Executive Metal Pass issued successfully for ${savedCard.card_holder_name}`,
    })
  } catch (err: any) {
    console.error('Error in admin-issue-card API:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
