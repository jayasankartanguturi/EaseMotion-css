/**
 * EaseMotion CSS — core/scroll-reveal.js
 *
 * Lightweight Intersection Observer driver for the ease-reveal-* utility
 * classes. Drop this script anywhere in your HTML (preferably before </body>)
 * and annotate elements with any of the following classes:
 *
 *   ease-reveal-fade   | ease-reveal-up    | ease-reveal-down
 *   ease-reveal-left   | ease-reveal-right | ease-reveal-zoom
 *   ease-reveal-rotate
 *
 * Optional stagger helpers (add alongside a reveal class):
 *   ease-reveal-delay-1  …  ease-reveal-delay-5
 *
 * Behaviour
 * ─────────
 * • Elements that are already in the viewport on page load are made
 *   visible immediately — no animation needed.
 * • Elements below the fold play their CSS transition once when they
 *   scroll into view.  The observer is disconnected afterwards
 *   (animate-once semantics) to keep memory usage minimal.
 * • If the user has opted in to `prefers-reduced-motion`, every element
 *   is made visible at once without any transition.
 * • Falls back gracefully when IntersectionObserver is unavailable
 *   (makes all elements visible instantly).
 *
 * No external dependencies. Zero-runtime-cost once all elements have
 * been revealed. GPU-friendly: the CSS side only animates `opacity`
 * and `transform`.
 */

(function () {
  'use strict';

  /* ── Selector that matches every reveal utility class ─────── */
  var REVEAL_SELECTOR = [
    '.ease-reveal-fade',
    '.ease-reveal-up',
    '.ease-reveal-down',
    '.ease-reveal-left',
    '.ease-reveal-right',
    '.ease-reveal-zoom',
    '.ease-reveal-rotate',
  ].join(', ');

  var ACTIVE_CLASS = 'ease-reveal-active';

  /* ── Helper: instantly reveal an element ─────────────────── */
  function revealNow(el) {
    el.classList.add(ACTIVE_CLASS);
  }

  /* ── Helper: is element already visible in the viewport? ─── */
  function isInViewport(el) {
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  /* ── Reduced-motion: skip all animations ─────────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll(REVEAL_SELECTOR).forEach(revealNow);
    });
    return;
  }

  /* ── IntersectionObserver path (modern browsers) ─────────── */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealNow(entry.target);
            /* Animate once — stop watching after reveal */
            observer.unobserve(entry.target);
          }
        });
      },
      {
        /* Fire when 12 % of the element is visible.
           Lower values reveal earlier; higher values require more
           of the element to be on-screen before triggering.       */
        threshold: 0.12,
        /* Optional: shrink the observation window slightly from
           the bottom so elements reveal a bit before the very
           edge of the viewport is reached.                        */
        rootMargin: '0px 0px -40px 0px',
      }
    );

    function initReveal() {
      document.querySelectorAll(REVEAL_SELECTOR).forEach(function (el) {
        if (isInViewport(el)) {
          /* Already on screen — reveal immediately without transition */
          revealNow(el);
        } else {
          observer.observe(el);
        }
      });
    }

    /* Run after DOM is ready */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initReveal);
    } else {
      initReveal();
    }

    return;
  }

  /* ── Fallback: no IntersectionObserver support ───────────── */
  /* Reveal everything immediately so content is never hidden.  */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll(REVEAL_SELECTOR).forEach(revealNow);
    });
  } else {
    document.querySelectorAll(REVEAL_SELECTOR).forEach(revealNow);
  }
})();
