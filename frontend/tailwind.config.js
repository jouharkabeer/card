/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#41287b',
          50: '#f5f3f9',
          100: '#ebe7f2',
          200: '#d6cfe5',
          300: '#b8a8d0',
          400: '#957cb6',
          500: '#7a5fa0',
          600: '#664d8b',
          700: '#564074',
          800: '#493763',
          900: '#3f3154',
          950: '#281c37',
        },
      },
    },
  },
  plugins: [],
}

