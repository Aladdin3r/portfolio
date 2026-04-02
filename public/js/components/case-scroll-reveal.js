/**
 * case-scroll-reveal.js
 * Scroll-triggered reveal animations for case study pages.
 * Inspired by Trang Cao's clean, section-by-section fade-up style.
 *
 * Requires: GSAP + ScrollTrigger (loaded via CaseStudyLayout.astro CDN scripts)
 */

(function waitForGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setTimeout(waitForGSAP, 60);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ─── Per-section reveals ──────────────────────────────────────────────────
  document.querySelectorAll('.case-section').forEach((section) => {
    const media   = section.querySelector('.section-media');
    const title   = section.querySelector('.section-title');
    const paras   = Array.from(section.querySelectorAll('.section-text > p'));
    const lists   = Array.from(section.querySelectorAll('.section-text ul'));
    const highlights = Array.from(section.querySelectorAll('.highlight'));
    const subHighlights = Array.from(section.querySelectorAll('.subhighlight'));

    // Media pane — fade up from slightly below
    if (media) {
      gsap.fromTo(
        media,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Section title — slightly ahead of body text
    if (title) {
      gsap.fromTo(
        title,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Body paragraphs — staggered fade-up
    if (paras.length) {
      gsap.fromTo(
        paras,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.11,
          ease: 'power2.out',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: section,
            start: 'top 76%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Lists — fade-up slightly after paras
    if (lists.length) {
      gsap.fromTo(
        lists,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.09,
          ease: 'power2.out',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Stat callouts (.highlight) — scale punch for impact numbers
    if (highlights.length) {
      gsap.fromTo(
        highlights,
        { opacity: 0, scale: 0.72 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.12,
          ease: 'back.out(1.6)',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Design & Build subheadings (.subhighlight) — slide in from left
    if (subHighlights.length) {
      gsap.fromTo(
        subHighlights,
        { opacity: 0, x: -14 },
        {
          opacity: 1,
          x: 0,
          duration: 0.42,
          stagger: 0.1,
          ease: 'power2.out',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  });

  // ─── Guide nav entrance (stagger in on load) ────────────────────────────
  const guideItems = document.querySelectorAll('.guide li');
  if (guideItems.length) {
    gsap.fromTo(
      guideItems,
      { opacity: 0, x: -10 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.07,
        ease: 'power2.out',
        delay: 0.2,
        overwrite: 'auto',
      }
    );
  }

})();
