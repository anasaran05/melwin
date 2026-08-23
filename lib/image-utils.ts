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
  if (
    !url || 
    typeof url !== 'string' || 
    url.trim() === '' || 
    url.includes('unsplash.com/photo-1534528741775-53994a69daeb')
  ) {
    return getFounderFallbackAvatar(fallbackName)
  }

  const cleanUrl = url.trim()

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
