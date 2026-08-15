/* ============================================================
   DynamicGradient

   Previously this ran an uncapped requestAnimationFrame loop that
   repainted the full viewport every frame with ctx.filter =
   'blur(60px)'. Canvas blur is a CPU filter, so on mobile that cost
   ~9.7s of main-thread Rendering, a 3.4s Total Blocking Time, and it
   never stopped — it kept burning the main thread and the battery for
   as long as the page was open.

   Rewritten to:
     - paint the blobs with radial gradients instead of a blur filter
       (same soft look, no per-frame CPU blur);
     - render once and stay still unless the pointer is actually moving;
     - stop entirely when the tab is hidden;
     - honour prefers-reduced-motion;
     - skip animation on touch devices, which had no pointer to follow.
   ============================================================ */

class DynamicGradient {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isTouch = window.matchMedia('(hover: none)').matches;
    this.static = this.reduceMotion || this.isTouch;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.blobs = [
      { x: 0.2, y: 0.3, targetX: 0.2, targetY: 0.3, radius: 150, color: '255,102,0',  opacity: 0.6 },
      { x: 0.7, y: 0.6, targetX: 0.7, targetY: 0.6, radius: 200, color: '255,133,51', opacity: 0.4 },
      { x: 0.5, y: 0.8, targetX: 0.5, targetY: 0.8, radius: 180, color: '255,119,34', opacity: 0.3 }
    ];

    this.rafId = null;
    this.idleFrames = 0;

    this.setup();
  }

  setup() {
    const s = this.canvas.style;
    s.position = 'fixed';
    s.top = '0';
    s.left = '0';
    s.width = '100%';
    s.height = '100%';
    s.zIndex = '-11';
    s.pointerEvents = 'none';

    document.body.insertBefore(this.canvas, document.body.firstChild);

    this.resize();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { this.resize(); this.draw(); }, 150);
    }, { passive: true });

    if (!this.static) {
      window.addEventListener('pointermove', (e) => this.handlePointerMove(e), { passive: true });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.stop();
        else this.kick();
      });
    }

    // Always paint one frame so the background is correct without animation.
    this.draw();
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.w = w;
    this.h = h;
  }

  handlePointerMove(e) {
    this.blobs[0].targetX = e.clientX / this.w;
    this.blobs[0].targetY = e.clientY / this.h;
    this.kick();
  }

  /** Start the loop if it isn't already running. */
  kick() {
    this.idleFrames = 0;
    if (this.rafId === null && !this.static) {
      this.rafId = requestAnimationFrame(() => this.animate());
    }
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;

    const base = ctx.createLinearGradient(0, 0, 0, h);
    base.addColorStop(0, '#1a1410');
    base.addColorStop(0.3, '#2a1815');
    base.addColorStop(0.6, '#2a1a25');
    base.addColorStop(1, '#1a0f08');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    // Radial gradients give the same soft falloff a 60px blur produced,
    // but they are drawn by the rasteriser rather than a CPU filter pass.
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.blobs.length; i++) {
      const b = this.blobs[i];
      const cx = b.x * w;
      const cy = b.y * h;
      const r = b.radius * 2.2;

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,    'rgba(' + b.color + ',' + b.opacity + ')');
      g.addColorStop(0.55, 'rgba(' + b.color + ',' + (b.opacity * 0.35) + ')');
      g.addColorStop(1,    'rgba(' + b.color + ',0)');
      ctx.fillStyle = g;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  animate() {
    let moving = false;
    for (let i = 0; i < this.blobs.length; i++) {
      const b = this.blobs[i];
      const dx = b.targetX - b.x;
      const dy = b.targetY - b.y;
      if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
        b.x += dx * 0.05;
        b.y += dy * 0.05;
        moving = true;
      }
    }

    this.draw();

    // Settle and stop rather than spinning forever.
    this.idleFrames = moving ? 0 : this.idleFrames + 1;
    if (this.idleFrames > 20 || document.hidden) {
      this.rafId = null;
      return;
    }
    this.rafId = requestAnimationFrame(() => this.animate());
  }

  setVisible(isVisible) {
    this.canvas.style.transition = 'opacity 0.25s ease-in-out';
    this.canvas.style.opacity = isVisible ? '1' : '0';
  }
}

if (typeof window !== 'undefined') {
  window.DynamicGradient = DynamicGradient;
  window.dynamicGradientInstance = null;

  const init = () => { window.dynamicGradientInstance = new DynamicGradient(); };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
