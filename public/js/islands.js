// Islands mini-portfolio animations

(function waitForGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setTimeout(waitForGSAP, 60);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero: staggered entrance on load
  gsap.fromTo(
    [
      '#hero .ip-hero-label',
      '#hero .ip-hero-h1',
      '#hero .ip-hero-sub',
      '#hero .ip-hero-links',
    ],
    { opacity: 0, y: 28 },
    {
      opacity: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.14,
      ease: 'power3.out',
      delay: 0.15,
    }
  );

  // All non-hero sections: fade + slide up on scroll
  document.querySelectorAll('.ip-section:not(#hero)').forEach((section) => {
    gsap.fromTo(
      section,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Why Islands cards: staggered on scroll
  const cards = document.querySelectorAll('.ip-card');
  if (cards.length) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#why-islands',
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // Stat count-up: only for elements with data-count (skips data-static values)
  document.querySelectorAll('.ip-stat[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: function () {
        el.textContent = Math.round(obj.val) + suffix;
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
})();

// Aunt interview video: click wrapper to unmute + request fullscreen
(function initOnwardClipVideo() {
  const wrapper = document.querySelector('.ip-video-wrapper');
  const video = document.getElementById('onward-clip-video');
  const hint = document.querySelector('.ip-video-hint');
  if (!wrapper || !video) return;

  wrapper.addEventListener('click', function () {
    video.muted = false;
    video.loop = false;

    const req =
      video.requestFullscreen ||
      video.webkitRequestFullscreen ||
      video.mozRequestFullScreen ||
      video.msRequestFullscreen;

    if (req) {
      req.call(video).catch(() => {});
    }

    if (hint) {
      hint.style.opacity = '0';
      hint.style.pointerEvents = 'none';
    }
  });

  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement) {
      video.muted = true;
      video.loop = true;
      if (hint) {
        hint.style.opacity = '';
        hint.style.pointerEvents = '';
      }
    }
  });
})();
