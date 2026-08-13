'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HardDrive, Upload, Cloud, Video, Image, FileCheck, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface R2MediaVaultProps {
  clientId: string;
  clientName: string;
  rawMediaUrl?: string | null;
  editedMediaUrl?: string | null;
  onUpdateMedia?: (rawUrl: string, editedUrl: string) => void;
}

export function R2MediaVault({
  clientId,
  clientName,
  rawMediaUrl = '',
  editedMediaUrl = '',
  onUpdateMedia
}: R2MediaVaultProps) {
  const [rawUrl, setRawUrl] = useState(rawMediaUrl || '');
  const [editedUrl, setEditedUrl] = useState(editedMediaUrl || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulateUpload = (type: 'raw' | 'edited') => {
    setIsUploading(true);
    toast.info(`Uploading ${type === 'raw' ? 'Raw Footage' : 'Edited Video'} to Cloudflare R2 Bucket...`);
    setTimeout(() => {
      const generatedUrl = `https://pub-r2.agency.com/clients/${clientId}/${type}/${Date.now()}_video.mp4`;
      if (type === 'raw') {
        setRawUrl(generatedUrl);
      } else {
        setEditedUrl(generatedUrl);
      }
      setIsUploading(false);
      toast.success(`Successfully uploaded to Cloudflare R2!`);
      if (onUpdateMedia) onUpdateMedia(type === 'raw' ? generatedUrl : rawUrl, type === 'edited' ? generatedUrl : editedUrl);
    }, 1200);
  };

  return (
    <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-6 select-none shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-indigo-600" /> Cloudflare R2 Storage & Asset Vault
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Client Media Path: <code className="text-indigo-600 font-mono">r2://agency-vault/clients/{clientId}/</code>
          </p>
        </div>
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] font-semibold">
          S3-Compatible API Ready
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Raw Footage Upload Box */}
        <div className="p-5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Video className="w-4 h-4 text-indigo-600" /> Raw Footage Upload
            </span>
            {rawUrl && <FileCheck className="w-4 h-4 text-emerald-600" />}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Upload unedited camera recordings directly for editors to download.
          </p>

          {rawUrl ? (
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between shadow-xs">
              <span className="truncate text-indigo-600 font-mono font-medium">{rawUrl}</span>
              <a href={rawUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-800 ml-2">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-2 hover:border-indigo-400 transition-colors bg-white">
              <Cloud className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Drag & drop raw MP4 / MOV files here</p>
              <Button
                onClick={() => handleSimulateUpload('raw')}
                disabled={isUploading}
                size="sm"
                variant="outline"
                className="border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Select File
              </Button>
            </div>
          )}
        </div>

        {/* Edited Video Final Assets Box */}
        <div className="p-5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Image className="w-4 h-4 text-purple-600" /> Edited Final Video / Captions
            </span>
            {editedUrl && <FileCheck className="w-4 h-4 text-emerald-600" />}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Upload finalized video files with captions and sound design ready for distribution.
          </p>

          {editedUrl ? (
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between shadow-xs">
              <span className="truncate text-purple-600 font-mono font-medium">{editedUrl}</span>
              <a href={editedUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-800 ml-2">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-2 hover:border-purple-400 transition-colors bg-white">
              <Cloud className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Drag & drop edited MP4 / 4K master files</p>
              <Button
                onClick={() => handleSimulateUpload('edited')}
                disabled={isUploading}
                size="sm"
                variant="outline"
                className="border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Select File
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
