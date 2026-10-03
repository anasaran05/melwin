import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Vault Store | Tested Playbooks, Templates & Frameworks',
  description: 'Verified startup playbooks, pitch deck templates, export directories, and business growth systems by Dr. Melwin Vincent.',
  openGraph: {
    title: 'The Vault Store | Tested Playbooks, Templates & Frameworks',
    description: 'Verified startup playbooks, pitch deck templates, export directories, and business growth systems by Dr. Melwin Vincent.',
    url: 'https://buildwithmelwin.com/store',
    siteName: 'Dr. Melwin Vincent',
    images: [
      {
        url: '/melwin-og-image.webp',
        width: 1200,
        height: 630,
        alt: 'The Vault Store - Tested Playbooks, Templates & Frameworks',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
