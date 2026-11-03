import type { Metadata } from 'next';
import { CabinetPage } from '@/components/cabinet/CabinetPage';

export const metadata: Metadata = { title: 'Il mio bar' };
export default function Page() { return <CabinetPage />; }
