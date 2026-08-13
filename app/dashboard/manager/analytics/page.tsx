'use client';

import React from 'react';
import { AiAnalyticsReport } from '@/components/dashboard/ai-analytics-report';

export default function GlobalAnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <AiAnalyticsReport clientName="All Agency Clients" />
    </div>
  );
}
