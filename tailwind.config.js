/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#f1efea',
          title: '#9c9185',
          subtitle: '#8c8378',
          btnbg: '#6e6257',
          btnhov: '#544941',
          logo: '#651e38',
          placeholder: '#d3ccc4'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
        display: ['Fraunces', 'serif']
      },
    },
  },
  plugins: [],
}
