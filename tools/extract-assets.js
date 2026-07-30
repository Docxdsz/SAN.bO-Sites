// tools/extract-assets.js
// One-time asset pipeline: crops the high-res page renders in .assets-src/
// into final web assets in site/assets/. Run: node extract-assets.js
const path = require('path');
const sharp = require('sharp');

const SRC = path.resolve(__dirname, '../.assets-src');
const OUT = path.resolve(__dirname, '../site/assets');

const jobs = [
  {
    src: 'page-06.jpg',
    out: 'images/hero-facade.jpg',
    crop: (w, h) => ({ left: 0, top: 0, width: w, height: Math.round(h * 0.783) }),
    resizeWidth: 2400,
    jpegQuality: 82,
  },
  {
    src: 'page-40.jpg',
    out: 'images/promise-garden.jpg',
    crop: (w, h) => {
      const left = Math.round(w * 0.213);
      return {
        left,
        top: 0,
        width: w - left,
        height: h,
      };
    },
    resizeWidth: 2000,
    jpegQuality: 82,
  },
  {
    src: 'page-08.jpg',
    out: 'images/palm-texture.jpg',
    crop: (w, h) => ({ left: 0, top: 0, width: w, height: Math.round(h * 0.35) }),
    resizeWidth: 1920,
    jpegQuality: 80,
  },
  {
    src: 'page-08.jpg',
    out: 'logo.png',
    crop: (w, h) => ({
      left: Math.round(w * 0.25),
      top: Math.round(h * 0.395),
      width: Math.round(w * 0.48),
      height: Math.round(h * 0.215),
    }),
    resizeWidth: 900,
    png: true,
  },
  {
    src: 'page-01.jpg',
    out: 'partners.png',
    crop: (w, h) => ({
      left: Math.round(w * 0.292),
      top: Math.round(h * 0.9212),
      width: Math.round(w * 0.406),
      height: Math.round(h * 0.0344),
    }),
    resizeWidth: 1400,
    png: true,
  },
];

async function run() {
  for (const job of jobs) {
    const inputPath = path.join(SRC, job.src);
    const meta = await sharp(inputPath).metadata();
    const box = job.crop(meta.width, meta.height);

    let pipeline = sharp(inputPath).extract(box).resize({ width: job.resizeWidth });
    pipeline = job.png
      ? pipeline.png({ compressionLevel: 9 })
      : pipeline.jpeg({ quality: job.jpegQuality });

    const outPath = path.join(OUT, job.out);
    await pipeline.toFile(outPath);
    console.log('wrote', job.out, `(${box.width}x${box.height} source crop)`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
