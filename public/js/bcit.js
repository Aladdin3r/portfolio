// BCIT Portfolio — scroll animations, sticky header, slide counter

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
  document.querySelectorAll('.bp-section:not(#hero)').forEach(function (section) {
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
  document.querySelectorAll('.bp-stat[data-count]').forEach(function (el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;
    var obj = { val: 0 };
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

// EchoLoop: click to unmute + fullscreen
(function initVideo() {
  var wrapper = document.querySelector('.bp-video-wrapper');
  var video = document.getElementById('echoloop-video');
  var hint = document.querySelector('.bp-video-hint');
  if (!wrapper || !video) return;

  wrapper.addEventListener('click', function () {
    video.muted = false;
    video.loop = false;
    var req =
      video.requestFullscreen ||
      video.webkitRequestFullscreen ||
      video.mozRequestFullScreen ||
      video.msRequestFullscreen;
    if (req) req.call(video).catch(function () {});
    if (hint) { hint.style.opacity = '0'; hint.style.pointerEvents = 'none'; }
  });

  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement) {
      video.muted = true;
      video.loop = true;
      if (hint) { hint.style.opacity = ''; hint.style.pointerEvents = ''; }
    }
  });
})();

// Sticky doc header + slide counter
(function initUI() {
  var docHeader = document.getElementById('bp-doc-header');
  var counter = document.getElementById('bp-slide-counter');
  var counterText = counter ? counter.querySelector('.bp-slide-counter-text') : null;
  var hero = document.getElementById('hero');

  var projectEls = ['#onward', '#echoloop', '#criterion', '#trondek']
    .map(function (id) { return document.querySelector(id); })
    .filter(Boolean);
  var TOTAL = projectEls.length;

  // Show/hide sticky UI when hero leaves viewport
  if (hero) {
    new IntersectionObserver(function (entries) {
      var onHero = entries[0].isIntersecting;
      if (docHeader) docHeader.classList.toggle('is-visible', !onHero);
      if (counter) counter.classList.toggle('is-visible', !onHero);
    }, { threshold: 0.1 }).observe(hero);
  }

  // Update slide counter as user scrolls
  if (counterText && projectEls.length) {
    var ratioMap = new Map();
    projectEls.forEach(function (el) { ratioMap.set(el, 0); });

    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        ratioMap.set(entry.target, entry.intersectionRatio);
      });
      var bestEl = null, bestRatio = 0;
      ratioMap.forEach(function (ratio, el) {
        if (ratio > bestRatio) { bestRatio = ratio; bestEl = el; }
      });
      if (bestEl && bestRatio > 0.2) {
        var idx = projectEls.indexOf(bestEl);
        if (idx !== -1) {
          counterText.textContent =
            String(idx + 1).padStart(2, '0') + ' / ' + String(TOTAL).padStart(2, '0');
        }
      }
    }, { threshold: [0, 0.2, 0.5, 0.8, 1.0] });

    projectEls.forEach(function (el) { counterObs.observe(el); });
  }
})();
