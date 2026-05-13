// BCIT Portfolio — scroll animations, autoplay, sticky header

// Hero entrance (GSAP)
(function waitForGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setTimeout(waitForGSAP, 60);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

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

// Section reveals via IntersectionObserver + inline styles
// Inline styles bypass CSS specificity issues entirely
(function initSectionReveals() {
  var transition = 'opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)';

  var sections = document.querySelectorAll('.bp-section:not(#hero)');
  sections.forEach(function (s) {
    s.style.opacity = '0';
    s.style.transform = 'translateY(32px)';
    s.style.transition = transition;
  });

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  sections.forEach(function (s) { obs.observe(s); });
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

// Sticky header, slide counter, and autoplay
(function initPresentation() {
  var docHeader = document.getElementById('bp-doc-header');
  var counter = document.getElementById('bp-slide-counter');
  var counterText = counter ? counter.querySelector('.bp-slide-counter-text') : null;
  var hero = document.getElementById('hero');

  var slideIds = ['#onward', '#echoloop', '#criterion', '#trondek', '#contact'];
  var slideEls = slideIds.map(function (id) { return document.querySelector(id); }).filter(Boolean);
  var projectEls = slideEls.slice(0, 4);
  var TOTAL = 4;

  var playIdx = 0;
  var currentVisibleIdx = 0;
  var manualPaused = false;
  var autoplayTimer = null;
  var scrollResumeTimer = null;

  function updateCounter(idx) {
    if (!counterText) return;
    counterText.textContent =
      String(Math.min(idx + 1, TOTAL)).padStart(2, '0') + ' / ' + String(TOTAL).padStart(2, '0');
  }

  function goTo(idx) {
    playIdx = ((idx % slideEls.length) + slideEls.length) % slideEls.length;
    var el = slideEls[playIdx];
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

  // Track which project is most visible for counter sync
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
        if (ratio > bestRatio) { bestRatio = ratio; bestEl = el; }
      });
      if (bestEl && bestRatio > 0.2) {
        var idx = projectEls.indexOf(bestEl);
        if (idx !== -1) {
          currentVisibleIdx = idx;
          updateCounter(idx);
        }
      }
    },
    { threshold: [0, 0.1, 0.2, 0.5, 0.75, 1.0] }
  );

  projectEls.forEach(function (el) { sectionObs.observe(el); });

  // Start autoplay after hero entrance
  setTimeout(function () {
    if (!manualPaused) scheduleNext();
  }, 3000);
})();
