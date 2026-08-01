// tools/process-elleven-wax-seal.js
// The client's actual "Selo da Eleven" asset (circular wax-seal badge,
// "7º Produto Elleven Engenharia EM COTIA") is FwbHd8.png, referenced by
// name in the proposal docs for both the footer and the sticky corner
// badge. Produces two sizes from the same source.
// Run: node process-elleven-wax-seal.js
const path = require('path');
const sharp = require('sharp');

const SRC = 'C:\\Users\\Doc\\Desktop\\ReservaVereda\\FwbHd8.png';
const OUT_FOOTER = path.resolve(__dirname, '../site/assets/images/elleven-wax-seal-footer.png');
const OUT_STICKY = path.resolve(__dirname, '../site/assets/images/elleven-wax-seal-sticky.png');

Promise.all([
  sharp(SRC).resize({ height: 200 }).png({ quality: 90 }).toFile(OUT_FOOTER),
  sharp(SRC).resize({ height: 120 }).png({ quality: 90 }).toFile(OUT_STICKY),
])
  .then(() => console.log('wrote elleven-wax-seal-footer.png and elleven-wax-seal-sticky.png'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
