# Reserva Vereda — Teaser Site ("Fase Pirata") Design

## Context

"Fase Pirata" is Brazilian real-estate marketing terminology for a pre-launch teaser
landing page: a single page published before a development's official launch, used to
build curiosity and capture leads without revealing full project details (unit sizes,
floor plans, exact address, pricing).

This spec covers the teaser site for **Reserva Vereda Granja Viana**, a luxury
residential development by Elleven Engenharia (with partners VCS, Conecta, SAN.bO).

Source materials (in `C:\Users\Doc\Desktop\ReservaVereda\`):
- `luxury_teaser_website_proposal.md` — the approved content/structure/tone brief.
- `BOOK DO EMPREENDIMENTO - RESERVA VEREDA - PRÉVIA - R.pdf` — 74-page brand book with
  logo, color palette, and architectural renders, used as the asset source.

## Goal

A single-page, animation-forward teaser site that:
- Establishes mystery/exclusivity ("quiet luxury") rather than explaining the project.
- Captures leads (nome, e-mail, telefone/WhatsApp) via a minimal form.
- Matches the brand book's dark-green/gold, palm-leaf-textured visual identity.

Non-goals: floor plans, unit metrics, pricing, exact address, multi-page navigation,
CMS/backend, automated tests (nothing stateful to unit-test).

## Tech approach

Static site, **no build step**:
- Plain HTML + Tailwind CSS via the browser CDN build (utility classes for layout/
  responsive design) with a small custom CSS layer for fonts, texture overlays, and
  keyframes not expressible in utilities alone.
- GSAP (CDN) for reveal/entrance animations, incl. ScrollTrigger.
- Lenis (CDN) for smooth-scroll momentum.
- No npm, no bundler, no framework. Deploy by uploading the `site/` folder to any
  static host (Netlify, Vercel, cPanel, etc.).

Rejected alternatives:
- Vite-built Tailwind: real dev server + purged CSS, but adds `npm install` and a
  build step for a single static page with no interactivity beyond a form and scroll
  animations — not worth the overhead here.
- Next.js/React: no routing, no dynamic data, no state beyond a form — a framework
  buys nothing over plain HTML/CSS/JS for this scope.

## File structure

```
reserva-vereda-site/
  docs/superpowers/specs/          (this spec)
  site/                            (deployable — upload this folder as-is)
    index.html
    privacy.html
    css/style.css                  (custom layer on top of Tailwind CDN)
    js/main.js                     (Lenis init, GSAP reveals, form submit handling)
    js/config.js                   (FORMSPREE_ENDPOINT, WHATSAPP_NUMBER, NOTIFY_EMAIL)
    assets/images/                 (renders extracted from the book PDF)
    assets/logo.png                (or .svg if a vector version can be isolated)
```

## Page sections

Content follows `luxury_teaser_website_proposal.md` directly (Portuguese copy is
already approved in that doc; implementation should use it verbatim).

1. **Hero**
   - Full-bleed background: an atmospheric render extracted from the book (dusk
     facade or sunset lifestyle shot), dark-green gradient overlay for text
     legibility, palm-leaf texture accent.
   - Logo mark ("Reserva Vereda — Granja Viana").
   - Headline: "Em breve, o melhor condomínio da Granja Viana."
   - Subtitle: "Um novo capítulo de exclusividade e bem-estar está para começar.
     Prepare-se para viver o extraordinário."
   - Primary CTA button ("Peça informações") — smooth-scrolls to the form section.

2. **A Promessa**
   - Title: "Onde a natureza encontra a sofisticação."
   - Short aspirational paragraph (from proposal §3.2).
   - Atmospheric visual (garden-path render), alternating text/image layout.

3. **Form / CTA**
   - Title: "Seja um dos primeiros a descobrir."
   - Descriptive text (proposal §3.3).
   - Minimal form: Nome, E-mail, Telefone/WhatsApp, submit button ("Quero receber
     informações exclusivas").
   - QR code placeholder is out of scope for this pass (print collateral, not web).

4. **Footer**
   - Elleven + partner logos (VCS, Conecta, SAN.bO), extracted from the book cover.
   - Minimal placeholder contact line.
   - Link to `privacy.html`.
   - Copyright line.

## Animation behavior

- Lenis initialized globally for smooth-scroll momentum across the page.
- Hero entrance (GSAP timeline on load): background slow fade-in + subtle zoom-out;
  headline reveals word-by-word via a custom span-wrap + stagger (no paid SplitText
  plugin — GSAP's free core covers this via manual DOM splitting); subtitle and CTA
  fade-up in sequence after.
- Sections 2–3: GSAP ScrollTrigger fade-in + slide-up as each enters the viewport,
  staggered per element.
- Buttons/inputs: subtle gold-glow hover/focus state, no jarring transitions.

## Form data flow

- Native `<form>`, submission intercepted via `fetch` (no page navigation) and POSTed
  to a Formspree endpoint read from `js/config.js`.
- On success, the form is replaced inline with a confirmation message (no redirect).
- Client-side validation: required fields, basic e-mail pattern, basic phone pattern.
- `js/config.js` holds three placeholder values the user swaps in once available,
  clearly marked with `// TODO`:
  - `FORMSPREE_ENDPOINT` — requires the user to create a form under their own
    Formspree account (cannot be done on their behalf) and paste the endpoint URL.
  - `NOTIFY_EMAIL` — documented alongside for reference; the real recipient is
    configured on the Formspree side, tied to whatever account owns the endpoint.
  - `WHATSAPP_NUMBER` — used in the footer contact line; placeholder until provided.
- Everything else (layout, animations, validation, section content) functions
  correctly without touching `config.js`.

## Privacy page (`privacy.html`)

Minimal LGPD-style policy, standalone page linked from the footer:
- What's collected: nome, e-mail, telefone.
- Purpose: contato comercial sobre o empreendimento Reserva Vereda.
- Controller: Elleven Engenharia (placeholder contact — swap alongside `config.js`
  values).
- User rights: acesso, correção, exclusão dos dados, conforme a LGPD.
- No third-party data sharing beyond the form-processing service (Formspree).

## Responsive design

Mobile-first Tailwind breakpoints: hero typography scales down on small screens,
all sections stack vertically, form is full-width on mobile, images crop/reflow
rather than overflow.

## Asset extraction plan

- Source: the book PDF, rendered/extracted via `pdftoppm`/`pdfimages` (Poppler,
  installed locally for this task).
- Candidates identified during review: page 6 (facade at dusk), page 7 (sunset
  lifestyle shot with facade inset), page 40 (landscaped garden path), page 8
  (clean logo lockup on palm-leaf texture), cover page 1 (palm-leaf texture only,
  for background reuse).
- Extract at high resolution (300 DPI or embedded-image extraction where the raw
  photo is available without composited captions/text), crop out any baked-in
  Portuguese caption bars or badge labels ("PERSPECTIVA ARTÍSTICA", etc.) that
  aren't appropriate for the teaser's minimal-reveal tone.
- Only 2–3 photographic assets are needed per the proposal's "poucas imagens,
  grande impacto" directive — avoid amenity-specific renders (pool, floor plans)
  since those over-reveal the project for a teaser phase.

## Testing / QA

No automated test framework — nothing stateful to unit-test in a static lead-gen
page. QA via a local static server + Playwright MCP (now available):
- Visual check at mobile/tablet/desktop widths.
- Verify scroll animations trigger correctly and Lenis smooth-scroll works.
- Verify form validation (empty fields, malformed e-mail) and the intercepted-submit
  success state render correctly.
- Check browser console for errors across the flow.

## Open items (user to provide before the site is fully wired)

- Formspree endpoint (user creates the form under their own account).
- Real WhatsApp number for the footer.
- Real contact email for the privacy policy page.

These are isolated to `js/config.js` and `privacy.html`'s contact line — everything
else is complete and functional without them.
