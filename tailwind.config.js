// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts}', // include .vue for class scanning
  ],
  darkMode: 'class', // manual toggle via <html class="dark">
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'], // or your custom list
  },
}
