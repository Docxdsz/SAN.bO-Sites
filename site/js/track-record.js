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
  initTrackScroll();
});
