import { getSupabasePublicAdminClient } from './admin'
import { getSupabaseBrowserClient } from './bmf-members'
import { sendStorePurchaseAlert } from '@/lib/notifications/admin-alerts'
import { sendStoreAssetDeliveryEmail } from '@/lib/email/resend'

export interface StoreProductItem {
  id: string
  slug: string
  title: string
  subtitle?: string | null
  description: string
  category: string
  product_type: 'pdf' | 'sheets' | 'notion' | 'video' | 'template' | 'bundle' | 'playbook' | string
  format_badge: string
  regular_price: number
  sale_price?: number | null
  bmf_discount_percent: number
  is_free_public: boolean
  is_free_for_bmf: boolean
  is_exclusive: boolean
  show_in_public_store: boolean
  show_in_bmf_club: boolean
  highlights: string[]
  asset_url?: string | null
  preview_url?: string | null
  thumbnail_url?: string | null
  author_name?: string
  sales_count?: number
  rating?: number
  reviews_count?: number
  is_published: boolean
  display_order: number
}

export interface StorePurchaseItem {
  id: string
  product_id: string
  order_id?: string | null
  customer_email: string
  user_id?: string | null
  amount_paid: number
  access_status: 'active' | 'revoked'
  download_count: number
  last_downloaded_at?: string | null
  created_at: string
  product?: StoreProductItem
}

/**
 * Fetch all published products meant for the public store.
 * Supports fallback to bmf_products if store_products is still initializing.
 */
export async function fetchPublicStoreProducts(): Promise<StoreProductItem[]> {
  try {
    const publicAdmin = getSupabasePublicAdminClient()

    // 1. Primary Query on public.store_products
    const { data, error } = await publicAdmin
      .from('store_products')
      .select('*')
      .eq('is_published', true)
      .eq('show_in_public_store', true)
      .order('display_order', { ascending: true })

    if (!error && Array.isArray(data) && data.length > 0) {
      // Strictly keep only verified public products; filter out timestamped duplicates and club-only passes
      const confirmed = data.filter((item) => {
        if (/-\d{8,}$/.test(item.slug)) return false
        if (item.slug === 'bmf-community-pass-free') return false
        return true
      })
      return confirmed.map(mapDbRecordToStoreProduct)
    }

    // 2. Fallback Query on bmf_products view
    const { data: bmfData, error: bmfError } = await publicAdmin
      .from('bmf_products')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })

    if (!bmfError && Array.isArray(bmfData) && bmfData.length > 0) {
      const confirmed = bmfData.filter((item) => {
        if (/-\d{8,}$/.test(item.slug)) return false
        if (item.slug === 'bmf-community-pass-free') return false
        return true
      })
      return confirmed.map(mapDbRecordToStoreProduct)
    }

    return []
  } catch (err) {
    console.error('[Store DB] Error fetching public store products:', err)
    return []
  }
}

/**
 * Fetch a single product by slug
 */
export async function fetchStoreProductBySlug(slug: string): Promise<StoreProductItem | null> {
  try {
    const publicAdmin = getSupabasePublicAdminClient()

    const { data, error } = await publicAdmin
      .from('store_products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (!error && data) {
      return mapDbRecordToStoreProduct(data)
    }

    const { data: bmfData } = await publicAdmin
      .from('bmf_products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (bmfData) {
      return mapDbRecordToStoreProduct(bmfData)
    }

    return null
  } catch (err) {
    console.error('[Store DB] Error fetching product by slug:', err)
    return null
  }
}

/**
 * Fetch all products purchased by a specific customer email or user ID
 */
export async function fetchCustomerPurchases(params: {
  userId?: string | null
  customerEmail?: string | null
}): Promise<StorePurchaseItem[]> {
  const { userId, customerEmail } = params
  if (!userId && !customerEmail) return []

  try {
    const publicAdmin = getSupabasePublicAdminClient()

    let query = publicAdmin
      .from('store_purchases')
      .select(`
        id,
        product_id,
        order_id,
        customer_email,
        user_id,
        amount_paid,
        access_status,
        download_count,
        last_downloaded_at,
        created_at
      `)
      .eq('access_status', 'active')

    if (userId && customerEmail) {
      query = query.or(`user_id.eq.${userId},customer_email.eq.${customerEmail.toLowerCase().trim()}`)
    } else if (userId) {
      query = query.eq('user_id', userId)
    } else if (customerEmail) {
      query = query.eq('customer_email', customerEmail.toLowerCase().trim())
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    let rawPurchases = data || []

    // Fallback to bmf_product_purchases if empty
    if (rawPurchases.length === 0) {
      let bmfQuery = publicAdmin
        .from('bmf_product_purchases')
        .select('*')
        .eq('access_status', 'active')

      if (userId && customerEmail) {
        bmfQuery = bmfQuery.or(`user_id.eq.${userId},customer_email.eq.${customerEmail.toLowerCase().trim()}`)
      } else if (userId) {
        bmfQuery = bmfQuery.eq('user_id', userId)
      } else if (customerEmail) {
        bmfQuery = bmfQuery.eq('customer_email', customerEmail.toLowerCase().trim())
      }

      const { data: bmfPurchases } = await bmfQuery.order('created_at', { ascending: false })
      if (bmfPurchases && bmfPurchases.length > 0) {
        rawPurchases = bmfPurchases
      }
    }

    if (rawPurchases.length === 0) return []

    // Fetch product details for the purchased products
    const productIds = Array.from(new Set(rawPurchases.map((p) => p.product_id).filter(Boolean)))
    const { data: prods } = await publicAdmin
      .from('store_products')
      .select('*')
      .in('id', productIds)

    const prodMap = new Map<string, StoreProductItem>()
    if (prods) {
      prods.forEach((p) => prodMap.set(p.id, mapDbRecordToStoreProduct(p)))
    }

    // Secondary product lookup for any missing items from bmf_products view
    const missingIds = productIds.filter((id) => !prodMap.has(id))
    if (missingIds.length > 0) {
      const { data: bmfProds } = await publicAdmin
        .from('bmf_products')
        .select('*')
        .in('id', missingIds)
      if (bmfProds) {
        bmfProds.forEach((p) => prodMap.set(p.id, mapDbRecordToStoreProduct(p)))
      }
    }

    return rawPurchases.map((p: any) => ({
      id: p.id,
      product_id: p.product_id,
      order_id: p.order_id,
      customer_email: p.customer_email,
      user_id: p.user_id,
      amount_paid: Number(p.amount_paid || 0),
      access_status: p.access_status || 'active',
      download_count: Number(p.download_count || 0),
      last_downloaded_at: p.last_downloaded_at || null,
      created_at: p.created_at || new Date().toISOString(),
      product: prodMap.get(p.product_id),
    }))
  } catch (err) {
    console.error('[Store DB] Error fetching customer purchases:', err)
    return []
  }
}

/**
 * Fulfills a public store purchase upon verified Cashfree payment.
 * STRICT ISOLATION: Never touches bmf_members, never issues bmf_cards.
 */
export async function fulfillPublicStoreOrder(params: {
  orderId: string
  cfPaymentId?: string
  paymentMethod?: string
  amount?: number
  bankReference?: string
  rawPayload?: any
}): Promise<{ success: boolean; error?: string }> {
  try {
    const publicAdmin = getSupabasePublicAdminClient()
    const nowIso = new Date().toISOString()

    // 1. Fetch store order from store_orders (or fallback to bmf_orders)
    let order: any = null
    const { data: storeOrder } = await publicAdmin
      .from('store_orders')
      .select('*')
      .eq('order_id', params.orderId)
      .maybeSingle()

    if (storeOrder) {
      order = storeOrder
    } else {
      const { data: bmfOrder } = await publicAdmin
        .from('bmf_orders')
        .select('*')
        .eq('order_id', params.orderId)
        .maybeSingle()
      order = bmfOrder
    }

    if (!order) {
      console.warn('[Store Fulfillment] Order record not found locally, checking payload tags:', params.orderId)
      const cfOrder = params.rawPayload?.data?.order || params.rawPayload?.order || {}
      const cfCustomer = params.rawPayload?.data?.customer_details || params.rawPayload?.customer_details || {}
      const tags = cfOrder.order_tags || {}

      order = {
        order_id: params.orderId,
        customer_name: cfCustomer.customer_name || 'Store Customer',
        customer_email: cfCustomer.customer_email || 'customer@gmail.com',
        customer_phone: cfCustomer.customer_phone || null,
        order_amount: params.amount || cfOrder.order_amount || 0,
        items: tags.product_id ? [{ product_id: tags.product_id }] : [],
        channel: 'public_store',
      }
    }

    // 2. Mark order as paid
    try {
      await publicAdmin
        .from('store_orders')
        .update({
          status: 'paid',
          cf_payment_id: params.cfPaymentId || null,
          updated_at: nowIso,
        })
        .eq('order_id', params.orderId)
    } catch (_) {}

    // 3. Grant access in store_purchases & bmf_product_purchases
    const customerEmail = (order.customer_email || 'customer@gmail.com').toLowerCase().trim()
    const userId = order.user_id || null

    const productIds: string[] = []
    if (Array.isArray(order.items) && order.items.length > 0) {
      order.items.forEach((item: any) => {
        if (item.product_id) productIds.push(item.product_id)
        if (item.id) productIds.push(item.id)
      })
    }
    if (order.product_id) {
      productIds.push(order.product_id)
    }

    const uniqueProductIds = Array.from(new Set(productIds.filter(Boolean)))

    for (const prodId of uniqueProductIds) {
      // Resolve UUID if slug was used
      let resolvedId = prodId
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(prodId)) {
        const { data: foundProd } = await publicAdmin
          .from('store_products')
          .select('id')
          .eq('slug', prodId)
          .maybeSingle()
        if (foundProd?.id) resolvedId = foundProd.id
      }

      const purchaseRecord = {
        user_id: userId,
        customer_email: customerEmail,
        product_id: resolvedId,
        order_id: params.orderId,
        amount_paid: params.amount || order.order_amount || 0,
        access_status: 'active',
        channel: 'public_store',
      }

      // Check existing purchase in store_purchases
      const { data: existing } = await publicAdmin
        .from('store_purchases')
        .select('id')
        .eq('product_id', resolvedId)
        .eq('customer_email', customerEmail)
        .maybeSingle()

      if (existing) {
        await publicAdmin
          .from('store_purchases')
          .update({
            order_id: params.orderId,
            amount_paid: params.amount || order.order_amount || 0,
            access_status: 'active',
          })
          .eq('id', existing.id)
      } else {
        await publicAdmin.from('store_purchases').insert(purchaseRecord)
      }

      // Dual write to bmf_product_purchases for total backward compatibility
      try {
        await publicAdmin.from('bmf_product_purchases').insert({
          user_id: userId,
          customer_email: customerEmail,
          product_id: resolvedId,
          order_id: params.orderId,
          amount_paid: params.amount || order.order_amount || 0,
          access_status: 'active',
        })
      } catch (_) {}

      // Increment product sales count & fetch details for fulfillment delivery
      let productDetails: any = null
      try {
        const { data: currProd } = await publicAdmin
          .from('store_products')
          .select('title, format_badge, asset_url, sales_count')
          .eq('id', resolvedId)
          .maybeSingle()
        if (currProd) {
          productDetails = currProd
          await publicAdmin
            .from('store_products')
            .update({ sales_count: (currProd.sales_count || 0) + 1 })
            .eq('id', resolvedId)
        }
      } catch (_) {}

      // 4. Send Instant Digital Delivery Email to Customer via Resend
      const prodTitle = productDetails?.title || 'Store Digital Asset'
      const prodUrl = productDetails?.asset_url || null
      const formatBadge = productDetails?.format_badge || 'Digital Asset'

      try {
        await sendStoreAssetDeliveryEmail({
          to: customerEmail,
          productTitle: prodTitle,
          formatBadge,
          amountPaid: params.amount || order.order_amount || 0,
          downloadUrl: prodUrl,
          orderId: params.orderId,
        })
      } catch (emailErr) {
        console.error('[Store Fulfillment] Email dispatch error:', emailErr)
      }

      // 5. Send Real-Time Notifications to Telegram & Discord
      try {
        await sendStorePurchaseAlert({
          orderId: params.orderId,
          productId: resolvedId,
          productTitle: prodTitle,
          amount: params.amount || order.order_amount || 0,
          customerName: order.customer_name || 'Store Customer',
          customerEmail,
          customerPhone: order.customer_phone || null,
          downloadUrl: prodUrl,
          paymentMethod: params.paymentMethod,
          cfPaymentId: params.cfPaymentId,
        })
      } catch (alertErr) {
        console.error('[Store Fulfillment] Admin alert error:', alertErr)
      }
    }

    console.log(`[Store Fulfillment] Successfully fulfilled store order ${params.orderId} for ${customerEmail}`)
    return { success: true }
  } catch (err: any) {
    console.error('[Store Fulfillment] Error fulfilling store order:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Normalizes raw Supabase row into standard StoreProductItem
 */
function mapDbRecordToStoreProduct(p: any): StoreProductItem {
  const reg = Number(p.regular_price ?? p.price_inr ?? p.price ?? 999)
  const regularPrice = isNaN(reg) ? 999 : reg
  const sale = p.sale_price ? Number(p.sale_price) : null
  const salePrice = sale && !isNaN(sale) && sale > 0 ? sale : null

  const discountPercent = Number(p.bmf_discount_percent ?? p.premium_discount_percent ?? 50)

  const rawFormat = p.format_badge || p.format || 'PDF Guide'
  const cleanFormat = rawFormat.replace(/\s*\(\s*\d+[\d.]*\s*(?:KB|MB|GB|bytes|B)\s*\)/gi, '').trim()

  return {
    id: p.id,
    slug: p.slug || p.id,
    title: p.title || 'Untitled Asset',
    subtitle: p.subtitle || null,
    description: p.description || '',
    category: p.category || 'Growth',
    product_type: (p.product_type as any) || 'playbook',
    format_badge: cleanFormat || 'PDF Guide',
    regular_price: regularPrice,
    sale_price: salePrice,
    bmf_discount_percent: isNaN(discountPercent) ? 50 : discountPercent,
    is_free_public: Boolean(p.is_free_public || regularPrice === 0),
    is_free_for_bmf: Boolean(p.is_free_for_bmf || p.is_free_for_premium),
    is_exclusive: Boolean(p.is_exclusive),
    show_in_public_store: p.show_in_public_store !== false,
    show_in_bmf_club: p.show_in_bmf_club !== false,
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    asset_url: p.asset_url || p.download_url || null,
    preview_url: p.preview_url || null,
    thumbnail_url: p.thumbnail_url || null,
    author_name: p.author_name || 'Build With Melwin',
    sales_count: Number(p.sales_count || 0),
    rating: Number(p.rating || 4.9),
    reviews_count: Number(p.reviews_count || 12),
    is_published: p.is_published !== false,
    display_order: Number(p.display_order || 0),
  }
}
