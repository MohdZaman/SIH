/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#000000',
          navy: '#0A0A0A',
          grid: '#171717',
          card: '#0C0C0C',
          input: '#171717',
          blue: '#059669', // Emerald-600 as primary brand
          'blue-hover': '#047857', // Emerald-700
          light: '#F8FAFC',
          sidebar: '#000000',
          activeTab: '#171717',
          border: '#E5E5E5',
          slate: '#737373',
          muted: '#A3A3A3',
          emerald: '#059669',
          amber: '#059669',
          rose: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}