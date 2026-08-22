import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudflareR2 } from '@/lib/r2'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as 'founders' | 'companies') || 'founders'
    const userId = (formData.get('userId') as string) || 'guest'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate mime type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, WEBP, and SVG are supported.' },
        { status: 400 }
      )
    }

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Image size exceeds 10MB limit.' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    const result = await uploadToCloudflareR2({
      fileBuffer,
      contentType: file.type,
      folder,
      userId,
      originalFileName: file.name,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Upload to Cloudflare R2 failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: result.url,
    })
  } catch (error: any) {
    console.error('[API Upload Media Error]:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during upload' },
      { status: 500 }
    )
  }
}
