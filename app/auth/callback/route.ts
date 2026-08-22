import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/bmf-club/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      let destination = '/bmf-club/dashboard'
      if (next) {
        if (next.startsWith('http://') || next.startsWith('https://')) {
          return NextResponse.redirect(next)
        }
        destination = next.startsWith('/') ? next : `/${next}`
      }

      const baseHost = (forwardedHost && !isLocalEnv) ? `https://${forwardedHost}` : origin
      return NextResponse.redirect(`${baseHost}${destination}`)
    }
  }

  // Return the user to login page with error param if code exchange failed
  return NextResponse.redirect(`${origin}/bmf-club/login?error=auth_failed`)
}
