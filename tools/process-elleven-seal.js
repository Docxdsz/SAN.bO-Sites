// tools/process-elleven-seal.js
// One-time resize: Elleven Engenharia logo, sourced from the client's brand
// asset (2053x769 RGBA PNG), down to a small badge suitable for a fixed
// on-screen seal. Run: node process-elleven-seal.js
const path = require('path');
const sharp = require('sharp');

const SRC = 'C:\\Users\\Doc\\Desktop\\ReservaVereda\\LOGO_ELLEVEN ENGENHARIA_PRINCIPAL.png';
const OUT = path.resolve(__dirname, '../site/assets/images/elleven-seal.png');

sharp(SRC)
  .resize({ height: 120 })
  .png({ quality: 90 })
  .toFile(OUT)
  .then(() => console.log('wrote elleven-seal.png'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
