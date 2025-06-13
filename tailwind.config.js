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
        'fire-orange': '#FF6B35',
        'fire-gold': '#FFD700',
        'neon-orange': '#FF4500',
        'dark-bg': '#0A0A0A',
        'dark-card': '#1A1A1A',
        'ash-gray': '#2D2D2D',
      },
      animation: {
        'fire-flicker': 'fire-flicker 1.5s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'fire-flicker': {
          '0%': { opacity: '0.8', transform: 'scale(1)' },
          '100%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 107, 53, 0.8)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
} 