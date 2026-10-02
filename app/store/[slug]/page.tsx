import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchStoreProductBySlug, fetchPublicStoreProducts } from '@/lib/supabase/store'
import { ProductShowcaseClient } from './product-showcase-client'

interface PageProps {
  params: Promise<{ slug: string }>
}

/**
 * Generate rich OpenGraph and Twitter card metadata for social media sharing
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchStoreProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found | Build With Melwin Vault',
      description: 'The requested digital product could not be found.',
    }
  }

  const title = `${product.title} | Build With Melwin`
  const description =
    product.subtitle ||
    product.description?.slice(0, 160) ||
    'Tested playbooks, templates, and frameworks for founders and exporters.'

  const canonicalUrl = `https://buildwithmelwin.com/store/${product.slug}`
  const imageUrl =
    product.thumbnail_url?.startsWith('http')
      ? product.thumbnail_url
      : product.thumbnail_url
      ? `https://buildwithmelwin.com${product.thumbnail_url}`
      : 'https://buildwithmelwin.com/melwin-og-image.webp'

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Build With Melwin Vault',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@buildwithmelwin',
    },
  }
}

export default async function ProductShowcasePage({ params }: PageProps) {
  const { slug } = await params
  const product = await fetchStoreProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Fetch all published public store products to compute related products
  const allProducts = await fetchPublicStoreProducts()

  // Prioritize same category, exclude current product, take up to 3
  const sameCategory = allProducts.filter(
    (p) => p.id !== product.id && p.category.toLowerCase() === product.category.toLowerCase()
  )
  const otherCategories = allProducts.filter(
    (p) => p.id !== product.id && p.category.toLowerCase() !== product.category.toLowerCase()
  )
  const relatedProducts = [...sameCategory, ...otherCategories].slice(0, 3)

  return (
    <ProductShowcaseClient
      product={product}
      relatedProducts={relatedProducts}
      allProducts={allProducts}
    />
  )
}
