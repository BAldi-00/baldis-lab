'use client';

import { useApp }    from '@/context/AppContext';
import { AuthModal } from './NavBar';

/** Overlays driven by context state, available on every (app) page. */
export function GlobalOverlays() {
  const { showAuth, closeAuth } = useApp();
  return showAuth ? <AuthModal onClose={closeAuth} /> : null;
}
