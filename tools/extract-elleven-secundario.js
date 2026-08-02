// tools/extract-elleven-secundario.js
// One-time asset pipeline: resizes the client-provided secondary Elleven
// Engenharia wordmark (white/orange, for dark backgrounds) into the footer
// logo image, replacing the wax-seal badge used there previously.
// Run: node extract-elleven-secundario.js
const path = require('path');
const sharp = require('sharp');

const SRC = 'C:\\Users\\Doc\\Desktop\\ReservaVereda\\LOGO_ELLEVEN ENGENHARIA_SECUNDÁRIO.png';
const OUT = path.resolve(__dirname, '../site/assets/images/elleven-logo-secundario.png');

sharp(SRC)
  .resize({ height: 240 })
  .png()
  .toFile(OUT)
  .then((info) => console.log('wrote elleven-logo-secundario.png', `${info.width}x${info.height}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
