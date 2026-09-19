import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#0a0a0a', accent: '#ff3b55', muted: '#a2a2aa' },
      fontFamily: { sans: ['Geist Variable', 'Arial', 'sans-serif'], mono: ['Geist Mono Variable', 'monospace'] },
      boxShadow: { glow: '0 0 80px -30px rgba(255,59,85,.45)' },
    },
  }, plugins: [],
} satisfies Config;
