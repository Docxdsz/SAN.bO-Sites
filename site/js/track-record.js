// site/js/track-record.js
// Renders window.TRACK_RECORD (site/js/track-record-data.js) into
// #track-track as alternating top/bottom cards along a center line.
const TRACK_ICON_PIN =
  '<svg class="w-4 h-4 text-gold-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M12 21s-7-6.7-7-11.5A7 7 0 0 1 19 9.5C19 14.3 12 21 12 21Z" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.4"/></svg>';
const TRACK_ICON_BUILDING =
  '<svg class="w-4 h-4 text-gold-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="1" stroke-linejoin="round"/><path d="M10 7.2h1M13 7.2h1M10 11h1M13 11h1M10 14.8h1M13 14.8h1" stroke-linecap="round"/></svg>';

const TRACK_PILL_CLASSES = {
  entregue: 'bg-forest-800 text-offwhite',
  'em-obras': 'bg-gold-600 text-offwhite',
  lancamento: 'bg-gold-400 text-forest-950',
};

function trackStatusText(entry) {
  if (!entry.statusYear) {
    return entry.statusLabel;
  }
  if (entry.statusMonth) {
    return `${entry.statusLabel} ${entry.statusMonth}/${entry.statusYear}`;
  }
  return `${entry.statusLabel} ${entry.statusYear}`;
}

function trackStatusPillHTML(entry) {
  const classes = TRACK_PILL_CLASSES[entry.status] || TRACK_PILL_CLASSES.lancamento;
  return `<span class="track-pill ${classes}">${trackStatusText(entry)}</span>`;
}

function trackCardHTML(entry) {
  const photo = entry.photo
    ? `<img src="${entry.photo}" alt="${entry.name}" class="track-photo" loading="lazy" />`
    : `<div class="track-photo-fallback"><span class="font-serif text-offwhite text-base leading-snug">${entry.name}</span></div>`;

  // Cards where launch is null (5 not-yet-delivered projects have no launch
  // line) still render an invisible placeholder of the same height, so every
  // card's panel stays the same total height regardless of which optional
  // fields it has — otherwise a shorter panel shifts that card's centered
  // .track-dot up onto its title text instead of the gap below the photo.
  const launchLine = entry.launch
    ? `<p class="text-gold-600 text-[11px] uppercase tracking-widest mb-1">Lançamento ${entry.launch}</p>`
    : `<p class="invisible text-[11px] mb-1">&nbsp;</p>`;

  const locationRow = entry.location
    ? `<div class="flex items-center gap-2 mb-1.5">${TRACK_ICON_PIN}<span class="text-forest-950/75 text-sm">${entry.location}</span></div>`
    : `<div class="invisible flex items-center gap-2 mb-1.5">${TRACK_ICON_PIN}<span class="text-sm">&nbsp;</span></div>`;

  const unitsText = entry.towers ? `${entry.units} · ${entry.towers}` : entry.units;
  const unitsRow = `<div class="flex items-center gap-2 mb-2">${TRACK_ICON_BUILDING}<span class="text-forest-950/75 text-sm">${unitsText}</span></div>`;

  return `
    <div class="track-card${entry.highlight ? ' track-highlight' : ''}" data-row="${entry.row}" data-id="${entry.id}">
      <div class="track-panel">
        <div class="track-photo-wrap">${photo}</div>
        <div class="track-info pt-3">
          ${launchLine}
          <p class="font-serif text-offwhite-950 text-lg mb-1.5 leading-tight">${entry.name}</p>
          ${locationRow}
          ${unitsRow}
          <div class="pt-2 border-t border-offwhite-950/10">
            <p class="text-gold-600 text-sm font-medium">VGV: ${entry.vgv}</p>
          </div>
        </div>
      </div>
      <div class="track-marker text-center py-2">
        ${trackStatusPillHTML(entry)}
      </div>
      <span class="track-dot" aria-hidden="true"></span>
    </div>
  `;
}

function renderTrackRecord() {
  const track = document.getElementById('track-track');
  if (!track || !window.TRACK_RECORD) return;

  track.innerHTML =
    '<div class="track-line" aria-hidden="true"></div>' +
    window.TRACK_RECORD.map(trackCardHTML).join('');

  // The line must span the full scrollable width of the track (not just the
  // visible viewport). Since it's absolutely positioned, its own box doesn't
  // grow with the overflowing card content, so set its width explicitly to
  // the track's measured scrollWidth once the cards have been laid out.
  const line = track.querySelector('.track-line');
  if (line) {
    line.style.width = `${track.scrollWidth}px`;
  }
}

function initTrackReveal() {
  const track = document.getElementById('track-track');
  if (!track) return;

  const cards = track.querySelectorAll('.track-card');

  if (typeof IntersectionObserver === 'undefined') {
    cards.forEach((card) => card.classList.add('track-card--visible'));
    return;
  }

  // Observe .track-panel (the real, sized content box), not .track-card
  // itself — .track-card collapses to a 1px positioning anchor (see the CSS
  // comment above .track-panel), so a threshold-based ratio computed against
  // it would fire on the faintest edge overlap instead of a meaningful
  // fraction of the card actually being visible.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target.closest('.track-card');
          if (card) card.classList.add('track-card--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { root: track, threshold: 0.35 }
  );

  cards.forEach((card) => {
    const panel = card.querySelector('.track-panel');
    observer.observe(panel || card);
  });
}

function initTrackFloatingUIHide() {
  // The fixed left-edge trail guide floats above every section — fine
  // everywhere else, but it visually clutters this section's dense card
  // grid (worst during the desktop pin, which holds the section in place
  // for a while). Temporarily hide it while #trajetoria is substantially
  // in view. The Elleven seal and WhatsApp button used to be hidden here
  // too (to avoid overlapping bottom-row cards), but the client wants both
  // always visible, so they're excluded — they may briefly overlap a card
  // here, but that's the accepted tradeoff.
  const section = document.getElementById('trajetoria');
  const trail = document.querySelector('.trail');
  if (!section || !trail || typeof IntersectionObserver === 'undefined') return;

  const setHidden = (hidden) => {
    trail.style.opacity = hidden ? '0' : '';
    trail.style.pointerEvents = hidden ? 'none' : '';
  };

  const observer = new IntersectionObserver(
    ([entry]) => setHidden(entry.isIntersecting),
    { threshold: 0.15 }
  );
  observer.observe(section);
}

function initTrackScroll() {
  // Pin #trajetoria-pin-wrap (heading + track-viewport together), not just
  // #track-viewport alone — otherwise the heading, being normal in-flow
  // content above the pinned viewport, has already scrolled off the top of
  // the page by the time the pin engages and stays off-screen for the whole
  // horizontal scroll. Pinning the wrapper keeps the title/subtitle on
  // screen for the entire card scroll instead of just before it.
  const pinWrap = document.getElementById('trajetoria-pin-wrap');
  const viewport = document.getElementById('track-viewport');
  const track = document.getElementById('track-track');
  if (!pinWrap || !viewport || !track) return;

  const prefersReducedMotion = window.matchMedia('(prefers-motion: reduce), (prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  if (prefersReducedMotion || !isDesktop || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return; // falls back to the native horizontal scroll from Task 2's CSS
  }

  gsap.registerPlugin(ScrollTrigger);

  const getScrollDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

  const st = ScrollTrigger.create({
    trigger: pinWrap,
    start: 'top top+=64', // clears the fixed header (#site-header renders ~59px tall)
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

document.addEventListener('DOMContentLoaded', () => {
  renderTrackRecord();
  initTrackReveal();
  initTrackFloatingUIHide();
});

// initTrackScroll() is deferred to the 'load' event (fires once every
// script has finished running, after DOMContentLoaded) rather than grouped
// with the functions above. This file's DOMContentLoaded listener runs
// before main.js's (script tag order), so if initTrackScroll() ran here,
// its ScrollTrigger pin would be created before the hero's own pin
// (main.js's initHeroScrollStory) has inserted its pin-spacer — GSAP then
// calculates this pin's start position against a page ~1980px shorter
// than reality (the hero pin's reserved scroll distance), causing the
// whole timeline to activate far too early and render pinned on top of
// the form section above it. Waiting for 'load' guarantees every other
// pin on the page already exists.
window.addEventListener('load', initTrackScroll);
