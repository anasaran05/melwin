import { NextResponse } from 'next/server'
import { getSupabaseAdminClient, getSupabasePublicAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const admin = getSupabaseAdminClient()
    const publicAdmin = getSupabasePublicAdminClient()

    let rawProducts: any[] = []
    let fetchError: any = null

    // Attempt 1: Schema-specific client
    const { data: schemaData, error: schemaErr } = await admin
      .from('bmf_products')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })

    if (!schemaErr && schemaData && schemaData.length > 0) {
      rawProducts = schemaData
    } else {
      fetchError = schemaErr
      // Attempt 2: Public schema view/fallback
      const { data: pubData, error: pubErr } = await publicAdmin
        .from('bmf_products')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })

      if (!pubErr && pubData && pubData.length > 0) {
        rawProducts = pubData
      } else if (pubErr) {
        fetchError = pubErr
      }
    }

    // Format into standard store product items
    const products = rawProducts.map((p) => {
      const parsedReg = Number(p.regular_price ?? p.price_inr ?? p.price ?? 99)
      const regPrice = isNaN(parsedReg) ? 99 : parsedReg
      const discountPercent = Number(p.premium_discount_percent ?? 50)
      const calculatedPrem =
        regPrice === 0 ? 0 : Math.round(regPrice * (1 - (isNaN(discountPercent) ? 50 : discountPercent) / 100))
      const parsedPrem = Number(p.discounted_price_inr ?? p.premium_price ?? calculatedPrem)
      const premPrice = regPrice === 0 ? 0 : isNaN(parsedPrem) ? 49 : parsedPrem

      const rawFormat = p.format_badge || p.format || 'PDF Guide'
      const cleanFormat = rawFormat.replace(/\s*\(\s*\d+[\d.]*\s*(?:KB|MB|GB|bytes|B)\s*\)/gi, '').trim()

      return {
        id: p.id,
        slug: p.slug || p.id,
        title: p.title,
        category: p.category || 'Growth',
        format: cleanFormat || 'PDF Guide',
        description: p.description || '',
        highlights: Array.isArray(p.highlights) ? p.highlights : [],
        regularPrice: regPrice,
        premiumPrice: premPrice,
        fileType: (p.product_type as any) || (p.file_type as any) || 'pdf',
        downloadUrl: p.asset_url || p.download_url,
        isExclusive: Boolean(p.is_exclusive),
        isFree: regPrice === 0,
      }
    })

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    })
  } catch (err: any) {
    console.error('[API /api/bmf/products] Error fetching store products:', err)
    return NextResponse.json(
      { success: false, error: err.message, products: [] },
      { status: 500 }
    )
  }
}
