/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#f8f9ff',
        surface: '#ffffff',
        primary: '#4f46e5', 
        success: '#16a34a', 
        warning: '#f59e0b', 
        danger: '#dc2626', 
      }
    },
  },
  plugins: [],
}
