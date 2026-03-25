document.addEventListener("DOMContentLoaded", () => {
    // Select all text elements (you can be more specific by targeting a class like `.text`)
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a'); // Adjust as needed

    // Animate the text elements with GSAP
    gsap.fromTo(
        textElements, 
        {
            opacity: 0,  // Start from invisible
            y: 20,       // Optional: Start with slight vertical offset
        },
        {
            opacity: 1,  // Fade in to full opacity
            y: 0,        // Bring the element back to its normal position
            duration: 0.5, // Duration of the fade-in animation
            stagger: 0.09 // Delay between each text element's animation
        }
    );
});