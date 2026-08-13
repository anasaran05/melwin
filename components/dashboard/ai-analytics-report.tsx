'use client';

import React from 'react';
import { PublishedContentTracker } from './published-content-tracker';

export function AiAnalyticsReport({ clientName }: { clientName: string }) {
  return <PublishedContentTracker clientName={clientName} />;
}
