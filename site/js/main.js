// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeroAnimation();
  initScrollReveals();
  initDividers();
  initParallax();
  initStickyChrome();
  initLightbox();
  initLeadForm();
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
  tl.fromTo('#hero-bg', { scale: 1.12 }, { scale: 1.06, duration: 2.4 })
    .to(words, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.3)
    .to(subtitle, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
    .to(cta, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');
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

  const show = (i) => {
    index = (i + items.length) % items.length;
    imageEl.src = items[index].src;
    imageEl.alt = items[index].alt || '';
  };
  const open = (i) => {
    show(i);
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  };
  const close = () => {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
    imageEl.src = '';
  };

  items.forEach((img, i) => img.addEventListener('click', () => open(i)));
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
  const formEmailLink = document.getElementById('form-contact-email');
  const formEmailText = document.getElementById('form-contact-email-text');

  if (window.SITE_CONFIG && SITE_CONFIG.WHATSAPP_NUMBER && !SITE_CONFIG.WHATSAPP_NUMBER.startsWith('TODO')) {
    whatsappLinks.forEach((el) => {
      el.href = `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}`;
      el.target = '_blank';
      el.rel = 'noopener';
    });
    if (formWhatsappText) formWhatsappText.textContent = `+${SITE_CONFIG.WHATSAPP_NUMBER}`;
  }

  if (window.SITE_CONFIG && SITE_CONFIG.NOTIFY_EMAIL && !SITE_CONFIG.NOTIFY_EMAIL.startsWith('TODO')) {
    if (formEmailLink) formEmailLink.href = `mailto:${SITE_CONFIG.NOTIFY_EMAIL}`;
    if (formEmailText) formEmailText.textContent = SITE_CONFIG.NOTIFY_EMAIL;
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
