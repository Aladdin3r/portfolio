/* ============================================================
   Entrance reveal.

   Was: every p / h1-h6 / span / a on the page set to opacity 0 and
   staggered back in at 0.09s each. On About that is ~60 elements, so
   the last line of copy arrived roughly 5.4 seconds after load — and
   nothing checked prefers-reduced-motion.

   Now: a small, explicit set of layout blocks, total stagger capped
   well under half a second, and no animation at all when the visitor
   has asked for reduced motion. Content is visible by default; this
   only ever enhances.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  // Deliberate blocks, not every text node on the page.
  // `.rotated-image` is excluded — index.js drives its own entrance
  // transition and the two would fight over opacity.
  const targets = Array.from(
    document.querySelectorAll('[data-reveal], header > div, main > *, footer > *')
  ).filter((el) => !el.classList.contains('rotated-image') && !el.hasAttribute('data-no-reveal'));
  if (!targets.length) return;

  // Cap the total sequence so the last element never lands late.
  const MAX_SEQUENCE = 0.45; // seconds
  const stagger = Math.min(0.06, MAX_SEQUENCE / targets.length);

  gsap.fromTo(
    targets,
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: 'power2.out',
      stagger,
      clearProps: 'transform',
    }
  );
});
