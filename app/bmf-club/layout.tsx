import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BMF Club | Private Founder & Creator Community',
  description: 'Join 23,000+ ambitious entrepreneurs for weekly masterminds, real-time collaboration, peer dealflow, investor networking, and exclusive startup growth playbooks.',
  openGraph: {
    title: 'BMF Club | Private Founder & Creator Community',
    description: 'Join 23,000+ ambitious entrepreneurs for weekly masterminds, real-time collaboration, peer dealflow, investor networking, and exclusive startup growth playbooks.',
    url: 'https://buildwithmelwin.com/bmf-club',
    siteName: 'Dr. Melwin Vincent',
    images: [
      {
        url: '/images/bmf-club.webp',
        width: 1200,
        height: 630,
        alt: 'BMF Club - Private Founder & Creator Community',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMF Club | Private Founder & Creator Community',
    description: 'Join 23,000+ ambitious entrepreneurs for weekly masterminds, real-time collaboration, peer dealflow, investor networking, and exclusive startup growth playbooks.',
    images: ['/images/bmf-club.webp'],
  },
}

export default function BmfClubLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
