import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchCustomerPurchases } from '@/lib/supabase/store'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const emailParam = searchParams.get('email')

    let userId: string | null = null
    let sessionEmail: string | null = null

    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        userId = user.id
        sessionEmail = user.email || null
      }
    } catch (_) {}

    const targetEmail = (emailParam || sessionEmail)?.toLowerCase().trim() || null

    if (!userId && !targetEmail) {
      return NextResponse.json({
        success: true,
        purchases: [],
        authenticated: false,
      })
    }

    const purchases = await fetchCustomerPurchases({
      userId,
      customerEmail: targetEmail,
    })

    return NextResponse.json({
      success: true,
      authenticated: Boolean(userId),
      email: targetEmail,
      count: purchases.length,
      purchases,
    })
  } catch (error: any) {
    console.error('[API /api/store/my-purchases] Error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch customer purchases', purchases: [] },
      { status: 500 }
    )
  }
}
