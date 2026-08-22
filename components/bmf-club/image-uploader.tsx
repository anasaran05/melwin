'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Upload, Loader2, CheckCircle2, Trash2 } from 'lucide-react'
import { compressImageToWebP, normalizeR2Url } from '@/lib/image-utils'

interface ImageUploaderProps {
  label: string
  description?: string
  currentUrl?: string
  aspectRatio?: 'square' | 'portrait' | 'landscape'
  isUploading?: boolean
  isPendingSave?: boolean
  onFileSelect: (file: File | null, previewUrl: string) => void
}

export function ImageUploader({
  label,
  description,
  currentUrl = '',
  aspectRatio = 'portrait',
  isUploading = false,
  isPendingSave = false,
  onFileSelect,
}: ImageUploaderProps) {
  const [isCompressing, setIsCompressing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(normalizeR2Url(currentUrl) || '')
  const [compressionStats, setCompressionStats] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync with currentUrl prop when it changes and we're not staging a new file
  useEffect(() => {
    if (!isPendingSave) {
      setPreviewUrl(normalizeR2Url(currentUrl) || '')
    }
  }, [currentUrl, isPendingSave])

  const handleFile = async (file: File) => {
    if (!file) return
    setError('')
    setIsCompressing(true)

    try {
      // Compress to WebP at 80% quality silently in the background
      const result = await compressImageToWebP(file, {
        quality: 0.8,
        maxWidth: aspectRatio === 'square' ? 800 : 1400,
        maxHeight: aspectRatio === 'square' ? 800 : 1400,
      })

      setPreviewUrl(result.previewUrl)
      // Pass the compressed File & previewUrl to parent form state
      onFileSelect(result.file, result.previewUrl)
    } catch (err: any) {
      console.error('Image compression error:', err)
      setError('Could not process image. Please try another file.')
    } finally {
      setIsCompressing(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreviewUrl('')
    setCompressionStats('')
    onFileSelect(null, '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const aspectClass =
    aspectRatio === 'square'
      ? 'w-20 h-20 sm:w-24 sm:h-24 rounded-2xl'
      : aspectRatio === 'landscape'
      ? 'w-36 h-20 sm:w-40 sm:h-24 rounded-2xl'
      : 'w-20 h-24 sm:w-24 sm:h-32 rounded-2xl'

  const activeImage = previewUrl || currentUrl

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-200">
          {label}
        </label>
        {activeImage && (
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready
          </span>
        )}
      </div>

      {description && (
        <p className="text-[11px] text-neutral-400">
          {description}
        </p>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/heic,image/jpg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
          }
        }}
      />

      {/* Modern Card Container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border rounded-2xl p-4 transition-all ${
          isDragOver
            ? 'border-sky-500 bg-sky-950/20'
            : activeImage
            ? 'border-neutral-800 bg-[#16161a] hover:border-neutral-700'
            : 'border-neutral-800 hover:border-neutral-700 bg-[#16161a]'
        }`}
      >
        {activeImage ? (
          <div className="flex items-center gap-4">
            <div className={`relative ${aspectClass} overflow-hidden bg-neutral-900 border border-white/10 shrink-0 shadow-md`}>
              <img
                src={activeImage}
                alt={label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if URL is invalid or blocked
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
                }}
              />
              {(isCompressing || isUploading) && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white gap-1 p-2 text-center">
                  <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
                  <span className="text-[10px] font-mono text-neutral-300">
                    {isCompressing ? 'Processing...' : 'Uploading...'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 text-left space-y-1.5 min-w-0">
              <div>
                <p className="text-xs font-semibold text-white truncate">{label}</p>
                <p className="text-[11px] text-neutral-400">
                  Image active
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isCompressing || isUploading}
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  disabled={isCompressing || isUploading}
                  onClick={handleClear}
                  className="text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 space-y-2 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              {isCompressing || isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-neutral-200">
                {isCompressing ? 'Processing...' : 'Click or drag image here to upload'}
              </p>
              <p className="text-[10px] text-neutral-500">
                PNG, JPG, or WEBP up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-400">
          {error}
        </p>
      )}
    </div>
  )
}
