/**
 * case-scroll-reveal.js
 * Sections start invisible. Each one fades + slides up as it enters the viewport.
 * Inspired by Trang Cao's clean per-section scroll reveals.
 *
 * Requires: GSAP + ScrollTrigger (loaded via CaseStudyLayout CDN)
 */

(function waitForGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setTimeout(waitForGSAP, 60);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const sections = document.querySelectorAll('.case-section');

  // ─── Step 1: immediately hide every section ───────────────────
  // GSAP sets opacity/transform before the browser paints, so there's
  // no flash of visible content.
  gsap.set(sections, { opacity: 0, y: 48 });

  // ─── Step 2: reveal each section as it enters the viewport ────
  sections.forEach((section) => {
    gsap.to(section, {
      opacity: 1,
      y: 0,
      duration: 0.72,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        // Fires when the section's top edge crosses 88% down the viewport
        // — so it's nearly fully off-screen before it animates in.
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // ─── Step 3: stagger the stat callouts inside each section ────
  // These animate a beat after the section itself appears, giving
  // the numbers a little punch that draws the eye.
  sections.forEach((section) => {
    const highlights = section.querySelectorAll('.highlight');
    if (!highlights.length) return;

    gsap.fromTo(
      highlights,
      { opacity: 0, scale: 0.7 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        overwrite: 'auto',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // ─── Step 4: guide nav items stagger in on load ───────────────
  const guideItems = document.querySelectorAll('.guide li');
  if (guideItems.length) {
    gsap.fromTo(
      guideItems,
      { opacity: 0, x: -10 },
      {
        opacity: 1,
        x: 0,
        duration: 0.38,
        stagger: 0.07,
        ease: 'power2.out',
        delay: 0.15,
      }
    );
  }

})();
