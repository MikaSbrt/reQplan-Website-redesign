/* ========================================
   REQPLAN GMBH – ANIMATIONS JS
   Vanilla JS – No framework
   ======================================== */

/* === 1. SCROLL REVEAL (Intersection Observer) === */
const revealOnScroll = () => {
  const targets = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .statement-divider'
  );
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  targets.forEach(el => observer.observe(el));
};

/* Stagger card reveals */
const revealCards = () => {
  const cardGroups = document.querySelectorAll('.leistungen-grid, .icons-grid, .stats-grid, .vermietung-grid, .features-grid, .gallery-grid');

  cardGroups.forEach(group => {
    const cards = group.querySelectorAll('.service-card, .leistung-card, .service-icon-item, .stat-item, .vermietung-card, .feature-card, .gallery-item, .icon-item');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const delay = (index % 6) * 80;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    cards.forEach(card => observer.observe(card));
  });
};

/* === 2. NUMBER COUNTER ANIMATION === */
const animateCounters = () => {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const start = parseInt(el.dataset.from || 0, 10);
    const duration = parseInt(el.dataset.duration || 1800, 10);
    const suffix = el.dataset.suffix || '';
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      const currentValue = Math.round(start + (target - start) * easedProgress);

      el.textContent = currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
};

/* === 3. STICKY NAV (transparent → solid) === */
const stickyNav = () => {
  const header = document.getElementById('site-header');
  if (!header) return;

  const threshold = 60;

  const update = () => {
    if (window.scrollY > threshold) {
      header.classList.remove('transparent');
      header.classList.add('solid');
    } else {
      header.classList.remove('solid');
      header.classList.add('transparent');
    }
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
};

/* === 4. HERO PARALLAX === */
const parallaxHero = () => {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  const update = () => {
    const scrolled = window.scrollY;
    const limit = window.innerHeight;
    if (scrolled > limit) return;
    heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
  };

  window.addEventListener('scroll', update, { passive: true });
};

/* === 5. DROPDOWN MENUS === */
const dropdownMenus = () => {
  const dropdowns = document.querySelectorAll('.has-dropdown');
  if (!dropdowns.length) return;

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

    const toggle = item.querySelector('.nav-link');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      dropdowns.forEach(d => d.classList.remove('open'));
    }
  });
};

/* === 6. MOBILE HAMBURGER MENU === */
const mobileMenu = () => {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!hamburger || !menu) return;

  const toggle = (open) => {
    hamburger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    toggle(!isOpen);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });

  /* Mobile dropdown toggles */
  const mobileToggles = document.querySelectorAll('.mobile-dropdown-toggle');
  mobileToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const submenu = btn.nextElementSibling;
      const arrow = btn.querySelector('span');
      submenu.classList.toggle('open');
      if (arrow) arrow.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : '';
    });
  });

  /* Close when nav link clicked */
  const mobileLinks = menu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });
};

/* === 7. TEXT GLITCH REVEAL for Hero Headline === */
const glitchReveal = () => {
  const headline = document.querySelector('.hero-headline');
  if (!headline) return;

  headline.setAttribute('data-text', headline.textContent);

  /* Trigger glitch after entrance animation completes */
  setTimeout(() => {
    headline.classList.add('glitch-active');
    setTimeout(() => headline.classList.remove('glitch-active'), 600);
  }, 1400);
};

/* === 8. ACTIVE NAV LINK === */
const setActiveNav = () => {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';

  const allLinks = document.querySelectorAll('.nav-link, .mobile-nav-links a');
  allLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkFile = href.split('/').pop();
    if (linkFile === filename || (filename === '' && linkFile === 'index.html')) {
      link.classList.add('active');
    }
  });
};

/* === INIT === */
export { revealOnScroll, revealCards, animateCounters, stickyNav, parallaxHero, dropdownMenus, mobileMenu, glitchReveal, setActiveNav };
