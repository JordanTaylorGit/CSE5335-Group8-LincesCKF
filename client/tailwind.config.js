/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        silk: {
          50:  '#fdf8f4',
          100: '#f7ece0',
          200: '#edd5be',
          300: '#deb893',
          400: '#cc9465',
          500: '#bf7a45',
          600: '#b2643a',
          700: '#944e31',
          800: '#78402d',
          900: '#623628',
        },
        obsidian: {
          DEFAULT: '#0d0d0d',
          soft: '#1a1a1a',
          light: '#2e2e2e',
        },
        ivory: {
          DEFAULT: '#f9f4ee',
          warm: '#f2e9dc',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Jost"', 'sans-serif'],
        accent: ['"Cinzel"', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'silk-shimmer': 'silkShimmer 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        silkShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
