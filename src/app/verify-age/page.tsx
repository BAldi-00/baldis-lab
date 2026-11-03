// src/app/verify-age/page.tsx
// Shown by the middleware when the bl_age_ok cookie is missing.
'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AgeGate } from '@/components/layout/NavBar';

function Gate() {
  const router = useRouter();
  const next = useSearchParams().get('next');

  function handleVerify() {
    document.cookie = 'bl_age_ok=1; max-age=31536000; path=/; samesite=lax';
    // Only allow same-site relative redirects
    router.replace(next && next.startsWith('/') && !next.startsWith('//') ? next : '/home');
  }

  return <AgeGate onVerify={handleVerify} />;
}

export default function VerifyAgePage() {
  return <Suspense fallback={null}><Gate /></Suspense>;
}
