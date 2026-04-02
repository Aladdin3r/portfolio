class DynamicGradient {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    
    // Blobs data
    this.blobs = [
      { x: 0.2, y: 0.3, targetX: 0.2, targetY: 0.3, radius: 150, color: '#ff6600', opacity: 0.6 },
      { x: 0.7, y: 0.6, targetX: 0.7, targetY: 0.6, radius: 200, color: '#ff8533', opacity: 0.4 },
      { x: 0.5, y: 0.8, targetX: 0.5, targetY: 0.8, radius: 180, color: '#ff7722', opacity: 0.3 }
    ];
    
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.time = 0;
    
    this.setup();
    this.attach();
  }

  setup() {
    // Style canvas
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-11';
    this.canvas.style.pointerEvents = 'none';
    
    // Insert at beginning of body
    document.body.insertBefore(this.canvas, document.body.firstChild);
    
    // Set canvas size
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Mouse tracking
    if (!this.isMobile) {
      document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
    
    // Start animation loop
    this.animate();
  }

  attach() {
    // Remove old gradient background from body
    document.documentElement.style.backgroundImage = 'none';
    document.body.style.backgroundImage = 'none';
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleMouseMove(e) {
    // Move primary blob toward mouse with smooth easing
    this.blobs[0].targetX = (e.clientX / window.innerWidth);
    this.blobs[0].targetY = (e.clientY / window.innerHeight);
  }

  draw() {
    // Clear canvas with dark base
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Create base gradient - warm dark tones with subtle blue
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#1a1410');
    gradient.addColorStop(0.3, '#2a1815');
    gradient.addColorStop(0.6, '#2a1a25');
    gradient.addColorStop(1, '#1a0f08');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw blobs with blur effect
    this.ctx.filter = 'blur(60px)';
    
    this.blobs.forEach((blob) => {
      // Smoothly interpolate position
      blob.x += (blob.targetX - blob.x) * 0.05;
      blob.y += (blob.targetY - blob.y) * 0.05;
      
      // Convert normalized coords to canvas coords
      const canvasX = blob.x * this.canvas.width;
      const canvasY = blob.y * this.canvas.height;
      
      // Draw blob
      this.ctx.globalAlpha = blob.opacity;
      this.ctx.fillStyle = blob.color;
      this.ctx.beginPath();
      this.ctx.arc(canvasX, canvasY, blob.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.ctx.filter = 'none';
    this.ctx.globalAlpha = 1;
  }

  updateMobileAnimation() {
    // Create floating motion for mobile blobs
    this.time += 0.01;
    
    // Wave motion for each blob
    this.blobs[0].targetX = 0.3 + Math.sin(this.time * 0.5) * 0.2;
    this.blobs[0].targetY = 0.4 + Math.cos(this.time * 0.7) * 0.15;
    
    this.blobs[1].targetX = 0.7 + Math.sin(this.time * 0.3 + 2) * 0.15;
    this.blobs[1].targetY = 0.6 + Math.cos(this.time * 0.5 + 2) * 0.2;
    
    this.blobs[2].targetX = 0.5 + Math.sin(this.time * 0.4 + 4) * 0.1;
    this.blobs[2].targetY = 0.8 + Math.cos(this.time * 0.6 + 4) * 0.15;
  }

  setVisible(isVisible) {
    this.canvas.style.opacity = isVisible ? '1' : '0';
    this.canvas.style.pointerEvents = isVisible ? 'none' : 'none';
    this.canvas.style.transition = 'opacity 0.25s ease-in-out';
  }

  animate() {
    if (this.isMobile) {
      this.updateMobileAnimation();
    }
    
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

if (typeof window !== 'undefined') {
  window.DynamicGradient = DynamicGradient;
  window.dynamicGradientInstance = null;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.dynamicGradientInstance = new DynamicGradient();
  });
} else {
  window.dynamicGradientInstance = new DynamicGradient();
}
