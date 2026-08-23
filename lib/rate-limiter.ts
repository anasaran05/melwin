import { NextRequest, NextResponse } from 'next/server'

interface RateLimitRecord {
  count: number
  resetTime: number
}

// In-memory store for IP rate limiting
const rateLimitStore = new Map<string, RateLimitRecord>()

// Periodically clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitOptions {
  limit?: number // Max requests allowed in window (default 60)
  windowMs?: number // Time window in milliseconds (default 60000 = 1 min)
  identifier?: string // Custom identifier, otherwise extracted from IP headers
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  headers: Record<string, string>
}

/**
 * Extracts a client IP address from standard proxy/CDN headers.
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  const cfConnectingIp = req.headers.get('cf-connecting-ip')
  if (cfConnectingIp) return cfConnectingIp.trim()

  return '127.0.0.1'
}

/**
 * Checks if a given request exceeds the rate limit.
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit ?? 60
  const windowMs = options.windowMs ?? 60 * 1000
  const ip = options.identifier ?? getClientIp(req)
  const key = `rl:${ip}`

  const now = Date.now()
  const record = rateLimitStore.get(key)

  let count = 1
  let resetTime = now + windowMs

  if (record) {
    if (now < record.resetTime) {
      count = record.count + 1
      resetTime = record.resetTime
    } else {
      // Window has passed, reset count
      count = 1
      resetTime = now + windowMs
    }
  }

  rateLimitStore.set(key, { count, resetTime })

  const remaining = Math.max(0, limit - count)
  const isAllowed = count <= limit
  const resetSeconds = Math.ceil((resetTime - now) / 1000)

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
  }

  if (!isAllowed) {
    headers['Retry-After'] = resetSeconds.toString()
  }

  return {
    success: isAllowed,
    limit,
    remaining,
    reset: resetTime,
    headers,
  }
}

/**
 * Helper to generate a 429 Too Many Requests response if rate limit is exceeded.
 */
export function rateLimitExceededResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: 'Too many requests. Please slow down and try again later.',
      retryAfterSeconds: result.headers['Retry-After'] || '60',
    },
    {
      status: 429,
      headers: result.headers,
    }
  )
}
