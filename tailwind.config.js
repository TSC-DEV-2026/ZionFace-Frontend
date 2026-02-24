/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        void: '#080B10',
        surface: '#0D1117',
        panel: '#111827',
        border: '#1F2937',
        accent: '#00F5A0',
        'accent-dim': '#00C47F',
        'accent-glow': 'rgba(0, 245, 160, 0.15)',
        warn: '#F59E0B',
        danger: '#EF4444',
        'danger-glow': 'rgba(239, 68, 68, 0.15)',
        muted: '#4B5563',
        subtle: '#9CA3AF',
        text: '#E5E7EB',
      },
      boxShadow: {
        glow: '0 0 30px rgba(0, 245, 160, 0.2), 0 0 60px rgba(0, 245, 160, 0.05)',
        'glow-sm': '0 0 15px rgba(0, 245, 160, 0.15)',
        'danger-glow': '0 0 30px rgba(239, 68, 68, 0.2)',
        card: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 4s linear infinite',
        scan: 'scan 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(100%)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
