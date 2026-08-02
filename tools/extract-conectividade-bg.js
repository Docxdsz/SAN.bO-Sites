// tools/extract-conectividade-bg.js
// One-time asset pipeline: resizes the client-provided gold palm-leaf texture
// (outside the repo, on the user's Desktop) into the conectividade section
// background image.
// Run: node extract-conectividade-bg.js
const path = require('path');
const sharp = require('sharp');

const SRC = 'C:\\Users\\Doc\\Desktop\\ReservaVereda\\BG-Dourado.jpg';
const OUT = path.resolve(__dirname, '../site/assets/images/conectividade-bg.jpg');

sharp(SRC)
  .resize({ width: 2400 })
  .jpeg({ quality: 82 })
  .toFile(OUT)
  .then((info) => console.log('wrote conectividade-bg.jpg', `${info.width}x${info.height}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
