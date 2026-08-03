// tools/extract-track-record.js
// One-time extraction of project photos from the Elleven track-record
// infographic (single-page PDF, rendered at 300dpi to hires-1.jpg,
// 9154x2625). The PDF has no machine-readable layout grid, so photos are
// cropped by visually inspecting 5 overlapping "region" cutouts (each
// covering 2-5 projects) and specifying each photo's box as a fraction of
// its region. Run: node extract-track-record.js
const path = require('path');
const sharp = require('sharp');

const HIRES = path.resolve(__dirname, '_track-hires/hires-1.jpg');
const OUT_DIR = path.resolve(__dirname, '../site/assets/images/track');
const REGION_DIR = path.resolve(__dirname, '_track-hires');

// [name, left, width] in original hires-1.jpg pixel space (height is always full, 0-2625).
// left/width were corrected during Step 3/4 visual inspection: the first-pass
// region-c/d/e boundaries clipped the left edge of Le Mont 2, Magnifique, and
// Reserva Vereda's photos respectively (confirmed with targeted diagnostic
// crops straddling each region boundary), so those regions were shifted left
// and widened to fully contain every photo.
const REGIONS = [
  ['region-a', 0, 1560],       // Botanique
  ['region-b', 1300, 2100],    // Vert, Essence, Grand Parc, Le Mont
  ['region-c', 3300, 2150],    // Le Mont 2, Mont Royal, GrandClub, Quartier
  ['region-d', 5150, 2150],    // Magnifique, Althea, Icaraí, Carapicuíba
  ['region-e', 7100, 2054],    // Reserva Vereda, Style Um, Alma da Mata, Águas do Cerrado
];

async function makeRegions() {
  for (const [name, left, width] of REGIONS) {
    await sharp(HIRES)
      .extract({ left, top: 0, width, height: 2625 })
      .toFile(path.join(REGION_DIR, `${name}.jpg`));
    console.log('wrote region', name);
  }
}

// Each entry: [outputFilename, regionName, leftFrac, topFrac, widthFrac, heightFrac]
// Fractions are relative to the NAMED REGION's own width/height (not the full image).
// These fractions were derived from precise pixel measurements: each project's
// photo card was located exactly (via targeted diagnostic crops read with the
// Read tool) rather than eyeballed off a scaled-down screenshot, so every box
// below maps to the photo card's true bounding box in the 300dpi source
// (confirmed against a consistent ~452x735px card template used throughout
// the infographic, at top_frac~0.147/height_frac~0.28 for top-row cards and
// top_frac~0.568/height_frac~0.28 for bottom-row cards).
const CROPS = [
  ['01-botanique.jpg',        'region-a', 0.6872, 0.5688, 0.2955, 0.2800],
  ['02-vert.jpg',              'region-b', 0.1133, 0.1478, 0.2143, 0.2796],
  ['03-essence.jpg',           'region-b', 0.3276, 0.5569, 0.2152, 0.2804],
  ['04-grand-parc.jpg',        'region-b', 0.5476, 0.1478, 0.2157, 0.2808],
  ['05-le-mont.jpg',           'region-b', 0.7586, 0.5688, 0.2143, 0.2800],
  ['06-le-mont-2.jpg',         'region-c', 0.0177, 0.1478, 0.2103, 0.2789],
  ['07-mont-royal.jpg',        'region-c', 0.2326, 0.5688, 0.2103, 0.2800],
  ['08-grandclub-cotia.jpg',   'region-c', 0.4502, 0.1478, 0.2079, 0.2789],
  ['09-quartier.jpg',          'region-c', 0.6758, 0.5688, 0.2126, 0.2800],
  ['10-magnifique.jpg',        'region-d', 0.0409, 0.1467, 0.2102, 0.2800],
  ['11-icarai.jpg',            'region-d', 0.2521, 0.5676, 0.2140, 0.2800],
  ['12-althea.jpg',            'region-d', 0.4907, 0.1474, 0.2098, 0.2793],
  ['13-carapicuiba.jpg',       'region-d', 0.7186, 0.5695, 0.2107, 0.2793],
  ['14-reserva-vereda.jpg',    'region-e', 0.0433, 0.1474, 0.2196, 0.2800],
  ['15-style-um.jpg',          'region-e', 0.5030, 0.1478, 0.2201, 0.2789],
  ['16-alma-da-mata.jpg',      'region-e', 0.2595, 0.5688, 0.2201, 0.2800],
  ['17-aguas-do-cerrado.jpg',  null,       0, 0, 0, 0], // no photo in source, logo only — see Step 5
];

async function makeCrops() {
  for (const [out, region, lf, tf, wf, hf] of CROPS) {
    if (!region) continue; // handled separately (no source photo)
    const regionPath = path.join(REGION_DIR, `${region}.jpg`);
    const meta = await sharp(regionPath).metadata();
    const left = Math.round(meta.width * lf);
    const top = Math.round(meta.height * tf);
    const width = Math.round(meta.width * wf);
    const height = Math.round(meta.height * hf);
    await sharp(regionPath)
      .extract({ left, top, width, height })
      .jpeg({ quality: 88 })
      .toFile(path.join(OUT_DIR, out));
    console.log('wrote', out);
  }
}

async function main() {
  await sharp(HIRES).metadata(); // fail fast if hires-1.jpg is missing
  const fs = require('fs');
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  await makeRegions();
  await makeCrops();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
