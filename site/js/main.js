// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeroScrollStory();
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

function initSmoothScroll() {
  if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') return;

  const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
  window.__lenis = lenis;
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

function initAnchorScroll() {
  const header = document.getElementById('site-header');

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const id = link.getAttribute('href');
    if (!id || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;

    link.addEventListener('click', (event) => {
      event.preventDefault();
      const headerOffset = header ? header.getBoundingClientRect().height : 0;

      if (window.__lenis) {
        window.__lenis.scrollTo(target, {
          offset: -(headerOffset + 16),
          duration: 1.6,
          easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
        });
      } else {
        const y = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

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

  // #hero-logo is absolutely positioned (top-1/2 left-1/2 in the markup, no
  // Tailwind translate classes) so it can be centered in the hero regardless
  // of how tall the sibling reveal content is. xPercent/yPercent:-50 does the
  // centering and is never touched again; the "rise while shrinking" motion
  // below animates plain `y` (viewport-relative px) and `scale` on top of
  // that fixed centering offset, so the two don't fight over `transform`.
  gsap.set(logo, { xPercent: -50, yPercent: -50, y: 0, scale: 1 });

  const revealTargets = [headline, line2, countdown, subtitle, cta].filter(Boolean);
  gsap.set(revealTargets, { opacity: 0, y: 24 });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  if (prefersReducedMotion || !isDesktop || typeof ScrollTrigger === 'undefined') {
    // Mobile / reduced-motion fallback: no scroll-jacking pin. Settle the
    // logo into its smaller, risen resting spot right away (rather than
    // leaving it huge and centered on top of the text that's about to
    // reveal in the same spot) and reveal the rest in place, matching the
    // site's normal (non-pinned) .js-reveal fade-in pattern used elsewhere.
    gsap.to(logo, { scale: 0.55, y: () => -window.innerHeight * 0.27, duration: 0.9, ease: 'power2.out' });
    gsap.to(revealTargets, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, delay: 0.4, ease: 'power2.out' });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Pins #hero itself (it's already min-h-screen) for an extended scroll
  // range and scrubs a single timeline across it: the huge centered logo
  // rises and shrinks first to make room, then the two client-mandated
  // headlines reveal in sequence, then the countdown/subtitle/CTA reveal
  // together just before the pin releases and the page continues scrolling
  // normally.
  gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=220%',
      pin: true,
      scrub: 1,
    },
  })
    .to(logo, { scale: 0.55, y: () => -window.innerHeight * 0.27, duration: 1, ease: 'power2.inOut' }, 0)
    .to(headline, { opacity: 1, y: 0, duration: 1 }, 1.0)
    .to(line2, { opacity: 1, y: 0, duration: 1 }, 2.2)
    .to([countdown, subtitle, cta], { opacity: 1, y: 0, duration: 1, stagger: 0.15 }, 3.4);
}

function initHeroSealDock() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const seal = document.getElementById('elleven-seal');
  const hero = document.getElementById('hero');
  if (!seal || !hero) return;

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
}

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

function initDividers() {
  if (typeof gsap === 'undefined') return;

  const items = document.querySelectorAll('.js-divider');
  gsap.set(items, { scaleX: 0 });
  items.forEach((el) => {
    gsap.to(el, {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  document.querySelectorAll('.js-parallax').forEach((img) => {
    const section = img.closest('section');
    if (!section) return;
    gsap.to(img, {
      yPercent: 2.5,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function initStickyChrome() {
  const header = document.getElementById('site-header');
  const whatsapp = document.getElementById('whatsapp-float');
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
  };

  if (typeof IntersectionObserver === 'undefined') {
    show();
    return;
  }

  const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? hide() : show()), { threshold: 0 });
  observer.observe(hero);
}

function initLightbox() {
  const items = Array.from(document.querySelectorAll('.js-lightbox'));
  const overlay = document.getElementById('lightbox-overlay');
  if (!items.length || !overlay) return;

  const imageEl = document.getElementById('lightbox-image');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  let index = 0;
  let previouslyFocused = null;

  const show = (i) => {
    index = (i + items.length) % items.length;
    imageEl.src = items[index].src;
    imageEl.alt = items[index].alt || '';
  };
  const open = (i) => {
    previouslyFocused = document.activeElement;
    show(i);
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');
    if (window.__lenis) window.__lenis.stop();
    closeBtn.focus();
  };
  const close = () => {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overflow-hidden');
    if (window.__lenis) window.__lenis.start();
    imageEl.src = '';
    if (previouslyFocused) previouslyFocused.focus();
  };

  items.forEach((img, i) => {
    img.addEventListener('click', () => open(i));
    img.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(i);
      }
    });
  });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => show(index + 1));
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener('keydown', (event) => {
    if (overlay.classList.contains('hidden')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });
}

function initTrail() {
  const trail = document.querySelector('.trail');
  const fill = document.querySelector('.trail-fill');
  const dots = Array.from(document.querySelectorAll('.trail-dot'));
  const words = Array.from(document.querySelectorAll('.trail-word'));
  const lightSections = Array.from(document.querySelectorAll('[data-trail-light]'));
  if (!fill) return;

  const marks = [0.2, 0.48, 0.74]; // also each dot/word's fixed top-% down the viewport (see CSS)

  // Each point along the trail shows the color of whatever section background
  // is actually behind it right now — gold over dark sections, forest green
  // over [data-trail-light] ones — blending gradually across a short zone
  // around each section's edge as it crosses that point, rather than the
  // whole bar switching color together.
  const DARK_ACCENT = [203, 169, 122];
  const LIGHT_ACCENT = [23, 46, 35];
  const BLEND_ZONE_PX = 160;

  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpRGB = (c1, c2, t) => [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
  const rgbStr = ([r, g, b]) => `${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`;

  // lightness (0 = dark/gold, 1 = light/green) of whatever is behind a given
  // viewport Y position (px from top of the viewport).
  function lightnessAt(yViewport) {
    const yAbs = window.scrollY + yViewport;
    let lightness = 0;
    lightSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const bottom = rect.bottom + window.scrollY;
      let v;
      if (yAbs >= top && yAbs <= bottom) {
        v = 1;
      } else if (yAbs < top) {
        v = 1 - Math.min(1, (top - yAbs) / BLEND_ZONE_PX);
      } else {
        v = 1 - Math.min(1, (yAbs - bottom) / BLEND_ZONE_PX);
      }
      lightness = Math.max(lightness, v);
    });
    return Math.max(0, Math.min(1, lightness));
  }

  function colorAt(yViewport) {
    return rgbStr(lerpRGB(DARK_ACCENT, LIGHT_ACCENT, lightnessAt(yViewport)));
  }

  function buildGradient() {
    const h = window.innerHeight;
    const eventYs = new Set([0, h]);
    lightSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      [rect.top - BLEND_ZONE_PX, rect.top, rect.bottom, rect.bottom + BLEND_ZONE_PX].forEach((y) => {
        if (y > 0 && y < h) eventYs.add(y);
      });
    });
    const stops = Array.from(eventYs)
      .sort((a, b) => a - b)
      .map((y) => `rgb(${colorAt(y)}) ${((y / h) * 100).toFixed(2)}%`);
    return `linear-gradient(to bottom, ${stops.join(', ')})`;
  }

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;

    fill.style.setProperty('--sp', progress.toFixed(4));
    dots.forEach((dot, i) => dot.classList.toggle('on', progress >= marks[i] - 0.03));
    words.forEach((word, i) => word.classList.toggle('on', progress >= marks[i] - 0.03));

    if (trail) {
      trail.style.setProperty('--trail-gradient', buildGradient());
    }

    // The fill bar is scaled (not clip-revealed), so a position-mapped
    // gradient would get visually compressed as it grows and show colors
    // that don't match what's actually on screen — give it a single solid
    // color instead, sampled at the viewport center.
    const fillAccent = colorAt(window.innerHeight / 2);
    fill.style.setProperty('--trail-mid', `rgb(${fillAccent})`);
    fill.style.setProperty('--trail-end', `rgb(${fillAccent})`);
    fill.style.setProperty('--trail-glow', `rgba(${fillAccent}, 0.6)`);

    dots.forEach((dot, i) => {
      const accent = colorAt(window.innerHeight * marks[i]);
      dot.style.setProperty('--trail-solid', `rgb(${accent})`);
      dot.style.setProperty('--trail-glow-soft', `rgba(${accent}, 0.4)`);
      dot.style.setProperty('--trail-glow-strong', `rgba(${accent}, 0.85)`);
    });

    words.forEach((word, i) => {
      const accent = colorAt(window.innerHeight * marks[i]);
      word.style.setProperty('--trail-mid', `rgb(${accent})`);
      word.style.setProperty('--trail-glow', `rgba(${accent}, 0.7)`);
    });
  }

  // Prefer Lenis' own scroll event (same pattern initSmoothScroll uses for
  // ScrollTrigger) so this stays in sync with the smoothed scroll position
  // rather than the native, un-smoothed one.
  if (window.__lenis) {
    window.__lenis.on('scroll', update);
  } else {
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      },
      { passive: true },
    );
  }
  update();
}

function initLeadForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  const successEl = document.getElementById('form-success');
  const errorEl = document.getElementById('form-error');
  const whatsappLinks = [
    document.getElementById('contact-whatsapp'),
    document.getElementById('whatsapp-float'),
    document.getElementById('form-contact-whatsapp'),
  ].filter(Boolean);
  const formWhatsappText = document.getElementById('form-contact-whatsapp-text');
  const formContactWhatsapp = document.getElementById('form-contact-whatsapp');
  const formEmailLink = document.getElementById('form-contact-email');
  const formEmailText = document.getElementById('form-contact-email-text');
  const formContactBlock = document.getElementById('form-contact-block');

  if (window.SITE_CONFIG && SITE_CONFIG.WHATSAPP_NUMBER && !SITE_CONFIG.WHATSAPP_NUMBER.startsWith('TODO')) {
    whatsappLinks.forEach((el) => {
      el.href = `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}`;
      el.target = '_blank';
      el.rel = 'noopener';
    });
    if (formWhatsappText) formWhatsappText.textContent = `+${SITE_CONFIG.WHATSAPP_NUMBER}`;
    if (formContactWhatsapp) formContactWhatsapp.classList.remove('hidden');
    if (formContactBlock) formContactBlock.classList.remove('hidden');
  }

  if (window.SITE_CONFIG && SITE_CONFIG.NOTIFY_EMAIL && !SITE_CONFIG.NOTIFY_EMAIL.startsWith('TODO')) {
    if (formEmailLink) {
      formEmailLink.href = `mailto:${SITE_CONFIG.NOTIFY_EMAIL}`;
      formEmailLink.classList.remove('hidden');
    }
    if (formEmailText) formEmailText.textContent = SITE_CONFIG.NOTIFY_EMAIL;
    if (formContactBlock) formContactBlock.classList.remove('hidden');
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

function initCountdown() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
  if (!window.SITE_CONFIG || !SITE_CONFIG.COUNTDOWN_TARGET) return;

  const target = new Date(SITE_CONFIG.COUNTDOWN_TARGET).getTime();
  let countdownInterval;

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

    if (diff === 0) {
      clearInterval(countdownInterval);
    }
  }

  tick();
  countdownInterval = setInterval(tick, 1000);
}
