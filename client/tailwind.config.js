/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f3',
          100: '#fce8e6',
          200: '#f9d4d1',
          300: '#f4b3ad',
          400: '#ec877e',
          500: '#e05d52',
          600: '#cc4035',
          700: '#ab332a',
          800: '#8e2d26',
          900: '#762c26',
        },
        warm: {
          50: '#fefbf3',
          100: '#fdf5e1',
          200: '#fae8c2',
          300: '#f6d599',
          400: '#f1bb5e',
          500: '#eca63a',
          600: '#dd8d2a',
          700: '#b86e24',
          800: '#935724',
          900: '#784821',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
