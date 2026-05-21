import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Mono, Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AppBackground } from '@/components/ui/background'
import SplashCursor from '@/components/nurui/splash-cursor'
import './globals.css'

const dmSerif = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-dm-serif' })
const dmMono = DM_Mono({ weight: '400', subsets: ['latin'], variable: '--font-dm-mono' })
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Dr. Melwin Vincent | Strategy. Infrastructure. Execution.',
  description: 'Startup strategist, consultant, and builder. Global markets expertise, zero-capital execution, pitch deck architecture.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmMono.variable} ${geist.variable} scroll-smooth`}>
      <body className="font-geist antialiased">
        <AppBackground>
          <SplashCursor />
          {children}
          <Toaster />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AppBackground>
      </body>
    </html>
  )
}
