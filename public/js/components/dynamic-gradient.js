/* ============================================================
   DynamicGradient

   History, so the tradeoff here stays legible:

   v1 ran an uncapped requestAnimationFrame loop repainting the full
   viewport every frame through ctx.filter = 'blur(60px)'. Canvas blur
   is a CPU filter pass, so on mobile that cost ~9.7s of main-thread
   rendering and a 3.4s Total Blocking Time, and it never stopped.

   v2 replaced the blur with three plain radial gradients. That fixed
   the performance, but it also changed the look: at fixed pixel radii
   the blobs read as hard-edged circles on a mostly empty background,
   and the one that tracked the pointer parked a bright disc wherever
   the cursor stopped.

   v3 (this one) gets the soft full-bleed wash back without the blur
   filter. The field is painted onto a small offscreen canvas — about
   1/8 scale — and then drawn up to full size with image smoothing on.
   Bilinear upscaling *is* the blur, done by the rasteriser for free.
   Painting ~200x125 pixels per frame is negligible.

   Also changed here:
     - radii are a fraction of the viewport, so the wash always covers
       the page instead of leaving dead corners on wide screens;
     - one blob still follows the pointer, as it always did, but at a
       viewport-relative radius and softened through the buffer, so it
       reads as a glow travelling with the cursor rather than a disc;
     - still renders once and stays still unless the pointer moves,
       stops when the tab is hidden, honours prefers-reduced-motion,
       and skips animation on touch.
   ============================================================ */

class DynamicGradient {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    // Low-resolution buffer. Everything is painted here, then scaled up.
    this.buf = document.createElement('canvas');
    this.bctx = this.buf.getContext('2d', { alpha: false });

    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isTouch = window.matchMedia('(hover: none)').matches;
    this.static = this.reduceMotion || this.isTouch;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Positions are viewport fractions. `radius` is a fraction of the
    // larger viewport dimension, so coverage holds at any aspect ratio.
    // `follow: true` means this blob tracks the pointer, as the original
    // did. It works now because the radius is a fraction of the viewport
    // rather than a fixed 150px, and because the whole field is softened
    // on the way up from the low-res buffer — so it reads as a warm glow
    // moving with the cursor instead of a disc parked next to a link.
    this.blobs = [
      { hx: 0.18, hy: 0.34, x: 0.18, y: 0.34, radius: 0.70, color: '255,102,0',  opacity: 0.30, follow: true },
      { hx: 0.74, hy: 0.60, x: 0.74, y: 0.60, radius: 0.80, color: '255,133,51', opacity: 0.18 },
      { hx: 0.48, hy: 0.86, x: 0.48, y: 0.86, radius: 0.75, color: '255,119,34', opacity: 0.17 },
      { hx: 0.92, hy: 0.14, x: 0.92, y: 0.14, radius: 0.58, color: '255,110,20', opacity: 0.11 },
      { hx: 0.05, hy: 0.92, x: 0.05, y: 0.92, radius: 0.55, color: '255,96,0',   opacity: 0.11 }
    ];

    // The blobs that don't follow drift a little with the pointer, so the
    // field has some depth behind the one that does.
    this.PARALLAX = 0.05;

    this.px = 0.5;
    this.py = 0.5;
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

    this.draw();
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // The visible canvas stays at device resolution: it only ever
    // receives one scaled drawImage, which is cheap at any size.
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // The buffer is where the cost lives, so keep it tiny. The 1/8
    // downscale is what softens the edges on the way back up.
    this.bw = Math.max(32, Math.round(w / 8));
    this.bh = Math.max(20, Math.round(h / 8));
    this.buf.width = this.bw;
    this.buf.height = this.bh;

    this.w = w;
    this.h = h;
  }

  handlePointerMove(e) {
    this.px = e.clientX / this.w;
    this.py = e.clientY / this.h;
    this.kick();
  }

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
    const ctx = this.bctx;
    const w = this.bw;
    const h = this.bh;
    const span = Math.max(w, h);

    const base = ctx.createLinearGradient(0, 0, 0, h);
    base.addColorStop(0, '#1a1410');
    base.addColorStop(0.3, '#2a1815');
    base.addColorStop(0.6, '#2a1a25');
    base.addColorStop(1, '#1a0f08');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.blobs.length; i++) {
      const b = this.blobs[i];
      const cx = b.x * w;
      const cy = b.y * h;
      const r = b.radius * span;

      // A gentler falloff than a two-stop gradient: no visible rim.
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,    'rgba(' + b.color + ',' + b.opacity + ')');
      g.addColorStop(0.25, 'rgba(' + b.color + ',' + (b.opacity * 0.62) + ')');
      g.addColorStop(0.50, 'rgba(' + b.color + ',' + (b.opacity * 0.30) + ')');
      g.addColorStop(0.75, 'rgba(' + b.color + ',' + (b.opacity * 0.10) + ')');
      g.addColorStop(1,    'rgba(' + b.color + ',0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.globalCompositeOperation = 'source-over';

    // One scaled blit. The upscale is the blur.
    this.ctx.drawImage(this.buf, 0, 0, w, h, 0, 0, this.w, this.h);
  }

  animate() {
    let moving = false;

    for (let i = 0; i < this.blobs.length; i++) {
      const b = this.blobs[i];

      let tx, ty;
      if (b.follow) {
        // Straight to the cursor, as before.
        tx = this.px;
        ty = this.py;
      } else {
        // Everything else just leans, for depth behind the glow.
        const depth = this.PARALLAX * (1 - i * 0.15);
        tx = b.hx + (this.px - 0.5) * depth;
        ty = b.hy + (this.py - 0.5) * depth;
      }

      const dx = tx - b.x;
      const dy = ty - b.y;
      if (Math.abs(dx) > 0.0004 || Math.abs(dy) > 0.0004) {
        b.x += dx * 0.06;
        b.y += dy * 0.06;
        moving = true;
      }
    }

    this.draw();

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
