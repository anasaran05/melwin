import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Funding & Government Grants | Dr. Melwin Vincent',
  description: 'Seed pitch deck refinement, state & central government grant subsidies, Startup India schemes, and angel syndicate matchmaking.',
  openGraph: {
    title: 'Funding & Government Grants | Dr. Melwin Vincent',
    description: 'Seed pitch deck refinement, state & central government grant subsidies, Startup India schemes, and angel syndicate matchmaking.',
    url: 'https://buildwithmelwin.com/funding-grants',
    siteName: 'Dr. Melwin Vincent',
    images: [
      {
        url: '/images/funding-grants.webp',
        width: 1200,
        height: 630,
        alt: 'Funding & Government Grants - Dr. Melwin Vincent',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Funding & Government Grants | Dr. Melwin Vincent',
    description: 'Seed pitch deck refinement, state & central government grant subsidies, Startup India schemes, and angel syndicate matchmaking.',
    images: ['/images/funding-grants.webp'],
  },
}

export default function FundingGrantsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
