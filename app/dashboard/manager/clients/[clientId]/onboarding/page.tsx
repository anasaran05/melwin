'use client';

import React, { use, useState } from 'react';
import { INITIAL_MOCK_CLIENTS, INITIAL_MOCK_BRAND_FOUNDATION } from '@/lib/supabase/smm-db';
import { QuestionnaireStepper } from '@/components/dashboard/questionnaire-stepper';
import { BrandFoundation } from '@/types/smm-dashboard';
import { toast } from 'sonner';

export default function ClientOnboardingPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const client = INITIAL_MOCK_CLIENTS.find((c) => c.id === clientId) || INITIAL_MOCK_CLIENTS[0];
  const initialFoundation = INITIAL_MOCK_BRAND_FOUNDATION[clientId] || INITIAL_MOCK_BRAND_FOUNDATION['client-101'];
  const [foundationData, setFoundationData] = useState<BrandFoundation>(initialFoundation);

  const handleSaveFoundation = (updated: BrandFoundation) => {
    setFoundationData(updated);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <QuestionnaireStepper
        initialData={foundationData}
        clientName={client.name}
        onSave={handleSaveFoundation}
      />
    </div>
  );
}
