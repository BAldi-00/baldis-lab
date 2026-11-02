// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['"Raleway"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Static reference palette — components mostly use inline theme
        // tokens from src/lib/themes.ts since themes are dynamic at runtime.
        // These Tailwind tokens are useful for static UI (buttons, badges)
        // that don't need to react to theme switching.
        gold:   { DEFAULT: '#C9A84C', soft: 'rgba(201,168,76,0.18)' },
        copper: '#B07340',
        night:  { bg: '#080810', surface: 'rgba(14,8,24,0.92)' },
        day:    { bg: '#fffbf5', surface: 'rgba(255,250,240,0.95)' },
      },
      borderRadius: {
        xs: '4px', sm: '8px', md: '14px', lg: '20px', xl: '28px',
      },
      animation: {
        'float-glass':  'floatGlass 4s ease-in-out infinite',
        'glow-pulse':   'glowPulse 1.2s ease-in-out infinite',
        'fade-slide-up':'fadeSlideUp 0.25s ease-out',
        shimmer:        'shimmer 2s linear infinite',
      },
      keyframes: {
        floatGlass: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-1deg)' },
          '50%':      { transform: 'translateY(-10px) rotate(1deg)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.85)' },
          '50%':      { opacity: '1',   transform: 'scale(1)' },
        },
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
