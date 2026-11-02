// src/app/login/LoginPageClient.tsx

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { AuthModal } from '@/components/layout/NavBar';
import { THEMES } from '@/lib/themes';
import type { AuthUser } from '@/context/AppContext';

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect') ?? '/home';
  const error = searchParams.get('error');
  const t = THEMES.night;

  function handleLogin(_u: AuthUser) {
    // Real Supabase auth happens inside AuthModal's onLogin prop.
    // OAuth providers redirect through /auth/callback.
    router.replace(redirect);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        background:
          'radial-gradient(ellipse at 18% 60%, #150b2a 0%, #08080f 52%, #0a0e1e 100%)',
      }}
    >
      {error && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,107,107,0.12)',
            border: '1px solid rgba(255,107,107,0.4)',
            color: '#FF6B6B',
            fontFamily: 'Raleway, sans-serif',
            fontSize: 13,
            padding: '10px 20px',
            borderRadius: 8,
            zIndex: 999,
            whiteSpace: 'nowrap',
          }}
        >
          ⚠ Errore di autenticazione: {decodeURIComponent(error)}
        </div>
      )}

      <AuthModal
        t={t}
        theme="night"
        onClose={() => router.back()}
        onLogin={handleLogin}
      />
    </div>
  );
}
