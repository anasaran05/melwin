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
    const config = getCashfreeConfig()
    const secret = process.env.CASHFREE_WEBHOOK_SECRET || config.secretKey
    if (!secret || !signature || !timestamp) return false

    // Cashfree signature algorithm: HMAC-SHA256(timestamp + rawBody, secret) -> base64
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(timestamp + rawBody)
      .digest('base64')

    const sigBuffer = Buffer.from(signature)
    const genBuffer = Buffer.from(generatedSignature)

    if (sigBuffer.length !== genBuffer.length) {
      return false
    }

    return crypto.timingSafeEqual(sigBuffer, genBuffer)
  } catch (error) {
    console.error('[Cashfree] Webhook signature verification error:', error)
    return false
  }
}
