// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Design Tokens
// src/lib/themes.ts
// ─────────────────────────────────────────────────────────────────────────────

export type ThemeId = 'night' | 'day' | 'summer' | 'winter' | 'halloween' | 'christmas';

export interface Theme {
  id:         ThemeId;
  label:      string;
  bg:         string;
  surface:    string;
  border:     string;
  gold:       string;
  goldRgb:    string;
  goldSoft:   string;
  copper:     string;
  text:       string;
  textMuted:  string;
  textSub:    string;
  nav:        string;
  card:       string;
  input:      string;
  inpBdr:     string;
  tag:        string;
  glassStr:   string;
}

export const THEMES: Record<ThemeId, Theme> = {
  night: {
    id: 'night', label: '🌙 Night',
    bg:        'radial-gradient(ellipse at 18% 60%, #150b2a 0%, #080810 52%, #0a0e1e 100%)',
    surface:   'rgba(14,8,24,0.92)',
    border:    'rgba(201,168,76,0.16)',
    gold:      '#C9A84C', goldRgb: '201,168,76', goldSoft: 'rgba(201,168,76,0.18)',
    copper:    '#B07340',
    text:      '#F5EDD8', textMuted: 'rgba(245,237,216,0.50)', textSub: 'rgba(245,237,216,0.30)',
    nav:       'rgba(5,4,11,0.96)',
    card:      'rgba(12,7,22,0.88)',
    input:     'rgba(255,255,255,0.05)', inpBdr: 'rgba(201,168,76,0.25)',
    tag:       'rgba(201,168,76,0.12)',
    glassStr:  'rgba(255,255,255,0.40)',
  },
  day: {
    id: 'day', label: '☀️ Day',
    bg:        'radial-gradient(ellipse at 28% 20%, #fffbf5 0%, #f2e8d8 50%, #e4d4bc 100%)',
    surface:   'rgba(255,250,240,0.95)',
    border:    'rgba(140,96,28,0.18)',
    gold:      '#8A6518', goldRgb: '138,101,24', goldSoft: 'rgba(138,101,24,0.16)',
    copper:    '#8B4513',
    text:      '#1A1008', textMuted: 'rgba(26,16,8,0.55)', textSub: 'rgba(26,16,8,0.32)',
    nav:       'rgba(252,246,238,0.98)',
    card:      'rgba(255,252,244,0.94)',
    input:     'rgba(26,16,8,0.04)', inpBdr: 'rgba(138,101,24,0.22)',
    tag:       'rgba(138,101,24,0.10)',
    glassStr:  'rgba(50,30,10,0.32)',
  },
  summer: {
    id: 'summer', label: '🌅 Estate',
    bg:        'radial-gradient(ellipse at 50% 95%, #FF6B35 0%, #C4183C 20%, #0E0814 62%, #0A0E1E 100%)',
    surface:   'rgba(28,8,18,0.92)',
    border:    'rgba(255,140,60,0.2)',
    gold:      '#FFB347', goldRgb: '255,179,71', goldSoft: 'rgba(255,179,71,0.18)',
    copper:    '#FF6B35',
    text:      '#FFF5E0', textMuted: 'rgba(255,245,224,0.52)', textSub: 'rgba(255,245,224,0.30)',
    nav:       'rgba(10,5,10,0.97)',
    card:      'rgba(28,10,18,0.88)',
    input:     'rgba(255,179,71,0.05)', inpBdr: 'rgba(255,179,71,0.28)',
    tag:       'rgba(255,179,71,0.12)',
    glassStr:  'rgba(255,220,160,0.38)',
  },
  winter: {
    id: 'winter', label: '❄️ Inverno',
    bg:        'radial-gradient(ellipse at 50% 18%, #162235 0%, #070918 50%, #030810 100%)',
    surface:   'rgba(8,12,24,0.92)',
    border:    'rgba(168,216,240,0.16)',
    gold:      '#A8D8F0', goldRgb: '168,216,240', goldSoft: 'rgba(168,216,240,0.15)',
    copper:    '#7EC8E3',
    text:      '#E8F4F8', textMuted: 'rgba(232,244,248,0.52)', textSub: 'rgba(232,244,248,0.30)',
    nav:       'rgba(4,6,14,0.97)',
    card:      'rgba(8,12,22,0.90)',
    input:     'rgba(168,216,240,0.05)', inpBdr: 'rgba(168,216,240,0.22)',
    tag:       'rgba(168,216,240,0.10)',
    glassStr:  'rgba(200,230,255,0.40)',
  },
  halloween: {
    id: 'halloween', label: '🎃 Halloween',
    bg:        'radial-gradient(ellipse at 40% 60%, #2D0A3A 0%, #0F0510 55%, #180408 100%)',
    surface:   'rgba(20,5,28,0.92)',
    border:    'rgba(255,107,0,0.18)',
    gold:      '#FF6B00', goldRgb: '255,107,0', goldSoft: 'rgba(255,107,0,0.15)',
    copper:    '#CC2200',
    text:      '#FFE8D0', textMuted: 'rgba(255,232,208,0.52)', textSub: 'rgba(255,232,208,0.30)',
    nav:       'rgba(10,3,14,0.97)',
    card:      'rgba(18,5,24,0.88)',
    input:     'rgba(255,107,0,0.05)', inpBdr: 'rgba(255,107,0,0.22)',
    tag:       'rgba(255,107,0,0.12)',
    glassStr:  'rgba(255,200,150,0.35)',
  },
  christmas: {
    id: 'christmas', label: '🎄 Natale',
    bg:        'radial-gradient(ellipse at 30% 40%, #0D2018 0%, #050D0A 55%, #180808 100%)',
    surface:   'rgba(5,12,8,0.92)',
    border:    'rgba(255,215,0,0.18)',
    gold:      '#FFD700', goldRgb: '255,215,0', goldSoft: 'rgba(255,215,0,0.15)',
    copper:    '#CC0000',
    text:      '#FFF8E8', textMuted: 'rgba(255,248,232,0.52)', textSub: 'rgba(255,248,232,0.30)',
    nav:       'rgba(3,8,5,0.97)',
    card:      'rgba(5,12,8,0.90)',
    input:     'rgba(255,215,0,0.04)', inpBdr: 'rgba(255,215,0,0.20)',
    tag:       'rgba(255,215,0,0.10)',
    glassStr:  'rgba(255,230,150,0.35)',
  },
};

// Font stacks
export const FONTS = {
  display: '"Cormorant Garamond", Georgia, serif',
  ui:      '"Raleway", system-ui, sans-serif',
} as const;

// Spacing & radius
export const RADIUS = { xs: 4, sm: 8, md: 14, lg: 20, xl: 28, full: 9999 } as const;
export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 40, xxl: 64 } as const;
