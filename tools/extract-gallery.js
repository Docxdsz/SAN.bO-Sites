// tools/extract-gallery.js
// One-time asset pipeline: crops the client-provided render photos (outside
// the repo, on the user's Desktop) into a uniform 4:3 gallery set in
// site/assets/images/. Run: node extract-gallery.js
const path = require('path');
const sharp = require('sharp');

const SRC = 'C:\\Users\\Doc\\Desktop\\ReservaVereda';
const OUT = path.resolve(__dirname, '../site/assets/images');

const jobs = [
  { src: 'San_Bo_Vila_Coty_Voo_Piscina_R00.jpg', out: 'gallery-piscina.jpg' },
  { src: 'San_Bo_Vila_Coty_Deck_Seco_R01.jpg', out: 'gallery-deck.jpg' },
  { src: 'San_Bo_Vila_Coty_Mirante_R02.jpg', out: 'gallery-mirante.jpg' },
];

const WIDTH = 1000;
const HEIGHT = 750; // 4:3

async function run() {
  for (const job of jobs) {
    const inputPath = path.join(SRC, job.src);
    const outPath = path.join(OUT, job.out);
    await sharp(inputPath)
      .resize({ width: WIDTH, height: HEIGHT, fit: 'cover', position: 'centre' })
      .jpeg({ quality: 82 })
      .toFile(outPath);
    console.log('wrote', job.out, `(${WIDTH}x${HEIGHT})`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
