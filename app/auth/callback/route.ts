import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      const cookieHeader = request.headers.get('cookie') || ''
      const cookieMatch = cookieHeader.match(/auth_destination=([^;]+)/)
      const cookieNext = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null

      let destination = '/store'
      if (next) {
        if (next.startsWith('http://') || next.startsWith('https://')) {
          return NextResponse.redirect(next)
        }
        destination = next.startsWith('/') ? next : `/${next}`
      } else if (cookieNext) {
        destination = cookieNext.startsWith('/') ? cookieNext : `/${cookieNext}`
      } else if (authData?.user) {
        // Only redirect to bmf-club if coming explicitly from bmf-club referrer
        const referer = request.headers.get('referer') || ''
        if (referer.includes('bmf-club')) {
          destination = '/bmf-club/dashboard'
        } else {
          destination = '/store'
        }
      }

      const baseHost = (forwardedHost && !isLocalEnv) ? `https://${forwardedHost}` : origin
      const response = NextResponse.redirect(`${baseHost}${destination}`)
      response.cookies.delete('auth_destination')
      return response
    }
  }

  // Return the user to login page with error param if code exchange failed
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
