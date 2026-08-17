/* ============================================================
   Page transition — outbound half.

   Intercepts clicks on links marked data-transition (the four nav
   links, the back arrow, and the homepage's two entry links), covers
   the page with the line-draw curtain, then navigates.

   The inbound half needs no script beyond the tiny inline snippet in
   BaseLayout's <head>, which sets html.pt-enter before first paint so
   the arriving page is already covered. Everything after that is CSS.

   Deliberate behaviours:
     • Modifier-clicks, middle-clicks, downloads, new-tab links, hash
       links and cross-origin links are all left alone.
     • Nav targets are prefetched on hover/focus, so by the time the
       curtain is closed the next document is usually already cached
       and there is no white flash between the two.
     • If navigation is slow the curtain simply stays up — which is
       the loading state this was always meant to be.
     • prefers-reduced-motion skips the whole thing.
   ============================================================ */

(function () {
  var FLAG = 'pt:navigating';

  // Single source of truth for timing is --pt-out in transition.css.
  // Read it rather than duplicating the number here, so changing the
  // CSS variable is enough to retime both halves.
  function outMs() {
    var raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--pt-out')
      .trim();
    var n = parseFloat(raw);
    if (!n) return 380;
    return raw.indexOf('ms') !== -1 ? n : n * 1000;   // support 0.38s too
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function shouldIntercept(link, event) {
    if (event.defaultPrevented) return false;
    if (event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;

    var url;
    try { url = new URL(link.href, location.href); } catch (e) { return false; }

    if (url.origin !== location.origin) return false;
    if (url.pathname === location.pathname && url.hash) return false;  // in-page anchor
    if (url.href === location.href) return false;                      // already here
    return true;
  }

  // ── Prefetch on intent, so the next page is warm ────────────────
  var prefetched = {};
  function prefetch(href) {
    if (prefetched[href]) return;
    prefetched[href] = true;
    var l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = href;
    document.head.appendChild(l);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var curtain = document.getElementById('page-transition');
    var links = document.querySelectorAll('a[data-transition]');
    if (!curtain || !links.length) return;

    links.forEach(function (link) {
      ['pointerenter', 'focus'].forEach(function (type) {
        link.addEventListener(type, function () {
          try {
            var u = new URL(link.href, location.href);
            if (u.origin === location.origin) prefetch(u.href);
          } catch (e) { /* not a URL we can prefetch */ }
        }, { passive: true });
      });

      link.addEventListener('click', function (event) {
        if (reduce.matches) return;               // navigate normally
        if (!shouldIntercept(link, event)) return;

        event.preventDefault();

        // Tell the next document to render already covered.
        try { sessionStorage.setItem(FLAG, '1'); } catch (e) { /* private mode */ }

        curtain.classList.add('pt-out');
        setTimeout(function () { location.href = link.href; }, outMs());
      });
    });
  });

  // Restoring from bfcache re-runs neither the head script nor the CSS
  // animation, so clear both states or the curtain would be stuck on.
  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) return;
    document.documentElement.classList.remove('pt-enter');
    var curtain = document.getElementById('page-transition');
    if (curtain) curtain.classList.remove('pt-out');
    try { sessionStorage.removeItem(FLAG); } catch (e) {}
  });
})();
