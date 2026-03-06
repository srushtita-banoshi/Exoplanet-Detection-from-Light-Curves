/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        space: { 950: '#030712', 900: '#0f172a', 800: '#1e293b' },
        cyan: { 400: '#22d3ee', 300: '#67e8f9' },
      },
      fontFamily: {
        orbitron: ['system-ui', 'sans-serif'],
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 4s linear infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '0%, 100%': { backgroundPosition: '0% center' }, '50%': { backgroundPosition: '100% center' } },
      },
    },
  },
  plugins: [],
};
