// src/app/verify-age/page.tsx
// This page is shown by the middleware when bl_age_ok cookie is missing.
// It renders the AgeGate component in isolation (outside the (app) layout)
// so the background, fonts and orbs still look correct.
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AgeGate }   from '@/components/layout/NavBar';

export default function VerifyAgePage() {
  const router = useRouter();

  function handleVerify() {
    // Write the cookie so the middleware allows passage on next navigation
    document.cookie = 'bl_age_ok=1; max-age=31536000; path=/; samesite=lax';
    // Also store in localStorage for the AppContext hydration
    try { localStorage.setItem('bl_age_ok', 'true'); } catch {}
    router.replace('/home');
  }

  // If somehow someone arrives here already verified, redirect immediately
  useEffect(() => {
    if (document.cookie.includes('bl_age_ok=1')) router.replace('/home');
  }, [router]);

  return <AgeGate onVerify={handleVerify} />;
}
