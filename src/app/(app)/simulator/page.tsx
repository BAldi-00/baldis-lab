import { Suspense } from 'react';
import type { Metadata } from 'next';
import SimulatorPage from '@/components/simulator/SimulatorPage';

export const metadata: Metadata = { title: 'Laboratorio — simulatore cocktail' };

export default function Page() {
  return <Suspense fallback={<div className="min-h-screen" />}><SimulatorPage /></Suspense>;
}
