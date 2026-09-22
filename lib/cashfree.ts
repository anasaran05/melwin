import crypto from 'crypto'

export interface CashfreeCustomerDetails {
  customer_id: string
  customer_email: string
  customer_phone: string
  customer_name: string
}

export interface CreateOrderParams {
  orderId: string
  orderAmount: number
  orderCurrency?: string
  customerDetails: CashfreeCustomerDetails
  returnUrl?: string
  notifyUrl?: string
  orderNote?: string
  metadata?: Record<string, string>
}

export interface CashfreeOrderResponse {
  cf_order_id?: string
  order_id: string
  entity?: string
  order_currency?: string
  order_amount: number
  order_status: 'ACTIVE' | 'PAID' | 'EXPIRED' | 'TERMINATED' | string
  payment_session_id: string
  order_expiry_time?: string
  order_note?: string
  customer_details?: CashfreeCustomerDetails
  payments?: {
    url: string
  }
}

export interface CashfreePaymentRecord {
  cf_payment_id: string
  payment_status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'USER_DROPPED' | string
  payment_amount: number
  payment_currency: string
  payment_time: string
  payment_message?: string
  payment_method?: Record<string, any>
  bank_reference?: string
}

/**
 * Returns Cashfree API configuration
 */
export function getCashfreeConfig() {
  const env = process.env.CASHFREE_ENVIRONMENT || process.env.NEXT_PUBLIC_CASHFREE_ENV || 'production'
  const isProd = env.toLowerCase() === 'production'
  
  const baseUrl = isProd 
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg'
    
  const appId = process.env.CASHFREE_APP_ID || '1413936ae6b0ffac7446a3df2746393141'
  const secretKey = process.env.CASHFREE_SECRET_KEY || ''
  const apiVersion = process.env.CASHFREE_API_VERSION || '2023-08-01'

  return {
    isProd,
    baseUrl,
    appId,
    secretKey,
    apiVersion,
  }
}

/**
 * Creates a payment order with Cashfree
 */
export async function createCashfreeOrder(params: CreateOrderParams): Promise<CashfreeOrderResponse> {
  const config = getCashfreeConfig()

  if (!config.secretKey) {
    throw new Error('Cashfree secret key is missing in environment variables.')
  }

  // Format phone to 10 digits for Indian numbers
  let formattedPhone = params.customerDetails.customer_phone.replace(/\D/g, '')
  if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
    formattedPhone = formattedPhone.slice(2)
  }
  if (!formattedPhone || formattedPhone.length < 10) {
    formattedPhone = '9999999999' // fallback default phone if unprovided
  }

  const payload = {
    order_id: params.orderId,
    order_amount: params.orderAmount,
    order_currency: params.orderCurrency || 'INR',
    customer_details: {
      customer_id: params.customerDetails.customer_id,
      customer_name: params.customerDetails.customer_name || 'BMF Club Member',
      customer_email: params.customerDetails.customer_email,
      customer_phone: formattedPhone,
    },
    order_meta: {
      return_url: params.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://melwin.in'}/bmf-club/pricing?order_id={order_id}&status=success`,
      notify_url: params.notifyUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://melwin.in'}/api/webhooks/cashfree`,
    },
    order_note: params.orderNote || 'BMF Club Premium Membership',
    order_tags: params.metadata || {
      plan: 'premium',
      billing_cycle: 'annual',
    },
  }

  const response = await fetch(`${config.baseUrl}/orders`, {
    method: 'POST',
    headers: {
      'x-client-id': config.appId,
      'x-client-secret': config.secretKey,
      'x-api-version': config.apiVersion,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('[Cashfree] Order Creation API Error:', data)
    throw new Error(data.message || `Cashfree Order creation failed with status ${response.status}`)
  }

  return data as CashfreeOrderResponse
}

/**
 * Fetches order details directly from Cashfree PG
 */
export async function getCashfreeOrder(orderId: string): Promise<CashfreeOrderResponse> {
  const config = getCashfreeConfig()

  const response = await fetch(`${config.baseUrl}/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
    headers: {
      'x-client-id': config.appId,
      'x-client-secret': config.secretKey,
      'x-api-version': config.apiVersion,
      Accept: 'application/json',
    },
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || `Failed to fetch Cashfree order: ${orderId}`)
  }

  return data as CashfreeOrderResponse
}

/**
 * Fetches payments made for an order
 */
export async function getCashfreeOrderPayments(orderId: string): Promise<CashfreePaymentRecord[]> {
  const config = getCashfreeConfig()

  const response = await fetch(`${config.baseUrl}/orders/${encodeURIComponent(orderId)}/payments`, {
    method: 'GET',
    headers: {
      'x-client-id': config.appId,
      'x-client-secret': config.secretKey,
      'x-api-version': config.apiVersion,
      Accept: 'application/json',
    },
  })

  const data = await response.json()
  if (!response.ok) {
    console.error('[Cashfree] Error fetching order payments:', data)
    return []
  }

  return Array.isArray(data) ? data : []
}

/**
 * Verifies Cashfree Webhook Signature (HMAC-SHA256)
 */
export function verifyCashfreeWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string
): boolean {
  try {
    if (!signature || !timestamp) return false

    const config = getCashfreeConfig()
    const webhookSecretEnv = process.env.CASHFREE_WEBHOOK_SECRET?.trim()
    const candidateSecrets: string[] = []

    if (webhookSecretEnv && !webhookSecretEnv.toLowerCase().includes('placeholder')) {
      candidateSecrets.push(webhookSecretEnv)
    }
    if (config.secretKey && !candidateSecrets.includes(config.secretKey)) {
      candidateSecrets.push(config.secretKey)
    }

    if (candidateSecrets.length === 0) {
      console.warn('[Cashfree] No valid secret key available for webhook signature verification')
      return false
    }

    // Cashfree signature algorithm: HMAC-SHA256(timestamp + rawBody, secret) -> base64
    for (const secret of candidateSecrets) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(timestamp + rawBody)
        .digest('base64')

      const sigBuffer = Buffer.from(signature)
      const genBuffer = Buffer.from(generatedSignature)

      if (sigBuffer.length === genBuffer.length && crypto.timingSafeEqual(sigBuffer, genBuffer)) {
        return true
      }
    }

    return false
  } catch (error) {
    console.error('[Cashfree] Webhook signature verification error:', error)
    return false
  }
}

export type DetectedPaymentCategory = 'webinar' | 'event' | 'product' | 'membership' | 'consultation' | 'custom'

export interface DetectedPaymentInfo {
  category: DetectedPaymentCategory
  orderId: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone?: string
  cfPaymentId: string
  paymentStatus: string
  paymentMethod: string
  bankReference?: string
  productId?: string
  eventId?: string
  formCode?: string
  formTitle?: string
  notes?: string
}

/**
 * Robust classifier for Cashfree Webhook Payloads
 * Supports PG API orders, Payment Forms, and custom checkout flows.
 */
export function detectCashfreePaymentType(payload: any): DetectedPaymentInfo {
  const data = payload?.data || {}
  const order = data.order || payload.order || {}
  const payment = data.payment || payload.payment || {}
  const customerDetails = data.customer_details || payload.customer_details || order.customer_details || {}
  const tags = order.order_tags || data.order_tags || payload.order_tags || {}

  const orderId = String(order.order_id || payload.order_id || `cf_order_${Date.now()}`)
  const amount = Number(payment.payment_amount || order.order_amount || 0)
  const cfPaymentId = String(payment.cf_payment_id || payment.payment_id || `cf_pay_${Date.now()}`)
  const paymentStatus = String(payment.payment_status || (String(payload.type || '').includes('SUCCESS') ? 'SUCCESS' : 'PENDING')).toUpperCase()
  const paymentMethod = typeof payment.payment_method === 'object' 
    ? JSON.stringify(payment.payment_method) 
    : String(payment.payment_method || 'cashfree')
  const bankReference = payment.bank_reference || null

  const customerName = customerDetails.customer_name || customerDetails.name || 'BMF Customer'
  const customerEmail = (customerDetails.customer_email || customerDetails.email || '').toLowerCase().trim()
  const customerPhone = customerDetails.customer_phone || customerDetails.phone || undefined

  // Identify form code or form title if delivered from a Cashfree hosted form
  const rawString = JSON.stringify(payload).toLowerCase()
  const formCode = 
    tags.form_code || 
    tags.code || 
    data.form_code || 
    data.form_id || 
    payload.form_code ||
    (rawString.includes('from-idea-to-1-lakh-webinar') ? 'from-idea-to-1-lakh-webinar' : undefined)

  const formTitle = 
    tags.form_title || 
    tags.title || 
    data.form_title || 
    payload.form_title || 
    (formCode === 'from-idea-to-1-lakh-webinar' ? 'From Idea to First ₹1 Lakh: The Early-Stage Founder Playbook' : undefined)

  // 1. Check for Event / Webinar
  const isWebinarByCode = formCode === 'from-idea-to-1-lakh-webinar' || rawString.includes('from-idea-to-1-lakh-webinar')
  const isEventByTag = tags.order_type === 'event' || tags.order_type === 'webinar' || Boolean(tags.event_id)
  const isEventByString = rawString.includes('webinar') || rawString.includes('masterclass') || rawString.includes('workshop')

  if (isWebinarByCode || isEventByTag || isEventByString) {
    return {
      category: 'webinar',
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      cfPaymentId,
      paymentStatus,
      paymentMethod,
      bankReference,
      eventId: tags.event_id || (isWebinarByCode ? '9c2225b0-e13a-4450-b5df-1082e0da0d89' : undefined),
      formCode,
      formTitle: formTitle || 'BMF Founder Webinar',
      notes: `Webinar registration via Cashfree Form: ${formCode || 'Direct'}`,
    }
  }

  // 2. Check for Store Digital Asset Product
  const isProductById = orderId.startsWith('bmf_prod_')
  const isProductByTag = tags.order_type === 'product' || Boolean(tags.product_id)
  const isProductByString = rawString.includes('store') || rawString.includes('digital asset')

  if (isProductById || isProductByTag || isProductByString) {
    return {
      category: 'product',
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      cfPaymentId,
      paymentStatus,
      paymentMethod,
      bankReference,
      productId: tags.product_id || undefined,
      formCode,
      formTitle: tags.product_title || 'BMF Digital Asset',
      notes: tags.product_title || 'Store Product Purchase',
    }
  }

  // 3. Check for Consultation
  const isConsultation = tags.order_type === 'consultation' || rawString.includes('consultation') || rawString.includes('1-on-1 strategy')

  if (isConsultation) {
    return {
      category: 'consultation',
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      cfPaymentId,
      paymentStatus,
      paymentMethod,
      bankReference,
      formCode,
      formTitle: '1-on-1 Advisory & Strategy Consultation',
      notes: 'Strategy Consultation Booking',
    }
  }

  // 4. Check for BMF Membership
  const isMembershipById = orderId.startsWith('bmf_prem_')
  const isMembershipByTag = tags.order_type === 'membership' || tags.plan === 'premium'
  const isMembershipByAmount = amount === 799

  if (isMembershipById || isMembershipByTag || isMembershipByAmount) {
    return {
      category: 'membership',
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      cfPaymentId,
      paymentStatus,
      paymentMethod,
      bankReference,
      formCode,
      formTitle: 'BMF Club Premium Annual Membership',
      notes: 'BMF Club Premium Pass',
    }
  }

  // 5. Fallback Custom Order
  return {
    category: 'custom',
    orderId,
    amount,
    customerName,
    customerEmail,
    customerPhone,
    cfPaymentId,
    paymentStatus,
    paymentMethod,
    bankReference,
    formCode,
    formTitle: formTitle || 'BMF Payment',
    notes: 'Custom Payment Received',
  }
}

