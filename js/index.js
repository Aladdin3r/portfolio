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