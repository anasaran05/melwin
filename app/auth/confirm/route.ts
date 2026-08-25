import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/bmf-club/dashboard'
  const origin = request.nextUrl.origin

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      const baseHost = (forwardedHost && !isLocalEnv) ? `https://${forwardedHost}` : origin
      const destination = next.startsWith('/') ? next : `/${next}`
      return NextResponse.redirect(`${baseHost}${destination}`)
    } else {
      console.error('[VerifyOtp Error]:', error.message)
    }
  }

  // Return the user to login page with error param if verification failed
  return NextResponse.redirect(`${origin}/bmf-club/login?error=verification_failed`)
}
