/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        blue: {
          800: '#1e40af',
          900: '#1e3a8a',
        },
        green: {
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
        },
        red: {
          600: '#dc2626',
        },
        amber: {
          500: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
