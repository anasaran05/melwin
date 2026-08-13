'use client';

import React, { useState, useEffect } from 'react';
import { Client, PipelineStage } from '@/types/smm-dashboard';
import { INITIAL_MOCK_CLIENTS, fetchClientsFromSupabase, updateClientStageInSupabase } from '@/lib/supabase/smm-db';
import { PipelineBranchingBoard } from '@/components/dashboard/pipeline-branching-board';
import { ClientCreationModal } from '@/components/dashboard/client-creation-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  GitFork,
  TrendingUp,
  PlusCircle,
  Video
} from 'lucide-react';

export default function ManagerOverviewPage() {
  const [clients, setClients] = useState<Client[]>(INITIAL_MOCK_CLIENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadLiveData() {
      const liveClients = await fetchClientsFromSupabase();
      if (liveClients && liveClients.length > 0) {
        setClients(liveClients);
      }
    }
    loadLiveData();
  }, []);

  const handleClientCreated = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
  };

  const handleStageChange = async (clientId: string, newStage: PipelineStage) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, current_stage: newStage } : c))
    );
    await updateClientStageInSupabase(clientId, newStage);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto select-none">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-indigo-50 via-purple-50/50 to-white border border-indigo-100/80 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 font-semibold">
              Agency Operating System
            </Badge>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-semibold">
              Live Database Active
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Social Media Manager Command Center
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage your personal branding clients, 13-stage pipeline branching, AI script scoring, and R2 media vaults.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 py-2.5 px-4 shadow-md shadow-indigo-600/20 rounded-xl"
        >
          <PlusCircle className="w-4 h-4" /> Onboard New Client
        </Button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Active Clients</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{clients.length}</div>
          <div className="text-[10px] text-indigo-600 font-bold">Fully Managed Personal Brands</div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pipeline Stages Active</span>
            <GitFork className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-700">13 Stages</div>
          <div className="text-[10px] text-slate-500 font-medium">Research → AI Iteration</div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Weekly Video Output</span>
            <Video className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">18 Shorts</div>
          <div className="text-[10px] text-emerald-600 font-bold">94% AI Script Approval Rate</div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Avg 3s Retention</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">68.4%</div>
          <div className="text-[10px] text-emerald-600 font-bold">DeepSeek AI Tracked</div>
        </div>
      </div>

      {/* 13-Stage Pipeline Branching Board */}
      <PipelineBranchingBoard
        clients={clients}
        onStageChange={handleStageChange}
      />

      {/* Client Onboarding Modal */}
      <ClientCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
}
