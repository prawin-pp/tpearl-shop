/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        cash: '#3f83f8',
        promptpay: '#003c6a',
        grab: '#00b14f',
        lineman: '#0ec963',
        robinhood: '#cf1e9e',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
