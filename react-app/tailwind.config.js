/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#bf5e3c',
        'secondary': '#c9d5ce',
        'muted': '#e8eee8',
        'foreground': '#1d2d2a',
        'card': '#f7faf6',
      }
    },
  },
  plugins: [],
}
