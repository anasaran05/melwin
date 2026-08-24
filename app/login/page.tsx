import { login } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react'

export default async function LoginPage(props: { searchParams: Promise<{ message?: string; next?: string }> }) {
  const searchParams = await props.searchParams
  const nextParam = searchParams?.next || '/dashboard/manager'
  const message = searchParams?.message ? decodeURIComponent(searchParams.message) : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4 select-none relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-4 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <Card className="w-full bg-neutral-900/90 border-neutral-800 text-neutral-100 shadow-2xl backdrop-blur-md rounded-2xl sm:rounded-3xl">
          <CardHeader className="space-y-2 text-center pb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mx-auto shadow-inner">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-white">
              Admin Console
            </CardTitle>
            <CardDescription className="text-xs text-neutral-400">
              Sign in with your administrator credentials to access the master console
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <input type="hidden" name="next" value={nextParam} />
              
              <div className="space-y-1.5 text-left">
                <Label htmlFor="email" className="text-xs font-semibold text-neutral-300">
                  Admin Email
                </Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="admin@buildwithmelwin.com" 
                  required 
                  className="bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-neutral-700 rounded-xl text-xs py-5"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <Label htmlFor="password" className="text-xs font-semibold text-neutral-300">
                  Password
                </Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••••••"
                  required 
                  className="bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-neutral-700 rounded-xl text-xs py-5"
                />
              </div>

              {message && (
                <div className="p-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl text-center flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <Button 
                formAction={login} 
                className="w-full bg-white text-black hover:bg-neutral-200 font-bold text-xs py-5 rounded-xl cursor-pointer shadow-lg active:scale-[0.99] transition-all"
              >
                Sign In to Console &rarr;
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
