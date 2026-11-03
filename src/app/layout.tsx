// src/app/layout.tsx — Root layout, loaded once for every route.
//
// Fonts are self-hosted through next/font (no render-blocking request to
// Google, no layout shift). The theme is applied by a tiny inline script
// before first paint, so a stored theme never flashes the default one.
import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['opsz', 'SOFT'],
  style: ['normal', 'italic'],
});

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://baldislab.com'),
  title: {
    default: "Baldi's Lab — Laboratorio di mixology",
    template: "%s | Baldi's Lab",
  },
  description: 'Il tuo laboratorio digitale di mixology. Simulatore cocktail, AI Bartender, 100 ricette professionali.',
  keywords: ['cocktail', 'mixology', 'ricette cocktail', 'AI bartender', 'simulatore cocktail'],
  authors: [{ name: "Baldi's Lab" }],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://baldislab.com',
    siteName: "Baldi's Lab",
    title: "Baldi's Lab — Laboratorio di mixology",
    description: '100 ricette, un simulatore realistico e un bartender AI.',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0f0d0b',
  width: 'device-width',
  initialScale: 1,
};

const THEME_BOOT = `try{var t=JSON.parse(localStorage.getItem('bl_theme')||'"night"');if(['night','day','summer','winter','halloween','christmas'].indexOf(t)>-1)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" data-theme="night" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
