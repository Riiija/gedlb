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
        primary: {
          50:  '#eef1f8',
          100: '#d5dced',
          200: '#abbad9',
          300: '#8097c5',
          400: '#5674b1',
          500: '#324372',
          600: '#2b3a62',
          700: '#233051',
          800: '#1c2741',
          900: '#141d30',
          DEFAULT: '#324372',
        },
        secondary: {
          50:  '#faf8e8',
          100: '#f3f0cc',
          200: '#e8e19f',
          300: '#d8cc72',
          400: '#c5b54d',
          500: '#ADA660',
          600: '#938d4e',
          700: '#79743d',
          800: '#5f5b2d',
          900: '#45421d',
          DEFAULT: '#ADA660',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(50,67,114,0.08), 0 4px 16px rgba(50,67,114,0.06)',
        'card-hover': '0 4px 12px rgba(50,67,114,0.12), 0 8px 32px rgba(50,67,114,0.10)',
        'sidebar': '4px 0 24px rgba(20,29,48,0.25)',
      },
      backgroundImage: {
        'sidebar-gradient': 'linear-gradient(180deg, #1c2741 0%, #324372 60%, #2b3a62 100%)',
        'header-gradient': 'linear-gradient(90deg, #232f52 0%, #324372 60%, #3d5390 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease',
        'slide-in': 'slideIn 0.25s ease',
        'scan': 'scan 1.4s linear infinite',
        'pulse-slow': 'pulse 2s ease infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'none' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-8px)' }, to: { opacity: '1', transform: 'none' } },
        scan: { '0%': { top: '-4px' }, '100%': { top: 'calc(100% + 4px)' } },
      },
    },
  },
  plugins: [],
}
