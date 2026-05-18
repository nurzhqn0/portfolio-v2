import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#20304f',
          navy: '#1f3a5f',
          accent: '#ff7a3d',
          neon: '#f6a94d',
          cyan: '#62b6cb',
          surface: '#fffaf1',
        },
        ink: '#20304f',
        paper: '#fff8ea',
        porcelain: '#fffdf8',
        clay: '#ff7a3d',
        moss: '#6f9f75',
        graphite: '#667085',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 70px rgba(90, 111, 132, 0.16)',
        glow: '0 18px 45px rgba(255, 122, 61, 0.18)',
        neon: '0 20px 55px rgba(98, 182, 203, 0.24)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,250,241,0.75) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
