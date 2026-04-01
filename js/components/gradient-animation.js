// Detect if the user is on a mobile device
const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);

// Throttle function to limit event firing
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Set CSS custom properties for mouse tracking
function updateGradientPosition(e) {
  // Calculate percentage position (0-100)
  const xPercent = (e.clientX / window.innerWidth) * 100;
  const yPercent = (e.clientY / window.innerHeight) * 100;

  // Update CSS custom properties
  document.documentElement.style.setProperty('--mouse-x', `${xPercent}%`);
  document.documentElement.style.setProperty('--mouse-y', `${yPercent}%`);
}

if (!isMobile) {
  // Desktop: Track mouse movement
  document.addEventListener('mousemove', throttle(updateGradientPosition, 50));
} else {
  // Mobile: Enable lava lamp animation via CSS class
  document.documentElement.classList.add('lava-lamp-animate');
}
