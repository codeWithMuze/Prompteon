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
          DEFAULT: '#10b981',
          glow: 'rgba(16, 185, 129, 0.2)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;