/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
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
  safelist: [
    // Border radius classes
    'rounded-none',
    'rounded-sm', 
    'rounded',
    'rounded-md',
    'rounded-lg',
    'rounded-xl',
    'rounded-2xl',
    'rounded-3xl',
    'rounded-full',
    // Other dynamic classes that might be missed
    'rounded-r-lg',
  ],
} 