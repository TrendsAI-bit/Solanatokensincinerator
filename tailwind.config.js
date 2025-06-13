/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'fire-orange': '#FF4500',
        'fire-gold': '#FFD700',
        'ash-gray': '#1A1A1A',
        'dark-bg': '#0A0A0A',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-fire': 'pulse-fire 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'burn': 'burn 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-fire': {
          '0%, 100%': {
            transform: 'scale(1)',
            filter: 'brightness(100%)',
          },
          '50%': {
            transform: 'scale(1.05)',
            filter: 'brightness(120%)',
          },
        },
        glow: {
          '0%, 100%': {
            textShadow: '0 0 4px #FF4500, 0 0 12px #FF4500, 0 0 16px #FF4500',
          },
          '50%': {
            textShadow: '0 0 4px #FFD700, 0 0 12px #FFD700, 0 0 16px #FFD700',
          },
        },
        burn: {
          '0%': { filter: 'brightness(100%) hue-rotate(0deg)' },
          '50%': { filter: 'brightness(150%) hue-rotate(20deg)' },
          '100%': { filter: 'brightness(100%) hue-rotate(0deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 