import { NextResponse } from 'next/server'
import { fetchPublicStoreProducts } from '@/lib/supabase/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const products = await fetchPublicStoreProducts()
    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    })
  } catch (error: any) {
    console.error('[API /api/store/products] Error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products', products: [] },
      { status: 500 }
    )
  }
}
