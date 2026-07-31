// tools/extract-panfleto-map.js
// One-time extraction of the map/entorno panel from the client's Panfleto
// PDF (2 pages, each a 3-panel fold-out spread at 1839.69x748.346pt).
// Renders the chosen page at 300dpi via pdftoppm, then crops to the panel
// identified by manual review. Run: node extract-panfleto-map.js
const { execFileSync } = require('child_process');
const path = require('path');
const sharp = require('sharp');

const PDFTOPPM = 'C:\\Users\\Doc\\AppData\\Local\\Microsoft\\WinGet\\Packages\\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\\poppler-25.07.0\\Library\\bin\\pdftoppm.exe';
const SRC_PDF = 'C:\\Users\\Doc\\Desktop\\ReservaVereda\\Reserva Vereda - Panfleto 2 dobras 64,5x26cm.pdf';
const PAGE = 1; // page identified in the manual review step: leftmost panel has the aerial "entorno" map with location pins
const TMP_PREFIX = path.resolve(__dirname, '_panfleto-hires');
const OUT = path.resolve(__dirname, '../site/assets/images/location-map.jpg');

// Bounding box as a fraction of the full rendered page (from manual review).
// Page 1 is a 3-panel spread; the map/entorno aerial photo sits in the top
// portion of the leftmost panel (above the "QUALIDADE DE VIDA" copy block).
const LEFT_FRAC = 0.0;
const TOP_FRAC = 0.0;
const WIDTH_FRAC = 0.335;
const HEIGHT_FRAC = 0.455;

execFileSync(PDFTOPPM, ['-png', '-r', '300', '-f', String(PAGE), '-l', String(PAGE), SRC_PDF, TMP_PREFIX]);

const rendered = `${TMP_PREFIX}-${PAGE}.png`;

sharp(rendered)
  .metadata()
  .then((meta) => {
    const left = Math.round(meta.width * LEFT_FRAC);
    const top = Math.round(meta.height * TOP_FRAC);
    const width = Math.round(meta.width * WIDTH_FRAC);
    const height = Math.round(meta.height * HEIGHT_FRAC);
    return sharp(rendered)
      .extract({ left, top, width, height })
      .jpeg({ quality: 88 })
      .toFile(OUT);
  })
  .then(() => console.log('wrote location-map.jpg'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
