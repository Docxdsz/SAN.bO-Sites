// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeroAnimation();
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
