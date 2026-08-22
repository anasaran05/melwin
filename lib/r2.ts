import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

export function getR2Client(): S3Client | null {
  const accountId = process.env.R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

export interface UploadR2Options {
  fileBuffer: Buffer
  contentType: string
  folder: 'founders' | 'companies'
  userId?: string
  originalFileName?: string
}

export async function uploadToCloudflareR2({
  fileBuffer,
  contentType,
  folder,
  userId = 'anonymous',
  originalFileName = 'image.webp',
}: UploadR2Options): Promise<{ success: boolean; url: string; error?: string }> {
  try {
    const r2 = getR2Client()
    const bucketName = process.env.R2_BUCKET_NAME || 'buildwithmelwin'
    const publicDomain = process.env.R2_PUBLIC_DOMAIN || process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN

    // Extract sanitized extension
    const ext = originalFileName.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'webp'
    const timestamp = Date.now()
    const sanitizedUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '_')
    
    // Organized naming paths:
    // bmf-club/founders/{userId}/portrait_{timestamp}.{ext}
    // bmf-club/companies/{userId}/logo_{timestamp}.{ext}
    const prefix = folder === 'founders' ? 'portrait' : 'logo'
    const key = `bmf-club/${folder}/${sanitizedUserId}/${prefix}_${timestamp}.${ext}`

    if (!r2) {
      console.warn('[R2] Cloudflare R2 credentials not set. Using base64 data URI fallback.')
      const base64 = `data:${contentType};base64,${fileBuffer.toString('base64')}`
      return {
        success: true,
        url: base64,
      }
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })

    await r2.send(command)

    // Format public URL:
    // If a custom public domain is configured (e.g. https://cdn.buildwithmelwin.com), use it.
    // Otherwise, route through the secure Next.js media proxy (/api/bmf/media/...)
    let publicUrl = ''
    if (publicDomain && publicDomain.trim().length > 0) {
      const cleanDomain = publicDomain.replace(/\/$/, '')
      publicUrl = `${cleanDomain}/${key}`
    } else {
      publicUrl = `/api/bmf/media/${key}`
    }

    return {
      success: true,
      url: publicUrl,
    }
  } catch (error: any) {
    console.error('[R2 Upload Error]:', error)
    return {
      success: false,
      url: '',
      error: error.message || 'Failed to upload image to Cloudflare R2',
    }
  }
}
