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
        orbitron: ['Orbitron', 'sans-serif'],
      },
      colors: {
        // Bonk-themed colors
        'bonk-orange': '#F59E0B',
        'bonk-yellow': '#FFD700',
        'bonk-brown': '#8B5C2A',
        'bonk-black': '#000000',
        'bonk-white': '#FFFFFF',
      },
      backgroundImage: {
        'solana-gradient': 'linear-gradient(90deg, #9945FF 0%, #14F195 100%)',
        'cosmic-gradient': 'linear-gradient(135deg, #0B1426 0%, #4338CA 50%, #EC4899 100%)',
        'space-nebula': 'radial-gradient(ellipse at 30% 20%, #6B46C133 0%, transparent 70%), radial-gradient(ellipse at 70% 80%, #EC489933 0%, transparent 70%), radial-gradient(ellipse at 50% 50%, #06B6D433 0%, transparent 70%)',
        'starfield': 'radial-gradient(2px 2px at 20px 30px, #F8FAFC, transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 90px 40px, #F8FAFC, transparent), radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent), radial-gradient(2px 2px at 160px 30px, #F8FAFC, transparent)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(11, 20, 38, 0.37)',
        'cosmic-glow': '0 0 20px 4px rgba(107, 70, 193, 0.5)',
        'stellar-glow': '0 0 16px 2px #6B46C1',
        'nebula-glow': '0 0 16px 2px #EC4899',
        'plasma-glow': '0 0 24px 4px #10B981',
        'bonk-pixel': '0 0 0 4px #F59E0B, 0 0 8px 2px #FFD700, 0 0 0 8px #8B5C2A',
        'bonk-glow': '0 0 16px 4px #F59E0B, 0 0 32px 8px #FFD700',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite alternate',
        'cosmic-drift': 'cosmic-drift 15s ease-in-out infinite',
        'stellar-pulse': 'stellar-pulse 4s ease-in-out infinite',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        'twinkle': {
          '0%': { opacity: '0.3', transform: 'scale(1)' },
          '100%': { opacity: '1', transform: 'scale(1.2)' },
        },
        'cosmic-drift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'stellar-pulse': {
          '0%': { boxShadow: '0 0 10px 2px rgba(107, 70, 193, 0.3)' },
          '50%': { boxShadow: '0 0 30px 8px rgba(107, 70, 193, 0.6), 0 0 60px 16px rgba(236, 72, 153, 0.3)' },
          '100%': { boxShadow: '0 0 10px 2px rgba(107, 70, 193, 0.3)' },
        },
      },
    },
  },
  plugins: [],
} 