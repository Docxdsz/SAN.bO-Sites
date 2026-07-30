# Reserva Vereda Teaser Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the single-page "Fase Pirata" teaser site for Reserva Vereda Granja Viana — a lead-capture landing page matching the brand book's dark-green/gold identity, per `docs/superpowers/specs/2026-07-30-reserva-vereda-teaser-design.md`.

**Architecture:** Static HTML + Tailwind CDN + GSAP + Lenis, zero build step. One `index.html`, one `privacy.html`, a small `css/style.css`, and `js/tailwind-config.js` + `js/config.js` + `js/main.js`. Images are extracted once from the brand-book PDF via a small Node/sharp script and committed as final assets.

**Tech Stack:** HTML5, Tailwind CSS (browser CDN build), GSAP 3 + ScrollTrigger (CDN), Lenis (CDN), vanilla JS (no modules — plain scripts for `file://`/no-build compatibility), Node.js + sharp (dev-time only, for the asset pipeline), Poppler (`pdftoppm`) (dev-time only, for rendering PDF pages).

## Global Constraints

- No npm/build step for the deployed site — `site/` must work by opening `index.html` directly or uploading the folder as-is.
- All page copy is Portuguese, copied verbatim from `luxury_teaser_website_proposal.md` (quoted in each task below) — do not paraphrase.
- Color palette (Tailwind custom colors, used consistently across all tasks): `forest-950 #0B1712`, `forest-900 #11221B`, `forest-800 #172E23`, `gold-400 #CBA97A`, `gold-600 #A9824F`, `offwhite #F4F1E8`.
- Fonts: Playfair Display (serif, headings) + Montserrat (sans, body/UI), loaded via Google Fonts.
- `FORMSPREE_ENDPOINT`, `NOTIFY_EMAIL`, `WHATSAPP_NUMBER` are the only three values allowed to be placeholders (isolated to `js/config.js` and the privacy page's contact line) — everything else must be fully implemented, no other TODOs.
- No automated test framework — verification is via Playwright MCP tools (navigate/snapshot/screenshot/console) against a local static server, per the spec's QA section.
- Never use Windows' built-in `convert.exe` (System32 filesystem-conversion tool) — it is not ImageMagick. Image processing in this plan uses the `sharp` npm package exclusively.

---

## Local server for verification

Every task's verification steps assume a static file server is running at `http://localhost:5500` serving the `site/` folder. Start it once per work session:

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
npx --yes serve site -p 5500
```

Run this in the background (or a separate terminal). If the port is already in use, a server from an earlier task is already running — proceed straight to verification. All Playwright navigation in this plan targets `http://localhost:5500/index.html` or `http://localhost:5500/privacy.html`.

---

### Task 1: Asset extraction pipeline

**Files:**
- Create: `.gitignore`
- Create: `tools/package.json`
- Create: `tools/extract-assets.js`
- Create (generated, not committed): `.assets-src/page-01.jpg`, `.assets-src/page-06.jpg`, `.assets-src/page-08.jpg`, `.assets-src/page-40.jpg`
- Create (generated, committed): `site/assets/images/hero-facade.jpg`, `site/assets/images/promise-garden.jpg`, `site/assets/images/palm-texture.jpg`, `site/assets/logo.png`, `site/assets/partners.png`

**Interfaces:**
- Produces (consumed by Tasks 2–4): `site/assets/images/hero-facade.jpg`, `site/assets/images/promise-garden.jpg`, `site/assets/images/palm-texture.jpg`, `site/assets/logo.png`, `site/assets/partners.png`.

- [ ] **Step 1: Create `.gitignore`**

```
node_modules/
.assets-src/
```

- [ ] **Step 2: Create `tools/package.json`**

```json
{
  "name": "reserva-vereda-asset-tools",
  "private": true,
  "version": "1.0.0",
  "description": "One-time asset extraction pipeline for the Reserva Vereda teaser site. Not part of the deployed site.",
  "dependencies": {
    "sharp": "^0.35.3"
  }
}
```

- [ ] **Step 3: Install `sharp`**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\tools"
npm install
```

Expected: installs without error, creates `tools/node_modules/`.

- [ ] **Step 4: Render the four source pages from the brand book at 300 DPI**

```bash
mkdir -p "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\.assets-src"
POPPLER="C:\Users\Doc\AppData\Local\Microsoft\WinGet\Packages\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\poppler-25.07.0\Library\bin\pdftoppm.exe"
SRC_PDF="C:\Users\Doc\Desktop\ReservaVereda\BOOK DO EMPREENDIMENTO - RESERVA VERDEDA - PRÉVIA - R.pdf"
OUT="C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\.assets-src"
"$POPPLER" -jpeg -r 300 -f 1 -l 1 "$SRC_PDF" "$OUT/page-01"
"$POPPLER" -jpeg -r 300 -f 6 -l 6 "$SRC_PDF" "$OUT/page-06"
"$POPPLER" -jpeg -r 300 -f 8 -l 8 "$SRC_PDF" "$OUT/page-08"
"$POPPLER" -jpeg -r 300 -f 40 -l 40 "$SRC_PDF" "$OUT/page-40"
```

If `pdftoppm` is already on PATH in your shell, you can drop the full `$POPPLER` path and call `pdftoppm` directly instead.

Expected: four files appear, each named like `page-01-01.jpg` (poppler appends the page number again). Rename them to drop the duplicate suffix:

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\.assets-src"
mv page-01-01.jpg page-01.jpg
mv page-06-06.jpg page-06.jpg
mv page-08-08.jpg page-08.jpg
mv page-40-40.jpg page-40.jpg
```

- [ ] **Step 5: Create `tools/extract-assets.js`**

These crop boxes were determined by visually inspecting each source page: page 6's bottom ~20% carries a caption bar and badge that must be excluded from the hero image; page 40's left ~20% is a blank margin outside the actual garden photo; page 8's top third is clean palm-leaf texture with no logo, while the logo itself sits in a tight box in the vertical center; page 1's partner-logo strip sits in a thin band near the bottom.

```js
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
    crop: (w, h) => ({ left: 0, top: 0, width: w, height: Math.round(h * 0.795) }),
    resizeWidth: 2400,
    jpegQuality: 82,
  },
  {
    src: 'page-40.jpg',
    out: 'images/promise-garden.jpg',
    crop: (w, h) => ({
      left: Math.round(w * 0.20),
      top: 0,
      width: Math.round(w * 0.80),
      height: h,
    }),
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
      left: Math.round(w * 0.275),
      top: Math.round(h * 0.415),
      width: Math.round(w * 0.41),
      height: Math.round(h * 0.15),
    }),
    resizeWidth: 900,
    png: true,
  },
  {
    src: 'page-01.jpg',
    out: 'partners.png',
    crop: (w, h) => ({
      left: Math.round(w * 0.05),
      top: Math.round(h * 0.9275),
      width: Math.round(w * 0.71),
      height: Math.round(h * 0.0575),
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
```

- [ ] **Step 6: Create the output directory and run the script**

```bash
mkdir -p "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\site\assets\images"
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\tools"
node extract-assets.js
```

Expected output: five `wrote ...` lines, one per asset, no errors.

- [ ] **Step 7: Verify output dimensions and visually spot-check**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\tools"
node -e "
const sharp = require('sharp');
const files = ['../site/assets/images/hero-facade.jpg','../site/assets/images/promise-garden.jpg','../site/assets/images/palm-texture.jpg','../site/assets/logo.png','../site/assets/partners.png'];
Promise.all(files.map(f => sharp(f).metadata().then(m => console.log(f, m.width + 'x' + m.height)))).catch(e => { console.error(e); process.exit(1); });
"
```

Expected: all five files print valid dimensions with no errors. Then use the Read tool on each of the five output files to visually confirm: `hero-facade.jpg` shows the facade render with no caption bar or badge text at the bottom; `promise-garden.jpg` shows the garden path with no blank margin on the left; `palm-texture.jpg` is pure leaf texture with no logo or text; `logo.png` shows the "Reserva Vereda / Granja Viana" wordmark tightly cropped; `partners.png` shows the four partner logos (Elleven, VCS, Conecta, SAN.bO) without excess surrounding photo.

If any crop is off, adjust the corresponding fraction in `tools/extract-assets.js` and re-run Step 6.

- [ ] **Step 8: Commit**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
git add .gitignore tools/package.json tools/extract-assets.js site/assets
git commit -m "Add asset extraction pipeline and generated site images"
```

---

### Task 2: HTML shell, Tailwind/font setup, and Hero section

**Files:**
- Create: `site/index.html`
- Create: `site/css/style.css`
- Create: `site/js/tailwind-config.js`
- Create: `site/js/config.js` (empty stub — filled in Task 6)
- Create: `site/js/main.js` (empty stub — filled in Task 5)

**Interfaces:**
- Consumes (from Task 1): `assets/images/hero-facade.jpg`, `assets/logo.png`.
- Produces (consumed by Tasks 3, 4, 5, 6): DOM IDs `#hero-bg`, `#hero-headline`, `#hero-subtitle`, `#hero-cta`; `site/js/tailwind-config.js` (shared Tailwind color/font token config, also consumed by `privacy.html` in Task 4 — do not duplicate this config inline in any other file); the `<body>` element with classes `bg-forest-950 text-offwhite font-sans antialiased`.

- [ ] **Step 1: Create empty JS stubs so script tags never 404**

`site/js/config.js`:
```js
// Filled in by Task 6 (js/config.js placeholder values).
```

`site/js/main.js`:
```js
// Filled in by Task 5 (hero animation) and Task 6 (scroll reveals + form).
```

- [ ] **Step 2: Create `site/js/tailwind-config.js`**

Shared between `index.html` and `privacy.html` (Task 4) so the color/font tokens are defined once.

```js
// js/tailwind-config.js
// Loaded after the Tailwind CDN <script> tag, before any page content.
// Shared by index.html and privacy.html — do not duplicate this config inline.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        forest: { 950: '#0B1712', 900: '#11221B', 800: '#172E23' },
        gold: { 400: '#CBA97A', 600: '#A9824F' },
        offwhite: '#F4F1E8',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
};
```

- [ ] **Step 3: Create `site/css/style.css`**

```css
/* css/style.css */
html {
  scroll-behavior: auto; /* Lenis (added in Task 5) handles smooth scroll */
}

body {
  overflow-x: hidden;
}

::selection {
  background: #cba97a;
  color: #0b1712;
}

.hero-word {
  will-change: transform, opacity;
}
```

- [ ] **Step 4: Create `site/index.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reserva Vereda | Granja Viana</title>
  <meta name="description" content="Em breve, o melhor condomínio da Granja Viana. Cadastre-se para receber informações exclusivas de pré-lançamento do Reserva Vereda." />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />

  <script src="https://cdn.tailwindcss.com"></script>
  <script src="js/tailwind-config.js"></script>

  <link rel="stylesheet" href="css/style.css" />
</head>
<body class="bg-forest-950 text-offwhite font-sans antialiased">

  <section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0">
      <img id="hero-bg" src="assets/images/hero-facade.jpg" alt="" class="w-full h-full object-cover scale-110" />
      <div class="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-forest-950/40"></div>
    </div>
    <div class="relative z-10 max-w-3xl px-6 text-center">
      <img src="assets/logo.png" alt="Reserva Vereda Granja Viana" class="mx-auto mb-8 w-48 md:w-56" />
      <h1 id="hero-headline" class="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight text-offwhite mb-6">
        Em breve, o melhor condomínio da Granja Viana.
      </h1>
      <p id="hero-subtitle" class="font-sans text-base md:text-lg text-offwhite/80 mb-10">
        Um novo capítulo de exclusividade e bem-estar está para começar. Prepare-se para viver o extraordinário.
      </p>
      <a href="#form" id="hero-cta" class="inline-block border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-forest-950 hover:shadow-[0_0_20px_rgba(203,169,122,0.5)] transition-all duration-300 px-8 py-3 tracking-widest text-sm uppercase">
        Peça informações
      </a>
    </div>
  </section>

  <!-- Task 3 adds #promessa and the footer here -->
  <!-- Task 4 adds #form here -->

  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js"></script>
  <script src="js/config.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

Note the CTA and subtitle have **no** `opacity-0` classes — they must be visible by default so the page works even if the GSAP CDN fails to load; Task 5 hides/animates them via JS at runtime instead.

- [ ] **Step 5: Verify with Playwright**

Ensure the local server is running (see "Local server for verification" above), then:
- Navigate to `http://localhost:5500/index.html`.
- Take a snapshot; confirm the heading "Em breve, o melhor condomínio da Granja Viana." and the "Peça informações" link are present and visible.
- Take a screenshot at 1440x900 and at 390x844 (mobile); confirm the hero fills the viewport and text is legible against the background image on both.
- Check console messages; expect zero errors (the GSAP/Lenis scripts loading unused is fine, no errors).

- [ ] **Step 6: Commit**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
git add site/index.html site/css/style.css site/js/tailwind-config.js site/js/config.js site/js/main.js
git commit -m "Add HTML shell, Tailwind/font setup, and hero section"
```

---

### Task 3: "A Promessa" section and footer

**Files:**
- Modify: `site/index.html` (insert sections after `#hero`, before the closing script tags)

**Interfaces:**
- Consumes (from Task 1): `assets/images/promise-garden.jpg`, `assets/partners.png`.
- Consumes (from Task 2): `forest-900`, `gold-400`, `offwhite` color tokens.
- Produces (consumed by Task 6): `.js-reveal` class on each of the two "A Promessa" content blocks; `#contact-whatsapp` anchor in the footer.

- [ ] **Step 1: Insert the "A Promessa" section and footer into `site/index.html`**

Replace the `<!-- Task 3 adds #promessa and the footer here -->` comment with:

```html
  <section id="promessa" class="relative py-24 md:py-32 px-6">
    <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div class="js-reveal">
        <h2 class="font-serif text-2xl md:text-4xl text-gold-400 mb-6">Onde a natureza encontra a sofisticação.</h2>
        <p class="text-offwhite/80 leading-relaxed">
          Imagine um refúgio onde cada detalhe é pensado para o seu conforto, cercado pela beleza natural e com acesso a tudo o que você precisa.
        </p>
      </div>
      <div class="js-reveal">
        <img src="assets/images/promise-garden.jpg" alt="" class="w-full h-80 md:h-[28rem] object-cover rounded-sm" />
      </div>
    </div>
  </section>

  <footer id="site-footer" class="py-12 px-6 bg-forest-950 border-t border-offwhite/10 text-center">
    <img src="assets/partners.png" alt="Elleven Engenharia, VCS, Conecta, SAN.bO" class="mx-auto mb-6 h-8 md:h-10 opacity-90" />
    <p class="text-offwhite/50 text-sm mb-2">
      Contato: <a id="contact-whatsapp" href="#" class="underline hover:text-gold-400">WhatsApp</a>
    </p>
    <p class="text-offwhite/40 text-xs">
      <a href="privacy.html" class="underline hover:text-gold-400">Política de Privacidade</a>
    </p>
    <p class="text-offwhite/30 text-xs mt-4">
      © 2026 Reserva Vereda Granja Viana. Todos os direitos reservados.
    </p>
  </footer>
```

(The footer sits after `#promessa` and before the `<!-- Task 4 adds #form here -->` comment, which stays in place for Task 4.)

- [ ] **Step 2: Verify with Playwright**

- Reload `http://localhost:5500/index.html`.
- Snapshot; confirm "Onde a natureza encontra a sofisticação." heading, the garden image, the four partner logos, and the "Política de Privacidade" link are all present.
- Click the "Política de Privacidade" link; expect a 404 page (privacy.html doesn't exist until Task 4) — this is expected at this checkpoint, navigate back afterward.
- Check console: no errors on the index page itself.

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
git add site/index.html
git commit -m "Add A Promessa section and footer"
```

---

### Task 4: Form/CTA section and privacy page

**Files:**
- Modify: `site/index.html` (insert `#form` section)
- Create: `site/privacy.html`

**Interfaces:**
- Consumes (from Task 2): color/font tokens, `js/tailwind-config.js` (load via `<script src="js/tailwind-config.js"></script>` after the Tailwind CDN tag in `privacy.html` too — do not inline a second copy of the config), `js/config.js` script tag pattern.
- Produces (consumed by Task 6): DOM IDs `#lead-form`, `#field-nome`, `#field-email`, `#field-telefone`, `#form-success`, `#form-error`; `#privacy-contact-email` in `privacy.html`.

- [ ] **Step 1: Insert the form section into `site/index.html`**

Replace the `<!-- Task 4 adds #form here -->` comment with:

```html
  <section id="form" class="relative py-24 md:py-32 px-6 bg-forest-900">
    <div class="max-w-xl mx-auto text-center js-reveal">
      <h2 class="font-serif text-2xl md:text-4xl text-offwhite mb-4">Seja um dos primeiros a descobrir.</h2>
      <p class="text-offwhite/70 mb-10">
        Garanta acesso exclusivo às informações de pré-lançamento do Reserva Vereda. Nossa equipe entrará em contato para apresentar este projeto único.
      </p>

      <form id="lead-form" class="space-y-5 text-left" novalidate>
        <div>
          <label for="field-nome" class="block text-xs uppercase tracking-widest text-gold-400 mb-2">Nome</label>
          <input type="text" id="field-nome" name="nome" required class="w-full bg-transparent border border-offwhite/30 focus:border-gold-400 focus:shadow-[0_0_12px_rgba(203,169,122,0.35)] outline-none px-4 py-3 text-offwhite transition-all" />
        </div>
        <div>
          <label for="field-email" class="block text-xs uppercase tracking-widest text-gold-400 mb-2">E-mail</label>
          <input type="email" id="field-email" name="email" required class="w-full bg-transparent border border-offwhite/30 focus:border-gold-400 focus:shadow-[0_0_12px_rgba(203,169,122,0.35)] outline-none px-4 py-3 text-offwhite transition-all" />
        </div>
        <div>
          <label for="field-telefone" class="block text-xs uppercase tracking-widest text-gold-400 mb-2">Telefone / WhatsApp</label>
          <input type="tel" id="field-telefone" name="telefone" required pattern="[0-9()\-\s+]{8,20}" class="w-full bg-transparent border border-offwhite/30 focus:border-gold-400 focus:shadow-[0_0_12px_rgba(203,169,122,0.35)] outline-none px-4 py-3 text-offwhite transition-all" />
        </div>
        <button type="submit" class="w-full bg-gold-400 hover:bg-gold-600 hover:shadow-[0_0_20px_rgba(203,169,122,0.5)] text-forest-950 uppercase tracking-widest text-sm py-4 transition-all duration-300">
          Quero receber informações exclusivas
        </button>
        <p id="form-error" class="hidden text-red-400 text-sm text-center pt-2">
          Não foi possível enviar. Verifique os campos e tente novamente.
        </p>
      </form>

      <div id="form-success" class="hidden">
        <p class="font-serif text-2xl text-gold-400 mb-3">Obrigado!</p>
        <p class="text-offwhite/80">Recebemos seu interesse. Nossa equipe entrará em contato em breve.</p>
      </div>
    </div>
  </section>
```

Note `novalidate` on the form: native browser validation popups are disabled because Task 6's JS drives validation via `checkValidity()` + `reportValidity()` explicitly, so behavior is consistent whether or not JS successfully attaches (if JS fails to load, `novalidate` means the form will actually submit as a normal GET/POST — acceptable degraded fallback, but not the primary path).

- [ ] **Step 2: Create `site/privacy.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Política de Privacidade | Reserva Vereda</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="js/tailwind-config.js"></script>
</head>
<body class="bg-forest-950 text-offwhite font-sans antialiased">
  <main class="max-w-2xl mx-auto px-6 py-16">
    <a href="index.html" class="text-gold-400 text-sm underline">&larr; Voltar</a>
    <h1 class="text-2xl md:text-3xl mt-6 mb-8">Política de Privacidade</h1>

    <div class="space-y-6 text-offwhite/80 leading-relaxed text-sm md:text-base">
      <p>Esta política descreve como o Reserva Vereda Granja Viana, empreendimento da Elleven Engenharia, trata os dados pessoais fornecidos por meio deste site, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>

      <div>
        <h2 class="text-gold-400 uppercase tracking-widest text-xs mb-2">Dados coletados</h2>
        <p>Coletamos apenas os dados fornecidos voluntariamente por você em nosso formulário de contato: nome, e-mail e telefone/WhatsApp.</p>
      </div>

      <div>
        <h2 class="text-gold-400 uppercase tracking-widest text-xs mb-2">Finalidade</h2>
        <p>Os dados são utilizados exclusivamente para contato comercial sobre o empreendimento Reserva Vereda Granja Viana, incluindo envio de informações de pré-lançamento.</p>
      </div>

      <div>
        <h2 class="text-gold-400 uppercase tracking-widest text-xs mb-2">Compartilhamento</h2>
        <p>Não compartilhamos seus dados com terceiros, exceto o serviço utilizado para processar o envio do formulário deste site.</p>
      </div>

      <div>
        <h2 class="text-gold-400 uppercase tracking-widest text-xs mb-2">Seus direitos</h2>
        <p>Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento, entrando em contato pelo e-mail informado abaixo.</p>
      </div>

      <div>
        <h2 class="text-gold-400 uppercase tracking-widest text-xs mb-2">Controlador</h2>
        <p>Elleven Engenharia — contato: <span id="privacy-contact-email">contato@reservavereda.com.br</span></p>
      </div>
    </div>
  </main>
  <script src="js/config.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const el = document.getElementById('privacy-contact-email');
      if (el && window.SITE_CONFIG && SITE_CONFIG.NOTIFY_EMAIL) {
        el.textContent = SITE_CONFIG.NOTIFY_EMAIL;
      }
    });
  </script>
</body>
</html>
```

- [ ] **Step 3: Verify with Playwright**

- Reload `http://localhost:5500/index.html`; snapshot and confirm the "Seja um dos primeiros a descobrir." heading, all three form fields, and the submit button are present.
- Type into each field, click submit with all fields empty first — since `js/main.js` is still an empty stub, nothing happens yet (no JS-driven validation exists until Task 6); this is expected at this checkpoint.
- Navigate to `http://localhost:5500/privacy.html`; snapshot and confirm the heading and all five policy sections render, and the "Voltar" link points back to `index.html`.
- Check console on both pages: no errors.

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
git add site/index.html site/privacy.html
git commit -m "Add form/CTA section and privacy policy page"
```

---

### Task 5: Lenis smooth scroll + hero entrance animation

**Files:**
- Modify: `site/js/main.js`

**Interfaces:**
- Consumes: `#hero-bg`, `#hero-headline`, `#hero-subtitle`, `#hero-cta` (from Task 2); global `Lenis`, `gsap`, `ScrollTrigger` (from CDN scripts in Task 2's `index.html`).
- Produces (consumed by Task 6): `initSmoothScroll()` and `initHeroAnimation()` functions in the same file; the `.hero-word` class applied to each split word (matches the CSS rule already in `style.css`).

- [ ] **Step 1: Write `site/js/main.js`**

```js
// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeroAnimation();
});

function initSmoothScroll() {
  if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') return;

  const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
  }
}

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
  tl.fromTo('#hero-bg', { scale: 1.15 }, { scale: 1, duration: 2.4 })
    .to(words, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.3)
    .to(subtitle, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
    .to(cta, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');
}
```

Each `init*` function checks its required globals exist before running, so a CDN failure degrades to the static (fully visible, non-animated) HTML rather than a broken page.

- [ ] **Step 2: Verify with Playwright**

- Reload `http://localhost:5500/index.html`.
- Take a screenshot immediately on load, then another ~1.5s later; confirm the headline words and subtitle/CTA visibly animate in (different opacity/position between the two screenshots).
- Scroll the page with the mouse wheel (or `browser_evaluate` calling `window.scrollBy`); confirm scrolling feels smooth (no assertion needed beyond no console errors during scroll).
- Check console: no errors, including no "Lenis is not defined" or "gsap is not defined" messages.

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
git add site/js/main.js
git commit -m "Add Lenis smooth scroll and hero entrance animation"
```

---

### Task 6: Scroll reveals, form validation/submission, and config

**Files:**
- Modify: `site/js/main.js`
- Modify: `site/js/config.js`

**Interfaces:**
- Consumes: `.js-reveal` elements (Tasks 3–4), `#lead-form`/`#field-nome`/`#field-email`/`#field-telefone`/`#form-success`/`#form-error`/`#contact-whatsapp` (Task 4), `window.SITE_CONFIG` (this task).
- Produces: `window.SITE_CONFIG = { FORMSPREE_ENDPOINT, NOTIFY_EMAIL, WHATSAPP_NUMBER }` global, read by `privacy.html` (Task 4) and by this task's own form handler.

- [ ] **Step 1: Write `site/js/config.js`**

```js
// js/config.js
// TODO: replace with your real values before going live.
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

- [ ] **Step 2: Extend `site/js/main.js`**

Add `initScrollReveals()` and `initLeadForm()`, and call them from the `DOMContentLoaded` listener:

```js
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeroAnimation();
  initScrollReveals();
  initLeadForm();
});
```

Append the two new functions to the end of the file:

```js
function initScrollReveals() {
  if (typeof gsap === 'undefined') return;

  const items = document.querySelectorAll('.js-reveal');
  gsap.set(items, { opacity: 0, y: 32 });
  items.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
  });
}

function initLeadForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  const successEl = document.getElementById('form-success');
  const errorEl = document.getElementById('form-error');
  const whatsappLink = document.getElementById('contact-whatsapp');

  if (whatsappLink && window.SITE_CONFIG && SITE_CONFIG.WHATSAPP_NUMBER && !SITE_CONFIG.WHATSAPP_NUMBER.startsWith('TODO')) {
    whatsappLink.href = `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}`;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorEl.classList.add('hidden');

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const endpoint = window.SITE_CONFIG && SITE_CONFIG.FORMSPREE_ENDPOINT;
    if (!endpoint || endpoint.startsWith('TODO')) {
      console.error('SITE_CONFIG.FORMSPREE_ENDPOINT is not configured yet.');
      errorEl.textContent = 'Formulário ainda não configurado. Tente novamente mais tarde.';
      errorEl.classList.remove('hidden');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });

      if (!response.ok) throw new Error(`Formspree respondeu ${response.status}`);

      form.classList.add('hidden');
      successEl.classList.remove('hidden');
    } catch (err) {
      console.error('Falha ao enviar formulário:', err);
      errorEl.classList.remove('hidden');
      submitButton.disabled = false;
    }
  });
}
```

- [ ] **Step 3: Verify scroll reveals with Playwright**

- Reload `http://localhost:5500/index.html`.
- Evaluate `window.scrollTo(0, document.getElementById('promessa').offsetTop - 200)` then wait briefly; screenshot and confirm the "A Promessa" text and image are now fully visible (not faded/offset).
- Check console: no errors.

- [ ] **Step 4: Verify form validation and the unconfigured-endpoint path with Playwright**

- On `http://localhost:5500/index.html`, scroll to `#form` and click the submit button with all fields empty.
- Expect the browser's native validation UI to appear on the first empty required field (via `reportValidity()`) and no network request to fire.
- Fill in Nome, E-mail, and Telefone with valid values, click submit again.
- Expect the error message "Formulário ainda não configurado..." to appear (since `FORMSPREE_ENDPOINT` is still the `TODO` placeholder) — confirms the guard branch works correctly.
- Check console: expect exactly one `console.error` about the endpoint not being configured, no other errors.

- [ ] **Step 5: Verify the WhatsApp link and privacy page pick up config values**

- On `http://localhost:5500/index.html`, confirm the footer's "WhatsApp" link `href` is still `#` (since `WHATSAPP_NUMBER` is still a `TODO` placeholder) — this confirms the guard against building a broken `wa.me` link.
- On `http://localhost:5500/privacy.html`, confirm the contact line still shows the static fallback email `contato@reservavereda.com.br` from the HTML (since `NOTIFY_EMAIL` is a `TODO` placeholder, the JS guard in Task 4's script skips overwriting it).

- [ ] **Step 6: Commit**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
git add site/js/main.js site/js/config.js
git commit -m "Add scroll reveal animations and form validation/submission"
```

---

### Task 7: Full responsive QA pass

**Files:**
- Modify: `site/index.html`, `site/css/style.css` (only if issues are found during this pass — fix forward, don't add new features)

**Interfaces:**
- None new — this task only verifies and fixes what Tasks 1–6 built.

- [ ] **Step 1: Desktop pass (1440x900)**

Navigate to `http://localhost:5500/index.html` at 1440x900. Screenshot each section (hero, A Promessa, form, footer). Confirm: no horizontal scrollbar, images fill their containers without distortion, text is legible against backgrounds, the gold/forest palette reads consistently across sections.

- [ ] **Step 2: Tablet pass (768x1024)**

Resize to 768x1024, reload, screenshot each section. Confirm the "A Promessa" grid stacks or reflows sensibly, form remains centered and readable, no overlapping elements.

- [ ] **Step 3: Mobile pass (390x844)**

Resize to 390x844, reload, screenshot each section. Confirm hero headline wraps without overflow, form fields and button are full-width and tappable, footer logos scale down without overlapping the WhatsApp/privacy links.

- [ ] **Step 4: End-to-end console check**

Reload the page fresh, open console, scroll through the entire page top to bottom, submit the form once. Confirm the only console output is the single expected `FORMSPREE_ENDPOINT not configured` error from Task 6 — zero unexpected errors or warnings.

- [ ] **Step 5: Fix forward**

If any visual or console issue was found in Steps 1–4, fix it directly in `site/index.html` or `site/css/style.css` now, then re-run the relevant step above to confirm the fix.

- [ ] **Step 6: Final commit**

```bash
cd "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site"
git add -A
git status
```

Review the status output — if Steps 1–5 required fixes, commit them:

```bash
git commit -m "Fix responsive/console issues found in final QA pass"
```

If no fixes were needed, skip the commit (nothing to add).
