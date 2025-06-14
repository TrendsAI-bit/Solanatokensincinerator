/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        futuristic: ['Orbitron', 'sans-serif'],
      },
      colors: {
        'fire-orange': '#FF6B35',
        'fire-gold': '#FFD700',
        'neon-orange': '#FF4500',
        'dark-bg': '#0A0A0A',
        'dark-card': '#1A1A1A',
        'ash-gray': '#2D2D2D',
        'solana-purple': '#9945FF',
        'solana-teal': '#14F195',
        'glass-dark': 'rgba(20, 20, 40, 0.7)',
      },
      backgroundImage: {
        'solana-gradient': 'linear-gradient(90deg, #9945FF 0%, #14F195 100%)',
        'cyberpunk': 'radial-gradient(ellipse at 80% 20%, #9945FF33 0%, transparent 70%), radial-gradient(ellipse at 20% 80%, #14F19533 0%, transparent 70%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'neon-purple': '0 0 16px 2px #9945FF',
        'neon-teal': '0 0 16px 2px #14F195',
        'glow-red': '0 0 24px 4px #ff003c',
      },
      animation: {
        'fire-flicker': 'fire-flicker 1.5s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'red-glow': 'red-glow 2s ease-in-out infinite alternate',
        'glitch': 'glitch 1s infinite linear alternate-reverse',
        'gradient-move': 'gradient-move 8s ease-in-out infinite',
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
        'red-glow': {
          '0%': { boxShadow: '0 0 10px 2px #ff003c, 0 0 40px 8px #ff003c33' },
          '100%': { boxShadow: '0 0 30px 8px #ff003c, 0 0 60px 16px #ff003c55' },
        },
        'glitch': {
          '0%': { textShadow: '2px 0 #9945FF, -2px 0 #14F195' },
          '20%': { textShadow: '-2px 0 #9945FF, 2px 0 #14F195' },
          '40%': { textShadow: '2px 2px #9945FF, -2px -2px #14F195' },
          '60%': { textShadow: '-2px 2px #9945FF, 2px -2px #14F195' },
          '80%': { textShadow: '2px 0 #9945FF, -2px 0 #14F195' },
          '100%': { textShadow: '0 0 #9945FF, 0 0 #14F195' },
        },
        'gradient-move': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
} 