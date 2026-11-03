import type { Metadata } from 'next';
import AIPage from '@/components/ai/AIPage';

export const metadata: Metadata = { title: 'AI Bartender' };
export default function Page() { return <AIPage />; }
