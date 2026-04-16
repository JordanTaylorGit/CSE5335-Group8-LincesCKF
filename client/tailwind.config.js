/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ── Legacy tokens (kept so existing components don't break while updating) ──────────
        // ── TODO: Remove once all old values are removed from html and jsx files   ──────────        
        silk: {
          50: "#fdf8f4",
          100: "#f7ece0",
          200: "#edd5be",
          300: "#deb893",
          400: "#cc9465",
          500: "#bf7a45",
          600: "#b2643a",
          700: "#944e31",
          800: "#78402d",
          900: "#623628",
        },
        obsidian: {
          DEFAULT: "#0d0d0d",
          soft: "#1a1a1a",
          light: "#2e2e2e",
        },
        ivory: {
          DEFAULT: "#f9f4ee",
          warm: "#f2e9dc",
        },

        // ── New theme tokens ─────────────────────────────────────────────────
        // Below are the chosen colors, fonts, and animations for the website theme and CSS Values.
        // COLOR ROLES:
        //   silk-red   : #C8102E hero section BACKGROUND ONLY (never as text)
        //   silk-amber : #d4900a accent on white/light sections (eyebrows, prices, active states)
        //   silk-gold  : #ffae42 accent on dark navy sections (buttons, highlights)
        //   navy       : #0B2545 all body text and dark backgrounds
        //   sky-light  : #E8F4FD light subsection backgrounds
        //   sky-mid    : #B8D4E8 borders, dividers, icon strokes
        //
        // Usage examples:
        //   bg-silk-red          hero bg only
        //   text-silk-amber      eyebrow labels, prices, active navigation on white
        //   bg-silk-gold         CTA button on navy bg
        //   hover:bg-navy        button hover
        //   bg-sky-light         subsection bg
        //   border-sky-mid       card borders
        'silk-red': {
          DEFAULT: '#C8102E',   // hero background only
        },
        'silk-amber': {
          DEFAULT: '#d4900a',   // accent on white/light — readable warm gold
          light:   '#f0a800',   // lighter variant
          dark:    '#b37a00',   // darker pressed state
        },
        'silk-gold': {
          DEFAULT: '#ffae42',   // accent on dark navy sections
          hover:   '#ffb85a',   // hover state
        },
        navy: {
          DEFAULT: '#0B2545',
          light:   '#0F3060',
          dark:    '#071830',
        },
        sky: {
          light:   '#E8F4FD',
          mid:     '#B8D4E8',
          dark:    '#7AAECB',
        },
      },
 
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body:    ['"Jost"', 'sans-serif'],
        accent:  ['"Cinzel"', 'serif'],
      },
 
      spacing: {
        '18':  '4.5rem',
        '88':  '22rem',
        '128': '32rem',
      },
 
      animation: {
        'fade-up':      'fadeUp 0.6s ease forwards',
        'silk-shimmer': 'silkShimmer 3s ease-in-out infinite',
      },
 
      keyframes: {
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        silkShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};