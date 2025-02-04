document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".case-section");
    const mediaContainer = document.getElementById("media-content");
    const guideLinks = document.querySelectorAll(".guide-link");

    // Function to update the media content based on the section
    function updateMedia(section) {
        const mediaType = section.dataset.media; // "image" or "video"
        const mediaSrc = section.dataset.src; // The source of the media (image/video URL)
        const caption = section.dataset.caption; // Caption for the media content

        // // Log values to debug
        // console.log('Media Type:', mediaType);
        // console.log('Media Src:', mediaSrc);
        // console.log('Caption:', caption);

        // Check if mediaSrc or mediaType is missing or undefined
        if (!mediaType || !mediaSrc) {
            console.error("Missing mediaType or mediaSrc for section", section);
            return; // Exit early if essential data is missing
        }

        // GSAP animation to smoothly push up the media content
        gsap.to(mediaContainer, { y: -50, opacity: 0, duration: 0.3, ease: "power2.out", onComplete: function() {
            // Clear previous content
            mediaContainer.innerHTML = '';

            // Create and add the new media element
            let mediaElement = null;
            if (mediaType === "image") {
                mediaElement = document.createElement('img');
                mediaElement.setAttribute('src', mediaSrc);
                mediaElement.setAttribute('alt', 'Case Study Image');
            } else if (mediaType === "video") {
                mediaElement = document.createElement('video');
                mediaElement.setAttribute('controls', true);
                mediaElement.setAttribute('autoplay', true);
                mediaElement.setAttribute('muted', true);

                const source = document.createElement('source');
                source.setAttribute('src', mediaSrc);
                source.setAttribute('type', 'video/mp4');
                mediaElement.appendChild(source);
            }

            // Check if mediaElement was created successfully
            if (mediaElement) {
                // Create caption element
                const captionElement = document.createElement('p');
                captionElement.classList.add('media-caption');
                captionElement.textContent = caption;

                // Append the media element and caption
                mediaContainer.appendChild(mediaElement);
                mediaContainer.appendChild(captionElement);

                // Reset the position and opacity after the content is replaced
                gsap.to(mediaContainer, { y: 0, opacity: 1, duration: 0.15, ease: "power2.inOut" });
            } else {
                console.error("Failed to create a valid media element.");
            }
        }});
    }

    // Function to update the guide link as the user scrolls
    function updateGuide(section) {
        guideLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${section.id}`) {
                link.classList.add("active");
            }
        });
    }

    // Use Intersection Observer to detect when a section is in view
    const observerOptions = {
        root: null, // Observe in the viewport
        rootMargin: "0px",
        threshold: 0.5, // When 50% of the section is in view
    };

    const observerCallback = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                console.log(`Section in view: ${entry.target.id}`);
                updateMedia(entry.target);
                updateGuide(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
        observer.observe(section); // Observe each section
    });

    // Function to handle guide link clicks
    guideLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            // Scroll to the target section
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            // Smooth scroll to the section
            targetSection.scrollIntoView({ behavior: "smooth", block: "center" });

            // Update the media content and guide
            updateMedia(targetSection);
            updateGuide(targetSection);
        });
    });

    // Initial call to update the media content and guide on page load
    updateGuide(sections[0]); // Set the first section as active
});
