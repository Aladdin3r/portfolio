/* ============================================================
   DEPRECATED — no longer loaded by any page.

   This drove a Lottie "loading" overlay on the homepage that was
   triggered by `window.load`, meaning it only appeared *after* the
   page had already finished rendering, and held the view for up to
   2000ms via a fallback timer. It added delay and communicated
   nothing, so index.astro no longer includes it.

   If a page transition is wanted later, the right shape is the
   commented-out outbound-click handler that used to sit at the
   bottom of this file: intercept a same-origin link click, play the
   animation, then navigate. Kept here as a starting point rather
   than restoring the on-load behaviour.
   ============================================================ */
