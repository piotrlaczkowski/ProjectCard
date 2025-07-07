/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'roboto-slab': ['Roboto Slab', 'serif'],
        'space-mono': ['Space Mono', 'monospace'],
      }
    },
  },
  plugins: [],
} 