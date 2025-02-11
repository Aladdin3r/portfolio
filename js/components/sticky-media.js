document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".case-section");
    const mediaContainer = document.getElementById("media-content");
    const guideLinks = document.querySelectorAll(".guide-link");

    function updateMedia(section) {
        const mediaType = section.dataset.media;
        const mediaSrc = section.dataset.src;
        const caption = section.dataset.caption;

        if (!mediaType || !mediaSrc) {
            console.error("Missing mediaType or mediaSrc for section", section);
            return;
        }

        requestAnimationFrame(() => {
            gsap.to(mediaContainer, { y: -50, opacity: 0, duration: 0.2, ease: "power2.out", onComplete: function () {
                mediaContainer.innerHTML = '';

                let mediaElement = null;
                if (mediaType === "image") {
                    mediaElement = document.createElement('img');
                    mediaElement.src = mediaSrc;
                    mediaElement.alt = 'Case Study Image';
                    mediaElement.loading = "lazy";
                } else if (mediaType === "video") {
                    mediaElement = document.createElement('video');
                    mediaElement.setAttribute('controls', true);
                    mediaElement.setAttribute('autoplay', true);
                    mediaElement.setAttribute('muted', ''); // Ensures the attribute is set
                    mediaElement.muted = true; // Ensures the property is also set
                    mediaElement.loading = "lazy";
                
                    const source = document.createElement('source');
                    source.src = mediaSrc;
                    source.type = 'video/mp4';
                    mediaElement.appendChild(source);
                }

                if (mediaElement) {
                    const captionElement = document.createElement('p');
                    captionElement.classList.add('media-caption');
                    captionElement.textContent = caption;

                    mediaContainer.appendChild(mediaElement);
                    mediaContainer.appendChild(captionElement);

                    if (mediaType === "image") {
                        const expandIcon = document.createElement('div');
                        expandIcon.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="expand-icon-svg">
                                <path d="M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z"/>
                            </svg>
                        `;
                        expandIcon.classList.add('expand-icon');
                        mediaContainer.appendChild(expandIcon);

                        // Add event listener for full-screen toggle
                        expandIcon.addEventListener('click', toggleFullScreen);
                    }

                    gsap.to(mediaContainer, { y: 0, opacity: 1, duration: 0.2, ease: "power2.inOut" });

                    // Add event listener for full-screen toggle
                    mediaElement.addEventListener('click', toggleFullScreen);
                } else {
                    console.error("Failed to create a valid media element.");
                }
            }});
        });
    }

    function toggleFullScreen(event) {
        const element = event.target.tagName === "IMG" || event.target.tagName === "VIDEO" 
    ? event.target 
    : event.target.closest('#media-content')?.querySelector('img, video');

        if (!document.fullscreenElement) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) { // Firefox
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) { // IE/Edge
                element.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }
    }

    function updateGuide(section) {
        guideLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${section.id}`) {
                link.classList.add("active");
            }
        });
    }

    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };

    const observerCallback = (entries) => {
        let visibleSections = entries.filter(entry => entry.isIntersecting);
        
        if (visibleSections.length > 0) {
            let topVisibleSection = visibleSections[0].target; 
            updateMedia(topVisibleSection);
            updateGuide(topVisibleSection);
        }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Ensure the first section loads immediately
    if (sections.length > 0) {
        updateMedia(sections[0]);
        updateGuide(sections[0]);

        guideLinks.forEach((link) => {
            if (link.getAttribute("href") === `#${sections[0].id}`) {
                link.classList.add("ready", "active");
            }
        });
    }

    sections.forEach((section) => observer.observe(section));

    guideLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: "smooth", block: "center" });

            updateMedia(targetSection);
            updateGuide(targetSection);
        });
    });

    // Lazy load the rest of the guide
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            sections.forEach(section => observer.observe(section));
        });
    } else {
        sections.forEach(section => observer.observe(section));
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const guideLinks = document.querySelectorAll('.guide a');

    guideLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            const offset = 100; // Adjust this value as needed

            window.scrollTo({
                top: targetElement.offsetTop - offset,
                behavior: 'smooth'
            });
        });
    });

    sections.forEach(section => {
        section.addEventListener('mouseenter', () => updateMedia(section));
    });
});
