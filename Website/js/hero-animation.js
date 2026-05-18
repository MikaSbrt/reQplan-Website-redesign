/* ========================================
   REQPLAN HERO SEQUENCE  –  v2
   Cinematic scroll-driven intro animation

   Phase 1: Typewriter on dark screen
   Phase 2: Logo appears large, centred
   Phase 3: Scroll-zoom – Q grows from
            exact logo-Q position to full screen
   Phase 4: Clean reveal of page content
   ======================================== */
(function () {
  'use strict';

  var sequence, stage, bgDark, typewriterEl, typeText,
      logoEl, logoWrapper, subline, qOverlay, header;
  var phase   = 0;
  var ticking = false;
  var done    = false;
  var bgPink  = false;   // flag: bg-to-pink triggered only once

  /* q-start geometry, captured after logo is fully visible */
  var qs = null;  /* { left, top, w, h, cx, cy, tx, ty, fillScale } */

  /* ── boot ── */
  function init() {
    sequence     = document.getElementById('hero-sequence');
    if (!sequence) return;

    stage        = document.getElementById('hero-stage');
    bgDark       = document.getElementById('hero-bg-dark');
    typewriterEl = document.getElementById('hero-typewriter');
    typeText     = document.getElementById('typewriter-text');
    logoEl       = document.getElementById('hero-logo-big');
    logoWrapper  = document.getElementById('hero-logo-wrapper');
    subline      = document.getElementById('hero-subline');
    qOverlay     = document.getElementById('q-overlay');
    header       = document.getElementById('site-header');

    /* Prevent white-flash: body goes dark until animation is done */
    document.body.style.background = '#0D0D0D';

    /* Hide header for dramatic opening */
    if (header) {
      header.style.transition    = 'none';
      header.style.opacity       = '0';
      header.style.pointerEvents = 'none';
    }

    setTimeout(startTypewriter, 600);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ─────────────────────────────────────
     PHASE 1  –  Typewriter
  ───────────────────────────────────── */
  function startTypewriter() {
    phase = 1;
    var text = 'Qualität ist plan.';
    var i = 0;
    typeText.textContent = '';
    var iv = setInterval(function () {
      typeText.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(iv);
        setTimeout(fadeOutTypewriter, 900);
      }
    }, 72);
  }

  function fadeOutTypewriter() {
    typewriterEl.style.transition = 'opacity 0.5s ease';
    typewriterEl.style.opacity    = '0';
    setTimeout(showLogo, 580);
  }

  /* ─────────────────────────────────────
     PHASE 2  –  Logo
  ───────────────────────────────────── */
  function showLogo() {
    phase = 2;
    typewriterEl.style.display = 'none';

    logoWrapper.style.transition =
      'opacity 0.85s cubic-bezier(0.16,1,0.3,1), ' +
      'transform 0.85s cubic-bezier(0.16,1,0.3,1)';
    logoWrapper.style.opacity   = '1';
    logoWrapper.style.transform = 'scale(1)';

    setTimeout(function () {
      subline.style.transition = 'opacity 0.7s ease';
      subline.style.opacity    = '1';
    }, 420);

    /* Restore header, set up Q, unlock scroll-zoom */
    setTimeout(function () {
      if (header) {
        header.style.transition    = 'opacity 0.5s ease';
        header.style.opacity       = '1';
        header.style.pointerEvents = '';
      }
      logoWrapper.classList.add('logo-pulse');
      measureAndPositionQ();
      phase = 3;
    }, 1300);
  }

  /* ─────────────────────────────────────
     Q MEASUREMENT & INITIAL PLACEMENT
     Called once after logo is fully visible.
     The Q in "reQplan" sits at ~20–43 % of
     the logo width, full logo height.
  ───────────────────────────────────── */
  function measureAndPositionQ() {
    var r = logoEl.getBoundingClientRect();

    var left   = r.left   + r.width  * 0.20;
    var top    = r.top    + r.height * 0.00;
    var width  = r.width  * 0.23;
    var height = r.height * 1.00;
    var cx     = left + width  / 2;
    var cy     = top  + height / 2;

    /* How far to translate Q-centre to viewport centre */
    var tx = window.innerWidth  / 2 - cx;
    var ty = window.innerHeight / 2 - cy;

    /* Scale needed to fill the larger viewport dimension  */
    var fillScale = Math.max(
      window.innerWidth  / width,
      window.innerHeight / height
    ) * 1.35;

    qs = { left: left, top: top, w: width, h: height,
           cx: cx, cy: cy, tx: tx, ty: ty, fillScale: fillScale };

    /* Pin SVG-Q to logo-Q position, still invisible */
    qOverlay.style.position        = 'fixed';
    qOverlay.style.left            = left   + 'px';
    qOverlay.style.top             = top    + 'px';
    qOverlay.style.width           = width  + 'px';
    qOverlay.style.height          = height + 'px';
    qOverlay.style.transform       = 'none';
    qOverlay.style.transformOrigin = 'center center';
    qOverlay.style.opacity         = '0';
  }

  /* ─────────────────────────────────────
     PHASE 3  –  Scroll-driven zoom
  ───────────────────────────────────── */
  function onScroll() {
    if (phase < 3 || done) return;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(processScroll);
    }
  }

  function processScroll() {
    ticking = false;
    var rect       = sequence.getBoundingClientRect();
    var scrolled   = -rect.top;
    var totalSpace = sequence.offsetHeight - window.innerHeight;
    var zoomStart  = totalSpace * 0.15;
    if (scrolled < zoomStart) return;

    var raw      = (scrolled - zoomStart) / (totalSpace - zoomStart);
    var progress = Math.min(Math.max(raw, 0), 1);
    applyZoom(easeInOut(progress));
    if (progress >= 1) finishSequence();
  }

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function applyZoom(p) {
    if (!qs) return;

    /* ── 2. Logo fades out fast (fully gone by p = 0.20) ── */
    logoWrapper.classList.remove('logo-pulse');
    logoWrapper.style.animation  = 'none';
    logoWrapper.style.transition = 'none';
    logoWrapper.style.opacity    = String(Math.max(0, 1 - p * 5.5));

    /* ── 3. SVG-Q cross-fades in as logo fades (same timing) ── */
    var qOpacity = Math.min(p * 5.5, 1);

    /* Near the end, fade Q out too */
    if (p > 0.82) {
      qOpacity = Math.max(0, (1 - p) / 0.18);
    }
    qOverlay.style.opacity = String(qOpacity);

    /* ── 4. SVG-Q zooms from logo-Q position to fill screen ──
       translate(p·tx, p·ty) moves the Q centre to viewport centre.
       scale grows from 1 → fillScale.
       transform-origin is 50% 50% (SVG element centre), which
       is already the Q centre because we sized the element to the Q.
    ── */
    var s  = 1 + p * (qs.fillScale - 1);
    var tx = p * qs.tx;
    var ty = p * qs.ty;
    qOverlay.style.transform =
      'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';

    /* ── 5. Dark overlay fades out revealing hero section, then everything fades ── */
    if (p > 0.60) {
      bgDark.style.opacity = String(Math.max(0, 1 - (p - 0.60) / 0.25));
    }
    if (p > 0.82) {
      stage.style.opacity = String(Math.max(0, (1 - p) / 0.18));
    }
  }

  /* ─────────────────────────────────────
     PHASE 4  –  Finish
     Goal: animation disappears completely,
     leaving the page exactly as if the
     hero-sequence never existed.

     Technique:
       1. Fade the stage out (0.3s)
       2. Set hero-sequence display:none
          → removes its 200 vh from the layout
       3. Adjust scrollY by −seqHeight so the
          hero section snaps to viewport top
     Result: header sits directly above the
     hero image, no black gap anywhere.
  ───────────────────────────────────── */
  function finishSequence() {
    if (done) return;
    done  = true;
    phase = 4;
    stage.style.pointerEvents = 'none';

    /* Quick fade */
    stage.style.transition = 'opacity 0.3s ease';
    stage.style.opacity    = '0';

    setTimeout(function () {
      window.removeEventListener('scroll', onScroll);

      var seqH = sequence.offsetHeight; /* ≈200 vh in pixels */
      var curY = window.scrollY;

      /* Remove animation space from document flow */
      sequence.style.display = 'none';

      /* Shift scroll so the hero stays at exactly the same
         visual position → ends up at scrollY ≈ 0           */
      window.scrollTo(0, Math.max(0, curY - seqH));

      document.body.style.background = '';
    }, 340);
  }

  /* ── boot ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
