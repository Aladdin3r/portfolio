window.addEventListener('DOMContentLoaded', () => {
    const image = document.querySelector('.rotated-image');

    // Add the 'enter' class when the page loads
    setTimeout(() => {
        image.classList.add('enter');
    }, 100); // Slight delay for better effect
});

// For exiting the page
function handlePageExit() {
    const image = document.querySelector('.rotated-image');

    // Add the 'exit' class to trigger the transition
    image.classList.remove('enter');
    image.classList.add('exit');
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("img").forEach((img) => {
        img.setAttribute("loading", "lazy");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let lottieContainer = document.getElementById("lottie-container");

    if (lottieContainer) {
        let animation = lottie.loadAnimation({
            container: lottieContainer,
            renderer: "html", // or "canvas" / "html"
            loop: true,
            autoplay: true,
            path: "public/clipinterview-results.json" // Ensure this path is correct
        });
    }
});
