import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next')
  const origin = request.nextUrl.origin

  if (token_hash && type) {
    const supabase = await createClient()

    const { data: authData, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      const baseHost = (forwardedHost && !isLocalEnv) ? `https://${forwardedHost}` : origin
      
      const cookieHeader = request.headers.get('cookie') || ''
      const cookieMatch = cookieHeader.match(/auth_destination=([^;]+)/)
      const cookieNext = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null

      let destination = '/store'
      if (next) {
        destination = next.startsWith('/') ? next : `/${next}`
      } else if (cookieNext) {
        destination = cookieNext.startsWith('/') ? cookieNext : `/${cookieNext}`
      } else if (authData?.user) {
        const referer = request.headers.get('referer') || ''
        if (referer.includes('bmf-club')) {
          destination = '/bmf-club/dashboard'
        } else {
          destination = '/store'
        }
      }

      const response = NextResponse.redirect(`${baseHost}${destination}`)
      response.cookies.delete('auth_destination')
      return response
    } else {
      console.error('[VerifyOtp Error]:', error.message)
    }
  }

  // Return the user to login page with error param if verification failed
  return NextResponse.redirect(`${origin}/login?error=verification_failed`)
}
