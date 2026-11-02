// src/app/page.tsx — root → redirect to /home
import { redirect } from 'next/navigation';
export default function RootPage() { redirect('/home'); }
