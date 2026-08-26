import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Atom SE | Bespoke Engineering, AI Studio & Product Development',
  description: 'Full-stack software, custom AI agents, and high-performance product engineering by Atom SE. Led by Dr. Melwin Vincent.',
  openGraph: {
    title: 'Atom SE | Bespoke Engineering, AI Studio & Product Development',
    description: 'Full-stack software, custom AI agents, and high-performance product engineering by Atom SE. Led by Dr. Melwin Vincent.',
    url: 'https://buildwithmelwin.com/atom-se',
    siteName: 'Dr. Melwin Vincent',
    images: [
      {
        url: '/images/atom-se.webp',
        width: 1200,
        height: 630,
        alt: 'Atom SE - Tech & AI Studio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atom SE | Bespoke Engineering, AI Studio & Product Development',
    description: 'Full-stack software, custom AI agents, and high-performance product engineering by Atom SE. Led by Dr. Melwin Vincent.',
    images: ['/images/atom-se.webp'],
  },
}

export default function AtomSeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
