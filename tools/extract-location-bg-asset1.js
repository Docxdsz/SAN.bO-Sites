// tools/extract-location-bg-asset1.js
// Swap the #localizacao background to the client's "Asset 1@2x-100" location
// graphic. Source is a print-ready CMYK JPEG (1231x647) — must convert to
// sRGB or it renders with wrong/inverted colors in browsers. Native
// resolution is already small (1231px wide); do not upscale.
// Run: node extract-location-bg-asset1.js
const path = require('path');
const sharp = require('sharp');

const SRC = 'C:\\Users\\Doc\\Desktop\\ReservaVereda\\Asset 1@2x-100.jpg';
const OUT = path.resolve(__dirname, '../site/assets/images/location-bg.jpg');

sharp(SRC)
  .toColorspace('srgb')
  .jpeg({ quality: 88 })
  .toFile(OUT)
  .then(() => console.log('wrote location-bg.jpg'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
