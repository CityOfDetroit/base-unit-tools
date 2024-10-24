/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        "128": "50vh",
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}