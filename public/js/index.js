/* ============================================================
   Shared page script.

   Previously this assumed the About page's DOM existed on every
   route, so `.rotated-image` and `#about-audio` were null everywhere
   else. That threw two uncaught TypeErrors on /projects, /onward,
   /safecycle and /sacabc, which stopped any later initialiser on the
   page from running and dragged the Best Practices score down.

   Every initialiser now guards its own elements.
   ============================================================ */

// ── About page: entrance transition on the portrait ──────────────
window.addEventListener('DOMContentLoaded', () => {
  const image = document.querySelector('.rotated-image');
  if (!image) return;

  setTimeout(() => image.classList.add('enter'), 100);
});

function handlePageExit() {
  const image = document.querySelector('.rotated-image');
  if (!image) return;

  image.classList.remove('enter');
  image.classList.add('exit');
}

// ── Lazy-load any image that hasn't opted out ────────────────────
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('img:not([loading])').forEach((img) => {
    img.setAttribute('loading', 'lazy');
  });
});

// ── Onward case study: Lottie results animation ──────────────────
document.addEventListener('DOMContentLoaded', function () {
  const lottieContainer = document.getElementById('lottie-container');
  if (!lottieContainer || typeof lottie === 'undefined') return;

  lottie.loadAnimation({
    container: lottieContainer,
    renderer: 'html',
    loop: true,
    autoplay: true,
    path: '/clipinterview-results.json'
  });
});

// ── About page: narration highlighting ───────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const audio = document.getElementById('about-audio');
  const phrases = Array.from(
    document.querySelectorAll('p.main-text > span[data-start][data-end]')
  );
  if (!audio || !phrases.length) return;

  let activePhrase = null;
  let animationFrame = null;

  function updateHighlight() {
    const currentTime = audio.currentTime;
    const nextPhrase = phrases.find((phrase) => {
      const start = Number.parseFloat(phrase.dataset.start);
      const end = Number.parseFloat(phrase.dataset.end);
      return currentTime >= start && currentTime <= end;
    }) || null;

    if (nextPhrase === activePhrase) return;

    if (activePhrase) {
      activePhrase.classList.remove('narration-active');
    }

    activePhrase = nextPhrase;
    if (activePhrase) {
      activePhrase.classList.add('narration-active');
    }
  }

  function syncHighlight() {
    updateHighlight();

    if (!audio.paused && !audio.ended) {
      animationFrame = window.requestAnimationFrame(syncHighlight);
    }
  }

  audio.addEventListener('play', function () {
    window.cancelAnimationFrame(animationFrame);
    syncHighlight();
  });

  audio.addEventListener('pause', function () {
    window.cancelAnimationFrame(animationFrame);
    updateHighlight();
  });

  audio.addEventListener('ended', function () {
    window.cancelAnimationFrame(animationFrame);
    if (activePhrase) activePhrase.classList.remove('narration-active');
    activePhrase = null;
  });

  audio.addEventListener('seeking', updateHighlight);
  audio.addEventListener('timeupdate', updateHighlight);
});
