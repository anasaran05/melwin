'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

// Simple in-memory rate limiter with development exemption
const rateLimitMap = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 10

export async function login(formData: FormData) {
  const next = (formData.get('next') as string) || '/dashboard/manager'
  const destination = next.startsWith('/') ? next : '/dashboard/manager'

  // Rate Limiting (exempt unknown / localhost in dev)
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  const isLocal = ip === 'unknown' || ip === '127.0.0.1' || ip === '::1' || process.env.NODE_ENV === 'development'

  if (!isLocal) {
    const now = Date.now()
    const rateLimitInfo = rateLimitMap.get(ip)

    if (rateLimitInfo) {
      if (now - rateLimitInfo.timestamp < RATE_LIMIT_WINDOW_MS) {
        if (rateLimitInfo.count >= MAX_ATTEMPTS) {
          const errMsg = encodeURIComponent('Too many login attempts. Please try again in 15 minutes.')
          redirect(`/login?message=${errMsg}&next=${encodeURIComponent(destination)}`)
        }
        rateLimitInfo.count += 1
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now })
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now })
    }
  }

  const supabase = await createClient()

  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    const errMsg = encodeURIComponent('Please provide both email and password.')
    redirect(`/login?message=${errMsg}&next=${encodeURIComponent(destination)}`)
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('[Admin Login Error]:', error.message)
    const errMsg = encodeURIComponent(error.message || 'Invalid login credentials.')
    redirect(`/login?message=${errMsg}&next=${encodeURIComponent(destination)}`)
  }

  // Clear rate limit on successful login
  if (!isLocal) {
    rateLimitMap.delete(ip)
  }

  revalidatePath('/', 'layout')
  redirect(destination)
}
