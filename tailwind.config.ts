import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zinc: { 950: '#09090b' },
        forge: {
          DEFAULT: '#588157', // tactical-500
          glow: 'rgba(88, 129, 87, 0.2)'
        },
        tactical: {
          50: '#f4f6f0',
          100: '#e5e9de',
          200: '#dad7cd', // Bone
          300: '#b4c09d',
          400: '#a3b18a', // Sage
          500: '#588157', // Hunter
          600: '#466b47',
          700: '#3a5a40',
          800: '#344e41', // Deep Olive (User Request)
          900: '#263a2f',
          950: '#1a2820',
        }
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;