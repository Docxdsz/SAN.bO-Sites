// tools/extract-location-bg.js
// One-time crop: wide background image for the #localizacao section, sourced
// from the same client-provided render used in the gallery (different crop,
// full width, no 4:3 forcing) so the section isn't just a flat color block.
// Run: node extract-location-bg.js
const path = require('path');
const sharp = require('sharp');

const SRC = 'C:\\Users\\Doc\\Desktop\\ReservaVereda\\San_Bo_Vila_Coty_Mirante_R02.jpg';
const OUT = path.resolve(__dirname, '../site/assets/images/location-bg.jpg');

sharp(SRC)
  .resize({ width: 2200 })
  .jpeg({ quality: 80 })
  .toFile(OUT)
  .then(() => console.log('wrote location-bg.jpg'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
