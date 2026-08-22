import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'

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
    forcePathStyle: true,
  })
}

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
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
  const bucketName = process.env.R2_BUCKET_NAME || 'buildwithmelwin'
  const publicDomain = process.env.R2_PUBLIC_DOMAIN || process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || 'https://media.buildwithmelwin.com'

  // Extract sanitized extension
  const ext = originalFileName.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'webp'
  const timestamp = Date.now()
  const sanitizedUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '_')
  
  // Organized naming paths:
  // bmf-club/founders/{userId}/portrait_{timestamp}.{ext}
  // bmf-club/companies/{userId}/logo_{timestamp}.{ext}
  const prefix = folder === 'founders' ? 'portrait' : 'logo'
  const key = `bmf-club/${folder}/${sanitizedUserId}/${prefix}_${timestamp}.${ext}`

  // 1. Try Cloudflare R2 (Primary High-Speed CDN Storage)
  const r2 = getR2Client()
  if (r2) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      })

      await r2.send(command)

      const cleanDomain = publicDomain.replace(/\/$/, '')
      const publicUrl = `${cleanDomain}/${key}`

      return {
        success: true,
        url: publicUrl,
      }
    } catch (r2Error: any) {
      console.warn('[R2 Upload Warning]: R2 upload failed, attempting Supabase Storage fallback...', r2Error.message)
    }
  }

  // 2. Fallback: Supabase Storage Bucket ('bmf-assets' / 'avatars')
  try {
    const supabase = getSupabaseAdmin()
    if (supabase) {
      const storageBucket = 'bmf-assets'
      const filePath = `${folder}/${sanitizedUserId}/${prefix}_${timestamp}.${ext}`

      const { data, error: uploadErr } = await supabase.storage
        .from(storageBucket)
        .upload(filePath, fileBuffer, {
          contentType,
          upsert: true,
        })

      if (!uploadErr && data) {
        const { data: publicData } = supabase.storage
          .from(storageBucket)
          .getPublicUrl(filePath)

        if (publicData?.publicUrl) {
          return {
            success: true,
            url: publicData.publicUrl,
          }
        }
      }
    }
  } catch (supabaseStorageError: any) {
    console.error('[Supabase Storage Error]:', supabaseStorageError)
  }

  return {
    success: false,
    url: '',
    error: 'Failed to upload image to object storage. Please verify storage bucket permissions.',
  }
}
