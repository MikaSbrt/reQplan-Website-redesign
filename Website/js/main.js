/* ========================================
   REQPLAN GMBH – MAIN JS (combined)
   Vanilla JS – No framework, no modules
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  stickyNav();
  dropdownMenus();
  mobileMenu();
  setActiveNav();
  revealOnScroll();
  revealCards();
  animateCounters();
  parallaxHero();
  glitchReveal();
  initContactForm();
});

/* === 1. STICKY NAV === */
function stickyNav() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const update = () => {
    if (window.scrollY > 60) {
      header.classList.replace('transparent', 'solid') || header.classList.add('solid');
    } else {
      header.classList.replace('solid', 'transparent') || header.classList.add('transparent');
    }
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* === 2. DROPDOWN MENUS === */
function dropdownMenus() {
  const dropdowns = document.querySelectorAll('.has-dropdown');
  dropdowns.forEach(item => {
    let closeTimer;
    item.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      dropdowns.forEach(d => { if (d !== item) d.classList.remove('open'); });
      item.classList.add('open');
    });
    item.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => item.classList.remove('open'), 200);
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      dropdowns.forEach(d => d.classList.remove('open'));
    }
  });
}

/* === 3. MOBILE MENU === */
function mobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!hamburger || !menu) return;

  const toggle = (open) => {
    hamburger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggle(!hamburger.classList.contains('open')));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });

  document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      const arrow = btn.querySelector('.m-arrow');
      if (sub) sub.classList.toggle('open');
      if (arrow) arrow.style.transform = sub && sub.classList.contains('open') ? 'rotate(180deg)' : '';
    });
  });

  menu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => toggle(false)));
}

/* === 4. ACTIVE NAV LINK === */
function setActiveNav() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-links a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkFile = href.split('/').pop();
    if (linkFile === filename || (filename === '' && linkFile === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* === 5. SCROLL REVEAL === */
function revealOnScroll() {
  const targets = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .statement-divider'
  );
  if (!targets.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => obs.observe(el));
}

/* === 6. CARD STAGGER REVEAL === */
function revealCards() {
  const selectors = '.leistung-card, .service-icon-item, .stat-item, .vermietung-card, .feature-card, .gallery-item, .agb-section, .weitere-link';
  const cards = document.querySelectorAll(selectors);
  const seen = new Set();

  const obs = new IntersectionObserver((entries) => {
    let delay = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting && !seen.has(entry.target)) {
        seen.add(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        delay += 70;
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  cards.forEach(card => obs.observe(card));
}

/* === 7. NUMBER COUNTERS === */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        const target = parseInt(el.dataset.count, 10);
        const from = parseInt(el.dataset.from || '0', 10);
        const duration = parseInt(el.dataset.duration || '1600', 10);
        const suffix = el.dataset.suffix || '';
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(from + (target - from) * eased) + suffix;
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    obs.observe(el);
  });
}

/* === 8. HERO PARALLAX === */
function parallaxHero() {
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      bg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    }
  }, { passive: true });
}

/* === 9. HERO GLITCH REVEAL === */
function glitchReveal() {
  const el = document.querySelector('.hero-headline');
  if (!el) return;
  el.setAttribute('data-text', el.textContent);
  setTimeout(() => {
    el.classList.add('glitch-active');
    setTimeout(() => el.classList.remove('glitch-active'), 600);
  }, 1600);
}

/* === 10. CONTACT FORM === */
function initContactForm() {
  document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Wird gesendet …';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 1200));
      const msg = document.createElement('p');
      msg.style.cssText = 'color:#4ade80;font-size:.875rem;font-weight:600;margin-top:1rem;padding:1rem;background:rgba(0,200,100,.08);border:1px solid rgba(0,200,100,.25);border-radius:8px;';
      msg.textContent = '✓ Vielen Dank! Wir melden uns schnellstmöglich bei Ihnen.';
      form.appendChild(msg);
      btn.textContent = orig;
      btn.disabled = false;
      form.reset();
      setTimeout(() => msg.remove(), 5000);
    });
  });
}
