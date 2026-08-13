'use client';

import React, { use, useState } from 'react';
import { INITIAL_MOCK_CLIENTS } from '@/lib/supabase/smm-db';
import { PipelineBranchingBoard } from '@/components/dashboard/pipeline-branching-board';
import { PipelineStage } from '@/types/smm-dashboard';

export default function SingleClientPipelinePage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const initialClient = INITIAL_MOCK_CLIENTS.find((c) => c.id === clientId) || INITIAL_MOCK_CLIENTS[0];
  const [clientList, setClientList] = useState([initialClient]);

  const handleStageChange = (id: string, newStage: PipelineStage) => {
    setClientList((prev) => prev.map((c) => (c.id === id ? { ...c, current_stage: newStage } : c)));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PipelineBranchingBoard
        clients={clientList}
        onStageChange={handleStageChange}
      />
    </div>
  );
}
