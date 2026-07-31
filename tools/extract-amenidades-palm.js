// tools/extract-amenidades-palm.js
// One-time asset pipeline: recolors the brand-book's dark-page palm-frond
// texture (top third of .assets-src/page-08.jpg, same crop as the original
// palm-texture.jpg job in extract-assets.js, which was removed from the site
// for being too heavy) into a faint tinted linework PNG, alpha-mapped from
// the texture's own luminance so the ridges read as a subtle sheen instead
// of a flat photographic overlay. Used only behind #amenidades. TINT is a
// separate constant (not baked into the filename) because the section's
// background color - and therefore which tint actually shows up - has
// already changed once (gold on dark green, now dark on gold).
// Run: node extract-amenidades-palm.js
const path = require('path');
const sharp = require('sharp');

const SRC = path.resolve(__dirname, '../.assets-src/page-08.jpg');
const OUT = path.resolve(__dirname, '../site/assets/images/amenidades-palm-accent.png');

const TINT = { r: 11, g: 23, b: 18 }; // forest-950 #0B1712 - reads as ink lines on the section's gold bg
const MAX_ALPHA = 150; // out of 255 - ceiling only the brightest ridge highlights reach
const CURVE = 3; // higher = only true highlights survive, midtones/shadows fade to ~0

async function run() {
  const meta = await sharp(SRC).metadata();
  const cropHeight = Math.round(meta.height * 0.35);

  const { data, info } = await sharp(SRC)
    .extract({ left: 0, top: 0, width: meta.width, height: cropHeight })
    .resize({ width: 1600 })
    .greyscale()
    .normalize()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const lum = data[i] / 255;
    const alpha = Math.round(Math.pow(lum, CURVE) * MAX_ALPHA);
    rgba[i * 4] = TINT.r;
    rgba[i * 4 + 1] = TINT.g;
    rgba[i * 4 + 2] = TINT.b;
    rgba[i * 4 + 3] = alpha;
  }

  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(OUT);

  console.log('wrote', OUT, `${width}x${height}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
