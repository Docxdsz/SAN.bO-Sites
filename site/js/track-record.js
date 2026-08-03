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
