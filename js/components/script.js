// Select elements
const loadingContainer = document.getElementById("loading-container");
const loadingAnimation = document.getElementById("loading-animation");
const overlay = document.getElementById("overlay"); // This is the overlay element

// Initialize Lottie Animation
const animation = lottie.loadAnimation({
  container: loadingAnimation,
  renderer: "svg",
  loop: false,
  autoplay: false,
  path: "public/transitions.json",
});

animation.addEventListener("DOMLoaded", () => {
  console.log("Lottie animation loaded successfully!");
});


// Show Loading Animation
function showLoading() {
  loadingContainer.classList.add("show");
  overlay.classList.add("show"); // Show the overlay (updated class)
  console.log("Loading animation started");
  animation.play();
}

// Hide Loading Animation
function hideLoading() {
  animation.stop();
  loadingContainer.classList.remove("show");
  overlay.classList.remove("show"); // Hide the overlay (updated class)
}

// On Page Load
window.addEventListener("load", () => {
  showLoading();

  animation.addEventListener("complete", () => {
    hideLoading();
  });

  setTimeout(() => {
    hideLoading();
  }, 2000); // Fallback
});

// // Simulate Navigation with Loading
// document.addEventListener("click", (event) => {
//   if (event.target.matches(".main-link")) {
//     showLoading();

//     setTimeout(() => {
//       hideLoading();
//       window.location.href = event.target.href;
//     }, 2000); // Delay
//     event.preventDefault();
//   }
// });
