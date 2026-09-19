import type { MetadataRoute } from 'next'
import { fetchBmfEvents } from '@/lib/supabase/bmf-events'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://buildwithmelwin.com'
  const currentDate = new Date()

  // Base static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bmf-club`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/bmf-club/directory`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/bmf-club/events`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bmf-club/dashboard`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/atom-se`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/funding-grants`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agency`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/personal-branding`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Dynamic BMF Events Pages for Google indexing
  let eventRoutes: MetadataRoute.Sitemap = []
  try {
    const publishedEvents = await fetchBmfEvents()
    eventRoutes = publishedEvents
      .filter((event) => event.is_published)
      .map((event) => ({
        url: `${baseUrl}/bmf-club/events/${encodeURIComponent(event.id)}`,
        lastModified: event.updated_at ? new Date(event.updated_at) : currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }))
  } catch (err) {
    console.error('[Sitemap] Error loading dynamic events for sitemap:', err)
  }

  return [...staticRoutes, ...eventRoutes]
}
