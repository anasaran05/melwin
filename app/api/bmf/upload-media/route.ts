import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudflareR2 } from '@/lib/r2'

export async function POST(request: NextRequest) {
  try {
    const contentTypeHeader = request.headers.get('content-type') || ''
    
    let fileBuffer: Buffer | null = null
    let contentType = 'image/webp'
    let folder: 'founders' | 'companies' = 'founders'
    let userId = 'guest'
    let originalFileName = 'image.webp'

    if (contentTypeHeader.includes('application/json')) {
      const body = await request.json()
      const base64String = body.base64Data || body.image
      folder = body.folder || 'founders'
      userId = body.userId || 'guest'
      originalFileName = body.originalFileName || 'image.webp'

      if (!base64String || typeof base64String !== 'string') {
        return NextResponse.json(
          { success: false, error: 'No image data provided in JSON body' },
          { status: 400 }
        )
      }

      // Parse data URL format: data:image/webp;base64,....
      const match = base64String.match(/^data:([a-zA-Z0-9/+-]+);base64,(.+)$/)
      if (match) {
        contentType = match[1]
        fileBuffer = Buffer.from(match[2], 'base64')
      } else {
        fileBuffer = Buffer.from(base64String, 'base64')
      }
    } else {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      folder = (formData.get('folder') as 'founders' | 'companies') || 'founders'
      userId = (formData.get('userId') as string) || 'guest'

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
      fileBuffer = Buffer.from(arrayBuffer)
      contentType = file.type
      originalFileName = file.name
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid or empty file buffer' },
        { status: 400 }
      )
    }

    const result = await uploadToCloudflareR2({
      fileBuffer,
      contentType,
      folder,
      userId,
      originalFileName,
    })

    if (!result.success || !result.url) {
      return NextResponse.json(
        { success: false, error: result.error || 'Upload to storage failed' },
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
