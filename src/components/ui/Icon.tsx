// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Icon set (inline SVG, 24px grid, stroke-based)
// src/components/ui/Icon.tsx
// ─────────────────────────────────────────────────────────────────────────────

const PATHS = {
  search:   'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35',
  heart:    'M19.5 12.57 12 20l-7.5-7.43A5 5 0 1 1 12 6.01a5 5 0 1 1 7.5 6.56Z',
  star:     'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z',
  menu:     'M4 7h16M4 12h16M4 17h16',
  close:    'M6 6l12 12M18 6 6 18',
  arrow:    'M5 12h14m-6-6 6 6-6 6',
  back:     'M19 12H5m6 6-6-6 6-6',
  plus:     'M12 5v14M5 12h14',
  minus:    'M5 12h14',
  undo:     'M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
  reset:    'M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5',
  filter:   'M4 5h16M7 12h10M10 19h4',
  flask:    'M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3M7 15h10',
  glass:    'M5 4h14l-7 8-7-8Zm7 8v8m-4 0h8',
  book:     'M4 19.5V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2Zm0 0A2 2 0 0 0 6 22h14',
  sparkle:  'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Zm7 13 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z',
  cabinet:  'M4 3h16v18H4zM4 9h16M4 15h16M10 6h4M10 12h4M10 18h4',
  user:     'M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
  share:    'M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13',
  clock:    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2',
  drop:     'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z',
  fire:     'M12 22c4 0 7-2.7 7-6.8 0-4.2-3.4-6.6-4.2-10.2-2 1.4-3.1 3.6-3 5.6-1.3-.7-2.3-2-2.6-3.6C7 9 5 11.5 5 15.2 5 19.3 8 22 12 22Z',
  ice:      'M12 2v20M4 7l16 10M20 7 4 17',
  shake:    'M8 3h8l-1 4H9L8 3Zm1 4h6l2 14H7L9 7Z',
  stir:     'M15 3 9 21M17 3h-4',
  straw:    'M15 2l-2 6M6 8h12l-1.5 14h-9L6 8Z',
  check:    'm5 12 5 5L20 7',
  send:     'm4 12 16-8-6 16-2-7-8-1Z',
  sun:      'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-15v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  palette:  'M12 22a10 10 0 1 1 10-10c0 2.8-2.2 3-4 3h-1.5a1.5 1.5 0 0 0-1 2.6A2 2 0 0 1 14 21a10 10 0 0 1-2 1ZM7.5 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm4-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm5 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  logout:   'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l-5-5 5-5M5 12h12',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 18, className, fill = false }: {
  name: IconName; size?: number; className?: string; fill?: boolean;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true"
      fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name]} />
    </svg>
  );
}
