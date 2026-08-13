'use client';

import React, { useState } from 'react';
import { INITIAL_MOCK_CLIENTS } from '@/lib/supabase/smm-db';
import { PipelineBranchingBoard } from '@/components/dashboard/pipeline-branching-board';
import { Client, PipelineStage } from '@/types/smm-dashboard';

export default function GlobalPipelinePage() {
  const [clients, setClients] = useState<Client[]>(INITIAL_MOCK_CLIENTS);

  const handleStageChange = (clientId: string, newStage: PipelineStage) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, current_stage: newStage } : c))
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PipelineBranchingBoard clients={clients} onStageChange={handleStageChange} />
    </div>
  );
}
