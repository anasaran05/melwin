import { NextRequest, NextResponse } from 'next/server'
import { getSupabasePublicAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * GET: Fetch all products for Manager Store Console (published + drafts)
 */
export async function GET() {
  try {
    const publicAdmin = getSupabasePublicAdminClient()

    // 1. Fetch products, purchases, and orders concurrently
    const [productsRes, purchasesRes, storeOrdersRes, bmfOrdersRes] = await Promise.all([
      publicAdmin
        .from('store_products')
        .select('*')
        .order('display_order', { ascending: true }),
      publicAdmin
        .from('store_purchases')
        .select('id, product_id, amount_paid, access_status, order_id, customer_email')
        .eq('access_status', 'active'),
      publicAdmin
        .from('store_orders')
        .select('id, order_id, order_amount, status, items')
        .eq('status', 'paid'),
      publicAdmin
        .from('bmf_orders')
        .select('id, order_id, amount, status, order_type, metadata')
        .eq('status', 'paid'),
    ])

    let rawProducts: any[] = productsRes.data || []
    if (!rawProducts.length) {
      const { data: bmfData } = await publicAdmin
        .from('bmf_products')
        .select('*')
        .order('display_order', { ascending: true })
      rawProducts = bmfData || []
    }

    const purchases = purchasesRes.data || []
    const storeOrders = storeOrdersRes.data || []
    const bmfOrders = bmfOrdersRes.data || []

    // 2. Precisely align and compute purchase units for every product
    const products = await Promise.all(
      rawProducts.map(async (p) => {
        // Matches from store_purchases
        const pPurchases = purchases.filter((pu) => pu.product_id === p.id)

        // Matches from store_orders
        const pStoreOrders = storeOrders.filter((so) => {
          if (!Array.isArray(so.items)) return false
          return so.items.some(
            (item: any) =>
              item.product_id === p.id ||
              item.slug === p.slug ||
              (item.title && p.title && item.title.toLowerCase().trim() === p.title.toLowerCase().trim())
          )
        })

        // Matches from legacy/supplemental bmf_orders
        const pBmfOrders = bmfOrders.filter((bo) => {
          const meta = bo.metadata || {}
          const metaTitle = (meta.product_title || '').toLowerCase().trim()
          const pTitle = (p.title || '').toLowerCase().trim()
          return (
            bo.product_id === p.id ||
            (metaTitle && pTitle && metaTitle === pTitle) ||
            (meta.slug && meta.slug === p.slug)
          )
        })

        // Deduplicate orders / transactions
        const uniqueTxKeys = new Set<string>()
        let paidUnits = 0
        let freeUnits = 0
        let revenueGenerated = 0

        // Process store_purchases
        pPurchases.forEach((pu) => {
          const key = pu.order_id || `purchase_${pu.id}`
          if (!uniqueTxKeys.has(key)) {
            uniqueTxKeys.add(key)
            const amt = Number(pu.amount_paid || 0)
            revenueGenerated += amt
            if (amt > 0) paidUnits++
            else freeUnits++
          }
        })

        // Process store_orders
        pStoreOrders.forEach((so) => {
          const key = so.order_id || `order_${so.id}`
          if (!uniqueTxKeys.has(key)) {
            uniqueTxKeys.add(key)
            const amt = Number(so.order_amount || 0)
            revenueGenerated += amt
            if (amt > 0) paidUnits++
            else freeUnits++
          }
        })

        // Process bmf_orders
        pBmfOrders.forEach((bo) => {
          const key = bo.order_id || `bmf_${bo.id}`
          if (!uniqueTxKeys.has(key)) {
            uniqueTxKeys.add(key)
            const amt = Number(bo.amount || 0)
            revenueGenerated += amt
            if (amt > 0) paidUnits++
            else freeUnits++
          }
        })

        const calculatedUnits = uniqueTxKeys.size
        const finalUnits = Math.max(calculatedUnits, Number(p.sales_count || 0))

        // Synchronize store_products.sales_count in database if drifting
        if (p.sales_count !== finalUnits) {
          try {
            await publicAdmin
              .from('store_products')
              .update({ sales_count: finalUnits })
              .eq('id', p.id)
          } catch (_) {}
        }

        return {
          ...p,
          sales_count: finalUnits,
          purchase_units: finalUnits,
          paid_units: paidUnits,
          free_units: freeUnits,
          revenue_generated: revenueGenerated,
        }
      })
    )

    return NextResponse.json({ success: true, count: products.length, products })
  } catch (err: any) {
    console.error('[Admin Store Products GET] Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

/**
 * POST: Create, Update, or Delete Store Products
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, product, productId } = body

    if (!action) {
      return NextResponse.json({ success: false, error: 'Missing action parameter' }, { status: 400 })
    }

    const publicAdmin = getSupabasePublicAdminClient()

    // 1. CREATE PRODUCT
    if (action === 'create') {
      if (!product || !product.title) {
        return NextResponse.json({ success: false, error: 'Product title is required' }, { status: 400 })
      }

      const rawSlug = product.slug || product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const finalSlug = rawSlug + (product.slug ? '' : `-${Math.random().toString(36).substring(2, 6)}`)
      const regPrice = Number(product.regular_price ?? product.regularPrice ?? 999)
      const salePrice = product.sale_price ? Number(product.sale_price) : null
      const discountPercent = Number(product.bmf_discount_percent ?? product.premium_discount_percent ?? 50)

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
        product_type: product.product_type || 'playbook',
        format_badge: product.format_badge || 'PDF Guide',
        regular_price: isNaN(regPrice) ? 999 : regPrice,
        sale_price: salePrice && !isNaN(salePrice) ? salePrice : null,
        bmf_discount_percent: isNaN(discountPercent) ? 50 : discountPercent,
        is_free_public: Boolean(product.is_free_public || regPrice === 0),
        is_free_for_bmf: Boolean(product.is_free_for_bmf),
        is_exclusive: Boolean(product.is_exclusive),
        show_in_public_store: product.show_in_public_store !== false,
        show_in_bmf_club: product.show_in_bmf_club !== false,
        highlights: highlightsArray,
        asset_url: product.asset_url || null,
        preview_url: product.preview_url || null,
        thumbnail_url: product.thumbnail_url || null,
        author_name: product.author_name || 'Build With Melwin',
        is_published: product.is_published !== false,
        display_order: Number(product.display_order || 0),
        metadata: product.metadata || {},
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await publicAdmin
        .from('store_products')
        .insert(productPayload)
        .select()
        .single()

      if (error) {
        console.warn('[Admin Store Action] Failed to insert into store_products, trying bmf_products:', error.message)
        // Fallback to bmf_products
        const { data: bmfData, error: bmfErr } = await publicAdmin
          .from('bmf_products')
          .insert({
            ...productPayload,
            premium_discount_percent: productPayload.bmf_discount_percent,
          })
          .select()
          .single()

        if (bmfErr) throw new Error(bmfErr.message)
        return NextResponse.json({ success: true, product: bmfData })
      }

      return NextResponse.json({ success: true, product: data })
    }

    // 2. UPDATE PRODUCT
    if (action === 'update') {
      const id = productId || product?.id
      if (!id) {
        return NextResponse.json({ success: false, error: 'Product ID is required for update' }, { status: 400 })
      }

      const regPrice = Number(product.regular_price ?? product.regularPrice ?? 999)
      const salePrice = product.sale_price ? Number(product.sale_price) : null
      const discountPercent = Number(product.bmf_discount_percent ?? product.premium_discount_percent ?? 50)

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
      if (product.format_badge) updatePayload.format_badge = product.format_badge
      if (product.regular_price !== undefined) updatePayload.regular_price = isNaN(regPrice) ? 999 : regPrice
      if (product.sale_price !== undefined) updatePayload.sale_price = salePrice
      if (product.bmf_discount_percent !== undefined) updatePayload.bmf_discount_percent = isNaN(discountPercent) ? 50 : discountPercent
      if (product.is_free_public !== undefined) updatePayload.is_free_public = Boolean(product.is_free_public)
      if (product.is_free_for_bmf !== undefined) updatePayload.is_free_for_bmf = Boolean(product.is_free_for_bmf)
      if (product.is_exclusive !== undefined) updatePayload.is_exclusive = Boolean(product.is_exclusive)
      if (product.show_in_public_store !== undefined) updatePayload.show_in_public_store = Boolean(product.show_in_public_store)
      if (product.show_in_bmf_club !== undefined) updatePayload.show_in_bmf_club = Boolean(product.show_in_bmf_club)
      if (product.highlights !== undefined) updatePayload.highlights = highlightsArray
      if (product.asset_url !== undefined) updatePayload.asset_url = product.asset_url
      if (product.preview_url !== undefined) updatePayload.preview_url = product.preview_url
      if (product.thumbnail_url !== undefined) updatePayload.thumbnail_url = product.thumbnail_url
      if (product.author_name !== undefined) updatePayload.author_name = product.author_name
      if (product.is_published !== undefined) updatePayload.is_published = Boolean(product.is_published)
      if (product.display_order !== undefined) updatePayload.display_order = Number(product.display_order)

      const { data, error } = await publicAdmin
        .from('store_products')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        // Fallback update to bmf_products
        await publicAdmin.from('bmf_products').update(updatePayload).eq('id', id)
      }

      return NextResponse.json({ success: true, product: data || updatePayload })
    }

    // 3. DELETE PRODUCT
    if (action === 'delete') {
      const id = productId || product?.id
      if (!id) {
        return NextResponse.json({ success: false, error: 'Product ID is required for delete' }, { status: 400 })
      }

      await publicAdmin.from('store_products').delete().eq('id', id)
      await publicAdmin.from('bmf_products').delete().eq('id', id)

      return NextResponse.json({ success: true, deletedId: id })
    }

    return NextResponse.json({ success: false, error: `Invalid action: ${action}` }, { status: 400 })
  } catch (err: any) {
    console.error('[Admin Store Action POST] Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
