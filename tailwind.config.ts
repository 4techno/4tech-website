import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#111111',
        cloud: '#EDEDED',
        ash: '#B5B5B5',
        iron: '#555555',
        silver: '#CCCCCC',
        ember: '#FC6B2F',
        'ember-bright': '#FF7A3D',
        'ember-dark': '#A02A22',
        // legacy
        ink: '#0a0a0a',
        accent: '#ff3b55',
        muted: '#a2a2aa',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Arial', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'Arial', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
        josefin: ['var(--font-josefin)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Geist Mono Variable', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'reveal-up': 'reveal-up 2s ease-in-out infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'reveal-up': {
          '0%': { transform: 'translateY(100%)' },
          '50%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      boxShadow: {
        glow: '0 0 80px -30px rgba(255,59,85,.45)',
        ember: '0 0 25px rgba(160,42,34,0.4)',
        'ember-lg': '0 0 50px rgba(252,107,47,0.3)',
        glass: '0 20px 60px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.25), inset 0 0 24px rgba(255,255,255,0.03)',
        'glass-sm': '0 15px 35px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)',
      },
      backgroundImage: {
        'noise': `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [],
} satisfies Config;
