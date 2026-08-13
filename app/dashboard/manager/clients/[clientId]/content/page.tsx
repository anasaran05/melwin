'use client';

import React, { use } from 'react';
import { INITIAL_MOCK_CLIENTS, INITIAL_MOCK_CONTENT_ITEMS } from '@/lib/supabase/smm-db';
import { ScriptScorerWidget } from '@/components/dashboard/script-scorer-widget';

export default function ClientContentPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const client = INITIAL_MOCK_CLIENTS.find((c) => c.id === clientId) || INITIAL_MOCK_CLIENTS[0];
  const sampleContent = INITIAL_MOCK_CONTENT_ITEMS.find((item) => item.client_id === clientId) || INITIAL_MOCK_CONTENT_ITEMS[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <ScriptScorerWidget
        initialTitle={sampleContent.title}
        initialHook={sampleContent.angle_hook || ''}
        initialScript={sampleContent.script_body || ''}
        targetAudience={client.target_audience || 'Founders & Entrepreneurs'}
      />
    </div>
  );
}
