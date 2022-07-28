/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      colors: {
        grab: '#00b14f',
        lineman: '#10c157',
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
