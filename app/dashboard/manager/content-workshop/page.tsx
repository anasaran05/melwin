'use client';

import React from 'react';
import { ScriptScorerWidget } from '@/components/dashboard/script-scorer-widget';

export default function GlobalContentWorkshopPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <ScriptScorerWidget
        initialTitle="Why 95% of Founders Fail at Personal Branding in 2026"
        initialHook="Stop hiring PR agencies that charge $10k/mo for vanity Forbes badges."
        initialScript={`[HOOK] Stop hiring PR agencies that charge $10k/mo for vanity Forbes badges. In 2026, buyers don't care about a press release. They care about authentic founder proof.

[BODY] Here is the 3-step engine we use to generate $50k in inbound deals:
1. Document raw failures before you celebrate wins.
2. Publish 3 video breakdowns a week showing exact code or sales metrics.
3. Call out industry fluff directly.

[CTA] Comment "BUILD" and I'll send you our 13-stage video script framework.`}
      />
    </div>
  );
}
