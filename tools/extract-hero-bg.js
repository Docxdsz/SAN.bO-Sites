// tools/extract-hero-bg.js
// One-time asset pipeline: resizes the client-provided Deck Seco render
// (outside the repo, on the user's Desktop - same source already used for
// gallery-deck.jpg) into the hero background image. Supersedes
// extract-assets.js's original hero-facade.jpg job (a brand-book page
// render); this replaces it with a real, higher-quality client render.
// Run: node extract-hero-bg.js
const path = require('path');
const sharp = require('sharp');

const SRC = 'C:\\Users\\Doc\\Desktop\\ReservaVereda\\San_Bo_Vila_Coty_Deck_Seco_R01.jpg';
const OUT = path.resolve(__dirname, '../site/assets/images/hero-facade.jpg');

sharp(SRC)
  .resize({ width: 2400 })
  .jpeg({ quality: 82 })
  .toFile(OUT)
  .then((info) => console.log('wrote hero-facade.jpg from Deck Seco render', `${info.width}x${info.height}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
