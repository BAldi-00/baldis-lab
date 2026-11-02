// src/app/layout.tsx — Root layout, loaded once for every route.
// This is the ONLY content of this file. Page-specific code lives in its
// own real file under src/app/(app)/*, src/app/api/*, etc.
//
// FONT STRATEGY NOTE: every component in this project references fonts by
// their literal Google Fonts family name (e.g. `fontFamily: 'Cormorant
// Garamond, serif'`), not via a next/font CSS variable. So fonts are loaded
// here via a standard server-rendered <link> to the Google Fonts CSS2 API —
// this is the one approach that actually matches what ~40 component files
// already reference by name, with zero risk of fonts silently falling back
// to system serif/sans-serif.
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://baldislab.com'),
  title: {
    default: "Baldi's Lab — Premium Mixology Studio",
    template: '%s | Baldi\'s Lab',
  },
  description: 'Il tuo laboratorio digitale di mixology. Simulatore cocktail, AI Bartender, 100 ricette professionali.',
  keywords: ['cocktail', 'mixology', 'ricette cocktail', 'AI bartender', 'simulatore cocktail'],
  authors: [{ name: "Baldi's Lab" }],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://baldislab.com',
    siteName: "Baldi's Lab",
    title: "Baldi's Lab — Premium Mixology Studio",
    description: "Il laboratorio digitale di mixology più avanzato d'Italia.",
    images: [{ url: '/og/home.png', width: 1200, height: 630, alt: "Baldi's Lab" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Baldi's Lab",
    description: 'Premium Mixology Studio — AI Bartender + Cocktail Simulator',
    images: ['/og/home.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-32.png', sizes: '32x32' },
      { url: '/icons/icon-192.png', sizes: '192x192' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#C9A84C',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Raleway:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'Raleway, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
