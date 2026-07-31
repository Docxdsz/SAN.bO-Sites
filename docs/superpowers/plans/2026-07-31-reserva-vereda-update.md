# Reserva Vereda — Visual/Header/Localização Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the identity-refresh, dual-CTA header, and localização content updates described in `docs/superpowers/specs/2026-07-31-reserva-vereda-update-design.md`, on top of the existing static Reserva Vereda teaser site.

**Architecture:** Static HTML + Tailwind CDN + vanilla JS, zero build step (unchanged). All work happens directly on `site/index.html`, `site/privacy.html`, `site/css/style.css`, `site/js/tailwind-config.js`, `site/js/main.js`, plus new binary assets under `site/assets/`. One-off image processing goes in new scripts under `tools/` (Node + `sharp`, already installed in `tools/node_modules`), following the existing `tools/extract-*.js` pattern — one script per new image need, never reuse an old script whose crop assumptions no longer apply.

**Tech Stack:** Tailwind CDN (utility classes, `js/tailwind-config.js` extends the theme), GSAP + ScrollTrigger + Lenis (already wired in `js/main.js`), `sharp` (Node, in `tools/`), `pdftoppm` (poppler, for the optional Panfleto extraction).

## Global Constraints

- Repo root: `C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site`. All work happens in the worktree at `.worktrees\build-teaser` (branch `build-teaser`) — do not touch `master` directly.
- Site color tokens (do not invent new hex values — reuse these): `forest-950 #0B1712`, `forest-900 #11221B`, `forest-800 #172E23`, `gold-400 #CBA97A`, `gold-600 #A9824F`, `offwhite #F4F1E8`. Book-verified divider gradient: `#7C4316` / `#CF9049` (already used in the amenidades top divider bar — do not change that specific element).
- No Playwright/browser-automation tools on this project — an unresolved Chrome-install incident from an earlier session means visual verification must stay static (grep, file/byte checks, `sharp` metadata, manual review of rendered HTML/CSS by reading the file). Do not invoke `mcp__playwright__*` tools for this project.
- Client source assets live outside the repo at `C:\Users\Doc\Desktop\ReservaVereda\` — reference them by absolute path when writing `tools/*.js` scripts (matches the existing scripts' pattern).
- Every `tools/*.js` script writes its output under `site/assets/...` via `path.resolve(__dirname, '../site/...')`, exactly like the existing scripts.
- Run `tools/*.js` scripts with `node <script>.js` from inside the `tools/` directory (that's where `node_modules` lives).
- Out of scope (do not touch): hero headline/subtitle copy, tracking/pixel code, `js/config.js` placeholder values, Galeria/Amenidades section copy tone.

---

### Task 1: Local font hosting (`@font-face`)

**Files:**
- Create: `site/assets/fonts/FahKwang.ttc` (binary copy)
- Create: `site/assets/fonts/Montserrat-VariableFont_wght.ttf` (binary copy)
- Modify: `site/css/style.css`
- Modify: `site/js/tailwind-config.js`
- Modify: `site/index.html:9-11`
- Modify: `site/privacy.html:7`

**Interfaces:**
- Produces: CSS font-family names `'FahKwang'` and `'Montserrat'`, available globally via `font-serif` / `font-sans` Tailwind utilities (used by every later task that touches headings/body text — nothing changes in how those utilities are invoked).

- [ ] **Step 1: Copy the font files into the site**

```bash
mkdir -p "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\.worktrees\build-teaser\site\assets\fonts"
cp "C:\Users\Doc\Desktop\ReservaVereda\Fonts\FahKwang.ttc" "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\.worktrees\build-teaser\site\assets\fonts\FahKwang.ttc"
cp "C:\Users\Doc\Desktop\ReservaVereda\Fonts\Montserrat-VariableFont_wght.ttf" "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\.worktrees\build-teaser\site\assets\fonts\Montserrat-VariableFont_wght.ttf"
```

- [ ] **Step 2: Verify the copies match the source byte-for-byte**

Run:
```bash
cmp "C:\Users\Doc\Desktop\ReservaVereda\Fonts\FahKwang.ttc" "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\.worktrees\build-teaser\site\assets\fonts\FahKwang.ttc" && echo IDENTICAL
cmp "C:\Users\Doc\Desktop\ReservaVereda\Fonts\Montserrat-VariableFont_wght.ttf" "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\.worktrees\build-teaser\site\assets\fonts\Montserrat-VariableFont_wght.ttf" && echo IDENTICAL
```
Expected: both print `IDENTICAL`, no `cmp` diff output.

- [ ] **Step 3: Add `@font-face` declarations to `site/css/style.css`**

Insert at the very top of the file (before the existing `html { scroll-behavior: auto; ... }` rule):

```css
@font-face {
  font-family: 'FahKwang';
  src: url('assets/fonts/FahKwang.ttc') format('truetype');
  font-weight: 200 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Montserrat';
  src: url('assets/fonts/Montserrat-VariableFont_wght.ttf') format('truetype');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

```

- [ ] **Step 4: Point the Tailwind theme's `serif` family at FahKwang**

In `site/js/tailwind-config.js`, change:
```js
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
```
to:
```js
      fontFamily: {
        serif: ['FahKwang', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
```
(`sans` already says `Montserrat` — no change needed there, it now resolves to the local `@font-face` instead of the Google Fonts CDN version.)

- [ ] **Step 5: Remove the Google Fonts CDN from `site/index.html`**

Delete lines 9–11:
```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
```
(The following lines — Tailwind CDN script, `tailwind-config.js`, `css/style.css` link — stay as-is.)

- [ ] **Step 6: Remove the Google Fonts CDN from `site/privacy.html` and link the shared stylesheet**

Replace line 7:
```html
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet" />
```
with:
```html
  <link rel="stylesheet" href="css/style.css" />
```
(`privacy.html` currently has no `<link>` to `css/style.css` at all, so without this the new `@font-face` rules would never reach that page.)

- [ ] **Step 7: Verify no Google Fonts references remain and the new rules are in place**

Run:
```bash
grep -rn "fonts.googleapis\|fonts.gstatic" site/index.html site/privacy.html
```
Expected: no output (grep exit code 1).

Run:
```bash
grep -n "@font-face\|FahKwang\|Montserrat-VariableFont" site/css/style.css
grep -n "FahKwang" site/js/tailwind-config.js
grep -n "css/style.css" site/privacy.html
```
Expected: matches for all three, confirming the `@font-face` block, the theme mapping, and the new stylesheet link are all present.

- [ ] **Step 8: Commit**

```bash
git add site/assets/fonts/FahKwang.ttc site/assets/fonts/Montserrat-VariableFont_wght.ttf site/css/style.css site/js/tailwind-config.js site/index.html site/privacy.html
git commit -m "Host FahKwang/Montserrat fonts locally, drop Google Fonts CDN"
```

---

### Task 2: Swap wordmark logo to `V1.svg`

**Files:**
- Modify: `site/assets/logo.svg` (full content replacement)

**Interfaces:**
- Produces: same file path `assets/logo.svg`, so no HTML changes are needed anywhere it's referenced (`site/index.html` header logo, hero logo).

- [ ] **Step 1: Confirm current usages won't need updating**

Run:
```bash
grep -n "assets/logo.svg" site/index.html
```
Expected: 2 matches (header `<img>` and hero `<img>`), both referencing the plain path `assets/logo.svg` — confirms swapping file content in place is sufficient.

- [ ] **Step 2: Replace the file content**

```bash
cp "C:\Users\Doc\Desktop\ReservaVereda\V1.svg" "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\.worktrees\build-teaser\site\assets\logo.svg"
```

- [ ] **Step 3: Verify the swap**

Run:
```bash
cmp "C:\Users\Doc\Desktop\ReservaVereda\V1.svg" "C:\Users\Doc\Desktop\ReservaVereda\reserva-vereda-site\.worktrees\build-teaser\site\assets\logo.svg" && echo IDENTICAL
grep -o "#[dD][eE][bB][aA]8[fF]" site/assets/logo.svg | head -1
grep -c "assets/logo.svg" site/index.html
```
Expected: `IDENTICAL`, one match of the gold fill color, and `2` (both references still resolve, unchanged).

- [ ] **Step 4: Commit**

```bash
git add site/assets/logo.svg
git commit -m "Swap wordmark logo to V1 horizontal design"
```

---

### Task 3: Sticky Elleven seal

**Files:**
- Create: `tools/process-elleven-seal.js`
- Create: `site/assets/images/elleven-seal.png` (generated by the script)
- Modify: `site/index.html` (add the seal element)
- Modify: `site/js/main.js` (`initStickyChrome`)

**Interfaces:**
- Consumes: `initStickyChrome()` in `site/js/main.js:102-136` (existing function — extend it, don't replace it).
- Produces: DOM element `id="elleven-seal"`, referenced by `initStickyChrome()`.

- [ ] **Step 1: Write the seal processing script**

Create `tools/process-elleven-seal.js`:
```js
// tools/process-elleven-seal.js
// One-time resize: Elleven Engenharia logo, sourced from the client's brand
// asset (2053x769 RGBA PNG), down to a small badge suitable for a fixed
// on-screen seal. Run: node process-elleven-seal.js
const path = require('path');
const sharp = require('sharp');

const SRC = 'C:\\Users\\Doc\\Desktop\\ReservaVereda\\LOGO_ELLEVEN ENGENHARIA_PRINCIPAL.png';
const OUT = path.resolve(__dirname, '../site/assets/images/elleven-seal.png');

sharp(SRC)
  .resize({ height: 120 })
  .png({ quality: 90 })
  .toFile(OUT)
  .then(() => console.log('wrote elleven-seal.png'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

- [ ] **Step 2: Run it**

Run: `cd tools && node process-elleven-seal.js`
Expected: prints `wrote elleven-seal.png`, and `site/assets/images/elleven-seal.png` exists.

- [ ] **Step 3: Verify the output**

Create a throwaway check script `tools/_check-seal.js`:
```js
const sharp = require('sharp');
sharp('../site/assets/images/elleven-seal.png').metadata().then((m) => {
  console.log(JSON.stringify({ width: m.width, height: m.height, hasAlpha: m.hasAlpha }));
});
```
Run: `cd tools && node _check-seal.js`
Expected: `{"width":320,"height":120,"hasAlpha":true}` (width will be ~320, computed from the source aspect ratio — exact width doesn't matter, `height:120` and `hasAlpha:true` do).
Delete `tools/_check-seal.js` afterward (it's a throwaway check, not part of the asset pipeline).

- [ ] **Step 4: Add the seal element to `site/index.html`**

Insert immediately before the closing `</body>` tag's preceding sibling — specifically right after the `whatsapp-float` anchor block (which ends around line 302) and before the lightbox overlay markup:

```html
  <div id="elleven-seal" class="fixed bottom-6 left-6 z-50 flex items-center px-3 py-2 rounded-full bg-forest-950/60 backdrop-blur-sm border border-offwhite/10 opacity-0 translate-y-4 pointer-events-none transition-all duration-500" aria-hidden="true">
    <img src="assets/images/elleven-seal.png" alt="Elleven Engenharia" class="h-5 md:h-6 w-auto" />
  </div>
```

- [ ] **Step 5: Wire it into `initStickyChrome()`**

In `site/js/main.js`, modify `initStickyChrome` (currently lines 102-136):
```js
function initStickyChrome() {
  const header = document.getElementById('site-header');
  const whatsapp = document.getElementById('whatsapp-float');
  const ellevenSeal = document.getElementById('elleven-seal');
  const hero = document.getElementById('hero');
  if (!hero) return;

  const show = () => {
    if (header) {
      header.classList.remove('-translate-y-full');
      header.classList.add('translate-y-0');
    }
    if (whatsapp) {
      whatsapp.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
      whatsapp.classList.add('opacity-100', 'translate-y-0');
    }
    if (ellevenSeal) {
      ellevenSeal.classList.remove('opacity-0', 'translate-y-4');
      ellevenSeal.classList.add('opacity-100', 'translate-y-0');
    }
  };
  const hide = () => {
    if (header) {
      header.classList.add('-translate-y-full');
      header.classList.remove('translate-y-0');
    }
    if (whatsapp) {
      whatsapp.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
      whatsapp.classList.remove('opacity-100', 'translate-y-0');
    }
    if (ellevenSeal) {
      ellevenSeal.classList.add('opacity-0', 'translate-y-4');
      ellevenSeal.classList.remove('opacity-100', 'translate-y-0');
    }
  };

  if (typeof IntersectionObserver === 'undefined') {
    show();
    return;
  }

  const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? hide() : show()), { threshold: 0 });
  observer.observe(hero);
}
```
(Note: the seal keeps `pointer-events-none` permanently in its base HTML class list — unlike the WhatsApp button it isn't a link, so it never needs pointer events re-enabled.)

- [ ] **Step 6: Verify**

Run:
```bash
grep -n 'id="elleven-seal"' site/index.html
grep -n "ellevenSeal" site/js/main.js
ls -la site/assets/images/elleven-seal.png
```
Expected: one match in `index.html`, multiple matches in `main.js` (declaration + both show/hide branches), and the file listed.

- [ ] **Step 7: Commit**

```bash
git add tools/process-elleven-seal.js site/assets/images/elleven-seal.png site/index.html site/js/main.js
git commit -m "Add sticky Elleven Engenharia seal, fixed bottom-left"
```

---

### Task 4: Header + hero dual-CTA, lead-form profile field

**Files:**
- Modify: `site/index.html` (header CTA, hero CTA, `lead-form`)
- Modify: `site/js/main.js` (new `initProfileCTA()`)

**Interfaces:**
- Produces: `<select id="field-perfil" name="perfil">` in the lead form (submitted automatically via the existing `new FormData(form)` call in `initLeadForm()` — no changes needed there); CSS marker class `.js-cta-profile` and `data-profile` attribute convention, consumed by `initProfileCTA()`.

- [ ] **Step 1: Replace the header CTA in `site/index.html:29-36`**

Replace:
```html
  <header id="site-header" class="fixed top-0 inset-x-0 z-50 -translate-y-full transition-transform duration-500 ease-out bg-forest-950/90 backdrop-blur-sm border-b border-offwhite/10">
    <div class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
      <img src="assets/logo.svg" alt="Reserva Vereda" class="h-7 md:h-8" />
      <a href="#form" class="border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-forest-950 transition-all duration-300 px-5 py-2 text-xs uppercase tracking-widest">
        Peça informações
      </a>
    </div>
  </header>
```
with:
```html
  <header id="site-header" class="fixed top-0 inset-x-0 z-50 -translate-y-full transition-transform duration-500 ease-out bg-forest-950/90 backdrop-blur-sm border-b border-offwhite/10">
    <div class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
      <img src="assets/logo.svg" alt="Reserva Vereda" class="h-7 md:h-8" />
      <div class="flex items-center gap-2 md:gap-3">
        <a href="#form" data-profile="Cliente" class="js-cta-profile border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-forest-950 transition-all duration-300 px-3 md:px-5 py-2 text-[11px] md:text-xs uppercase tracking-widest whitespace-nowrap">
          Sou cliente
        </a>
        <a href="#form" data-profile="Parceiro/Imobiliária" class="js-cta-profile border border-offwhite/40 text-offwhite/80 hover:bg-offwhite/10 hover:text-offwhite transition-all duration-300 px-3 md:px-5 py-2 text-[11px] md:text-xs uppercase tracking-widest whitespace-nowrap">
          Sou parceiro
        </a>
      </div>
    </div>
  </header>
```

- [ ] **Step 2: Replace the hero CTA in `site/index.html:51-53`**

Replace:
```html
      <a href="#form" id="hero-cta" class="inline-block border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-forest-950 hover:shadow-[0_0_20px_rgba(203,169,122,0.5)] transition-all duration-300 px-8 py-3 tracking-widest text-sm uppercase">
        Peça informações
      </a>
```
with:
```html
      <div id="hero-cta" class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#form" data-profile="Cliente" class="js-cta-profile inline-block border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-forest-950 hover:shadow-[0_0_20px_rgba(203,169,122,0.5)] transition-all duration-300 px-8 py-3 tracking-widest text-sm uppercase">
          Sou cliente e quero garantir meu espaço
        </a>
        <a href="#form" data-profile="Parceiro/Imobiliária" class="js-cta-profile inline-block border border-offwhite/50 text-offwhite hover:bg-offwhite/10 transition-all duration-300 px-8 py-3 tracking-widest text-sm uppercase">
          Sou parceiro e quero vender este projeto
        </a>
      </div>
```
(The `id="hero-cta"` moves from the `<a>` to this wrapping `<div>` — `initHeroAnimation()` in `main.js` animates `#hero-cta` as a single opacity/y target via `gsap.set([subtitle, cta], ...)` and `.to(cta, ...)`, so this keeps that animation working unchanged, now animating both buttons together as a group.)

- [ ] **Step 3: Add the profile field to `lead-form`**

In `site/index.html`, inside `<form id="lead-form">`, immediately before the phone field's wrapping `<div>` (the one containing `id="field-telefone"`, currently starting at line 253), insert:
```html
          <div>
            <label for="field-perfil" class="block text-offwhite/50 text-xs uppercase tracking-widest mb-2">Perfil</label>
            <select id="field-perfil" name="perfil" required class="w-full bg-forest-900 border-0 border-b border-offwhite/30 focus:border-gold-400 outline-none px-0 py-3 text-offwhite transition-colors">
              <option value="Cliente">Cliente</option>
              <option value="Parceiro/Imobiliária">Parceiro/Imobiliária</option>
            </select>
          </div>
```

- [ ] **Step 4: Add `initProfileCTA()` to `site/js/main.js`**

Add the function anywhere after `initLeadForm` (e.g. right after it, before `initTrail` — exact position doesn't matter, function declarations are hoisted):
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

- [ ] **Step 5: Register it in the `DOMContentLoaded` listener**

Change:
```js
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeroAnimation();
  initScrollReveals();
  initDividers();
  initParallax();
  initStickyChrome();
  initLightbox();
  initLeadForm();
  initTrail();
});
```
to:
```js
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeroAnimation();
  initScrollReveals();
  initDividers();
  initParallax();
  initStickyChrome();
  initLightbox();
  initLeadForm();
  initProfileCTA();
  initTrail();
});
```

- [ ] **Step 6: Verify**

Run:
```bash
grep -c 'data-profile="Cliente"' site/index.html
grep -c 'data-profile="Parceiro/Imobiliária"' site/index.html
grep -c 'id="hero-cta"' site/index.html
grep -c 'id="field-perfil"' site/index.html
grep -n "initProfileCTA" site/js/main.js
```
Expected: `2`, `2`, `1`, `1`, and two matches in `main.js` (the function definition and the call inside `DOMContentLoaded`).

- [ ] **Step 7: Commit**

```bash
git add site/index.html site/js/main.js
git commit -m "Add dual-CTA header/hero (cliente vs parceiro) and lead-form profile field"
```

---

### Task 5: Amenidades background contrast/sophistication

**Files:**
- Modify: `site/index.html:170-172`

**Interfaces:** none (self-contained visual tweak).

- [ ] **Step 1: Swap the gradient to the site's existing gold tokens and add a contrast wash**

Replace line 170-172:
```html
  <section id="amenidades" class="relative overflow-hidden py-24 md:py-32 px-6 bg-gradient-to-br from-[#B98F5D] to-[#DEBA8F]">
    <img src="assets/images/amenidades-palm-accent.png" alt="" class="absolute inset-0 w-full h-full object-cover pointer-events-none" />
    <div class="js-divider absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#7C4316] via-[#CF9049] to-[#7C4316] pointer-events-none" aria-hidden="true"></div>
```
with:
```html
  <section id="amenidades" class="relative overflow-hidden py-24 md:py-32 px-6 bg-gradient-to-br from-gold-600 to-gold-400">
    <img src="assets/images/amenidades-palm-accent.png" alt="" class="absolute inset-0 w-full h-full object-cover pointer-events-none" />
    <div class="absolute inset-0 bg-offwhite/15 pointer-events-none" aria-hidden="true"></div>
    <div class="js-divider absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#7C4316] via-[#CF9049] to-[#7C4316] pointer-events-none" aria-hidden="true"></div>
```
This replaces the one-off hex pair (`#B98F5D`/`#DEBA8F`) with the site's own `gold-600`/`gold-400` tokens (already used for CTAs and dividers elsewhere, so the section reads as more consistent/deliberate rather than an independent color pair), and adds a uniform light wash (`bg-offwhite/15`) between the palm image/gradient and the content, lifting contrast for the dark `text-forest-950` text and icons throughout the section. The book-verified divider bar (`#7C4316`/`#CF9049`) is untouched.

- [ ] **Step 2: Verify**

Run:
```bash
grep -n 'id="amenidades"' site/index.html
grep -n "bg-gradient-to-br from-gold-600 to-gold-400" site/index.html
grep -n "bg-offwhite/15" site/index.html
grep -c "#B98F5D\|#DEBA8F" site/index.html
```
Expected: the section tag with the new gradient classes, the new overlay div present, and `0` remaining occurrences of the old hex pair in `index.html`.

- [ ] **Step 3: Commit**

```bash
git add site/index.html
git commit -m "Darken/unify amenidades background for contrast and consistency with site gold tokens"
```

---

### Task 6: Reinforce organic shapes (larger border radii)

**Files:**
- Modify: `site/index.html` (10 occurrences of `rounded-lg` → `rounded-3xl`)

**Interfaces:** none (self-contained visual tweak).

- [ ] **Step 1: Confirm the current count**

Run: `grep -c "rounded-lg" site/index.html`
Expected: `10` (2 in `#promessa`, 6 across the 3 `#galeria` images, 2 in `#amenidades`).

- [ ] **Step 2: Replace all occurrences**

Every `rounded-lg` in `site/index.html` becomes `rounded-3xl` (applies to the `gold-frame`/`dark-frame` wrapper divs and their inner `overflow-hidden` divs in the Promessa, Galeria, and Amenidades sections — these are the only rounded-corner image containers left after Diferenciais' rectangular cards are removed in Task 7).

- [ ] **Step 3: Verify**

Run:
```bash
grep -c "rounded-lg" site/index.html
grep -c "rounded-3xl" site/index.html
```
Expected: `0` and `10`.

- [ ] **Step 4: Commit**

```bash
git add site/index.html
git commit -m "Increase image corner radius site-wide for a more organic feel"
```

---

### Task 7: Remove Diferenciais, integrate its copy, add the distance matrix

**Files:**
- Modify: `site/index.html` (Promessa paragraph, Localização section, Diferenciais removal, Galeria subtitle)

**Interfaces:** none (self-contained content change). This task must run after Task 6 (or the `rounded-lg` count check in Task 6 Step 1 will be wrong, since Diferenciais removal doesn't touch any `rounded-lg` itself but should be sequenced after so counts stay predictable for whoever re-runs Task 6's grep later).

- [ ] **Step 1: Fold "Natureza preservada" into the Promessa paragraph**

In `site/index.html`, replace the Promessa paragraph (currently):
```html
        <p class="text-forest-950/70 leading-relaxed md:text-lg">
          Imagine um refúgio onde cada detalhe é pensado para o seu conforto, cercado pela beleza natural e com acesso a tudo o que você precisa.
        </p>
```
with:
```html
        <p class="text-forest-950/70 leading-relaxed md:text-lg">
          Imagine um refúgio envolto por vegetação preservada, onde cada detalhe é pensado para o seu conforto — a beleza natural ao alcance de tudo o que você precisa, tão perto da cidade quanto raramente se encontra.
        </p>
```

- [ ] **Step 2: Fold "Localização privilegiada" + "Segurança 24 horas" into the Localização paragraph, and add the distance matrix**

Replace the entire `#localizacao` section:
```html
  <section id="localizacao" class="relative py-20 md:py-28 px-6 bg-forest-800 overflow-hidden">
    <div class="absolute inset-0">
      <img src="assets/images/location-bg.jpg" alt="" class="js-parallax w-full h-full object-cover scale-[1.08]" />
      <div class="absolute inset-0 bg-forest-950/75"></div>
    </div>
    <div class="relative max-w-4xl mx-auto text-center js-reveal">
      <div class="js-divider mx-auto mb-6 h-1 w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
      <p class="text-offwhite/70 text-xs md:text-sm uppercase tracking-[0.2em] mb-3">Localização</p>
      <h2 class="font-serif text-3xl md:text-5xl text-gold-400 mb-6">Viver na Granja Viana é um privilégio.</h2>
      <p class="text-offwhite/80 leading-relaxed md:text-lg">
        Cercada por áreas verdes preservadas e a poucos minutos dos principais acessos viários, a Granja Viana é sinônimo de qualidade de vida, segurança e sofisticação discreta — um dos endereços mais cobiçados de São Paulo.
      </p>
    </div>
  </section>
```
with:
```html
  <section id="localizacao" class="relative py-20 md:py-28 px-6 bg-forest-800 overflow-hidden">
    <div class="absolute inset-0">
      <img src="assets/images/location-bg.jpg" alt="" class="js-parallax w-full h-full object-cover scale-[1.08]" />
      <div class="absolute inset-0 bg-forest-950/75"></div>
    </div>
    <div class="relative max-w-4xl mx-auto text-center js-reveal">
      <div class="js-divider mx-auto mb-6 h-1 w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
      <p class="text-offwhite/70 text-xs md:text-sm uppercase tracking-[0.2em] mb-3">Localização</p>
      <h2 class="font-serif text-3xl md:text-5xl text-gold-400 mb-6">Viver na Granja Viana é um privilégio.</h2>
      <p class="text-offwhite/80 leading-relaxed md:text-lg">
        Cercada por áreas verdes preservadas e a poucos minutos dos principais acessos viários, a Granja Viana é sinônimo de qualidade de vida, segurança 24 horas e sofisticação discreta — um dos endereços mais cobiçados de São Paulo, com toda a tranquilidade para você e sua família todos os dias.
      </p>
      <div class="mt-10 max-w-md mx-auto text-left">
        <div class="divide-y divide-gold-400/20">
          <div class="flex items-center justify-between py-3">
            <span class="text-offwhite/80 text-sm md:text-base">Cotia</span>
            <span class="text-gold-400 text-sm md:text-base tabular-nums">8 km · 7 min</span>
          </div>
          <div class="flex items-center justify-between py-3">
            <span class="text-offwhite/80 text-sm md:text-base">Aldeia da Serra</span>
            <span class="text-gold-400 text-sm md:text-base tabular-nums">15 km · 20 min</span>
          </div>
          <div class="flex items-center justify-between py-3">
            <span class="text-offwhite/80 text-sm md:text-base">Alphaville</span>
            <span class="text-gold-400 text-sm md:text-base tabular-nums">19 km · 25 min</span>
          </div>
          <div class="flex items-center justify-between py-3">
            <span class="text-offwhite/80 text-sm md:text-base">São Paulo (Centro)</span>
            <span class="text-gold-400 text-sm md:text-base tabular-nums">25 km · 37 min</span>
          </div>
        </div>
      </div>
    </div>
  </section>
```
(The distance-matrix wrapper doesn't carry `js-reveal` itself — it's inside the parent `.js-reveal` block, which already fades the whole column in together via `initScrollReveals()`.)

- [ ] **Step 3: Delete the Diferenciais section entirely**

Delete the whole block from `<section id="diferenciais" ...>` through its closing `</section>` (currently lines 97-135 — verify exact bounds with `grep -n 'id="diferenciais"\|id="galeria"' site/index.html` before deleting, since prior edits may have shifted line numbers).

- [ ] **Step 4: Fold "Lazer completo" into the Galeria subtitle**

Replace:
```html
        <p class="text-offwhite/70 max-w-xl mx-auto">Um vislumbre dos espaços pensados para o seu dia a dia.</p>
```
with:
```html
        <p class="text-offwhite/70 max-w-xl mx-auto">Lazer completo: espaços pensados para cada momento do seu dia a dia.</p>
```

- [ ] **Step 5: Verify**

Run:
```bash
grep -n 'id="diferenciais"' site/index.html
grep -c "vegetação preservada" site/index.html
grep -c "segurança 24 horas" site/index.html
grep -c "Aldeia da Serra" site/index.html
grep -c "Lazer completo" site/index.html
```
Expected: no match for `id="diferenciais"` (grep exit code 1), and `1` for each of the other four checks.

- [ ] **Step 6: Commit**

```bash
git add site/index.html
git commit -m "Remove Diferenciais section, fold its copy into Promessa/Localização/Galeria, add distance matrix"
```

---

### Task 8: Swap localização background to the client's location asset

**Files:**
- Create: `tools/extract-location-bg-asset1.js`
- Modify (generated): `site/assets/images/location-bg.jpg`

**Interfaces:** none (output path is unchanged, so `site/index.html`'s `<img src="assets/images/location-bg.jpg">` needs no edit).

- [ ] **Step 1: Write the processing script**

The source, `Asset 1@2x-100.jpg`, is a print-ready **CMYK** JPEG (1231×647px) — it must be converted to sRGB or it will render with wrong/inverted colors in browsers, which don't support CMYK JPEGs.

Create `tools/extract-location-bg-asset1.js`:
```js
// tools/extract-location-bg-asset1.js
// Swap the #localizacao background to the client's "Asset 1@2x-100" location
// graphic. Source is a print-ready CMYK JPEG (1231x647) — must convert to
// sRGB or it renders with wrong/inverted colors in browsers. Native
// resolution is already small (1231px wide); do not upscale.
// Run: node extract-location-bg-asset1.js
const path = require('path');
const sharp = require('sharp');

const SRC = 'C:\\Users\\Doc\\Desktop\\ReservaVereda\\Asset 1@2x-100.jpg';
const OUT = path.resolve(__dirname, '../site/assets/images/location-bg.jpg');

sharp(SRC)
  .toColorspace('srgb')
  .jpeg({ quality: 88 })
  .toFile(OUT)
  .then(() => console.log('wrote location-bg.jpg'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

- [ ] **Step 2: Run it**

Run: `cd tools && node extract-location-bg-asset1.js`
Expected: prints `wrote location-bg.jpg`.

- [ ] **Step 3: Verify the output is sRGB and roughly the source's dimensions**

Create a throwaway check script `tools/_check-location-bg.js`:
```js
const sharp = require('sharp');
sharp('../site/assets/images/location-bg.jpg').metadata().then((m) => {
  console.log(JSON.stringify({ width: m.width, height: m.height, space: m.space }));
});
```
Run: `cd tools && node _check-location-bg.js`
Expected: `{"width":1231,"height":647,"space":"srgb"}` — `space` must read `srgb`, not `cmyk`.
Delete `tools/_check-location-bg.js` afterward.

- [ ] **Step 4: Commit**

```bash
git add tools/extract-location-bg-asset1.js site/assets/images/location-bg.jpg
git commit -m "Swap localizacao background to client's Asset 1 location graphic"
```

---

### Task 9 (best-effort, optional): Extract a map/entorno image from the Panfleto PDF

**Files:**
- Create (conditionally): `tools/extract-panfleto-map.js`
- Create (conditionally): `site/assets/images/location-map.jpg`
- Modify (conditionally): `site/index.html` (`#localizacao` section, add a second image)

**Interfaces:** none.

This task has a real go/no-go decision baked in: the Panfleto PDF (`C:\Users\Doc\Desktop\ReservaVereda\Reserva Vereda - Panfleto 2 dobras 64,5x26cm.pdf`) has exactly 2 pages, each a huge print-ready spread (1839.69 × 748.346 pt — a 2-fold pamphlet, so each page holds 3 side-by-side panels). Whether either page contains a reusable map/entorno graphic can only be known by looking at them.

- [ ] **Step 1: Render both pages as review thumbnails**

Run (adjust the poppler path if `pdftoppm` is already on PATH):
```bash
mkdir -p /c/Users/Doc/AppData/Local/Temp/claude/panfleto-review
"/c/Users/Doc/AppData/Local/Microsoft/WinGet/Packages/oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe/poppler-25.07.0/Library/bin/pdftoppm.exe" -png -r 100 "C:\Users\Doc\Desktop\ReservaVereda\Reserva Vereda - Panfleto 2 dobras 64,5x26cm.pdf" /c/Users/Doc/AppData/Local/Temp/claude/panfleto-review/page
```
Expected: `page-1.png` and `page-2.png` created in that temp folder (not inside the repo — these are throwaway review renders).

- [ ] **Step 2: View both renders and decide**

Use the Read tool on `panfleto-review/page-1.png` and `panfleto-review/page-2.png`. Look specifically for a map, location pin, or "entorno"/distances diagram among the panels (the pamphlet's front/back cover panels are more likely to be generic branding — a map, if present, is more likely on an inner panel).

- **If no usable map/location graphic is found on either page:** stop here. Do not create the script or image. Note in the final summary that the Panfleto had no reusable map asset for this round, and delete the `panfleto-review` temp folder. Skip Steps 3-6.
- **If a usable map/location graphic is found:** note which page (1 or 2) and its approximate bounding box as a fraction of the full page width/height (e.g. "middle third of page 2, roughly x: 33%-66%, y: 10%-90%"), then continue.

- [ ] **Step 3: Render the chosen page at high resolution and crop it**

Create `tools/extract-panfleto-map.js`, filling in `PAGE`, `LEFT_FRAC`/`TOP_FRAC`/`WIDTH_FRAC`/`HEIGHT_FRAC` with the bounding box identified in Step 2 (values below are placeholders showing the shape of the script — replace them with the real fractions before running):
```js
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
const PAGE = 2; // page identified in the manual review step
const TMP_PREFIX = path.resolve(__dirname, '_panfleto-hires');
const OUT = path.resolve(__dirname, '../site/assets/images/location-map.jpg');

// Bounding box as a fraction of the full rendered page (from manual review).
const LEFT_FRAC = 0.33;
const TOP_FRAC = 0.1;
const WIDTH_FRAC = 0.33;
const HEIGHT_FRAC = 0.8;

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
```

- [ ] **Step 4: Run it and inspect the crop**

Run: `cd tools && node extract-panfleto-map.js`
Then view `site/assets/images/location-map.jpg` with the Read tool. If the crop is off (wrong panel, too tight/loose), adjust the `*_FRAC` constants and re-run — this is expected to take 1-2 iterations.

- [ ] **Step 5: Add the image to the Localização section**

Once the crop looks right, add it inside `#localizacao`'s content column in `site/index.html`, right after the distance-matrix `<div>` added in Task 7 Step 2:
```html
      <div class="mt-10 max-w-sm mx-auto">
        <img src="assets/images/location-map.jpg" alt="Mapa de localização do Reserva Vereda na Granja Viana" class="w-full rounded-3xl" />
      </div>
```

- [ ] **Step 6: Verify and commit**

Run:
```bash
ls -la site/assets/images/location-map.jpg
grep -n "location-map.jpg" site/index.html
```
Expected: file present, one match in `index.html`.

```bash
git add tools/extract-panfleto-map.js site/assets/images/location-map.jpg site/index.html
git commit -m "Add location map panel extracted from Panfleto PDF"
```

If Step 2 concluded there was no usable map (the no-go branch), skip this commit entirely — there is nothing to commit for this task.

---

## Self-Review Notes

- **Spec coverage:** Fonts (Task 1), logo (Task 2), Elleven seal (Task 3), organic shapes (Task 6, plus Diferenciais' rectangular cards removed in Task 7), amenidades contrast (Task 5), dual-CTA header/hero + profile field (Task 4), distance matrix (Task 7), Diferenciais removal/integration (Task 7), Asset 1 location image (Task 8), Panfleto map (Task 9, explicitly best-effort per spec). Hero copy, tracking, email activation, and Galeria/Amenidades tone rewrite are correctly excluded per the spec's "fora de escopo" section.
- **Type/interface consistency:** `field-perfil` (Task 4) matches the `name="perfil"` submitted via the existing `new FormData(form)` in `initLeadForm` — verified that function needs no changes. `elleven-seal` (Task 3) and `field-perfil`/`js-cta-profile` (Task 4) IDs/classes are consistent between their HTML insertion steps and their JS consumption steps.
- **Sequencing:** Tasks 1-2 (fonts, logo) are independent of everything else. Task 3 and Task 4 both edit `main.js`'s `DOMContentLoaded` list and are ordered sequentially to avoid conflicting edits. Task 6 must precede Task 7 so its `rounded-lg` count check reflects a stable file state (Task 7 doesn't touch `rounded-lg` itself but reduces the file's line count via the Diferenciais deletion). Task 9 is independent and can be skipped without affecting any other task.
