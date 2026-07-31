// tools/extract-amenidades-bg.js
// One-time crop: side image for the #amenidades column, sourced from the
// same client-provided deck render used in the gallery (just resized, no
// forced aspect - object-cover handles final framing responsively).
// Run: node extract-amenidades-bg.js
const path = require('path');
const sharp = require('sharp');

const SRC = 'C:\\Users\\Doc\\Desktop\\ReservaVereda\\San_Bo_Vila_Coty_Deck_Seco_R01.jpg';
const OUT = path.resolve(__dirname, '../site/assets/images/amenidades-bg.jpg');

sharp(SRC)
  .resize({ width: 1400 })
  .jpeg({ quality: 82 })
  .toFile(OUT)
  .then(() => console.log('wrote amenidades-bg.jpg'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
