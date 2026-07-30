// js/tailwind-config.js
// Loaded after the Tailwind CDN <script> tag, before any page content.
// Shared by index.html and privacy.html — do not duplicate this config inline.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        forest: { 950: '#0B1712', 900: '#11221B', 800: '#172E23' },
        gold: { 400: '#CBA97A', 600: '#A9824F' },
        offwhite: '#F4F1E8',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
};
