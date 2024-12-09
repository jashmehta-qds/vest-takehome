/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-light': 'rgba(242, 241, 240, 1)',
        'custom-light-gray': 'rgba(129, 129, 129, 1)',
        'custom-gray': 'rgba(174, 173, 173, 1)',
        'custom-dark': 'rgba(22, 21, 20, 1)',
        'custom-darker': 'rgba(26, 26, 26, 1)',
        'custom-darker-gray': 'rgba(66, 66, 66, 1)',
        'custom-darkest': 'rgba(15, 14, 12, 1)',
        'custom-darkest-gray': 'rgba(37, 37, 37, 1)',
        'salmon': 'rgba(255, 90, 68, 1)',
      }
    }
  },
  plugins: [],
}