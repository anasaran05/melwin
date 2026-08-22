'use client'

import React, { useState, useRef } from 'react'
import { Upload, Loader2, CheckCircle2, Image as ImageIcon, Trash2 } from 'lucide-react'

interface ImageUploaderProps {
  label: string
  description?: string
  currentUrl?: string
  folder: 'founders' | 'companies'
  userId?: string
  aspectRatio?: 'square' | 'portrait' | 'landscape'
  onUploadComplete: (url: string) => void
}

export function ImageUploader({
  label,
  description,
  currentUrl,
  folder,
  userId = 'anonymous',
  aspectRatio = 'portrait',
  onUploadComplete,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl || '')
  const [error, setError] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return
    setError('')
    setIsUploading(true)

    // Set immediate local preview
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      formData.append('userId', userId)

      const response = await fetch('/api/bmf/upload-media', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success && data.url) {
        setPreviewUrl(data.url)
        onUploadComplete(data.url)
      } else {
        setError(data.error || 'Upload failed. Please try again.')
      }
    } catch (err: any) {
      console.error('Upload error:', err)
      setError('Network error during upload.')
    } finally {
      setIsUploading(false)
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
    onUploadComplete('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const aspectClass = 
    aspectRatio === 'square' ? 'aspect-square max-w-[140px]' : 
    aspectRatio === 'landscape' ? 'aspect-video max-w-[240px]' : 
    'aspect-[3/4] max-w-[160px]'

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-200">
          {label} <span className="text-emerald-400">*</span>
        </label>
        {previewUrl && (
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Ready
          </span>
        )}
      </div>

      {description && (
        <p className="text-[11px] text-neutral-400 leading-tight">
          {description}
        </p>
      )}

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
          }
        }}
      />

      {/* Dropzone Container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center text-center ${
          isDragOver
            ? 'border-sky-400 bg-sky-950/20'
            : previewUrl
            ? 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-500'
            : 'border-neutral-700 hover:border-neutral-500 bg-neutral-900/80'
        }`}
      >
        {previewUrl ? (
          <div className="flex items-center gap-4 w-full">
            <div className={`relative ${aspectClass} w-full rounded-xl overflow-hidden bg-black border border-white/10 shrink-0 shadow-md`}>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-1.5 text-white">
                  <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
                  <span className="text-[10px] font-mono font-bold">Uploading to R2...</span>
                </div>
              )}
            </div>

            <div className="flex-1 text-left space-y-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Image Uploaded</p>
              <p className="text-[11px] text-neutral-400 font-mono">
                {folder === 'founders' ? 'Founder Portrait (Cloudflare R2)' : 'Company Logo (Cloudflare R2)'}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="text-[11px] font-mono bg-white/10 hover:bg-white/20 text-neutral-200 px-2.5 py-1 rounded-md transition-colors"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[11px] font-mono text-rose-400 hover:text-rose-300 p-1 transition-colors"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-2 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/10 text-neutral-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-neutral-200">
                {isUploading ? 'Uploading to Cloudflare R2...' : 'Click or Drag & Drop to Upload'}
              </p>
              <p className="text-[10px] text-neutral-500 font-mono">
                PNG, JPG, WEBP or SVG (Max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-400 font-mono">
          ⚠️ {error}
        </p>
      )}
    </div>
  )
}
