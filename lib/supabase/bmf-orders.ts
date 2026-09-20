import { getSupabaseAdminClient, getSupabasePublicAdminClient } from './admin'

export interface BmfOrderRecord {
  id?: string
  order_id: string
  user_id?: string | null
  member_id?: string | null
  order_type?: 'membership' | 'product'
  product_id?: string | null
  plan_tier: 'free' | 'premium' | 'product' | string
  billing_cycle: 'annual' | 'monthly' | 'lifetime' | 'one_time' | string
  amount: number
  currency: string
  payment_gateway: string
  payment_session_id?: string
  status: 'created' | 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded'
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  metadata?: Record<string, any>
  created_at?: string
  updated_at?: string
}

export interface BmfPaymentRecord {
  id?: string
  order_id: string
  cf_payment_id: string
  payment_method?: string
  payment_amount: number
  payment_currency?: string
  payment_status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED' | 'USER_DROPPED'
  payment_time?: string
  bank_reference?: string
  failure_reason?: string
  raw_payload?: Record<string, any>
}

export interface BmfSubscriptionRecord {
  id?: string
  user_id: string
  member_id?: string | null
  plan_tier: 'free' | 'premium'
  status: 'active' | 'past_due' | 'cancelled' | 'expired'
  billing_cycle: string
  current_period_start?: string
  current_period_end?: string
  last_order_id?: string
}

/**
 * Creates an order record in bmf_orders
 */
export async function saveBmfOrder(orderData: BmfOrderRecord): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = getSupabaseAdminClient()
    const { error } = await admin
      .from('bmf_orders')
      .upsert(
        {
          order_id: orderData.order_id,
          user_id: orderData.user_id || null,
          member_id: orderData.member_id || null,
          order_type: orderData.order_type || 'membership',
          product_id: orderData.product_id || null,
          plan_tier: orderData.plan_tier || 'premium',
          billing_cycle: orderData.billing_cycle || 'annual',
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          payment_gateway: orderData.payment_gateway || 'cashfree',
          payment_session_id: orderData.payment_session_id || null,
          status: orderData.status || 'created',
          customer_name: orderData.customer_name || null,
          customer_email: orderData.customer_email || null,
          customer_phone: orderData.customer_phone || null,
          metadata: orderData.metadata || {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'order_id' }
      )

    if (error) {
      console.warn('[BMF Orders] Error writing to bmf_club schema, falling back to public view:', error.message)
      const publicAdmin = getSupabasePublicAdminClient()
      const { error: pubError } = await publicAdmin
        .from('bmf_orders')
        .upsert(
          {
            order_id: orderData.order_id,
            user_id: orderData.user_id || null,
            member_id: orderData.member_id || null,
            order_type: orderData.order_type || 'membership',
            product_id: orderData.product_id || null,
            plan_tier: orderData.plan_tier || 'premium',
            billing_cycle: orderData.billing_cycle || 'annual',
            amount: orderData.amount,
            currency: orderData.currency || 'INR',
            payment_gateway: orderData.payment_gateway || 'cashfree',
            payment_session_id: orderData.payment_session_id || null,
            status: orderData.status || 'created',
            customer_name: orderData.customer_name || null,
            customer_email: orderData.customer_email || null,
            customer_phone: orderData.customer_phone || null,
            metadata: orderData.metadata || {},
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'order_id' }
        )

      if (pubError) {
        console.error('[BMF Orders] Fallback failed:', pubError.message)
        return { success: false, error: pubError.message }
      }
    }

    return { success: true }
  } catch (err: any) {
    console.error('[BMF Orders] Unexpected error saving order:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Checks if a user already holds an active purchase for a specific product
 */
export async function checkExistingActivePurchase(params: {
  userId?: string | null
  customerEmail: string
  productId: string
}): Promise<{ alreadyPurchased: boolean; orderId?: string }> {
  try {
    const admin = getSupabaseAdminClient()
    const publicAdmin = getSupabasePublicAdminClient()

    let validProductId = params.productId
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(validProductId)
    if (!isUuid) {
      const { data: prod } = await admin
        .from('bmf_products')
        .select('id')
        .eq('slug', validProductId)
        .maybeSingle()
      if (prod?.id) validProductId = prod.id
    }

    let matchQuery = admin
      .from('bmf_product_purchases')
      .select('id, order_id, access_status')
      .eq('product_id', validProductId)
      .eq('access_status', 'active')

    if (params.userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.userId)) {
      matchQuery = matchQuery.or(`user_id.eq.${params.userId},customer_email.eq.${params.customerEmail}`)
    } else {
      matchQuery = matchQuery.eq('customer_email', params.customerEmail)
    }

    const { data: existing, error: matchErr } = await matchQuery.maybeSingle()
    if (!matchErr && existing) {
      return { alreadyPurchased: true, orderId: existing.order_id || undefined }
    }

    // Check public schema fallback
    let pubQuery = publicAdmin
      .from('bmf_product_purchases')
      .select('id, order_id, access_status')
      .eq('product_id', validProductId)
      .eq('access_status', 'active')

    if (params.userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.userId)) {
      pubQuery = pubQuery.or(`user_id.eq.${params.userId},customer_email.eq.${params.customerEmail}`)
    } else {
      pubQuery = pubQuery.eq('customer_email', params.customerEmail)
    }

    const { data: pubExisting } = await pubQuery.maybeSingle()
    if (pubExisting) {
      return { alreadyPurchased: true, orderId: pubExisting.order_id || undefined }
    }

    return { alreadyPurchased: false }
  } catch (err) {
    console.warn('[BMF Orders] Error checking existing purchase:', err)
    return { alreadyPurchased: false }
  }
}

/**
 * Searches for an uncompleted order created within the last N minutes (default 15m)
 * to reuse the order_id and payment_session_id, preventing duplicate charges.
 */
export async function findRecentPendingOrder(params: {
  userId?: string | null
  customerEmail: string
  orderType: 'membership' | 'product'
  productId?: string | null
  amount: number
  withinMinutes?: number
}): Promise<{
  order_id: string
  payment_session_id: string
  amount: number
  currency: string
} | null> {
  try {
    const admin = getSupabaseAdminClient()
    const publicAdmin = getSupabasePublicAdminClient()
    const minutes = params.withinMinutes || 15
    const cutoffIso = new Date(Date.now() - minutes * 60 * 1000).toISOString()

    const searchInClient = async (client: any) => {
      let q = client
        .from('bmf_orders')
        .select('order_id, payment_session_id, amount, currency, status, created_at')
        .eq('order_type', params.orderType)
        .in('status', ['created', 'pending'])
        .not('payment_session_id', 'is', null)
        .gte('created_at', cutoffIso)
        .order('created_at', { ascending: false })
        .limit(1)

      if (params.orderType === 'product' && params.productId) {
        q = q.eq('product_id', params.productId)
      }

      if (params.userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.userId)) {
        q = q.or(`user_id.eq.${params.userId},customer_email.eq.${params.customerEmail}`)
      } else {
        q = q.eq('customer_email', params.customerEmail)
      }

      const { data, error } = await q
      if (!error && Array.isArray(data) && data.length > 0) {
        return data[0]
      }
      return null
    }

    let candidate = await searchInClient(admin)
    if (!candidate) {
      candidate = await searchInClient(publicAdmin)
    }

    if (candidate && candidate.payment_session_id) {
      // Validate amount matching so price discrepancies don't reuse mismatched sessions
      if (Math.abs(Number(candidate.amount) - params.amount) < 0.01) {
        return {
          order_id: candidate.order_id,
          payment_session_id: candidate.payment_session_id,
          amount: Number(candidate.amount),
          currency: candidate.currency || 'INR',
        }
      }
    }

    return null
  } catch (err) {
    console.warn('[BMF Orders] Error finding recent pending order:', err)
    return null
  }
}

/**
 * Marks order as paid, records payment log, upserts subscription, and upgrades member profile
 */
export async function fulfillPaidPremiumOrder(params: {
  orderId: string
  cfPaymentId?: string
  paymentMethod?: string
  amount?: number
  bankReference?: string
  rawPayload?: any
}): Promise<{ success: boolean; error?: string; upgradedUser?: string; purchasedProduct?: string }> {
  try {
    const admin = getSupabaseAdminClient()
    const publicAdmin = getSupabasePublicAdminClient()

    // 1. Fetch the order
    let order: any = null
    const { data: orderData, error: orderErr } = await admin
      .from('bmf_orders')
      .select('*')
      .eq('order_id', params.orderId)
      .maybeSingle()

    if (!orderErr && orderData) {
      order = orderData
    } else {
      const { data: pubOrderData } = await publicAdmin
        .from('bmf_orders')
        .select('*')
        .eq('order_id', params.orderId)
        .maybeSingle()
      order = pubOrderData
    }

    if (!order) {
      console.error('[Fulfillment] Order not found for orderId:', params.orderId)
      return { success: false, error: `Order ${params.orderId} not found` }
    }

    // 2. Update order status to 'paid'
    const nowIso = new Date().toISOString()
    await admin
      .from('bmf_orders')
      .update({ status: 'paid', updated_at: nowIso })
      .eq('order_id', params.orderId)

    // 3. Record payment in bmf_payments if payment id provided
    if (params.cfPaymentId) {
      const paymentRecord = {
        order_id: params.orderId,
        cf_payment_id: params.cfPaymentId,
        payment_method: params.paymentMethod || 'cashfree',
        payment_amount: params.amount || order.amount || 799,
        payment_currency: order.currency || 'INR',
        payment_status: 'SUCCESS',
        payment_time: nowIso,
        bank_reference: params.bankReference || null,
        raw_payload: params.rawPayload || {},
      }

      await admin.from('bmf_payments').upsert(paymentRecord, { onConflict: 'cf_payment_id' })
    }

    const userId = order.user_id
    const customerEmail = order.customer_email

    // 4. Branch for Digital Product Purchase vs Membership Subscription
    if (order.order_type === 'product' && order.product_id) {
      try {
        let validProductId = order.product_id
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(validProductId)
        if (!isUuid) {
          const { data: prod } = await admin
            .from('bmf_products')
            .select('id')
            .eq('slug', validProductId)
            .maybeSingle()
          if (prod?.id) {
            validProductId = prod.id
          }
        }

        const purchaseRecord = {
          user_id: userId || null,
          customer_email: customerEmail || 'guest@customer.com',
          product_id: validProductId,
          order_id: params.orderId,
          amount_paid: params.amount || order.amount,
          discount_applied_percent: order.metadata?.discount_applied_percent || 0,
          access_status: 'active',
        }

        // Check if an existing purchase row exists to update or insert
        let matchQuery = admin
          .from('bmf_product_purchases')
          .select('id, order_id')
          .eq('product_id', validProductId)

        if (userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
          matchQuery = matchQuery.or(`user_id.eq.${userId},customer_email.eq.${customerEmail || ''}`)
        } else {
          matchQuery = matchQuery.eq('customer_email', customerEmail || '')
        }

        const { data: existingRec } = await matchQuery.maybeSingle()

        if (existingRec) {
          await admin
            .from('bmf_product_purchases')
            .update({
              order_id: params.orderId,
              amount_paid: params.amount || order.amount,
              discount_applied_percent: order.metadata?.discount_applied_percent || 0,
              access_status: 'active',
            })
            .eq('id', existingRec.id)
        } else {
          const { error: insErr } = await admin
            .from('bmf_product_purchases')
            .insert(purchaseRecord)

          if (insErr) {
            console.warn('[Fulfillment] Schema insert error, trying publicAdmin:', insErr.message)
            await publicAdmin
              .from('bmf_product_purchases')
              .insert(purchaseRecord)
          }
        }
      } catch (prodErr) {
        console.warn('[Fulfillment] Error recording product purchase (non-fatal):', prodErr)
      }

      console.log(`[Fulfillment] Successfully fulfilled digital product ${order.product_id} for order ${params.orderId}`)
      return { success: true, purchasedProduct: order.product_id }
    }

    // 5. Calculate subscription expiry (1 year from now for annual)
    const validUntilDate = new Date()
    validUntilDate.setFullYear(validUntilDate.getFullYear() + 1)
    const validUntilIso = validUntilDate.toISOString()

    // 6. Upsert subscription in bmf_subscriptions
    if (userId) {
      const subRecord = {
        user_id: userId,
        member_id: order.member_id || null,
        plan_tier: 'premium',
        status: 'active',
        billing_cycle: order.billing_cycle || 'annual',
        current_period_start: nowIso,
        current_period_end: validUntilIso,
        last_order_id: params.orderId,
        updated_at: nowIso,
      }

      await admin.from('bmf_subscriptions').upsert(subRecord, { onConflict: 'user_id' })
    }

    // 6. Upgrade Member Profile in bmf_members
    // Matches by user_id, or by customer_email if user_id was not populated
    let memberUpdated = false

    if (userId) {
      const { data: memberUpdateData, error: memErr } = await admin
        .from('bmf_members')
        .update({
          membership_tier: 'premium',
          membership_valid_until: validUntilIso,
          is_featured: true, // UNLOCKS FEATURED FOUNDER DIRECTORY PLACEMENT
          badge_title: 'Premium Member',
          updated_at: nowIso,
        })
        .eq('user_id', userId)
        .select()

      if (!memErr && memberUpdateData && memberUpdateData.length > 0) {
        memberUpdated = true
      }
    }

    if (!memberUpdated && customerEmail) {
      await admin
        .from('bmf_members')
        .update({
          membership_tier: 'premium',
          membership_valid_until: validUntilIso,
          is_featured: true,
          badge_title: 'Premium Member',
          updated_at: nowIso,
        })
        .ilike('email', customerEmail)
    }

    // 7. Auto-activate Obsidian Executive Pass in bmf_cards
    if (userId) {
      try {
        const { data: existingCard } = await admin
          .from('bmf_cards')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle()

        const defaultPerks = [
          'Featured Founder Directory Placement',
          'Member-Only VIP WhatsApp Group',
          'Direct Access to Melwin',
          'Invite-Only Mastermind RSVPs',
          '50% Off BMF Founder Vault'
        ]

        if (existingCard) {
          await admin
            .from('bmf_cards')
            .update({
              card_tier: 'obsidian',
              approval_status: 'approved',
              is_active: true,
              tier_perks: defaultPerks,
              updated_at: nowIso,
            })
            .eq('user_id', userId)
        } else {
          const randomSuffix = Math.floor(1000 + Math.random() * 9000)
          await admin
            .from('bmf_cards')
            .insert({
              user_id: userId,
              card_number: `BMF-OBS-${randomSuffix}`,
              card_tier: 'obsidian',
              card_holder_name: order.customer_name || 'BMF Founder',
              company_name: 'BMF Club',
              valid_thru: '12/28',
              member_since: '2026',
              nfc_uid: `NFC-${Date.now()}`,
              is_active: true,
              approval_status: 'approved',
              tier_perks: defaultPerks,
              updated_at: nowIso,
            })
        }
      } catch (cardErr) {
        console.warn('[Fulfillment] Error auto-activating bmf_cards (non-fatal):', cardErr)
      }
    }

    // 8. Dispatch Alert to Discord & Telegram
    try {
      await dispatchAdminNotification({
        orderId: params.orderId,
        amount: params.amount || order.amount || 799,
        customerName: order.customer_name || 'BMF Member',
        customerEmail: order.customer_email || 'N/A',
        customerPhone: order.customer_phone || 'N/A',
      })
    } catch (notifErr) {
      console.error('[Fulfillment] Notification dispatch error (non-fatal):', notifErr)
    }

    console.log(`[Fulfillment] Successfully upgraded order ${params.orderId} to Premium!`)
    return { success: true, upgradedUser: userId || customerEmail }
  } catch (err: any) {
    console.error('[Fulfillment] Critical error fulfilling order:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Sends Discord and Telegram notification when a member purchases Premium
 */
async function dispatchAdminNotification(info: {
  orderId: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
}) {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChatId = process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_FOUNDER_INTRO_CHAT_ID
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL_founder_intro || process.env.DISCORD_WEBHOOK_URL

  const message = `🎉 *NEW BMF PREMIUM MEMBER ACTIVATED!* 🎉\n\n` +
    `👤 *Name:* ${info.customerName}\n` +
    `📧 *Email:* ${info.customerEmail}\n` +
    `📱 *Phone:* ${info.customerPhone}\n` +
    `💰 *Plan:* BMF Premium (Annual)\n` +
    `💳 *Amount:* ₹${info.amount}\n` +
    `🧾 *Order ID:* \`${info.orderId}\`\n\n` +
    `⭐ *Perks Activated:*\n` +
    `• Featured Founder Directory Placement\n` +
    `• Premium WhatsApp Access\n` +
    `• VIP Events & Direct Access to Melwin`

  // Send Telegram
  if (telegramBotToken && telegramChatId) {
    try {
      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      })
    } catch (e) {
      console.warn('Failed to send Telegram notification:', e)
    }
  }

  // Send Discord
  if (discordWebhookUrl) {
    try {
      await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [
            {
              title: '🌟 New BMF Club Premium Member!',
              description: `A founder just upgraded to **BMF Premium** for **₹${info.amount}/yr**!`,
              color: 0xd4af37, // Gold
              fields: [
                { name: 'Member', value: info.customerName, inline: true },
                { name: 'Email', value: info.customerEmail, inline: true },
                { name: 'Phone', value: info.customerPhone, inline: true },
                { name: 'Order ID', value: info.orderId, inline: false },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      })
    } catch (e) {
      console.warn('Failed to send Discord webhook:', e)
    }
  }
}
