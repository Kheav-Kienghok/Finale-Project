/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // manual control via html.dark
  content: ['./index.html', './src/**/*.{vue,js}'],
  plugins: [require('daisyui')], // keep or remove as you use
  // Optional daisyUI config if you use it:
  daisyui: {
    themes: ['light', 'dark'],
    darkTheme: 'dark',
  },
}
