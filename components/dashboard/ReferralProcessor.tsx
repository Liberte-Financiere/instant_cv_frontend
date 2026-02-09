'use client';

import { Suspense } from 'react';
import { useProcessReferral } from '@/hooks/useProcessReferral';

function ReferralProcessorContent() {
  useProcessReferral();
  return null;
}

export function ReferralProcessor() {
  return (
    <Suspense fallback={null}>
      <ReferralProcessorContent />
    </Suspense>
  );
}
