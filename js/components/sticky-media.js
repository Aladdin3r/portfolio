document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".case-section");
    const mediaContainer = document.getElementById("media-content");
    const guideLinks = document.querySelectorAll(".guide-link");
    const backToTopButton = document.getElementById("back-to-top");

    function updateMedia(section) {
        const mediaType = section.dataset.media;
        const mediaSrc = section.dataset.src;
        const caption = section.dataset.caption;

        if (!mediaType || !mediaSrc) {
            console.error("Missing mediaType or mediaSrc for section", section);
            return;
        }

        gsap.to(mediaContainer, {
            y: -100,
            opacity: 0,
            duration: 0.2,
            ease: "power2.out",
            onComplete: function () {
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
                    mediaElement.setAttribute('muted', '');
                    mediaElement.muted = true;
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

                    gsap.to(mediaContainer, { y: 0, opacity: 1, duration: 0.2, ease: "power2.inOut" });

                    mediaElement.addEventListener('click', toggleFullScreen);
                }
            }
        });
    }

    function toggleFullScreen(event) {
        const element = event.target.tagName === "IMG" || event.target.tagName === "VIDEO" 
            ? event.target 
            : event.target.closest('#media-content')?.querySelector('img, video');

        if (!document.fullscreenElement) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msExitFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
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

            // Fade out the previous section
            sections.forEach((section, index) => {
                if (section === topVisibleSection) {
                    gsap.to(section, { opacity: 1, duration: 0.3 });
                    if (index > 0) {
                        gsap.to(sections[index - 1], { opacity: 0, duration: 0.3 });
                    }
                }
            });
        }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

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

    /** 
     * 🌟 Enhanced Parallax Effect with GSAP 
     */
    gsap.registerPlugin(ScrollTrigger);

    sections.forEach((section, index) => {
        gsap.to(section, {
            y: "-5%",
            opacity: 1,
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top center",
                scrub: 1,
                markers: false, // Set to true to debug positions
            },
        });
    });

    window.addEventListener("scroll", function () {
        if (window.scrollY > 0) {
            backToTopButton.style.opacity = "1";
        } else {
            backToTopButton.style.opacity = "0";
        }
    });

    backToTopButton.addEventListener("click", function () {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
});
