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

  // Hero countdown target. Set to 90 days from 2026-08-03 (the date this was
  // configured, per the client's "90 dias" request) = 2026-11-01, midnight
  // America/Sao_Paulo. Update this single value if the client gives a real
  // launch date later — everything else recalculates automatically.
  COUNTDOWN_TARGET: '2026-11-01T00:00:00-03:00',
};
