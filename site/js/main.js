// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeroAnimation();
  initScrollReveals();
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
  tl.fromTo('#hero-bg', { scale: 1.15 }, { scale: 1, duration: 2.4 })
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
