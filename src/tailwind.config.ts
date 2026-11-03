// tailwind.config.ts
// Colours map to the CSS custom properties defined per theme in globals.css,
// so every utility (bg-surface, text-accent/60, …) follows the active theme.
import type { Config } from 'tailwindcss';

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans:    ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg:          token('bg'),
        'bg-2':      token('bg-2'),
        surface:     token('surface'),
        'surface-2': token('surface-2'),
        line:        token('line'),
        text:        token('text'),
        muted:       token('muted'),
        accent:      token('accent'),
        'accent-2':  token('accent-2'),
        'on-accent': token('on-accent'),
      },
    },
  },
  plugins: [],
};

export default config;
