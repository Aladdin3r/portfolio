/* ============================================================
   Site navigation.

   Was: a click handler on a <div class="menu"> with no role, no
   accessible name and no aria-expanded, toggling a panel that kept
   its links focusable while invisible (opacity:0 + pointer-events:none
   is not enough to leave the tab order).

   Now: a real button, an inert panel, Escape to close, and focus
   returned to the trigger on close.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu-toggle');
  const panel = document.getElementById('site-menu');
  if (!toggle || !panel) return;

  const firstLink = panel.querySelector('a');

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const open = () => {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation');
    toggle.classList.add('open');
    panel.classList.add('visible');
    panel.removeAttribute('inert');
    document.body.classList.add('menu-open');
    if (firstLink) firstLink.focus();
  };

  const close = ({ returnFocus = true } = {}) => {
    // Move focus out before the panel goes inert, or the browser will
    // drop it to <body> and the user loses their place.
    if (returnFocus && panel.contains(document.activeElement)) toggle.focus();
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.classList.remove('open');
    panel.classList.remove('visible');
    panel.setAttribute('inert', '');
    document.body.classList.remove('menu-open');
  };

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));

  // Let a link navigate; just release the panel state first.
  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => close({ returnFocus: false }));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) close();
  });
});
