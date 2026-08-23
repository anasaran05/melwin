'use client'

/**
 * Client-side Image Optimization Utility
 * Automatically compresses, scales, and converts images into modern WebP format at 80% quality.
 */
export interface CompressedImageResult {
  file: File
  blob: Blob
  previewUrl: string
  originalSizeKb: number
  compressedSizeKb: number
  dimensions: { width: number; height: number }
}

export const CANONICAL_MEDIA_DOMAIN = 'https://media.buildwithmelwin.com'

export interface FounderAvatarPreset {
  id: string
  name: string
  category: string
  url: string
}

export const FOUNDER_AVATAR_PRESETS: FounderAvatarPreset[] = [
  {
    id: 'avatar-1',
    name: 'Avatar 01',
    category: 'Avatar',
    url: 'https://static.wixstatic.com/media/6abdd9_bec9fd0f15f84599ab0e08763bfb20d2~mv2.jpg',
  },
  {
    id: 'avatar-2',
    name: 'Avatar 02',
    category: 'Avatar',
    url: 'https://static.wixstatic.com/media/6abdd9_050ee469f0a343a889fb6293c57f5501~mv2.jpg',
  },
  {
    id: 'avatar-3',
    name: 'Avatar 03',
    category: 'Avatar',
    url: 'https://static.wixstatic.com/media/6abdd9_73b2fbb451704a62a2ec8031d743c7f6~mv2.jpg',
  },
  {
    id: 'avatar-4',
    name: 'Avatar 04',
    category: 'Avatar',
    url: 'https://static.wixstatic.com/media/6abdd9_982d5b43b0df44b78f5dd563e56cacd1~mv2.jpg',
  },
  {
    id: 'avatar-5',
    name: 'Avatar 05',
    category: 'Avatar',
    url: 'https://static.wixstatic.com/media/6abdd9_dcb02580e49647f290f2125993c39043~mv2.jpg',
  },
  {
    id: 'avatar-6',
    name: 'Avatar 06',
    category: 'Avatar',
    url: 'https://static.wixstatic.com/media/6abdd9_8a1a294a663c49d9b0b2936349e0b4b9~mv2.jpg',
  },
  {
    id: 'avatar-7',
    name: 'Avatar 07',
    category: 'Avatar',
    url: 'https://static.wixstatic.com/media/6abdd9_2ba2e72c3f4b4bee920c044ac733f81e~mv2.jpg',
  },
  {
    id: 'avatar-8',
    name: 'Avatar 08',
    category: 'Avatar',
    url: 'https://static.wixstatic.com/media/6abdd9_cc75ba9a7a5548178e20c681e74e1adb~mv2.jpg',
  },
  {
    id: 'avatar-9',
    name: 'Avatar 09',
    category: 'Avatar',
    url: 'https://static.wixstatic.com/media/6abdd9_8fb48110bd4344c785df1f3171d7747d~mv2.jpg',
  },
  {
    id: 'avatar-10',
    name: 'Avatar 10',
    category: 'Avatar',
    url: 'https://static.wixstatic.com/media/6abdd9_e73157142e61495bafcbe6858868bba8~mv2.jpg',
  },
  {
    id: 'avatar-11',
    name: 'Avatar 11',
    category: 'Avatar',
    url: 'https://static.wixstatic.com/media/6abdd9_80f61a3b12b146d3a25870b2261872b0~mv2.jpg',
  },
  {
    id: 'avatar-12',
    name: 'Avatar 12',
    category: 'Avatar',
    url: 'https://static.wixstatic.com/media/6abdd9_f02762fcf4e84524932e8188c3072b40~mv2.jpg',
  },
]

/**
 * Generates a clean, modern executive avatar illustration
 * instead of arbitrary stock photos when a user hasn't uploaded their portrait.
 */
export function getFounderFallbackAvatar(name?: string | null): string {
  const cleanName = (name || 'Founder').trim()
  return `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=121214`
}

export const DEFAULT_FOUNDER_AVATAR = 'https://api.dicebear.com/7.x/personas/svg?seed=ExecutiveFounder&backgroundColor=121214'

export function normalizeR2Url(url?: string | null, fallbackName?: string | null): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallbackName ? getFounderFallbackAvatar(fallbackName) : ''
  }

  const cleanUrl = url.trim()

  // Ignore unsplash placeholder images for company logos
  if (cleanUrl.includes('images.unsplash.com') && !fallbackName) {
    return ''
  }

  // Rewrite any development/old domain variations to the custom media.buildwithmelwin.com domain
  if (
    cleanUrl.includes('buildwithmelwin.r2.dev') ||
    cleanUrl.includes('.r2.dev')
  ) {
    return cleanUrl.replace(/https?:\/\/[a-zA-Z0-9_-]+\.r2\.dev/, CANONICAL_MEDIA_DOMAIN)
  }

  return cleanUrl
}

export async function compressImageToWebP(
  file: File,
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    customFileName?: string
  } = {}
): Promise<CompressedImageResult> {
  const {
    maxWidth = 1400,
    maxHeight = 1400,
    quality = 0.8, // 80% quality as requested
    customFileName,
  } = options

  return new Promise((resolve, reject) => {
    // If it's an SVG, don't rasterize to canvas; keep SVG as is
    if (file.type === 'image/svg+xml') {
      const previewUrl = URL.createObjectURL(file)
      const sizeKb = Math.round(file.size / 1024)
      return resolve({
        file,
        blob: file,
        previewUrl,
        originalSizeKb: sizeKb,
        compressedSizeKb: sizeKb,
        dimensions: { width: 400, height: 400 },
      })
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read image file.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Failed to load image for compression.'))
      img.onload = () => {
        let { width, height } = img

        // Calculate bounded aspect ratio dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return reject(new Error('Could not get canvas 2D rendering context.'))
        }

        // Enable high quality image smoothing
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to WebP at 80% quality (0.8)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('WebP compression failed.'))
            }

            const baseName = customFileName || file.name.replace(/\.[^/.]+$/, '')
            const webpFileName = `${baseName}.webp`
            const webpFile = new File([blob], webpFileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            })

            const previewUrl = URL.createObjectURL(blob)

            resolve({
              file: webpFile,
              blob,
              previewUrl,
              originalSizeKb: Math.round(file.size / 1024),
              compressedSizeKb: Math.round(blob.size / 1024),
              dimensions: { width, height },
            })
          },
          'image/webp',
          quality
        )
      }

      img.src = reader.result as string
    }

    reader.readAsDataURL(file)
  })
}
