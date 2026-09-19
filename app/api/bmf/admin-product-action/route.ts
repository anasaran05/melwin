import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient, getSupabasePublicAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * GET: Fetch all products for admin console (both published and drafts)
 */
export async function GET() {
  try {
    const admin = getSupabaseAdminClient()
    const publicAdmin = getSupabasePublicAdminClient()

    let products: any[] = []
    const { data, error } = await admin
      .from('bmf_products')
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data) {
      products = data
    } else {
      const { data: pubData, error: pubErr } = await publicAdmin
        .from('bmf_products')
        .select('*')
        .order('display_order', { ascending: true })

      if (pubErr) {
        throw new Error(pubErr.message)
      }
      products = pubData || []
    }

    return NextResponse.json({ success: true, products })
  } catch (err: any) {
    console.error('[Admin Product Action GET] Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

/**
 * POST: Create, Update, Delete, or Toggle status of digital store products
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, product, productId } = body

    if (!action) {
      return NextResponse.json({ success: false, error: 'Missing action parameter' }, { status: 400 })
    }

    const admin = getSupabaseAdminClient()
    const publicAdmin = getSupabasePublicAdminClient()

    // 1. CREATE PRODUCT
    if (action === 'create') {
      if (!product || !product.title) {
        return NextResponse.json({ success: false, error: 'Product title is required' }, { status: 400 })
      }

      const rawSlug = product.slug || product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const finalSlug = rawSlug + (product.slug ? '' : `-${Math.random().toString(36).substring(2, 6)}`)
      const regPrice = Number(product.regular_price ?? product.regularPrice ?? 99)
      const discountPercent = Number(product.premium_discount_percent ?? 50)
      const highlightsArray = Array.isArray(product.highlights)
        ? product.highlights
        : typeof product.highlights === 'string'
        ? product.highlights.split('\n').map((h: string) => h.trim()).filter(Boolean)
        : []

      const productPayload = {
        slug: finalSlug,
        title: product.title.trim(),
        subtitle: product.subtitle || null,
        description: product.description || '',
        category: product.category || 'Growth',
        product_type: product.product_type || product.fileType || 'pdf',
        format_badge: product.format_badge || product.format || 'PDF Guide',
        regular_price: isNaN(regPrice) ? 99 : regPrice,
        premium_discount_percent: isNaN(discountPercent) ? 50 : discountPercent,
        is_exclusive: Boolean(product.is_exclusive),
        is_free_for_premium: regPrice === 0 || Boolean(product.is_free_for_premium),
        highlights: highlightsArray,
        asset_url: product.asset_url || product.downloadUrl || null,
        preview_url: product.preview_url || null,
        author_name: product.author_name || 'Build With Melwin',
        is_published: product.is_published !== false,
        display_order: Number(product.display_order || 0),
        metadata: product.metadata || {},
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await admin
        .from('bmf_products')
        .insert(productPayload)
        .select()
        .single()

      if (error) {
        console.warn('[Admin Product Action] Fallback to public admin for insert:', error.message)
        const { data: pubData, error: pubErr } = await publicAdmin
          .from('bmf_products')
          .insert(productPayload)
          .select()
          .single()

        if (pubErr) throw new Error(pubErr.message)
        return NextResponse.json({ success: true, product: pubData })
      }

      return NextResponse.json({ success: true, product: data })
    }

    // 2. UPDATE PRODUCT
    if (action === 'update') {
      const id = productId || product?.id
      if (!id) {
        return NextResponse.json({ success: false, error: 'Product ID is required for update' }, { status: 400 })
      }

      const regPrice = Number(product.regular_price ?? product.regularPrice ?? 99)
      const discountPercent = Number(product.premium_discount_percent ?? 50)
      const highlightsArray = Array.isArray(product.highlights)
        ? product.highlights
        : typeof product.highlights === 'string'
        ? product.highlights.split('\n').map((h: string) => h.trim()).filter(Boolean)
        : []

      const updatePayload: any = {
        updated_at: new Date().toISOString(),
      }

      if (product.title) updatePayload.title = product.title.trim()
      if (product.subtitle !== undefined) updatePayload.subtitle = product.subtitle
      if (product.description !== undefined) updatePayload.description = product.description
      if (product.category) updatePayload.category = product.category
      if (product.product_type) updatePayload.product_type = product.product_type
      if (product.format_badge || product.format) updatePayload.format_badge = product.format_badge || product.format
      if (product.regular_price !== undefined || product.regularPrice !== undefined) {
        updatePayload.regular_price = isNaN(regPrice) ? 99 : regPrice
      }
      if (product.premium_discount_percent !== undefined) {
        updatePayload.premium_discount_percent = isNaN(discountPercent) ? 50 : discountPercent
      }
      if (product.is_exclusive !== undefined) updatePayload.is_exclusive = Boolean(product.is_exclusive)
      if (product.is_free_for_premium !== undefined) updatePayload.is_free_for_premium = Boolean(product.is_free_for_premium)
      if (product.highlights !== undefined) updatePayload.highlights = highlightsArray
      if (product.asset_url !== undefined || product.downloadUrl !== undefined) {
        updatePayload.asset_url = product.asset_url || product.downloadUrl
      }
      if (product.is_published !== undefined) updatePayload.is_published = Boolean(product.is_published)
      if (product.display_order !== undefined) updatePayload.display_order = Number(product.display_order)

      const { data, error } = await admin
        .from('bmf_products')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        const { data: pubData, error: pubErr } = await publicAdmin
          .from('bmf_products')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .single()

        if (pubErr) throw new Error(pubErr.message)
        return NextResponse.json({ success: true, product: pubData })
      }

      return NextResponse.json({ success: true, product: data })
    }

    // 3. TOGGLE PUBLISH STATUS
    if (action === 'toggle_publish') {
      const id = productId || product?.id
      if (!id) {
        return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 })
      }

      const isPublished = Boolean(product?.is_published)
      const { data, error } = await admin
        .from('bmf_products')
        .update({ is_published: isPublished, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        const { data: pubData, error: pubErr } = await publicAdmin
          .from('bmf_products')
          .update({ is_published: isPublished, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single()

        if (pubErr) throw new Error(pubErr.message)
        return NextResponse.json({ success: true, product: pubData })
      }

      return NextResponse.json({ success: true, product: data })
    }

    // 4. DELETE PRODUCT
    if (action === 'delete') {
      const id = productId || product?.id
      if (!id) {
        return NextResponse.json({ success: false, error: 'Product ID is required for deletion' }, { status: 400 })
      }

      const { error } = await admin
        .from('bmf_products')
        .delete()
        .eq('id', id)

      if (error) {
        const { error: pubErr } = await publicAdmin
          .from('bmf_products')
          .delete()
          .eq('id', id)

        if (pubErr) throw new Error(pubErr.message)
      }

      return NextResponse.json({ success: true, deletedId: id })
    }

    return NextResponse.json({ success: false, error: `Invalid action: ${action}` }, { status: 400 })
  } catch (err: any) {
    console.error('[Admin Product Action POST] Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
