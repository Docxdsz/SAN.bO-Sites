// js/config.js
// TODO: replace with your real values before going live.
window.SITE_CONFIG = {
  // Vercel serverless function (api/contact.js) that sends the lead email
  // via SMTP. Same-origin, so a relative path works in production.
  CONTACT_ENDPOINT: '/api/contact',

  // Reference only — shown on the page and the privacy policy. The actual
  // recipient is hardcoded in api/contact.js (TO_EMAIL).
  NOTIFY_EMAIL: 'contato@reservavereda.com.br',

  // Digits only, country + area code, e.g. "5511999998888". Used to build
  // the footer's wa.me WhatsApp link.
  WHATSAPP_NUMBER: 'TODO_WHATSAPP_NUMBER',

  // Hero countdown target. Set to 90 days from 2026-08-03 (the date this was
  // configured, per the client's "90 dias" request) = 2026-11-01, midnight
  // America/Sao_Paulo. Update this single value if the client gives a real
  // launch date later — everything else recalculates automatically.
  COUNTDOWN_TARGET: '2026-11-01T00:00:00-03:00',
};
