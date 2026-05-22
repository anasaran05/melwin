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

  // Turnstile Verification
  const turnstileToken = formData.get('cf-turnstile-response')
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY

  if (turnstileSecret && turnstileSecret !== 'your_secret_key_here') {
    if (!turnstileToken) {
      redirect('/login?message=Please complete the anti-bot verification')
    }
    
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${turnstileSecret}&response=${turnstileToken}&remoteip=${ip}`,
    })
    
    const verifyData = await verifyRes.json()
    if (!verifyData.success) {
      redirect('/login?message=Anti-bot verification failed')
    }
  }

  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
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
  redirect('/dashboard')
}
