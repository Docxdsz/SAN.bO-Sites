// tools/process-track-aguas-cerrado.js
// Source: Google Drive "Key Visual_ÁGUAS DO CERRADO.jpg" (1920x1080), shared
// via the folder linked in Downloads/Ajustes Solicitados - Site Pirata.md.
// That file is a full marketing composite (building render + lifestyle
// family photo + logo + spec text baked in on the right two-thirds) — this
// crop keeps only the clean left-side building-tower render (verified by
// visual inspection: x 0-460, y 230-1080 contains the full tower with no
// text or the overlapping lifestyle photo). Run: node process-track-aguas-cerrado.js
const path = require('path');
const sharp = require('sharp');

const SOURCE = path.resolve(__dirname, '_track-hires/aguas-do-cerrado-source.jpg');
const OUT = path.resolve(__dirname, '../site/assets/images/track/17-aguas-do-cerrado.jpg');

async function main() {
  await sharp(SOURCE)
    .extract({ left: 0, top: 230, width: 460, height: 850 })
    .resize({ width: 600 })
    .jpeg({ quality: 88 })
    .toFile(OUT);
  console.log('wrote', OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
