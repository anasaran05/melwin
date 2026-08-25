import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendAuthConfirmationEmail, sendAuthMagicLinkEmail } from '@/lib/email/resend'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const { email, type, fullName, password, redirectTo } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()
    const supabase = getAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 })
    }

    const origin = req.headers.get('origin') || req.nextUrl.origin || 'https://www.buildwithmelwin.com'
    const finalRedirect = redirectTo || `${origin}/auth/callback?next=/bmf-club/dashboard`

    if (type === 'signup') {
      // 1. Generate signup confirmation token via Supabase Admin Auth
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'signup',
        email: cleanEmail,
        password: password || undefined,
        options: {
          redirectTo: finalRedirect,
          data: {
            full_name: fullName?.trim() || undefined,
          },
        },
      })

      if (linkError) {
        return NextResponse.json({ error: linkError.message }, { status: 400 })
      }

      // Generate custom domain branded confirm URL
      const hashedToken = linkData?.properties?.hashed_token
      const confirmUrl = hashedToken
        ? `${origin}/auth/confirm?token_hash=${hashedToken}&type=signup&next=${encodeURIComponent('/bmf-club/dashboard')}`
        : `${origin}/auth/confirm?token_hash=${linkData?.properties?.hashed_token || ''}&type=signup&next=${encodeURIComponent('/bmf-club/dashboard')}`

      // 2. Dispatch custom branded confirmation email via Resend
      const emailRes = await sendAuthConfirmationEmail({
        to: cleanEmail,
        founderName: fullName?.trim() || 'Founder',
        confirmUrl,
      })

      if (!emailRes.success) {
        return NextResponse.json({ error: emailRes.error || 'Failed to send confirmation email via Resend' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Account created! Verification email sent via Resend.',
      })
    } else if (type === 'magiclink') {
      // Generate magiclink / OTP token via Supabase Admin Auth
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: cleanEmail,
        options: {
          redirectTo: finalRedirect,
        },
      })

      if (linkError) {
        return NextResponse.json({ error: linkError.message }, { status: 400 })
      }

      // Generate custom domain branded login URL
      const hashedToken = linkData?.properties?.hashed_token
      const loginUrl = hashedToken
        ? `${origin}/auth/confirm?token_hash=${hashedToken}&type=magiclink&next=${encodeURIComponent('/bmf-club/dashboard')}`
        : `${origin}/auth/confirm?token_hash=${linkData?.properties?.hashed_token || ''}&type=magiclink&next=${encodeURIComponent('/bmf-club/dashboard')}`

      // Dispatch custom branded magic link email via Resend
      const emailRes = await sendAuthMagicLinkEmail({
        to: cleanEmail,
        loginUrl,
      })

      if (!emailRes.success) {
        return NextResponse.json({ error: emailRes.error || 'Failed to send login link via Resend' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Magic login link sent via Resend! Check your inbox.',
      })
    }

    return NextResponse.json({ error: 'Invalid auth type specified' }, { status: 400 })
  } catch (err: any) {
    console.error('Error in send-auth-email API:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
