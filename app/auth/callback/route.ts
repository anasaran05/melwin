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
      
      let destination = '/store'
      if (next) {
        if (next.startsWith('http://') || next.startsWith('https://')) {
          return NextResponse.redirect(next)
        }
        destination = next.startsWith('/') ? next : `/${next}`
      } else if (authData?.user) {
        // If user already has an established BMF Club profile, direct them to club dashboard;
        // Otherwise, send them to the public store without creating any BMF member or card records!
        const { data: member } = await supabase
          .from('bmf_members')
          .select('id')
          .eq('user_id', authData.user.id)
          .maybeSingle()

        if (member) {
          destination = '/bmf-club/dashboard'
        } else {
          destination = '/store'
        }
      }

      const baseHost = (forwardedHost && !isLocalEnv) ? `https://${forwardedHost}` : origin
      return NextResponse.redirect(`${baseHost}${destination}`)
    }
  }

  // Return the user to login page with error param if code exchange failed
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
