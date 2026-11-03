import type { Metadata } from 'next';
import { EncyclopediaPage } from '@/components/encyclopedia/EncyclopediaPage';

export const metadata: Metadata = { title: 'Enciclopedia' };
export default function Page() { return <EncyclopediaPage />; }
