// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — App Group Layout
// src/app/(app)/layout.tsx
//
// Server component: the shell (nav, footer) and every page under (app)/ are
// rendered on the server and arrive as HTML, so content is visible before
// any JavaScript runs. Only the interactive islands hydrate on the client.
// The age gate is enforced by middleware via the bl_age_ok cookie.
// ─────────────────────────────────────────────────────────────────────────────

import { AppProvider }        from '@/context/AppContext';
import { NavBar, Footer }     from '@/components/layout/NavBar';
import { GlobalOverlays }     from '@/components/layout/GlobalOverlays';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <NavBar />
      <main className="relative min-h-[70vh] pt-16">{children}</main>
      <Footer />
      <GlobalOverlays />
    </AppProvider>
  );
}
