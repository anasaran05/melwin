'use client';

import React, { use } from 'react';
import { INITIAL_MOCK_CLIENTS } from '@/lib/supabase/smm-db';
import { AiAnalyticsReport } from '@/components/dashboard/ai-analytics-report';

export default function ClientAnalyticsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const client = INITIAL_MOCK_CLIENTS.find((c) => c.id === clientId) || INITIAL_MOCK_CLIENTS[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <AiAnalyticsReport clientName={client.name} />
    </div>
  );
}
