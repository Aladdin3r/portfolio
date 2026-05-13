// BCIT Portfolio — scroll animations, autoplay, sticky header

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

  // Slide sections: fade + rise on scroll — once only, never reverses
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
          start: 'top 95%',
          once: true,
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

// Sticky header, slide counter, and autoplay
(function initPresentation() {
  const docHeader = document.getElementById('bp-doc-header');
  const counter = document.getElementById('bp-slide-counter');
  const counterText = counter ? counter.querySelector('.bp-slide-counter-text') : null;
  const hero = document.getElementById('hero');

  const slideIds = ['#onward', '#safecycle', '#echoloop', '#criterion', '#trondek', '#contact'];
  const slideEls = slideIds.map((id) => document.querySelector(id)).filter(Boolean);
  const projectEls = slideEls.slice(0, 5);
  const TOTAL = 5;

  let playIdx = 0;
  let currentVisibleIdx = 0;
  let manualPaused = false;
  let autoplayTimer = null;
  let scrollResumeTimer = null;

  function updateCounter(idx) {
    if (!counterText) return;
    counterText.textContent =
      String(Math.min(idx + 1, TOTAL)).padStart(2, '0') + ' / ' + String(TOTAL).padStart(2, '0');
  }

  function goTo(idx) {
    playIdx = ((idx % slideEls.length) + slideEls.length) % slideEls.length;
    const el = slideEls[playIdx];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function scheduleNext() {
    clearTimeout(autoplayTimer);
    if (manualPaused) return;
    autoplayTimer = setTimeout(function () {
      playIdx = (playIdx + 1) % slideEls.length;
      goTo(playIdx);
      scheduleNext();
    }, 9000);
  }

  function onUserScroll() {
    clearTimeout(autoplayTimer);
    clearTimeout(scrollResumeTimer);
    if (!manualPaused) {
      scrollResumeTimer = setTimeout(function () {
        playIdx = currentVisibleIdx;
        scheduleNext();
      }, 45000);
    }
  }

  ['wheel', 'touchstart', 'keydown'].forEach(function (evt) {
    window.addEventListener(evt, onUserScroll, { passive: true });
  });

  if (counter) {
    counter.addEventListener('click', function () {
      clearTimeout(autoplayTimer);
      clearTimeout(scrollResumeTimer);
      manualPaused = !manualPaused;
      counter.classList.toggle('is-paused', manualPaused);
      if (!manualPaused) {
        playIdx = currentVisibleIdx;
        scheduleNext();
      }
    });
  }

  // Show/hide sticky UI when hero leaves viewport
  if (hero) {
    var heroObs = new IntersectionObserver(
      function (entries) {
        var onHero = entries[0].isIntersecting;
        if (docHeader) docHeader.classList.toggle('is-visible', !onHero);
        if (counter) counter.classList.toggle('is-visible', !onHero);
      },
      { threshold: 0.1 }
    );
    heroObs.observe(hero);
  }

  // Track which project is most visible
  var ratioMap = new Map();
  projectEls.forEach(function (el) { ratioMap.set(el, 0); });

  var sectionObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        ratioMap.set(entry.target, entry.intersectionRatio);
      });

      var bestEl = null;
      var bestRatio = 0;
      ratioMap.forEach(function (ratio, el) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestEl = el;
        }
      });

      if (bestEl && bestRatio > 0.25) {
        var idx = projectEls.indexOf(bestEl);
        if (idx !== -1) {
          currentVisibleIdx = idx;
          updateCounter(idx);
        }
      }
    },
    { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] }
  );

  projectEls.forEach(function (el) { sectionObs.observe(el); });

  // Kick off autoplay after hero entrance
  setTimeout(function () {
    if (!manualPaused) scheduleNext();
  }, 3000);
})();
