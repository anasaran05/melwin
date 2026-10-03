import { NextRequest, NextResponse } from 'next/server'
import { fetchPublicStoreProducts } from '@/lib/supabase/store'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('refresh') === 'true'

    const products = await fetchPublicStoreProducts(forceRefresh)

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        products,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error: any) {
    console.error('[API /api/store/products] Error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products', products: [] },
      { status: 500 }
    )
  }
}
