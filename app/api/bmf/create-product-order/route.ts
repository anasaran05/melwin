import { NextRequest, NextResponse } from 'next/server'
import { POST as createOrderHandler } from '@/app/api/cashfree/create-order/route'

export const dynamic = 'force-dynamic'

/**
 * Fallback endpoint for /api/bmf/create-product-order
 * Automatically proxies requests to /api/cashfree/create-order
 * to prevent 404 errors from any cached client bundles or direct calls.
 */
export async function POST(request: NextRequest) {
  try {
    return await createOrderHandler(request)
  } catch (error: any) {
    console.error('[Fallback API create-product-order] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment session' },
      { status: 500 }
    )
  }
}
