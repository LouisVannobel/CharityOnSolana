/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontWeight: {
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    },
  },
  plugins: [],
}
