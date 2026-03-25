document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".case-section");
    const mediaContainer = document.getElementById("media-content");
    const guideLinks = document.querySelectorAll(".guide-link");
    const backToTopButton = document.getElementById("back-to-top");

    function updateMedia(section) {
        const mediaType = section.dataset.media;
        const mediaSrc = section.dataset.src;
        const caption = section.dataset.caption;

        if (!mediaType || !mediaSrc) return;

        // Crossfade: fade out, swap content, fade in
        gsap.to(mediaContainer, {
            opacity: 0,
            duration: 0.25,
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

                    gsap.fromTo(mediaContainer,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.5, ease: "power2.out" }
                    );

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
            if (element.requestFullscreen) element.requestFullscreen();
            else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
            else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
            else if (element.webkitExitFullscreen) document.webkitExitFullscreen();
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

    // Trigger when a section crosses the middle 40% of the viewport
    const observerOptions = {
        root: null,
        rootMargin: "-30% 0px -30% 0px",
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                updateMedia(section);
                updateGuide(section);
                gsap.to(section, { opacity: 1, duration: 0.4 });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Initialize with first section
    if (sections.length > 0) {
        updateMedia(sections[0]);
        updateGuide(sections[0]);
        gsap.set(sections[0], { opacity: 1 });
    }

    sections.forEach((section) => observer.observe(section));

    // Guide link clicks
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

    // Subtle parallax on sections as they enter
    gsap.registerPlugin(ScrollTrigger);

    sections.forEach((section) => {
        gsap.fromTo(section,
            { y: 30 },
            {
                y: 0,
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "top 60%",
                    scrub: 1,
                },
            }
        );
    });

    // Back to top
    window.addEventListener("scroll", function () {
        backToTopButton.style.opacity = window.scrollY > 200 ? "1" : "0";
    });

    backToTopButton.addEventListener("click", function () {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });
});
