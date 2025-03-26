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

document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("about-audio");
    const words = document.querySelectorAll("p.main-text span");


    const timings = [
        { start: 0, stop: 1000 },
        { start: 2000, stop: 3000 },
        { start: 3100, stop: 4800 },
        { start: 4900, stop: 7000 },
        { start: 7000, stop: 8000 },
        { start: 8000, stop: 9000 },
        { start: 9000, stop: 12000 },
        { start: 12000, stop: 15000 },
        { start: 15000, stop: 20000 },
        { start: 20000, stop: 24000 },
        { start: 24100, stop: 25000 },
        { start: 25000, stop: 26000 },
        { start: 26000, stop: 28000 },
        { start: 29000, stop: 30000 },
        { start: 30000, stop: 31000 },
        { start: 31000, stop: 32000 },
        { start: 32000, stop: 35000 },
        { start: 35000, stop: 39000 },
        { start: 39000, stop: 41000 },
        { start: 41000, stop: 42000 },
        { start: 42000, stop: 46000 },
        { start: 46000, stop: 47000 },
        { start: 47000, stop: 50000 },
        { start: 50000, stop: 52000 },
        { start: 52000, stop: 55000 },
        { start: 55000, stop: 57000 },
        { start: 57000, stop: 58000 },
        { start: 58000, stop: 59000 },
        { start: 59000, stop: 62000 },
        { start: 62000, stop: 63000 },
        { start: 63000, stop: 64000 },
        { start: 64000, stop: 67000 },
        { start: 67000, stop: 69000 },
    ];

    let currentIndex = 0;

    function updateHighlight() {
        let currentTime = audio.currentTime * 1000; // Convert to milliseconds

        // Remove previous highlight
        words.forEach(word => word.classList.remove("highlight"));

        // Find the current word to highlight
        for (let i = 0; i < timings.length; i++) {
            if (currentTime >= timings[i].start && currentTime <= timings[i].stop) {
                words[i].classList.add("highlight");
                currentIndex = i;
                break;
            }
        }
    }

    // Listen for time update in the audio and highlight accordingly
    audio.addEventListener("timeupdate", updateHighlight);
});
