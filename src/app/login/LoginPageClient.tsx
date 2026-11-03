// src/app/login/LoginPageClient.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppProvider, useApp } from '@/context/AppContext';
import { AuthModal } from '@/components/layout/NavBar';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useApp();
  const redirect = params.get('redirect');
  const error = params.get('error');
  const target = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/home';

  useEffect(() => { if (user) router.replace(target); }, [user, router, target]);

  return (
    <div className="min-h-screen">
      {error && (
        <div className="fixed left-1/2 top-5 z-[60] -translate-x-1/2 rounded-full border border-accent-2/40 bg-surface px-5 py-2 text-sm text-accent-2">
          Errore di autenticazione: {decodeURIComponent(error)}
        </div>
      )}
      <AuthModal onClose={() => router.push(target)} />
    </div>
  );
}

export default function LoginPageClient() {
  return <AppProvider><LoginInner /></AppProvider>;
}
