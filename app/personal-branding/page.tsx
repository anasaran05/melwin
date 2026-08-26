import type { Metadata } from 'next'
import AgencyPage from '../agency/page'

export const metadata: Metadata = {
  title: 'Personal Branding & Executive Presence | Dr. Melwin Vincent',
  description: 'Turn the founder into the #1 customer acquisition channel. Complete done-for-you video production, studio shoots, scriptwriting, and executive authority on LinkedIn & Instagram.',
  openGraph: {
    title: 'Personal Branding & Executive Presence | Dr. Melwin Vincent',
    description: 'Turn the founder into the #1 customer acquisition channel. Complete done-for-you video production, studio shoots, scriptwriting, and executive authority on LinkedIn & Instagram.',
    url: 'https://buildwithmelwin.com/personal-branding',
    siteName: 'Dr. Melwin Vincent',
    images: [
      {
        url: '/images/personal-branding.webp',
        width: 1200,
        height: 630,
        alt: 'Personal Branding & Executive Presence - Dr. Melwin Vincent',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Branding & Executive Presence | Dr. Melwin Vincent',
    description: 'Turn the founder into the #1 customer acquisition channel. Complete done-for-you video production, studio shoots, scriptwriting, and executive authority on LinkedIn & Instagram.',
    images: ['/images/personal-branding.webp'],
  },
}

export default function PersonalBrandingPage() {
  return <AgencyPage />
}
