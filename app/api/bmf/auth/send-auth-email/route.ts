import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { 
  sendAuthConfirmationEmail, 
  sendAuthMagicLinkEmail, 
  sendAuthPasswordResetOtpEmail 
} from '@/lib/email/resend'

// In-memory rate limiting map: email -> last request timestamp
const otpRateLimitMap = new Map<string, number>()
const OTP_RATE_LIMIT_COOLDOWN_MS = 60 * 1000 // 60-second cooldown

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

    // FORGOT PASSWORD / OTP RECOVERY FLOW
    if (type === 'recovery' || type === 'forgot-password') {
      // 1. Enforce 60-second rate limiting cooldown per email
      const lastRequestTime = otpRateLimitMap.get(cleanEmail)
      const now = Date.now()
      if (lastRequestTime && (now - lastRequestTime) < OTP_RATE_LIMIT_COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((OTP_RATE_LIMIT_COOLDOWN_MS - (now - lastRequestTime)) / 1000)
        return NextResponse.json({
          error: `Please wait ${remainingSeconds}s before requesting a new verification code.`,
          retryAfter: remainingSeconds,
          rateLimited: true,
        }, { status: 429 })
      }

      // 2. Generate recovery link & 6-digit OTP code via Supabase Admin Auth
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: cleanEmail,
        options: {
          redirectTo: finalRedirect,
        },
      })

      if (linkError) {
        return NextResponse.json({ 
          error: linkError.message || 'Unable to generate reset code for this email. Please ensure the email is registered.' 
        }, { status: 400 })
      }

      const otpCode = linkData?.properties?.email_otp
      if (!otpCode) {
        return NextResponse.json({ error: 'Failed to generate verification OTP' }, { status: 500 })
      }

      // 3. Dispatch branded email with OTP code (no sensitive URLs in body)
      const emailRes = await sendAuthPasswordResetOtpEmail({
        to: cleanEmail,
        otpCode,
      })

      if (!emailRes.success) {
        return NextResponse.json({ error: emailRes.error || 'Failed to send verification code email' }, { status: 500 })
      }

      // Record rate limit timestamp only on successful dispatch
      otpRateLimitMap.set(cleanEmail, Date.now())

      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your email. Check your inbox.',
        cooldownSeconds: 60,
      })
    }

    if (type === 'signup') {
      // 1. Check if member already exists in bmf_members
      const { data: existingMember } = await supabase
        .from('bmf_members')
        .select('id, email, user_id, is_verified')
        .ilike('email', cleanEmail)
        .maybeSingle()

      if (existingMember) {
        return NextResponse.json({
          success: false,
          alreadyExists: true,
          error: 'An account with this email already exists. Please sign in with your password.',
        }, { status: 409 })
      }

      // 2. Generate signup confirmation token via Supabase Admin Auth
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
        const isAlreadyRegistered = 
          linkError.message.toLowerCase().includes('already') ||
          linkError.message.toLowerCase().includes('registered') ||
          linkError.message.toLowerCase().includes('exists')

        return NextResponse.json({ 
          error: isAlreadyRegistered 
            ? 'An account with this email already exists. Please sign in instead.' 
            : linkError.message,
          alreadyExists: isAlreadyRegistered,
        }, { status: isAlreadyRegistered ? 409 : 400 })
      }

      // If user already had email confirmed or previously logged in, they already have an account
      const user = linkData?.user
      if (user?.email_confirmed_at || user?.confirmed_at || user?.last_sign_in_at) {
        return NextResponse.json({
          success: false,
          alreadyExists: true,
          error: 'An account with this email already exists. Please sign in with your password.',
        }, { status: 409 })
      }

      // Generate custom domain branded confirm URL
      const hashedToken = linkData?.properties?.hashed_token
      const confirmUrl = hashedToken
        ? `${origin}/auth/confirm?token_hash=${hashedToken}&type=signup&next=${encodeURIComponent('/bmf-club/dashboard')}`
        : `${origin}/auth/confirm?token_hash=${linkData?.properties?.hashed_token || ''}&type=signup&next=${encodeURIComponent('/bmf-club/dashboard')}`

      // 3. Dispatch custom branded confirmation email via Resend
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
      // Legacy fallback for magiclink
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

      const hashedToken = linkData?.properties?.hashed_token
      const loginUrl = hashedToken
        ? `${origin}/auth/confirm?token_hash=${hashedToken}&type=magiclink&next=${encodeURIComponent('/bmf-club/dashboard')}`
        : `${origin}/auth/confirm?token_hash=${linkData?.properties?.hashed_token || ''}&type=magiclink&next=${encodeURIComponent('/bmf-club/dashboard')}`

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
