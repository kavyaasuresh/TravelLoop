/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        // Core palette — "Sunset Travel Journal"
        sage: {
          DEFAULT: '#C6D8AF',
          dark: '#a8c18c',
          light: '#dce8ce',
        },
        sand: {
          DEFAULT: '#DBD8B3',
          dark: '#c5c199',
          light: '#ebe9d4',
        },
        peach: {
          DEFAULT: '#FCC8B2',
          dark: '#f0b59c',
          light: '#fde4d8',
        },
        salmon: {
          DEFAULT: '#EFA48B',
          dark: '#df8d72',
          light: '#f5c4b3',
        },
        eggplant: {
          DEFAULT: '#685369',
          dark: '#4d3c4e',
          light: '#826d83',
          muted: '#9a8a9b',
        },

        // Semantic aliases
        primary: {
          DEFAULT: '#EFA48B',
          dark: '#df8d72',
        },
        success: {
          DEFAULT: '#C6D8AF',
          dark: '#a8c18c',
        },
        dark: {
          DEFAULT: '#685369',
          light: '#826d83',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'journal': '0 10px 40px rgba(104,83,105,0.12)',
        'journal-lg': '0 20px 60px rgba(104,83,105,0.18)',
        'journal-glow': '0 0 60px rgba(239,164,139,0.15)',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'grain': 'grain 8s steps(10) infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
