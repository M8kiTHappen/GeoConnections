/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['"IM Fell English"', 'serif'],
      },
      colors: {
        parchment: {
          DEFAULT: '#f0deb4',
          tile:    '#d6c090',
          hover:   '#c8ae7a',
          dark:    '#b89a60',
        },
        ink: {
          DEFAULT:  '#2c1a0e',
          light:    '#5c3d20',
          faded:    '#8a6845',
        },
        // Category banner colours — aged map palette
        'map-ochre': {
          DEFAULT: '#b8942e',   // aged gold / yellow
          text:    '#3d2800',
        },
        'map-olive': {
          DEFAULT: '#546b38',   // terrain green
          text:    '#eef4e0',
        },
        'map-sea': {
          DEFAULT: '#2e5c7a',   // ocean blue (old atlas style)
          text:    '#ddeef8',
        },
        'map-mauve': {
          DEFAULT: '#5e3470',   // faded purple ink
          text:    '#f4eafc',
        },
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-6px)' },
          '40%':      { transform: 'translateX(6px)' },
          '60%':      { transform: 'translateX(-4px)' },
          '80%':      { transform: 'translateX(4px)' },
        },
        pop: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shake:     'shake 0.4s ease-in-out',
        pop:       'pop 0.2s ease-in-out',
        slideDown: 'slideDown 0.35s ease-out',
      },
    },
  },
  plugins: [],
}
