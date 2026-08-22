/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        gold: '#C5A059',
      },
      boxShadow: {
        gold: '0 0 30px rgba(197, 160, 89, 0.18)',
      },
    },
  },
  plugins: [],
};

