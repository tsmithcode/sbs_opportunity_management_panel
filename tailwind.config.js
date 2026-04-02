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
          canvas: '#f4efe4',
          surface: '#fbf7ef',
          'surface-strong': '#fffdf8',
          'surface-soft': 'rgba(255, 252, 245, 0.88)',
          ink: '#182028',
          muted: '#55606d',
          line: '#c4baa7',
          accent: '#0a5f57',
          'accent-strong': '#083f3b',
          highlight: '#d0e7dd',
          review: '#f2dfb8',
          info: '#d7e4f9',
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"Avenir Next"', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        'brand-shadow': '0 18px 40px rgba(24, 32, 40, 0.08)',
      }
    },
  },
  plugins: [],
}
