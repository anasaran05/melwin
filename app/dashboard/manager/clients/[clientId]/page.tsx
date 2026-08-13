'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { INITIAL_MOCK_CLIENTS, INITIAL_MOCK_BRAND_FOUNDATION, PIPELINE_STAGES } from '@/lib/supabase/smm-db';
import { R2MediaVault } from '@/components/dashboard/r2-media-vault';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  GitFork,
  Sparkles,
  BarChart3,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function ClientHubPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const client = INITIAL_MOCK_CLIENTS.find((c) => c.id === clientId) || INITIAL_MOCK_CLIENTS[0];
  const foundation = INITIAL_MOCK_BRAND_FOUNDATION[clientId] || INITIAL_MOCK_BRAND_FOUNDATION['a1b2c3d4-e5f6-7890-abcd-111111111111'];
  const stageObj = PIPELINE_STAGES.find((s) => s.id === client.current_stage);

  return (
    <div className="space-y-8 max-w-7xl mx-auto select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-gradient-to-r from-indigo-50 via-purple-50/50 to-white border border-indigo-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={client.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={client.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[10px] font-semibold">
                {client.company_name || 'Personal Brand Client'}
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] uppercase font-semibold">
                {client.status}
              </Badge>
            </div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              {client.name} Command Center
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Niche: <span className="text-slate-800 font-semibold">{client.niche}</span> • Target Audience: <span className="text-slate-800 font-semibold">{client.target_audience}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/manager/clients/${client.id}/onboarding`}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 py-2 px-4 shadow-md shadow-indigo-600/15">
              <FileText className="w-4 h-4" /> Open 9-Part Blueprint
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Navigation Cards to Subpages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href={`/dashboard/manager/clients/${client.id}/onboarding`}
          className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 hover:border-indigo-300 transition-all group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <FileText className="w-5 h-5 text-indigo-600" />
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">9-Part Brand Blueprint</h3>
          <p className="text-xs text-slate-500 font-medium">View or update questionnaire responses & 6 Content Pillars.</p>
        </Link>

        <Link
          href={`/dashboard/manager/clients/${client.id}/pipeline`}
          className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 hover:border-purple-300 transition-all group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <GitFork className="w-5 h-5 text-purple-600" />
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600">Client Pipeline</h3>
          <p className="text-xs text-slate-500 font-medium">Current Stage: <span className="text-purple-700 font-bold">{stageObj?.name}</span></p>
        </Link>

        <Link
          href={`/dashboard/manager/clients/${client.id}/content`}
          className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 hover:border-amber-300 transition-all group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600">Script AI Workshop</h3>
          <p className="text-xs text-slate-500 font-medium">Score scripts (0-100) & rewrite hooks with DeepSeek.</p>
        </Link>

        <Link
          href={`/dashboard/manager/clients/${client.id}/analytics`}
          className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 hover:border-emerald-300 transition-all group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600">Published Content Tracker</h3>
          <p className="text-xs text-slate-500 font-medium">Log reels, posted dates, video URLs & track manual views.</p>
        </Link>
      </div>

      {/* Synthesized Pillars Quick View */}
      {foundation.content_pillars && foundation.content_pillars.length > 0 && (
        <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Synthesized 6 Content Pillars
            </h3>
            <span className="text-xs text-indigo-600 font-bold font-mono">DeepSeek AI Generated</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {foundation.content_pillars.map((pillar, i) => (
              <div key={i} className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700">{pillar.title}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cloudflare R2 Media Vault */}
      <R2MediaVault
        clientId={client.id}
        clientName={client.name}
      />
    </div>
  );
}
