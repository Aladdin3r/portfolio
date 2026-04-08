/**
 * case-scroll-reveal.js
 * Natural-scroll section reveals, Pixmob / Trang Cao style.
 *
 * Sections start invisible. Each one fades + slides up as it enters
 * the viewport. No scroll snap — just smooth natural browser scroll.
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

  // ─── Immediately hide every section ──────────────────────────
  gsap.set(sections, { opacity: 0, y: 40 });

  // ─── Reveal each section as it enters the viewport ───────────
  sections.forEach((section) => {
    gsap.to(section, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        // Start animating in when the section top hits 88% down the viewport
        start: 'top 88%',
        // Reverse (fade back out) when scrolling back up past this point
        toggleActions: 'play none none reverse',
      },
    });
  });

  // ─── Stat callout punch ───────────────────────────────────────
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
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // ─── Guide nav items stagger in on load ──────────────────────
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
