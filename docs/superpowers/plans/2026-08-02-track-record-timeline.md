# Track Record Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Track Record ("Trajetória") timeline section described in `docs/superpowers/specs/2026-08-02-track-record-timeline-design.md`, between `#form` and the footer of the Reserva Vereda static site.

**Architecture:** Static HTML + Tailwind CDN + vanilla JS, zero build step (unchanged). Card data lives in a plain JS array (`site/js/track-record-data.js`), rendered into `#trajetoria` by a new `site/js/track-record.js`. Desktop scroll-jacking uses GSAP ScrollTrigger `pin`; mobile/tablet and `prefers-reduced-motion` use native `overflow-x` scroll with CSS scroll-snap. Photos are cropped once from the source PDF via a `tools/` sharp script, following this repo's established one-script-per-asset-need pattern.

**Tech Stack:** Tailwind CDN, GSAP + ScrollTrigger (already loaded in `site/index.html`), `sharp` (Node, in `tools/`), `pdftoppm` (poppler, already used elsewhere in this repo).

## Global Constraints

- Repo root: `C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site`. Work happens directly on `master` (per [[project-reserva-vereda]] memory — no active worktree for this round).
- Site color tokens (reuse, do not invent new hex values): `forest-950 #0B1712`, `forest-900 #11221B`, `forest-800 #172E23`, `gold-400 #CBA97A`, `gold-600 #A9824F`, `offwhite #F4F1E8`.
- Source PDF: `C:\Users\Doc\Desktop\ReservaVereda\TRACK RECORD (1).pdf` — single page, 2196.85×629.76pt. Render at 300dpi via poppler's `pdftoppm.exe` (path: `C:\Users\Doc\AppData\Local\Microsoft\WinGet\Packages\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\poppler-25.07.0\Library\bin\pdftoppm.exe`) to get a 9154×2625px JPEG — call it `hires-1.jpg`.
- Project **names are typeset in `font-serif` text**, not extracted as raster logos. The PDF's 17 project logos are each a different third-party brand style (varied colors/fonts) that would visually clash with the site's cohesive gold/forest identity — the spec already calls for `font-serif` names on cards, so this is spec-compliant, not a shortcut. Only **photos** are extracted as assets.
- Every `tools/*.js` script writes output under `site/assets/...` via `path.resolve(__dirname, '../site/...')`, matching existing scripts. Run scripts with `node <script>.js` from inside `tools/` (that's where `node_modules`/`sharp` lives — already installed, version 0.35.3).
- No Playwright use on this project without asking first, **except** read-only nav/screenshot/console checks on the site's own local/live pages, which the user has already authorized in prior sessions (see [[feedback-reserva-vereda-workflow]]) — safe to use for this plan's verification steps without re-asking.
- Out of scope (do not touch): adding `#trajetoria` to the header anchor nav; final marketing copy for the section's H2/subtitle (placeholder copy is acceptable, same category as the still-pending hero copy); QR code; tracking pixel.
- Push to GitHub/Vercel and re-run `vercel alias set` after this work lands, without asking first (standing authorization for this repo, see [[feedback-reserva-vereda-workflow]]).

## Verified Source Data

All 17 projects, read directly off the PDF at 300dpi (not approximated). Chronological order matches the PDF's left-to-right layout, alternating `top`/`bottom` row exactly as in the source:

| # | Nome | Linha | Lançamento | Local | Unidades | Torres | VGV | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | Botanique | bottom | 2010 | Cotia, São Paulo | 151 Unidades | 5 Torres | R$ 19.177.000,00 | Entregue Out/2013 |
| 2 | Vert | top | 10/2012 | Itu, São Paulo | 100 Unidades | 5 Torres | R$ 11.900.000,00 | Entregue Abr/2016 |
| 3 | Essence | bottom | 09/2012 | Cotia, São Paulo | 180 Unidades | 6 Torres | R$ 29.088.000,00 | Entregue Set/2015 |
| 4 | Grand Parc | top | 01/2013 | Itu, São Paulo | 192 Unidades | 12 Torres | R$ 25.435.000,00 | Entregue Out/2016 |
| 5 | Le Mont | bottom | 04/2013 | Cotia, São Paulo | 150 Unidades | 5 Torres | R$ 21.192.000,00 | Entregue Jul/2016 |
| 6 | Le Mont 2 | top | 11/2013 | Cotia, São Paulo | 120 Unidades | 4 Torres | R$ 17.856.000,00 | Entregue Jul/2018 |
| 7 | Mont Royal | bottom | 01/2016 | Porto Feliz, São Paulo | 168 Unidades | 7 Torres | R$ 23.503.000,00 | Entregue Mar/2017 |
| 8 | GrandClub Cotia | top | 10/2016 | Cotia, São Paulo | 198 Unidades | 8 Torres | R$ 32.670.000,00 | Entregue Mai/2019 |
| 9 | Quartier | bottom | 07/2017 | Itapevi, São Paulo | 198 Unidades | 2 Torres | R$ 36.630.000,00 | Entregue Mai/2019 |
| 10 | Magnifique Salto | top | 10/2016 | Salto, São Paulo | 188 Unidades | 4 Torres | R$ 43.200.000,00 | Entregue Jan/2022 |
| 11 | Icaraí Parque Clube | bottom | 01/2022 | Salto, São Paulo | 408 Unidades | 4 Torres | R$ 233.000.000,00 | Entregue Mar/2023 |
| 12 | Althea Granja Viana | top | 08/2025 | Cotia, São Paulo | 199 Unidades | 3 Torres | R$ 70.000.000,00 | Em obras — prev. Nov/2026 |
| 13 | Carapicuíba | bottom | — | Carapicuíba, São Paulo | 119 Unidades | — | R$ 42.000.000,00 | Lançamento 2026 |
| 14 | **Reserva Vereda Granja Viana** | top | — | Granja Viana, São Paulo | 76 Casas | — | R$ 138.000.000,00 | Lançamento 2026 |
| 15 | Style Um | top | — | *(não informado na fonte)* | 206 Unidades | — | R$ 80.000.000,00 | Lançamento 2026 |
| 16 | Alma da Mata | bottom | — | Bragança Paulista, São Paulo | 227 Unidades | — | R$ 273.000.000,00 | Lançamento 2026 |
| 17 | Águas do Cerrado Residencial | bottom | — | Valinhos, São Paulo | 329 Unidades | — | R$ 312.000.000,00 | Lançamento 2027 |

Notes:
- Row 14 (Reserva Vereda) is the page's own development — gets the highlight treatment (Task 4).
- Row 15 (Style Um) genuinely has no "Localização:" line in the source PDF — leave its location out of the card rather than inventing one.
- Rows 13–17 have no separate "LANÇAMENTO mm/aaaa" line printed on their own cards in the source (only "Lançamento YYYY" on the timeline dot) — because they haven't delivered yet, the dot *is* their only date marker. Don't invent a month for these.
- GrandClub Cotia and Quartier share the same "Entregue Maio/2019" timeline marker in the source (two projects delivered close enough together that the designer used one shared dot/label) — this is correct, not a data error.

---

### Task 1: Extract project photos and write the data config

**Files:**
- Create: `tools/extract-track-record.js`
- Create (generated): `site/assets/images/track/01-botanique.jpg` … `site/assets/images/track/17-aguas-do-cerrado.jpg` (17 files; project 15/Style Um and project 13/Carapicuíba and project 17/Águas do Cerrado — verify which of these actually have a distinct photo vs. logo-only per Step 2 below)
- Create: `site/js/track-record-data.js`

**Interfaces:**
- Produces: `window.TRACK_RECORD` — a plain array of 17 objects, each `{ id, name, row, launch, location, units, towers, vgv, status, statusLabel, photo, highlight }`, consumed by Task 2's renderer (`site/js/track-record.js`, not written yet — this task only produces the data + images it will read).

- [ ] **Step 1: Render the source PDF at 300dpi**

```bash
mkdir -p "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\tools\_track-hires"
"C:\Users\Doc\AppData\Local\Microsoft\WinGet\Packages\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\poppler-25.07.0\Library\bin\pdftoppm.exe" -jpeg -r 300 "C:\Users\Doc\Desktop\ReservaVereda\TRACK RECORD (1).pdf" "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\tools\_track-hires\hires"
```
Expected: `tools/_track-hires/hires-1.jpg` exists, 9154×2625px (verify with `node -e "require('./node_modules/sharp')('_track-hires/hires-1.jpg').metadata().then(m=>console.log(m.width,m.height))"` run from inside `tools/`).

- [ ] **Step 2: Generate the 5 named region crops for visual inspection**

Create `tools/extract-track-record.js`:
```js
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
const REGIONS = [
  ['region-a', 0, 1560],       // Botanique
  ['region-b', 1300, 2100],    // Vert, Essence, Grand Parc, Le Mont
  ['region-c', 3350, 2100],    // Le Mont 2, Mont Royal, GrandClub, Quartier
  ['region-d', 5400, 2100],    // Magnifique, Althea, Reserva Vereda (partial), Icaraí, Carapicuíba
  ['region-e', 7300, 1854],    // Reserva Vereda (photo), Style Um, Alma da Mata, Águas do Cerrado
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
// These are starting estimates from a first-pass visual read — inspect each
// region-*.jpg with the Read tool before running crops() and correct any
// fraction that looks off (wrong project, cuts off the building, includes
// neighboring card text). This is expected to take a couple of adjustment
// rounds, same as this repo's existing tools/extract-panfleto-map.js pattern.
const CROPS = [
  ['01-botanique.jpg',        'region-a', 0.55, 0.24, 0.22, 0.28],
  ['02-vert.jpg',              'region-b', 0.11, 0.11, 0.23, 0.23],
  ['03-essence.jpg',           'region-b', 0.34, 0.45, 0.21, 0.19],
  ['04-grand-parc.jpg',        'region-b', 0.55, 0.11, 0.22, 0.23],
  ['05-le-mont.jpg',           'region-b', 0.775, 0.45, 0.22, 0.19],
  ['06-le-mont-2.jpg',         'region-c', 0.00, 0.11, 0.21, 0.23],
  ['07-mont-royal.jpg',        'region-c', 0.21, 0.45, 0.22, 0.19],
  ['08-grandclub-cotia.jpg',   'region-c', 0.44, 0.11, 0.22, 0.23],
  ['09-quartier.jpg',          'region-c', 0.66, 0.45, 0.22, 0.19],
  ['10-magnifique.jpg',        'region-d', 0.00, 0.11, 0.22, 0.23],
  ['11-icarai.jpg',            'region-d', 0.44, 0.45, 0.22, 0.19],
  ['12-althea.jpg',            'region-d', 0.29, 0.11, 0.22, 0.23],
  ['13-carapicuiba.jpg',       'region-d', 0.66, 0.45, 0.22, 0.19],
  ['14-reserva-vereda.jpg',    'region-e', 0.00, 0.11, 0.20, 0.23],
  ['15-style-um.jpg',          'region-e', 0.44, 0.11, 0.24, 0.23],
  ['16-alma-da-mata.jpg',      'region-e', 0.18, 0.44, 0.22, 0.24],
  ['17-aguas-do-cerrado.jpg',  null,       0, 0, 0, 0], // no photo in source, logo only — see Step 4
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
```

- [ ] **Step 3: Run region generation and inspect each region image**

```bash
cd tools && node extract-track-record.js
```
Then use the Read tool on each of `tools/_track-hires/region-a.jpg` through `region-e.jpg`. For every project photo, compare where it actually sits in the region image against the fraction box specified in `CROPS` above. This mirrors what was already done once to derive these starting estimates — the goal now is to correct any box that's off before trusting the output.

- [ ] **Step 4: Fix any wrong crop fractions, re-run, and inspect the 16 output photos**

Edit the `CROPS` fractions in `tools/extract-track-record.js` for any project whose box looked wrong in Step 3, then re-run `node extract-track-record.js` (it's idempotent — safe to re-run whole). Use the Read tool on every file in `site/assets/images/track/` and confirm: the correct building is shown, no neighboring card's text/photo bleeds in, and the building isn't awkwardly cropped (missing its top or cut through the middle of the facade). Iterate until all 16 (all except Águas do Cerrado, which has no source photo) look right.

- [ ] **Step 5: Handle Águas do Cerrado (no source photo)**

The source PDF shows only a logo mark (a stylized tree/roots icon) for Águas do Cerrado, no building photo. Do not fabricate one. In the data config (Step 6), this project's `photo` field is `null`, and Task 2's card template must handle a missing photo (fall back to a plain color panel with the project name, no `<img>`).

- [ ] **Step 6: Write the data config**

Create `site/js/track-record-data.js`:
```js
// site/js/track-record-data.js
// Source: C:\Users\Doc\Desktop\ReservaVereda\TRACK RECORD (1).pdf (Elleven
// Engenharia / CS Empreendimentos track record infographic). Transcribed
// directly from a 300dpi render — see docs/superpowers/plans/2026-08-02-track-record-timeline.md
// for the verification table. Do not edit numbers here without re-checking
// the source PDF.
window.TRACK_RECORD = [
  { id: 'botanique', name: 'Botanique', row: 'bottom', launch: '2010', location: 'Cotia, São Paulo', units: '151 Unidades', towers: '5 Torres', vgv: 'R$ 19.177.000,00', status: 'entregue', statusLabel: 'Entregue', statusYear: '2013', statusMonth: 'Outubro', photo: 'assets/images/track/01-botanique.jpg', highlight: false },
  { id: 'vert', name: 'Vert', row: 'top', launch: '10/2012', location: 'Itu, São Paulo', units: '100 Unidades', towers: '5 Torres', vgv: 'R$ 11.900.000,00', status: 'entregue', statusLabel: 'Entregue', statusYear: '2016', statusMonth: 'Abril', photo: 'assets/images/track/02-vert.jpg', highlight: false },
  { id: 'essence', name: 'Essence', row: 'bottom', launch: '09/2012', location: 'Cotia, São Paulo', units: '180 Unidades', towers: '6 Torres', vgv: 'R$ 29.088.000,00', status: 'entregue', statusLabel: 'Entregue', statusYear: '2015', statusMonth: 'Setembro', photo: 'assets/images/track/03-essence.jpg', highlight: false },
  { id: 'grand-parc', name: 'Grand Parc', row: 'top', launch: '01/2013', location: 'Itu, São Paulo', units: '192 Unidades', towers: '12 Torres', vgv: 'R$ 25.435.000,00', status: 'entregue', statusLabel: 'Entregue', statusYear: '2016', statusMonth: 'Outubro', photo: 'assets/images/track/04-grand-parc.jpg', highlight: false },
  { id: 'le-mont', name: 'Le Mont', row: 'bottom', launch: '04/2013', location: 'Cotia, São Paulo', units: '150 Unidades', towers: '5 Torres', vgv: 'R$ 21.192.000,00', status: 'entregue', statusLabel: 'Entregue', statusYear: '2016', statusMonth: 'Julho', photo: 'assets/images/track/05-le-mont.jpg', highlight: false },
  { id: 'le-mont-2', name: 'Le Mont 2', row: 'top', launch: '11/2013', location: 'Cotia, São Paulo', units: '120 Unidades', towers: '4 Torres', vgv: 'R$ 17.856.000,00', status: 'entregue', statusLabel: 'Entregue', statusYear: '2018', statusMonth: 'Julho', photo: 'assets/images/track/06-le-mont-2.jpg', highlight: false },
  { id: 'mont-royal', name: 'Mont Royal', row: 'bottom', launch: '01/2016', location: 'Porto Feliz, São Paulo', units: '168 Unidades', towers: '7 Torres', vgv: 'R$ 23.503.000,00', status: 'entregue', statusLabel: 'Entregue', statusYear: '2017', statusMonth: 'Março', photo: 'assets/images/track/07-mont-royal.jpg', highlight: false },
  { id: 'grandclub-cotia', name: 'GrandClub Cotia', row: 'top', launch: '10/2016', location: 'Cotia, São Paulo', units: '198 Unidades', towers: '8 Torres', vgv: 'R$ 32.670.000,00', status: 'entregue', statusLabel: 'Entregue', statusYear: '2019', statusMonth: 'Maio', photo: 'assets/images/track/08-grandclub-cotia.jpg', highlight: false },
  { id: 'quartier', name: 'Quartier', row: 'bottom', launch: '07/2017', location: 'Itapevi, São Paulo', units: '198 Unidades', towers: '2 Torres', vgv: 'R$ 36.630.000,00', status: 'entregue', statusLabel: 'Entregue', statusYear: '2019', statusMonth: 'Maio', photo: 'assets/images/track/09-quartier.jpg', highlight: false },
  { id: 'magnifique-salto', name: 'Magnifique Salto', row: 'top', launch: '10/2016', location: 'Salto, São Paulo', units: '188 Unidades', towers: '4 Torres', vgv: 'R$ 43.200.000,00', status: 'entregue', statusLabel: 'Entregue', statusYear: '2022', statusMonth: 'Janeiro', photo: 'assets/images/track/10-magnifique.jpg', highlight: false },
  { id: 'icarai', name: 'Icaraí Parque Clube', row: 'bottom', launch: '01/2022', location: 'Salto, São Paulo', units: '408 Unidades', towers: '4 Torres', vgv: 'R$ 233.000.000,00', status: 'entregue', statusLabel: 'Entregue', statusYear: '2023', statusMonth: 'Março', photo: 'assets/images/track/11-icarai.jpg', highlight: false },
  { id: 'althea', name: 'Althea Granja Viana', row: 'top', launch: '08/2025', location: 'Cotia, São Paulo', units: '199 Unidades', towers: '3 Torres', vgv: 'R$ 70.000.000,00', status: 'em-obras', statusLabel: 'Em obras — entrega prevista', statusYear: '2026', statusMonth: 'Novembro', photo: 'assets/images/track/12-althea.jpg', highlight: false },
  { id: 'carapicuiba', name: 'Carapicuíba', row: 'bottom', launch: null, location: 'Carapicuíba, São Paulo', units: '119 Unidades', towers: null, vgv: 'R$ 42.000.000,00', status: 'lancamento', statusLabel: 'Lançamento', statusYear: '2026', statusMonth: null, photo: 'assets/images/track/13-carapicuiba.jpg', highlight: false },
  { id: 'reserva-vereda', name: 'Reserva Vereda Granja Viana', row: 'top', launch: null, location: 'Granja Viana, São Paulo', units: '76 Casas', towers: null, vgv: 'R$ 138.000.000,00', status: 'lancamento', statusLabel: 'Lançamento', statusYear: '2026', statusMonth: null, photo: 'assets/images/track/14-reserva-vereda.jpg', highlight: true },
  { id: 'style-um', name: 'Style Um', row: 'top', launch: null, location: null, units: '206 Unidades', towers: null, vgv: 'R$ 80.000.000,00', status: 'lancamento', statusLabel: 'Lançamento', statusYear: '2026', statusMonth: null, photo: 'assets/images/track/15-style-um.jpg', highlight: false },
  { id: 'alma-da-mata', name: 'Alma da Mata', row: 'bottom', launch: null, location: 'Bragança Paulista, São Paulo', units: '227 Unidades', towers: null, vgv: 'R$ 273.000.000,00', status: 'lancamento', statusLabel: 'Lançamento', statusYear: '2026', statusMonth: null, photo: 'assets/images/track/16-alma-da-mata.jpg', highlight: false },
  { id: 'aguas-do-cerrado', name: 'Águas do Cerrado Residencial', row: 'bottom', launch: null, location: 'Valinhos, São Paulo', units: '329 Unidades', towers: null, vgv: 'R$ 312.000.000,00', status: 'lancamento', statusLabel: 'Lançamento', statusYear: '2027', statusMonth: null, photo: null, highlight: false },
];
```

- [ ] **Step 7: Verify**

Run:
```bash
node -e "const d = require('./site/js/track-record-data.js'.replace('.js',''));" 2>/dev/null; echo "(expected to fail — window.TRACK_RECORD isn't a CommonJS export, that's fine, it's a browser global)"
grep -c "id: '" site/js/track-record-data.js
ls site/assets/images/track/ | wc -l
```
Expected: `grep -c` prints `17`; `ls | wc -l` prints `16` (16 photo files — Águas do Cerrado has none).

- [ ] **Step 8: Remove the temporary hires render, keep the region crops out of git**

The full-page hires render (`tools/_track-hires/hires-1.jpg`, ~30-60MB at 300dpi) and the 5 region images are working files, not final assets — they must not be committed. Add to `tools/.gitignore` (create the file if it doesn't exist):
```
_track-hires/
```

- [ ] **Step 9: Commit**

```bash
git add tools/extract-track-record.js tools/.gitignore site/assets/images/track/ site/js/track-record-data.js
git commit -m "Add track record photo extraction script and project data"
```

---

### Task 2: Section markup, CSS, and card renderer (mobile-first, native scroll)

**Files:**
- Modify: `site/index.html` (new `<section id="trajetoria">`, inserted between `#form` and `<footer id="site-footer">`)
- Modify: `site/css/style.css` (new `.track-*` rules)
- Create: `site/js/track-record.js`
- Modify: `site/index.html` (`<script>` tags: add `track-record-data.js` and `track-record.js`, load order matters)

**Interfaces:**
- Consumes: `window.TRACK_RECORD` from Task 1.
- Produces: `renderTrackRecord()` function in `site/js/track-record.js`, called from `DOMContentLoaded` (added to the same listener block as the other `init*()` calls in `site/js/main.js`... actually kept self-contained in its own file/listener to avoid merge conflicts with `main.js`'s existing listener — see Step 4). Produces DOM structure `#trajetoria .track-track` (the horizontally-scrollable strip) and `.track-card[data-row="top"|"bottom"]`, consumed by Task 3's ScrollTrigger code.

- [ ] **Step 1: Add the section skeleton to `site/index.html`**

Insert between the closing `</section>` of `#form` and `<footer id="site-footer">`:
```html
  <section id="trajetoria" class="relative py-24 md:py-32 bg-forest-950 overflow-hidden">
    <div class="max-w-3xl mx-auto text-center js-reveal mb-16 px-6">
      <div class="js-divider mx-auto mb-6 h-1 w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
      <p class="text-gold-400 text-xs md:text-sm uppercase tracking-[0.2em] mb-3">Track Record</p>
      <h2 class="font-serif text-3xl md:text-5xl text-offwhite mb-4">Uma trajetória de resultados.</h2>
      <p class="text-offwhite/70 max-w-xl mx-auto">17 empreendimentos entregues, em obras e lançados pela Elleven Engenharia — incluindo o Reserva Vereda.</p>
    </div>
    <div id="track-viewport" class="track-viewport">
      <div id="track-track" class="track-track">
        <!-- .track-card elements injected by site/js/track-record.js -->
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Add the CSS to `site/css/style.css`**

Append at the end of the file:
```css
/* Track Record timeline */
.track-viewport {
  position: relative;
  width: 100%;
}

.track-track {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 6vw;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
}

.track-track::-webkit-scrollbar {
  height: 6px;
}
.track-track::-webkit-scrollbar-thumb {
  background: rgba(203, 169, 122, 0.4);
  border-radius: 3px;
}

.track-card {
  scroll-snap-align: center;
  flex: 0 0 auto;
  width: 280px;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0 20px;
}

.track-card[data-row="bottom"] {
  flex-direction: column-reverse;
}

.track-card .track-photo-wrap {
  order: 1;
}
.track-card[data-row="bottom"] .track-photo-wrap {
  order: 3;
}

.track-card .track-info {
  order: 2;
}

.track-card .track-marker {
  order: 2;
}
.track-card[data-row="top"] .track-marker {
  order: 3;
}
.track-card[data-row="bottom"] .track-marker {
  order: 1;
}

.track-photo {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: 1.5rem;
}

.track-photo-fallback {
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 1.5rem;
  background: linear-gradient(160deg, #172E23, #0B1712);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem;
}

.track-line {
  position: relative;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(203, 169, 122, 0.5) 4%, rgba(203, 169, 122, 0.5) 96%, transparent);
  margin: 2.5rem 0;
}

.track-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #CBA97A;
  transform: translate(-50%, -50%);
}

.track-card.track-highlight .track-photo,
.track-card.track-highlight .track-photo-fallback {
  outline: 2px solid #CBA97A;
  outline-offset: 4px;
  box-shadow: 0 0 30px rgba(203, 169, 122, 0.35);
}

@media (min-width: 1024px) {
  .track-track {
    scroll-snap-type: none;
  }
}
```

- [ ] **Step 3: Write the renderer, `site/js/track-record.js`**

```js
// site/js/track-record.js
// Renders window.TRACK_RECORD (site/js/track-record-data.js) into
// #track-track as alternating top/bottom cards along a center line.
function trackStatusText(entry) {
  if (entry.statusMonth) {
    return `${entry.statusLabel} ${entry.statusMonth}/${entry.statusYear}`;
  }
  return `${entry.statusLabel} ${entry.statusYear}`;
}

function trackCardHTML(entry) {
  const photo = entry.photo
    ? `<img src="${entry.photo}" alt="${entry.name}" class="track-photo" loading="lazy" />`
    : `<div class="track-photo-fallback"><span class="font-serif text-offwhite text-lg">${entry.name}</span></div>`;

  const launchLine = entry.launch
    ? `<p class="text-offwhite/50 text-[11px] uppercase tracking-widest mb-1">Lançamento ${entry.launch}</p>`
    : '';

  const locationLine = entry.location
    ? `<p class="text-offwhite/70 text-sm mb-1">${entry.location}</p>`
    : '';

  const towersLine = entry.towers
    ? `<p class="text-offwhite/70 text-sm">${entry.units} · ${entry.towers}</p>`
    : `<p class="text-offwhite/70 text-sm">${entry.units}</p>`;

  return `
    <div class="track-card${entry.highlight ? ' track-highlight' : ''}" data-row="${entry.row}" data-id="${entry.id}">
      <div class="track-photo-wrap">${photo}</div>
      <div class="track-info py-4">
        <p class="font-serif text-offwhite text-xl mb-2">${entry.name}</p>
        ${launchLine}
        ${locationLine}
        ${towersLine}
        <p class="text-gold-400 text-sm mt-2">VGV: ${entry.vgv}</p>
      </div>
      <div class="track-marker text-center py-2">
        <p class="text-gold-400 text-xs uppercase tracking-widest">${trackStatusText(entry)}</p>
      </div>
    </div>
  `;
}

function renderTrackRecord() {
  const track = document.getElementById('track-track');
  if (!track || !window.TRACK_RECORD) return;

  track.innerHTML = window.TRACK_RECORD.map(trackCardHTML).join('');
}

document.addEventListener('DOMContentLoaded', renderTrackRecord);
```

- [ ] **Step 4: Wire the two new scripts into `site/index.html`**

Find the existing script tags (near the end of `<body>`, where `js/main.js` is loaded) and add the two new files **before** `main.js`, in this order:
```html
  <script src="js/track-record-data.js"></script>
  <script src="js/track-record.js"></script>
  <script src="js/main.js"></script>
```
(Order matters: `track-record-data.js` defines `window.TRACK_RECORD` before `track-record.js` reads it; both run as separate `DOMContentLoaded` listeners from `main.js`'s, which is fine — no shared state between them at this stage.)

- [ ] **Step 5: Verify markup and script wiring**

Run:
```bash
grep -n 'id="trajetoria"' site/index.html
grep -n "track-record-data.js\|track-record.js" site/index.html
grep -c "track-card\|track-viewport\|track-track" site/css/style.css
```
Expected: one match for the section, two matches for the script tags, at least 3 matches in the CSS.

- [ ] **Step 6: Visual check with a local server**

```bash
npx --yes serve site -p 4173
```
(background) Then use Playwright: navigate to `http://localhost:4173?v=1`, scroll to `#trajetoria`, take a viewport screenshot. Expected: 17 cards visible in a horizontally-scrollable strip, alternating photo-on-top/photo-on-bottom, Reserva Vereda's card has a visible gold outline/glow. Scroll the strip left-right with `mouse.wheel` or by dragging to confirm native horizontal scroll works. Kill the server afterward (`taskkill //F //PID <pid>`).

- [ ] **Step 7: Commit**

```bash
git add site/index.html site/css/style.css site/js/track-record.js
git commit -m "Add Track Record section: markup, styles, and card renderer"
```

---

### Task 3: Desktop pinned scroll (GSAP ScrollTrigger)

**Files:**
- Modify: `site/js/track-record.js` (add `initTrackScroll()`)

**Interfaces:**
- Consumes: `#track-viewport` / `#track-track` / `.track-card` from Task 2. GSAP + ScrollTrigger globals (`gsap`, `ScrollTrigger`) already loaded by `site/index.html` for the site's other scroll effects (confirm via `grep -n "gsap.min.js\|ScrollTrigger" site/index.html` before writing this task's code — if the CDN tags aren't already present, this step must add them, but per the existing `conectividade`/`trail` features already using ScrollTrigger, they should already be there).
- Produces: nothing consumed by later tasks — this is the last interactive piece.

- [ ] **Step 1: Confirm GSAP/ScrollTrigger are already available**

Run: `grep -n "gsap\|ScrollTrigger" site/index.html`
Expected: existing `<script>` tags for `gsap.min.js` and `ScrollTrigger.min.js` from a CDN, plus `gsap.registerPlugin(ScrollTrigger)` somewhere in `site/js/main.js`. If `registerPlugin` isn't called yet in a way that runs before this new code, add `gsap.registerPlugin(ScrollTrigger);` at the top of `initTrackScroll()` too (calling it twice is harmless — GSAP no-ops repeat registration).

- [ ] **Step 2: Add `initTrackScroll()` to `site/js/track-record.js`**

Append to the file (after `renderTrackRecord`, before the `DOMContentLoaded` listener):
```js
function initTrackScroll() {
  const viewport = document.getElementById('track-viewport');
  const track = document.getElementById('track-track');
  if (!viewport || !track) return;

  const prefersReducedMotion = window.matchMedia('(prefers-motion: reduce), (prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  if (prefersReducedMotion || !isDesktop || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return; // falls back to the native horizontal scroll from Task 2's CSS
  }

  gsap.registerPlugin(ScrollTrigger);

  const getScrollDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

  const st = ScrollTrigger.create({
    trigger: viewport,
    start: 'top top+=88', // clears the fixed header (site-header)
    end: () => `+=${getScrollDistance()}`,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      track.scrollLeft = self.progress * getScrollDistance();
    },
  });

  window.addEventListener('resize', () => st.refresh());
}
```

- [ ] **Step 3: Call `initTrackScroll()` after render**

Change the file's `DOMContentLoaded` listener from:
```js
document.addEventListener('DOMContentLoaded', renderTrackRecord);
```
to:
```js
document.addEventListener('DOMContentLoaded', () => {
  renderTrackRecord();
  initTrackScroll();
});
```
(Must run in this order — `initTrackScroll` reads `track.scrollWidth`, which is only correct once `renderTrackRecord` has populated the cards.)

- [ ] **Step 4: Verify pin/scrub behavior on desktop**

With the local server still running (or restarted per Task 2 Step 6's pattern) at a fresh port, use Playwright at a desktop viewport (`browser_resize` to at least 1280×800). Navigate fresh (`page.goto`, cache-busting query string per this project's established `npx serve` caching gotcha), scroll the page down incrementally toward `#trajetoria` using real wheel/scroll events (not `window.scrollTo` teleport, and not a `fullPage` screenshot — GSAP ScrollTrigger needs real scroll events to fire, and `fullPage` captures render `.js-reveal`/pinned content as if never scrolled, per this project's established Playwright gotchas). Confirm: the section pins (page stops scrolling vertically while cards visibly move horizontally), and eventually releases to continue normal vertical scroll after the last card passes.

- [ ] **Step 5: Verify mobile/tablet and reduced-motion fallback**

Resize the Playwright viewport to a mobile width (e.g. 390×844). Reload. Confirm `initTrackScroll()` returns early (no pin) — the section should scroll normally with the page, and the card strip should be swipeable/draggable horizontally on its own (native `overflow-x` from Task 2's CSS). Also test with `page.emulateMedia({ reducedMotion: 'reduce' })` at a desktop viewport width — confirm no pin occurs.

- [ ] **Step 6: Commit**

```bash
git add site/js/track-record.js
git commit -m "Add desktop pinned scroll-jack for Track Record, native scroll fallback elsewhere"
```

---

### Task 4: Final integration pass, deploy

**Files:** none new — verification and deploy only.

- [ ] **Step 1: Full-page manual review**

With the local server running, navigate through the whole page in order (Playwright, incremental scroll per this project's established gotchas) from `#form` through `#trajetoria` into the footer. Confirm: no visual gap/overlap at the `#form` → `#trajetoria` boundary (both flat `bg-forest-900`/`bg-forest-950`, no stray wave divider needed per the spec), the section heading reads correctly, all 17 cards render with correct alternating layout, Reserva Vereda's card is visually distinct (gold glow), and the transition into `<footer>` looks intentional (not abrupt).

- [ ] **Step 2: Check for console errors**

Use `browser_console_messages` after the full scroll-through in Step 1. Expected: no errors referencing `track-record`, `TRACK_RECORD`, `ScrollTrigger`, or 404s for any `site/assets/images/track/*.jpg` file.

- [ ] **Step 3: Push and deploy**

Per this repo's standing authorization (no confirmation needed):
```bash
git push origin master
npx vercel --prod
```
Then re-point the alias to the new production deployment:
```bash
npx vercel alias set <latest-deployment-url-from-previous-command> reservavereda.vercel.app
```

- [ ] **Step 4: Final live check**

Navigate Playwright to `https://reservavereda.vercel.app?v=<cache-bust>` and repeat Step 1's scroll-through against production to confirm the deploy matches what was verified locally.

---

## Self-Review Notes

- **Spec coverage:** placement between `#form`/footer (Task 2 Step 1), data model per card incl. status badge/location/units/towers/VGV (Task 1 Step 6, spec section 2), Reserva Vereda highlight (Task 1 Step 6 `highlight: true` + Task 2 Step 2 `.track-highlight` CSS, spec section 2), asset extraction via dedicated `tools/` script (Task 1), site-styled visuals — `font-serif`, `gold-400`, `organic`-style rounded photos, no raster logos (Task 1 Global Constraints + Task 2 Step 2/3, spec section 3), desktop pinned scroll-jack + mobile native scroll + `prefers-reduced-motion` fallback (Task 3, spec section 4), local server + Playwright verification (Task 2 Step 6, Task 3 Steps 4-5, Task 4, spec "Testes/Verificação"). Out-of-scope items from the spec (nav link, final copy, QR/tracking) are correctly not touched anywhere in this plan.
- **Type/interface consistency:** `window.TRACK_RECORD` field names (`row`, `status`, `statusLabel`, `statusYear`, `statusMonth`, `photo`, `highlight`, etc.) are used identically between Task 1 Step 6 (data) and Task 2 Step 3 (`trackCardHTML`/`trackStatusText`) — no renamed fields between tasks. `#track-viewport`/`#track-track` ids are introduced in Task 2 Step 1 and consumed unchanged by Task 2 Step 3 (`renderTrackRecord`) and Task 3 Step 2 (`initTrackScroll`).
- **Sequencing:** Task 1 must complete before Task 2 (data + photos are inputs to the renderer). Task 2 must complete before Task 3 (pin logic reads rendered card widths). Task 4 depends on all three. Photo crop fractions in Task 1's `CROPS` table are explicitly starting estimates with a built-in inspect-and-correct step (Steps 3-4) — this follows the same pattern already used successfully in this repo's `tools/extract-panfleto-map.js` task, not a placeholder.
