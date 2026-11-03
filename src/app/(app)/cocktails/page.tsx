import { Suspense } from 'react';
import type { Metadata } from 'next';
import LibraryPage from '@/components/library/LibraryPage';

export const metadata: Metadata = { title: 'Cocktail — tutte le ricette' };

export default function Page() {
  return <Suspense fallback={<div className="min-h-screen" />}><LibraryPage /></Suspense>;
}
