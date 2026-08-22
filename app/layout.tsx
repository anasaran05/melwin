import { Suspense } from 'react'
import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Mono, Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AppBackground } from '@/components/ui/background'
import SplashCursor from '@/components/nurui/splash-cursor'
import { ScrollToTop } from '@/components/scroll-to-top'
import { GoogleOneTap } from '@/components/auth/google-one-tap'
import './globals.css'

const dmSerif = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-dm-serif' })
const dmMono = DM_Mono({ weight: '400', subsets: ['latin'], variable: '--font-dm-mono' })
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Dr. Melwin Vincent | Strategy. Infrastructure. Execution.',
  description: 'Startup strategist, consultant, and builder. Global markets expertise, zero-capital execution, pitch deck architecture.',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmMono.variable} ${geist.variable}`}>
      <body className="font-geist antialiased">
        <GoogleOneTap redirectTo="/bmf-club/dashboard" />
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <AppBackground>
          <SplashCursor />
          {children}
          <Toaster />
          <Analytics />
        </AppBackground>
      </body>
    </html>
  )
}
