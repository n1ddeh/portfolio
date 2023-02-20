/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      terminal: ['"Meslo"'],
    },
    backgroundColor: {
      'toolbar': '#696969'
    }
  },
  plugins: [],
}