import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        // Fluid type via clamp() per spec §4.1
        'fluid-hero': 'clamp(2.4rem, 5vw, 4rem)',
        'fluid-quote': 'clamp(1.4rem, 3vw, 2rem)',
        'fluid-body': 'clamp(0.9rem, 1.5vw, 1.1rem)',
        'fluid-h2': 'clamp(1.6rem, 3.5vw, 2.4rem)',
        'fluid-h3': 'clamp(1.2rem, 2.5vw, 1.6rem)',
        'fluid-giant': 'clamp(2.8rem, 6vw, 5rem)',
      },
      colors: {
        cv: {
          // Surfaces (spec §4.2)
          cream: '#faf6f0',
          navy: '#1a2744',
          cinematic: '#2a2a2a',
          vault: '#162318',
          // Text
          charcoal: '#1a1a1a',
          'light-text': '#f0ece6',
          muted: '#6b6b6b',
          border: '#e8e4df',
          // Thread colors (spec §4.2 -- canonical)
          sage: '#7a9e7e',
          terracotta: '#c4724e',
          gold: '#d4a843',
          'soft-blue': '#5b8ba0',
          rose: '#c94c60',
          plum: '#6b4c6e',
          amber: '#b0884c',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
        'pulse-once': 'pulseOnce 2s ease-in-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseOnce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
      gridTemplateColumns: {
        // Asymmetric leader grid per spec §4.3
        'leaders': '1.2fr 0.8fr 1fr',
      },
      maxWidth: {
        'content': '1200px',
        'bleed': '1400px',
      },
    },
  },
  plugins: [],
};

export default config;
