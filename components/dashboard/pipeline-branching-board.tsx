'use client';

import React, { useState } from 'react';
import { Client, ContentItem, PipelineStage } from '@/types/smm-dashboard';
import { PIPELINE_STAGES } from '@/lib/supabase/smm-db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  GitFork,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface PipelineBranchingBoardProps {
  clients: Client[];
  contentItems?: ContentItem[];
  onStageChange?: (clientId: string, newStage: PipelineStage) => void;
}

export function PipelineBranchingBoard({ clients, contentItems = [], onStageChange }: PipelineBranchingBoardProps) {
  const [selectedStage, setSelectedStage] = useState<PipelineStage | 'all'>('all');

  const getStageCount = (stageId: PipelineStage) => {
    return clients.filter((c) => c.current_stage === stageId).length;
  };

  const handleAdvanceStage = (client: Client) => {
    const currentIndex = PIPELINE_STAGES.findIndex((s) => s.id === client.current_stage);
    if (currentIndex < PIPELINE_STAGES.length - 1) {
      const nextStage = PIPELINE_STAGES[currentIndex + 1].id;
      if (onStageChange) onStageChange(client.id, nextStage);
      toast.success(`${client.name} moved to stage ${PIPELINE_STAGES[currentIndex + 1].name}`);
    }
  };

  const filteredClients = selectedStage === 'all'
    ? clients
    : clients.filter((c) => c.current_stage === selectedStage);

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-indigo-50 via-purple-50/40 to-white border border-indigo-100/80 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GitFork className="w-5 h-5 text-indigo-600" /> 13-Stage Pipeline Branching & Stage Manager
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Track client progress from initial Research to AI Feedback Iteration.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 py-1 font-semibold">
            {clients.length} Active Agency Clients
          </Badge>
        </div>
      </div>

      {/* 13 Pipeline Branch Nodes Horizontal Scrollbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        <button
          onClick={() => setSelectedStage('all')}
          className={`px-3 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedStage === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          All Stages ({clients.length})
        </button>
        {PIPELINE_STAGES.map((stg) => {
          const count = getStageCount(stg.id);
          const isSelected = selectedStage === stg.id;
          return (
            <button
              key={stg.id}
              onClick={() => setSelectedStage(stg.id)}
              className={`px-3 py-2 rounded-xl border text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold shadow-xs'
                  : count > 0
                  ? 'bg-white border-slate-200 text-slate-800 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <span>{stg.name}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${count > 0 ? 'bg-indigo-100 text-indigo-700 font-bold' : 'bg-slate-200 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Client Pipeline Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
          const stageIndex = PIPELINE_STAGES.findIndex((s) => s.id === client.current_stage);
          const progressPercent = Math.round(((stageIndex + 1) / PIPELINE_STAGES.length) * 100);
          const currentStageObj = PIPELINE_STAGES[stageIndex];

          return (
            <div
              key={client.id}
              className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-4 hover:border-indigo-300 transition-all group shadow-sm hover:shadow-md"
            >
              {/* Top Client Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {client.avatar_url ? (
                    <img
                      src={client.avatar_url}
                      alt={client.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center border border-indigo-200 text-sm">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {client.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{client.company_name || client.niche}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 capitalize text-[10px] font-semibold">
                  {client.status}
                </Badge>
              </div>

              {/* Current Stage Indicator */}
              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Current Stage
                  </span>
                  <span className="text-[11px] font-bold text-indigo-600">
                    Step {stageIndex + 1} of 13 ({progressPercent}%)
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {currentStageObj.name}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">{currentStageObj.description}</p>
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <a
                  href={`/dashboard/manager/clients/${client.id}`}
                  className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-semibold"
                >
                  View Client Hub <ChevronRight className="w-3.5 h-3.5" />
                </a>
                <Button
                  onClick={() => handleAdvanceStage(client)}
                  disabled={stageIndex === PIPELINE_STAGES.length - 1}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-1 px-3 h-8 flex items-center gap-1 shadow-sm shadow-indigo-600/15"
                >
                  Advance Stage <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
