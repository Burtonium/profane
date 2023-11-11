/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,tsx}"],
  theme: {
    fontFamily: {
      'brand': ['Oswald', 'sans-serif'],
      'title': ['Roboto Condensed', 'sans-serif'],
      'sans': ['Quicksand', 'sans-serif']
    },
    extend: {
      colors: {
        'error': '#ef4444',
        'muted': '#cbd5e1',
        'primary': '#f59042',
        'primary-light': '#f9b886',
        'primary-dark': '#f2700d'
      },
    },
  },
  plugins: [],
};
