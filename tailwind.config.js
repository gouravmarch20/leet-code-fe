/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        gradientMove: {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' },
        },
      },
      animation: {
        'gradient-once': 'gradientMove 3s ease-in-out forwards', // forwards keeps final state
      },
      backgroundSize: {
        '200': '200% 200%',
      },
    },
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography'),],
  daisyui: {
    themes: ["forest"]
  }
};

