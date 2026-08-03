# Ajustes Solicitados (Site Pirata) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement every item in `C:\Users\Doc\Downloads\Ajustes Solicitados - Site Pirata.md` (client feedback, sourced from `SITEPIRATA.docx`) on the live Reserva Vereda teaser site: a cinematic pinned-scroll hero rebuild with a 90-day countdown, CTA copy changes, two new section eyebrow labels, Elleven/CS co-branding, and Track Record product-listing maintenance (including a new photo for Águas do Cerrado).

**Architecture:** Static HTML + Tailwind CDN + vanilla JS, zero build step (unchanged). Work happens on `site/index.html`, `site/privacy.html`, `site/js/main.js`, `site/js/config.js`, `site/js/track-record.js`, `site/js/track-record-data.js`, plus one new binary asset under `site/assets/images/track/` produced by a new `tools/process-track-aguas-cerrado.js` script (sharp), following the existing `tools/*.js` one-script-per-image-need pattern.

**Tech Stack:** Tailwind CDN (utility classes via `js/tailwind-config.js`), GSAP + ScrollTrigger + Lenis (already wired in `js/main.js`), `sharp` (Node, in `tools/`, already installed in `tools/node_modules`).

## Global Constraints

- Repo root: `C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site`. This is "another substantial multi-task round" per this project's established workflow — create a fresh worktree/branch via **superpowers:using-git-worktrees** before starting Task 1, rather than editing `master` directly.
- Site color tokens (do not invent new hex values — reuse these): `forest-950 #0B1712`, `forest-900 #11221B`, `forest-800 #172E23`, `gold-400 #CBA97A`, `gold-600 #A9824F`, `offwhite #F4F1E8`.
- No automated test framework exists for this static site. Every task's "verification" step is a `grep`/`node -e` check or manual visual review — this is expected, not a gap to fill in.
- **No Playwright/browser-automation tools without asking first, even though this project has been given scoped consent in past sessions** — the underlying Chrome-install incident is still unresolved, and consent has always been asked for fresh each session, never treated as a standing blanket grant. This matters most for Task 6 (the pinned hero scroll-story), which is genuinely hard to fully verify by reading code alone — ask the user for a read-only Playwright pass (navigate + screenshot + scroll only) before relying solely on static review for that task.
- `assets/images/track/17-aguas-do-cerrado.jpg` is produced from a source file that already exists at `tools/_track-hires/aguas-do-cerrado-source.jpg` (1920×1080, downloaded from the client's shared Google Drive link in the ajustes doc — file "Key Visual_ÁGUAS DO CERRADO.jpg"). That source is a full marketing composite (building render + lifestyle photo + logo + spec text baked in); Task 3 crops out just the clean building-render strip (verified by visual inspection already — see Task 3 for the exact crop box).
- Out of scope (do not touch): `FORMSPREE_ENDPOINT`/`NOTIFY_EMAIL`/`WHATSAPP_NUMBER` placeholders in `config.js`, Galeria section copy, the footer legal disclaimer paragraph's legal text itself (only the already-resolved "material impresso" sentence is verified, not edited — see Task 1), any "Reserva Vereda Granja Viana" → "Reserva Vereda" renaming outside the Track Record listing entry (the ajustes doc scopes that rename to "o nome do produto na listagem" specifically).
- Two items in the ajustes doc are **already satisfied** by an earlier full-site replace done the day before this plan was written: the "Conectividade" eyebrow (removed), the "Track Record" eyebrow (removed), and the footer's "material impresso" sentence (removed). Task 1 includes a verification-only step for these — do not re-implement removals that already happened.

---

### Task 1: Copy, section-label & co-branding pass

**Files:**
- Modify: `site/index.html:101-103` (Proximidades eyebrow), `site/index.html:349-352` (Quem Somos eyebrow + CS co-branding)
- Modify: `site/privacy.html:17`, `site/privacy.html:41` (CS co-branding)

**Interfaces:**
- Produces: no new IDs/classes — pure text-content changes plus one new `<p class="...">` eyebrow element per section, matching the existing eyebrow pattern already used in the Galeria section (`site/index.html:259`, `<p class="text-gold-400 text-xs md:text-sm uppercase tracking-[0.2em] mb-3">Galeria</p>`).

- [ ] **Step 1: Add the "Proximidades" eyebrow to the localização section**

In `site/index.html`, find:
```html
    <div class="relative max-w-4xl mx-auto text-center px-6 mt-12 md:mt-16 js-reveal">
      <div class="js-divider mx-auto mb-6 h-1 w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
      <h2 class="font-serif text-3xl md:text-5xl text-gold-400 mb-6">Granja Viana: perto de tudo o que faz parte da sua rotina.</h2>
```
Replace with:
```html
    <div class="relative max-w-4xl mx-auto text-center px-6 mt-12 md:mt-16 js-reveal">
      <div class="js-divider mx-auto mb-6 h-1 w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
      <p class="text-offwhite/70 text-xs md:text-sm uppercase tracking-[0.2em] mb-3">Proximidades</p>
      <h2 class="font-serif text-3xl md:text-5xl text-gold-400 mb-6">Granja Viana: perto de tudo o que faz parte da sua rotina.</h2>
```

- [ ] **Step 2: Add the "Quem Somos" eyebrow and the Elleven/CS co-branding line to the trajetória section**

In `site/index.html`, find:
```html
      <div class="max-w-3xl mx-auto text-center js-reveal mb-8 px-6">
        <div class="js-divider mx-auto mb-6 h-1 w-20 bg-gradient-to-r from-transparent via-gold-600 to-transparent"></div>
        <h2 class="font-serif text-3xl md:text-5xl text-forest-950 mb-4">Uma trajetória de resultados.</h2>
        <p class="text-forest-950/70 max-w-xl mx-auto">17 empreendimentos entregues, em obras e lançados pela Elleven Engenharia — incluindo o Reserva Vereda.</p>
      </div>
```
Replace with:
```html
      <div class="max-w-3xl mx-auto text-center js-reveal mb-8 px-6">
        <div class="js-divider mx-auto mb-6 h-1 w-20 bg-gradient-to-r from-transparent via-gold-600 to-transparent"></div>
        <p class="text-gold-600 text-xs md:text-sm uppercase tracking-[0.2em] mb-3">Quem Somos</p>
        <h2 class="font-serif text-3xl md:text-5xl text-forest-950 mb-4">Uma trajetória de resultados.</h2>
        <p class="text-forest-950/70 max-w-xl mx-auto">17 empreendimentos entregues, em obras e lançados pela Elleven Engenharia em parceria com a CS Empreendimentos Imobiliários — incluindo o Reserva Vereda.</p>
      </div>
```

- [ ] **Step 3: Add CS co-branding to the privacy policy page**

In `site/privacy.html`, find (line 17):
```html
      <p>Esta política descreve como o Reserva Vereda Granja Viana, empreendimento da Elleven Engenharia, trata os dados pessoais fornecidos por meio deste site, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>
```
Replace with:
```html
      <p>Esta política descreve como o Reserva Vereda Granja Viana, empreendimento da Elleven Engenharia em parceria com a CS Empreendimentos Imobiliários, trata os dados pessoais fornecidos por meio deste site, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>
```

Find (line 41):
```html
        <p>Elleven Engenharia — contato: <span id="privacy-contact-email">contato@reservavereda.com.br</span></p>
```
Replace with:
```html
        <p>Elleven Engenharia e CS Empreendimentos Imobiliários — contato: <span id="privacy-contact-email">contato@reservavereda.com.br</span></p>
```

- [ ] **Step 4: Verify the eyebrow/co-branding edits landed, and confirm the already-resolved items stayed resolved**

Run:
```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
grep -n "Proximidades" site/index.html
grep -n "Quem Somos" site/index.html
grep -n "CS Empreendimentos Imobiliários" site/index.html site/privacy.html
```
Expected: one match each for `Proximidades` and `Quem Somos`, and three matches total for `CS Empreendimentos Imobiliários` (trajetória paragraph, privacy.html line 17, privacy.html line 41).

Run:
```bash
grep -ni "impresso" site/index.html
grep -n "text-offwhite/70 text-xs md:text-sm uppercase tracking-\[0.2em\] mb-3\">Conectividade\|>Track Record<" site/index.html
```
Expected: no output from either command (both already removed by the prior day's replace — this step just confirms nothing regressed).

- [ ] **Step 5: Commit**

```bash
git add site/index.html site/privacy.html
git commit -m "Add Proximidades/Quem Somos eyebrows, cite Elleven and CS together"
```

---

### Task 2: Track Record product-listing maintenance

**Files:**
- Modify: `site/js/track-record-data.js:18,19,21,22,23`
- Modify: `site/js/track-record.js:15-20` (`trackStatusText`)
- Delete: `site/assets/images/track/15-style-um.jpg`, `site/assets/images/track/16-alma-da-mata.jpg` (orphaned once their data entries are removed)

**Interfaces:**
- Modifies: `trackStatusText(entry)` — now returns `entry.statusLabel` alone (no trailing date) when `entry.statusYear` is falsy. Every other call site (`trackStatusPillHTML` in the same file) already just calls this function and interpolates the result, so no other file needs to change.

- [ ] **Step 1: Let `trackStatusText` support a dateless status (needed for Althea below)**

In `site/js/track-record.js`, find:
```js
function trackStatusText(entry) {
  if (entry.statusMonth) {
    return `${entry.statusLabel} ${entry.statusMonth}/${entry.statusYear}`;
  }
  return `${entry.statusLabel} ${entry.statusYear}`;
}
```
Replace with:
```js
function trackStatusText(entry) {
  if (!entry.statusYear) {
    return entry.statusLabel;
  }
  if (entry.statusMonth) {
    return `${entry.statusLabel} ${entry.statusMonth}/${entry.statusYear}`;
  }
  return `${entry.statusLabel} ${entry.statusYear}`;
}
```

- [ ] **Step 2: Icaraí — set delivery to December 2026**

In `site/js/track-record-data.js`, find:
```js
  { id: 'icarai', name: 'Icaraí Parque Clube', row: 'bottom', launch: '01/2022', location: 'Salto, São Paulo', units: '408 Unidades', towers: '4 Torres', vgv: 'R$ 233.000.000,00', status: 'entregue', statusLabel: 'Entregue', statusYear: '2023', statusMonth: 'Março', photo: 'assets/images/track/11-icarai.jpg', highlight: false },
```
Replace with:
```js
  { id: 'icarai', name: 'Icaraí Parque Clube', row: 'bottom', launch: '01/2022', location: 'Salto, São Paulo', units: '408 Unidades', towers: '4 Torres', vgv: 'R$ 233.000.000,00', status: 'em-obras', statusLabel: 'Em obras — entrega prevista', statusYear: '2026', statusMonth: 'Dezembro', photo: 'assets/images/track/11-icarai.jpg', highlight: false },
```

- [ ] **Step 3: Althea — remove the delivery prediction entirely**

In `site/js/track-record-data.js`, find:
```js
  { id: 'althea', name: 'Althea Granja Viana', row: 'top', launch: '08/2025', location: 'Cotia, São Paulo', units: '199 Unidades', towers: '3 Torres', vgv: 'R$ 70.000.000,00', status: 'em-obras', statusLabel: 'Em obras — entrega prevista <br><b>', statusYear: '2026</b>', statusMonth: 'Novembro', photo: 'assets/images/track/12-althea.jpg', highlight: false },
```
Replace with:
```js
  { id: 'althea', name: 'Althea Granja Viana', row: 'top', launch: '08/2025', location: 'Cotia, São Paulo', units: '199 Unidades', towers: '3 Torres', vgv: 'R$ 70.000.000,00', status: 'em-obras', statusLabel: 'Em obras', statusYear: null, statusMonth: null, photo: 'assets/images/track/12-althea.jpg', highlight: false },
```

- [ ] **Step 4: Reserva Vereda — drop the "Granja Viana" suffix from the listing name**

In `site/js/track-record-data.js`, find:
```js
  { id: 'reserva-vereda', name: 'Reserva Vereda Granja Viana', row: 'top', launch: null, location: 'Granja Viana, São Paulo', units: '76 Casas', towers: null, vgv: 'R$ 138.000.000,00', status: 'lancamento', statusLabel: 'Lançamento', statusYear: '2026', statusMonth: null, photo: 'assets/images/track/14-reserva-vereda.jpg', highlight: true },
```
Replace with:
```js
  { id: 'reserva-vereda', name: 'Reserva Vereda', row: 'top', launch: null, location: 'Granja Viana, São Paulo', units: '76 Casas', towers: null, vgv: 'R$ 138.000.000,00', status: 'lancamento', statusLabel: 'Lançamento', statusYear: '2026', statusMonth: null, photo: 'assets/images/track/14-reserva-vereda.jpg', highlight: true },
```

- [ ] **Step 5: Remove Style Um and Alma da Mata from the listing entirely**

In `site/js/track-record-data.js`, delete these two lines completely:
```js
  { id: 'style-um', name: 'Style Um', row: 'top', launch: null, location: null, units: '206 Unidades', towers: null, vgv: 'R$ 80.000.000,00', status: 'lancamento', statusLabel: 'Lançamento', statusYear: '2026', statusMonth: null, photo: 'assets/images/track/15-style-um.jpg', highlight: false },
  { id: 'alma-da-mata', name: 'Alma da Mata', row: 'bottom', launch: null, location: 'Bragança Paulista, São Paulo', units: '227 Unidades', towers: null, vgv: 'R$ 273.000.000,00', status: 'lancamento', statusLabel: 'Lançamento', statusYear: '2026', statusMonth: null, photo: 'assets/images/track/16-alma-da-mata.jpg', highlight: false },
```

- [ ] **Step 6: Delete the now-unused photo files for the two removed entries**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
git rm site/assets/images/track/15-style-um.jpg site/assets/images/track/16-alma-da-mata.jpg
```

- [ ] **Step 7: Verify**

Run:
```bash
grep -n "style-um\|alma-da-mata" site/js/track-record-data.js
```
Expected: no output (both entries fully removed).

Run:
```bash
node -e "
window = {};
require('./site/js/track-record-data.js');
console.log(window.TRACK_RECORD.length, 'entries');
console.log(window.TRACK_RECORD.map(e => e.id).join(', '));
const althea = window.TRACK_RECORD.find(e => e.id === 'althea');
const icarai = window.TRACK_RECORD.find(e => e.id === 'icarai');
console.log('althea:', JSON.stringify(althea));
console.log('icarai:', JSON.stringify(icarai));
"
```
Expected: `14 entries` (16 minus 2), the id list has no `style-um` or `alma-da-mata`, Althea shows `statusYear:null,statusMonth:null`, Icaraí shows `status:'em-obras'` and `statusMonth:'Dezembro'`.

- [ ] **Step 8: Commit**

```bash
git add site/js/track-record-data.js site/js/track-record.js
git commit -m "Update Track Record listing: Icaraí->Dez/2026, Althea drop date, rename Reserva Vereda, remove Style Um and Alma da Mata"
```

---

### Task 3: Águas do Cerrado photo

**Files:**
- Create: `tools/process-track-aguas-cerrado.js`
- Create: `site/assets/images/track/17-aguas-do-cerrado.jpg`
- Modify: `site/js/track-record-data.js:24`

**Interfaces:**
- Consumes: `tools/_track-hires/aguas-do-cerrado-source.jpg` (already present locally — see Global Constraints).
- Produces: `site/assets/images/track/17-aguas-do-cerrado.jpg`, referenced by the Águas do Cerrado entry's `photo` field exactly like every other entry.

- [ ] **Step 1: Write the crop/resize script**

Create `tools/process-track-aguas-cerrado.js`:
```js
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
```

- [ ] **Step 2: Run it**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\tools"
node process-track-aguas-cerrado.js
```
Expected: `wrote .../site/assets/images/track/17-aguas-do-cerrado.jpg`, no errors.

- [ ] **Step 3: Wire the new photo into the data**

In `site/js/track-record-data.js`, find:
```js
  { id: 'aguas-do-cerrado', name: 'Águas do Cerrado Residencial', row: 'bottom', launch: null, location: 'Valinhos, São Paulo', units: '329 Unidades', towers: null, vgv: 'R$ 312.000.000,00', status: 'lancamento', statusLabel: 'Lançamento', statusYear: '2027', statusMonth: null, photo: null, highlight: false },
```
Replace with:
```js
  { id: 'aguas-do-cerrado', name: 'Águas do Cerrado Residencial', row: 'bottom', launch: null, location: 'Valinhos, São Paulo', units: '329 Unidades', towers: null, vgv: 'R$ 312.000.000,00', status: 'lancamento', statusLabel: 'Lançamento', statusYear: '2027', statusMonth: null, photo: 'assets/images/track/17-aguas-do-cerrado.jpg', highlight: false },
```

- [ ] **Step 4: Verify the output image and the data wiring**

Run:
```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
node -e "
const sharp = require('./tools/node_modules/sharp');
sharp('site/assets/images/track/17-aguas-do-cerrado.jpg').metadata().then(m => console.log(m.width, m.height, m.format));
"
grep -n "aguas-do-cerrado" site/js/track-record-data.js
```
Expected: dimensions print as `600 <some height> jpeg`, and the grep shows `photo: 'assets/images/track/17-aguas-do-cerrado.jpg'` (no `photo: null` left for this entry).

- [ ] **Step 5: Tidy the scratch crop-preview files (never committed — gitignored — but keep the folder clean)**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\tools\_track-hires"
rm -f aguas-do-cerrado-crop-preview.jpg aguas-do-cerrado-crop-preview2.jpg
```

- [ ] **Step 6: Commit**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
git add tools/process-track-aguas-cerrado.js site/assets/images/track/17-aguas-do-cerrado.jpg site/js/track-record-data.js
git commit -m "Add Águas do Cerrado track-record photo"
```

---

### Task 4: Hero markup rebuild (big logo, second line, countdown slots)

**Files:**
- Modify: `site/index.html:44-66` (entire `<section id="hero">`)

**Interfaces:**
- Produces new element IDs that Task 5 and Task 6 depend on: `#hero-logo`, `#hero-line-2`, `#hero-countdown` (containing `#countdown-days`, `#countdown-hours`, `#countdown-minutes`, `#countdown-seconds`). Keeps existing IDs `#hero`, `#hero-bg`, `#hero-headline`, `#hero-subtitle`, `#hero-cta` unchanged so `initParallax()`, `initStickyChrome()`, and `initLeadForm()`'s CTA wiring (`.js-cta-profile`) keep working untouched.
- Also fixes a pre-existing markup bug in this exact block: a stray duplicate `</h1>` closing tag right after the real one.
- Also applies the CTA copy change from the ajustes doc (in scope here, not Task 1, since this whole block is being replaced anyway): "Sou cliente e quero garantir meu espaço" → "Sou cliente e quero mais informações", "Sou parceiro e quero vender este projeto" → "Sou corretor/imobiliária".

- [ ] **Step 1: Replace the hero section**

In `site/index.html`, find the entire block from `<section id="hero" ...>` through its closing `</section>` (currently lines 44-66):
```html
  <section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0">
      <img id="hero-bg" src="assets/images/hero-facade.jpg" alt="" class="js-parallax w-full h-full object-cover scale-110" />
      <div class="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-forest-950/40"></div>
    </div>
    <div class="relative z-10 max-w-3xl px-6 text-center">
      <img src="assets/logo.svg" alt="Reserva Vereda Granja Viana" class="mx-auto mb-8 w-48 md:w-56" />
      <h1 id="hero-headline" class="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-offwhite mb-6">
        Em breve, o empreendimento mais desejado da <b>Granja Viana</b>.</h1>
      </h1>
      <p id="hero-subtitle" class="font-sans text-base md:text-lg text-offwhite/80 mb-10">
        Um novo capítulo de exclusividade e bem-estar está para começar. Prepare-se para viver o extraordinário.
      </p>
      <div id="hero-cta" class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#form" data-profile="Cliente" class="js-cta-profile inline-block border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-forest-950 hover:shadow-[0_0_20px_rgba(203,169,122,0.5)] transition-all duration-300 px-8 py-3 tracking-widest text-sm uppercase">
          Sou cliente e quero garantir meu espaço
        </a>
        <a href="#form" data-profile="Parceiro/Imobiliária" class="js-cta-profile inline-block border border-offwhite/50 text-offwhite hover:bg-offwhite/10 transition-all duration-300 px-8 py-3 tracking-widest text-sm uppercase">
          Sou parceiro e quero vender este projeto
        </a>
      </div>
    </div>
  </section>
```
Replace with:
```html
  <section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0">
      <img id="hero-bg" src="assets/images/hero-facade.jpg" alt="" class="js-parallax w-full h-full object-cover scale-110" />
      <div class="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-forest-950/40"></div>
    </div>
    <div class="relative z-10 max-w-3xl px-6 text-center">
      <img id="hero-logo" src="assets/logo.svg" alt="Reserva Vereda Granja Viana" class="mx-auto mb-8 w-[78vw] max-w-sm sm:max-w-md md:max-w-xl lg:max-w-3xl" />
      <h1 id="hero-headline" class="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-offwhite mb-6">
        Em breve, o empreendimento mais desejado da <b>Granja Viana</b>.
      </h1>
      <p id="hero-line-2" class="font-serif text-xl md:text-3xl lg:text-4xl leading-snug text-gold-400 mb-8">
        Se você está buscando casa na Granja Viana, pare imediatamente e aguarde esse lançamento.
      </p>
      <div id="hero-countdown" class="flex items-center justify-center gap-3 md:gap-5 mb-8">
        <div class="text-center">
          <span id="countdown-days" class="block font-serif text-3xl md:text-4xl text-gold-400 tabular-nums">00</span>
          <span class="block text-[10px] md:text-xs uppercase tracking-widest text-offwhite/60">Dias</span>
        </div>
        <span class="text-offwhite/30 text-2xl md:text-3xl leading-none pb-4">:</span>
        <div class="text-center">
          <span id="countdown-hours" class="block font-serif text-3xl md:text-4xl text-gold-400 tabular-nums">00</span>
          <span class="block text-[10px] md:text-xs uppercase tracking-widest text-offwhite/60">Horas</span>
        </div>
        <span class="text-offwhite/30 text-2xl md:text-3xl leading-none pb-4">:</span>
        <div class="text-center">
          <span id="countdown-minutes" class="block font-serif text-3xl md:text-4xl text-gold-400 tabular-nums">00</span>
          <span class="block text-[10px] md:text-xs uppercase tracking-widest text-offwhite/60">Min</span>
        </div>
        <span class="text-offwhite/30 text-2xl md:text-3xl leading-none pb-4">:</span>
        <div class="text-center">
          <span id="countdown-seconds" class="block font-serif text-3xl md:text-4xl text-gold-400 tabular-nums">00</span>
          <span class="block text-[10px] md:text-xs uppercase tracking-widest text-offwhite/60">Seg</span>
        </div>
      </div>
      <p id="hero-subtitle" class="font-sans text-base md:text-lg text-offwhite/80 mb-10">
        Um novo capítulo de exclusividade e bem-estar está para começar. Prepare-se para viver o extraordinário.
      </p>
      <div id="hero-cta" class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#form" data-profile="Cliente" class="js-cta-profile inline-block border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-forest-950 hover:shadow-[0_0_20px_rgba(203,169,122,0.5)] transition-all duration-300 px-8 py-3 tracking-widest text-sm uppercase">
          Sou cliente e quero mais informações
        </a>
        <a href="#form" data-profile="Parceiro/Imobiliária" class="js-cta-profile inline-block border border-offwhite/50 text-offwhite hover:bg-offwhite/10 transition-all duration-300 px-8 py-3 tracking-widest text-sm uppercase">
          Sou corretor/imobiliária
        </a>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Verify**

Run:
```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
grep -c "</h1>" site/index.html
grep -n "id=\"hero-logo\"\|id=\"hero-line-2\"\|id=\"countdown-days\"\|id=\"countdown-hours\"\|id=\"countdown-minutes\"\|id=\"countdown-seconds\"" site/index.html
grep -n "Sou cliente e quero mais informações\|Sou corretor/imobiliária" site/index.html
```
Expected: exactly one `</h1>` in the whole file (was two before — the stray one is gone); one match for each of the six new IDs; both new CTA strings present.

- [ ] **Step 3: Commit**

```bash
git add site/index.html
git commit -m "Rebuild hero markup: bigger logo, second headline, countdown slots, CTA copy"
```

---

### Task 5: Countdown timer

**Files:**
- Modify: `site/js/config.js`
- Modify: `site/js/main.js` (add `initCountdown()`, register it in the `DOMContentLoaded` listener)

**Interfaces:**
- Consumes: `#countdown-days` / `#countdown-hours` / `#countdown-minutes` / `#countdown-seconds` from Task 4, `SITE_CONFIG.COUNTDOWN_TARGET` from this task's own `config.js` change.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add the target date to config**

In `site/js/config.js`, find:
```js
window.SITE_CONFIG = {
  // Create a form at https://formspree.io (free tier works fine), then
  // paste its endpoint URL here, e.g. "https://formspree.io/f/abc123".
  FORMSPREE_ENDPOINT: 'TODO_FORMSPREE_ENDPOINT',

  // Reference only — the actual recipient inbox is whatever email owns the
  // Formspree form above. Also shown on the privacy policy page.
  NOTIFY_EMAIL: 'TODO_NOTIFY_EMAIL',

  // Digits only, country + area code, e.g. "5511999998888". Used to build
  // the footer's wa.me WhatsApp link.
  WHATSAPP_NUMBER: 'TODO_WHATSAPP_NUMBER',
};
```
Replace with:
```js
window.SITE_CONFIG = {
  // Create a form at https://formspree.io (free tier works fine), then
  // paste its endpoint URL here, e.g. "https://formspree.io/f/abc123".
  FORMSPREE_ENDPOINT: 'TODO_FORMSPREE_ENDPOINT',

  // Reference only — the actual recipient inbox is whatever email owns the
  // Formspree form above. Also shown on the privacy policy page.
  NOTIFY_EMAIL: 'TODO_NOTIFY_EMAIL',

  // Digits only, country + area code, e.g. "5511999998888". Used to build
  // the footer's wa.me WhatsApp link.
  WHATSAPP_NUMBER: 'TODO_WHATSAPP_NUMBER',

  // Hero countdown target. Set to 90 days from 2026-08-03 (the date this was
  // configured, per the client's "90 dias" request) = 2026-11-01, midnight
  // America/Sao_Paulo. Update this single value if the client gives a real
  // launch date later — everything else recalculates automatically.
  COUNTDOWN_TARGET: '2026-11-01T00:00:00-03:00',
};
```

- [ ] **Step 2: Add `initCountdown()` to `main.js`**

In `site/js/main.js`, find:
```js
function initProfileCTA() {
  const perfilField = document.getElementById('field-perfil');
  if (!perfilField) return;

  document.querySelectorAll('.js-cta-profile').forEach((link) => {
    link.addEventListener('click', () => {
      const profile = link.dataset.profile;
      if (profile) perfilField.value = profile;
    });
  });
}
```
Add this new function immediately after it (end of file):
```js

function initCountdown() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
  if (!window.SITE_CONFIG || !SITE_CONFIG.COUNTDOWN_TARGET) return;

  const target = new Date(SITE_CONFIG.COUNTDOWN_TARGET).getTime();

  function tick() {
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}
```

- [ ] **Step 3: Register it in the `DOMContentLoaded` listener**

In `site/js/main.js`, find:
```js
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeroAnimation();
  initScrollReveals();
  initDividers();
  initParallax();
  initStickyChrome();
  initHeroSealDock();
  initAnchorScroll();
  initLightbox();
  initLeadForm();
  initProfileCTA();
  initTrail();
});
```
Replace with (note: `initHeroAnimation` is replaced by `initHeroScrollStory` in Task 6 — for this task alone, just add the countdown call and leave `initHeroAnimation` where it is; Task 6 will do the rename):
```js
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeroAnimation();
  initScrollReveals();
  initDividers();
  initParallax();
  initStickyChrome();
  initHeroSealDock();
  initAnchorScroll();
  initLightbox();
  initLeadForm();
  initProfileCTA();
  initTrail();
  initCountdown();
});
```

- [ ] **Step 4: Verify with a fake target date in the past and in the future**

Run:
```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\site"
node -e "
global.window = {};
global.document = {
  getElementById: (id) => ({ textContent: '', padStart: undefined, _id: id }),
};
require('./js/config.js');
console.log('target parses:', !isNaN(new Date(window.SITE_CONFIG.COUNTDOWN_TARGET).getTime()));
const target = new Date(window.SITE_CONFIG.COUNTDOWN_TARGET).getTime();
const diff = target - Date.now();
console.log('days remaining from today:', Math.floor(diff / 86400000));
"
```
Expected: `target parses: true`, and `days remaining from today` prints a positive number in the high 80s/89-90 range (run relative to today, 2026-08-03 — should not be negative and should not be wildly larger than 90).

- [ ] **Step 5: Commit**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
git add site/js/config.js site/js/main.js
git commit -m "Add 90-day hero countdown timer"
```

---

### Task 6: Hero pinned scroll-story + seal reposition

**Files:**
- Modify: `site/js/main.js`

**Interfaces:**
- Consumes: `#hero-logo`, `#hero-headline`, `#hero-line-2`, `#hero-countdown`, `#hero-subtitle`, `#hero-cta` from Task 4.
- Removes: `splitIntoWords()` and `initHeroAnimation()` (fully replaced — no other function calls `splitIntoWords`, confirmed by grep before writing this plan).
- Produces: `initHeroScrollStory()`, called from `DOMContentLoaded` in place of `initHeroAnimation()`.

- [ ] **Step 1: Remove `splitIntoWords` and `initHeroAnimation`, add `initHeroScrollStory`**

In `site/js/main.js`, find:
```js
function splitIntoWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words
    .map((w) => `<span class="inline-block overflow-hidden align-top"><span class="hero-word inline-block">${w}&nbsp;</span></span>`)
    .join('');
  return el.querySelectorAll('.hero-word');
}

function initHeroAnimation() {
  if (typeof gsap === 'undefined') return;

  const headline = document.getElementById('hero-headline');
  const subtitle = document.getElementById('hero-subtitle');
  const cta = document.getElementById('hero-cta');
  const words = splitIntoWords(headline);

  gsap.set(words, { yPercent: 110, opacity: 0 });
  gsap.set([subtitle, cta], { opacity: 0, y: 16 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('#hero-bg', { scale: 1.12 }, { scale: 1.06, duration: 2.4 })
    .to(words, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.3)
    .to(subtitle, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
    .to(cta, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');
}
```
Replace with:
```js
function initHeroScrollStory() {
  if (typeof gsap === 'undefined') return;

  const hero = document.getElementById('hero');
  const logo = document.getElementById('hero-logo');
  const headline = document.getElementById('hero-headline');
  const line2 = document.getElementById('hero-line-2');
  const countdown = document.getElementById('hero-countdown');
  const subtitle = document.getElementById('hero-subtitle');
  const cta = document.getElementById('hero-cta');
  if (!hero || !logo) return;

  gsap.fromTo('#hero-bg', { scale: 1.12 }, { scale: 1.06, duration: 2.4, ease: 'power3.out' });

  const revealTargets = [headline, line2, countdown, subtitle, cta].filter(Boolean);
  gsap.set(revealTargets, { opacity: 0, y: 24 });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  if (prefersReducedMotion || !isDesktop || typeof ScrollTrigger === 'undefined') {
    // Mobile / reduced-motion fallback: no scroll-jacking pin, everything
    // reveals in place shortly after load instead, matching the site's
    // normal (non-pinned) .js-reveal fade-in pattern used elsewhere.
    gsap.to(revealTargets, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, delay: 0.4, ease: 'power2.out' });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Pins #hero itself (it's already min-h-screen) for an extended scroll
  // range and scrubs a single timeline across it: the huge logo shrinks
  // first to make room, then the two client-mandated headlines reveal in
  // sequence, then the countdown/subtitle/CTA reveal together just before
  // the pin releases and the page continues scrolling normally.
  gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=220%',
      pin: true,
      scrub: 1,
    },
  })
    .to(logo, { scale: 0.55, duration: 1, ease: 'power2.inOut' }, 0)
    .to(headline, { opacity: 1, y: 0, duration: 1 }, 0.4)
    .to(line2, { opacity: 1, y: 0, duration: 1 }, 1.6)
    .to([countdown, subtitle, cta], { opacity: 1, y: 0, duration: 1, stagger: 0.15 }, 2.8);
}
```

- [ ] **Step 2: Update the `DOMContentLoaded` listener to call the renamed function**

In `site/js/main.js`, find:
```js
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeroAnimation();
  initScrollReveals();
```
Replace with:
```js
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeroScrollStory();
  initScrollReveals();
```

- [ ] **Step 3: Reposition the Elleven seal so it stays corner-anchored instead of drifting over the (now taller) hero text column**

In `site/js/main.js`, find:
```js
  gsap.fromTo(
    seal,
    { scale: 1.65, x: () => window.innerWidth * 0.14, y: () => -window.innerHeight * 0.28 },
    {
      scale: 1,
      x: 0,
      y: 0,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    }
  );
```
Replace with:
```js
  gsap.fromTo(
    seal,
    { scale: 1.2, x: () => window.innerWidth * 0.04, y: () => -window.innerHeight * 0.08 },
    {
      scale: 1,
      x: 0,
      y: 0,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    }
  );
```

- [ ] **Step 4: Verify**

Run:
```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
grep -n "function splitIntoWords\|function initHeroAnimation\|function initHeroScrollStory" site/js/main.js
grep -n "initHeroScrollStory();" site/js/main.js
grep -n "scale: 1.65\|scale: 1.2, x: () => window.innerWidth \* 0.04" site/js/main.js
```
Expected: no match for `function splitIntoWords` or `function initHeroAnimation` (both removed); one match for `function initHeroScrollStory`; one match for `initHeroScrollStory();` (the call site); no match for `scale: 1.65` (old seal offset gone) and one match for the new `scale: 1.2, x: ...0.04` line.

- [ ] **Step 5: Ask the user for a fresh Playwright consent check, then do a real scroll-through**

Per this project's standing rule (see Global Constraints), ask before using Playwright even though past sessions allowed it. If granted: serve the site locally (`npx --yes serve site -p 4173`, background), navigate, and scroll through the hero in small increments confirming: logo starts large and alone, headline appears, then the second line, then countdown/subtitle/CTA together, the pin releases into the normal page, and the Elleven seal never overlaps the text column at any scroll position. If Playwright isn't authorized this session, do the equivalent review by reading the rendered timeline logic once more against the six-target list and note that a manual browser check is still recommended before the client sees it live.

While doing this pass, also check the ajustes doc's separate "Correção do Selo" item under the Proximidades section (the seal "saindo dos limites da página" while viewing that section, not the hero). Static analysis while writing this plan couldn't reproduce this — `initHeroSealDock`'s `scrollTrigger` only scrubs between `top top` and `bottom top` of `#hero`, so past that range the seal should already be resting at its plain `fixed bottom-5 left-5 lg:left-20` position with no transform applied, comfortably inside any viewport (the seal image is 214×200px, ~103-120px wide at its `h-24`/`h-28` display height). Scroll to the Proximidades section specifically and check the seal at viewport widths 375px, 768px, and 1440px. If it genuinely renders partially outside the viewport at any of those:
```css
/* In site/index.html, on the #elleven-seal div itself, add a safety clamp: */
class="fixed bottom-5 left-5 lg:left-20 z-50 origin-bottom-left max-w-[18vw]"
```
(constrains its rendered width so it can never exceed 18% of the viewport, which keeps it inside the visible area even on very narrow screens). If it does NOT reproduce, note that in the commit/report and do not make a speculative change — this may be a duplicated line in the client's source docx rather than a second real bug (the raw `SITE PIRATA.docx` content has the "AJUSTAR O SELO – FORA DA PAGINA" line duplicated back-to-back).

- [ ] **Step 6: Commit**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
git add site/js/main.js
git commit -m "Replace load-time hero animation with a pinned scroll-story, reposition Elleven seal"
```

---

## After all tasks: merge and deploy

Once Tasks 1-6 are done and committed on the worktree branch, follow **superpowers:finishing-a-development-branch** to merge back into `master`, then per this project's standing authorization (push/deploy without asking — see project memory), push to `origin master` and re-run `vercel alias set <latest-deployment-url> reservavereda.vercel.app` since that alias does not auto-follow new deploys.
