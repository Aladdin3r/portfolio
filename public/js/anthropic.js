// Anthropic mini-portfolio animations
// Uses waitForGSAP polling to avoid race conditions with CDN-loaded GSAP

(function waitForGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setTimeout(waitForGSAP, 60);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero: staggered entrance on load
  gsap.fromTo(
    [
      '#hero .pitch-hero-label',
      '#hero .pitch-hero-h1',
      '#hero .pitch-hero-sub',
      '#hero .pitch-hero-links',
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
  document.querySelectorAll('.pitch-section:not(#hero)').forEach((section) => {
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

  // Why Anthropic cards: staggered on scroll
  const cards = document.querySelectorAll('.pitch-card');
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
          trigger: '#why-anthropic',
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // Stat count-up: only for elements with data-count (skips 8/10 which has data-static)
  document.querySelectorAll('.pitch-stat[data-count]').forEach((el) => {
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

// EchoLoop video: click wrapper to unmute + request fullscreen
(function initEchoLoopVideo() {
  const wrapper = document.querySelector('.pitch-video-wrapper');
  const video = document.getElementById('echoloop-video');
  const hint = document.querySelector('.pitch-video-hint');
  if (!wrapper || !video) return;

  wrapper.addEventListener('click', function () {
    video.muted = false;
    video.loop = false;

    // Try native fullscreen
    const req =
      video.requestFullscreen ||
      video.webkitRequestFullscreen ||
      video.mozRequestFullScreen ||
      video.msRequestFullscreen;

    if (req) {
      req.call(video).catch(() => {});
    }

    // Hide the hint once clicked
    if (hint) {
      hint.style.opacity = '0';
      hint.style.pointerEvents = 'none';
    }
  });

  // When fullscreen exits, re-mute and loop again
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
