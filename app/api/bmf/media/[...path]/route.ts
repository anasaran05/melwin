import { NextRequest, NextResponse } from 'next/server'
import { getR2Client } from '@/lib/r2'
import { GetObjectCommand } from '@aws-sdk/client-s3'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await context.params
    const key = params.path.join('/')

    if (!key) {
      return NextResponse.json({ error: 'Missing object key' }, { status: 400 })
    }

    const r2 = getR2Client()
    if (!r2) {
      return NextResponse.json({ error: 'R2 storage client not configured' }, { status: 500 })
    }

    const bucketName = process.env.R2_BUCKET_NAME || 'buildwithmelwin'

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    const response = await r2.send(command)

    if (!response.Body) {
      return NextResponse.json({ error: 'Object not found' }, { status: 404 })
    }

    // Convert readable stream to byte array
    const byteArray = await response.Body.transformToByteArray()
    const contentType = response.ContentType || 'image/webp'

    return new NextResponse(Buffer.from(byteArray), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error: any) {
    console.error('[R2 Media Proxy Error]:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve media from R2' },
      { status: error.$metadata?.httpStatusCode || 500 }
    )
  }
}
