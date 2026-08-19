'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number, timestamp: number }>()
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 5

export async function login(formData: FormData) {
  // Rate Limiting
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const rateLimitInfo = rateLimitMap.get(ip)

  if (rateLimitInfo) {
    if (now - rateLimitInfo.timestamp < RATE_LIMIT_WINDOW_MS) {
      if (rateLimitInfo.count >= MAX_ATTEMPTS) {
        redirect('/login?message=Too many login attempts. Please try again later.')
      }
      rateLimitInfo.count += 1
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now })
    }
  } else {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
  }

  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  // Clear rate limit on successful login
  rateLimitMap.delete(ip)

  revalidatePath('/', 'layout')
  redirect('/dashboard/manager')
}
