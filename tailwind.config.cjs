/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      keyframes: {
        'share-appear': {
          to: { transform: 'translate(0, -30%)', opacity: '1' },
        },
      },
      animation: {
        'share-enter': 'share-appear 0.3s 2.55s forwards',
        'resume-enter': 'share-appear 0.3s 2.5s forwards',
        'not-found-home-enter': 'share-appear 0.3s 1s forwards',
      },
    },
  },
  plugins: [],
};
