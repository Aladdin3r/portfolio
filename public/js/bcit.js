// BCIT Portfolio — scroll animations

(function waitForGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setTimeout(waitForGSAP, 60);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.fromTo(
    ['#hero .bp-label', '#hero .bp-h1', '#hero .bp-hero-sub', '#hero .bp-hero-links'],
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

  // Slide sections: fade + rise on scroll
  document.querySelectorAll('.bp-section:not(#hero)').forEach((section) => {
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

  // Stat count-up
  document.querySelectorAll('.bp-stat[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate() {
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

// EchoLoop: click to unmute + fullscreen
(function initVideo() {
  const wrapper = document.querySelector('.bp-video-wrapper');
  const video = document.getElementById('echoloop-video');
  const hint = document.querySelector('.bp-video-hint');
  if (!wrapper || !video) return;

  wrapper.addEventListener('click', function () {
    video.muted = false;
    video.loop = false;

    const req =
      video.requestFullscreen ||
      video.webkitRequestFullscreen ||
      video.mozRequestFullScreen ||
      video.msRequestFullscreen;

    if (req) req.call(video).catch(() => {});

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
