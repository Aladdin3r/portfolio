document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".case-section");
    const mediaContainer = document.getElementById("media-content");
    const guideLinks = document.querySelectorAll(".guide-link");
    const backToTopButton = document.getElementById("back-to-top");

    // Preload all images up front so crossfades are instant
    sections.forEach(function (section) {
        if (section.dataset.media === "image" && section.dataset.src) {
            const preload = new Image();
            preload.src = section.dataset.src;
        }
    });

    let currentSrc = null;

    function showMedia(mediaType, mediaSrc, caption) {
        mediaContainer.innerHTML = '';

        if (mediaType === "image") {
            const img = document.createElement('img');
            const cap = document.createElement('p');
            cap.classList.add('media-caption');
            cap.textContent = caption || '';
            img.alt = caption || 'Case Study Image';
            img.src = mediaSrc;

            // decode() resolves once the image is fully ready to paint —
            // prevents blank-frame flash between crossfades
            img.decode()
                .catch(function () {}) // proceed even if decode fails
                .then(function () {
                    mediaContainer.appendChild(img);
                    mediaContainer.appendChild(cap);
                    gsap.to(mediaContainer, { opacity: 1, duration: 0.35, ease: "power2.out" });
                    img.addEventListener('click', toggleFullScreen);
                });

        } else if (mediaType === "video") {
            const video = document.createElement('video');
            video.setAttribute('controls', true);
            video.setAttribute('autoplay', true);
            video.setAttribute('muted', '');
            video.muted = true;

            const source = document.createElement('source');
            source.src = mediaSrc;
            source.type = 'video/mp4';
            video.appendChild(source);

            const cap = document.createElement('p');
            cap.classList.add('media-caption');
            cap.textContent = caption || '';

            mediaContainer.appendChild(video);
            mediaContainer.appendChild(cap);
            gsap.to(mediaContainer, { opacity: 1, duration: 0.35, ease: "power2.out" });
            video.addEventListener('click', toggleFullScreen);
        }
    }

    function updateMedia(section) {
        const mediaType = section.dataset.media;
        const mediaSrc = section.dataset.src;
        const caption = section.dataset.caption;

        if (!mediaType || !mediaSrc) return;
        if (mediaSrc === currentSrc) return;
        currentSrc = mediaSrc;

        gsap.to(mediaContainer, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: function () {
                showMedia(mediaType, mediaSrc, caption);
            }
        });
    }

    function toggleFullScreen(event) {
        const element = event.target.tagName === "IMG" || event.target.tagName === "VIDEO"
            ? event.target
            : event.target.closest('#media-content') && event.target.closest('#media-content').querySelector('img, video');

        if (!element) return;

        if (!document.fullscreenElement) {
            if (element.requestFullscreen) element.requestFullscreen();
            else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
            else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
    }

    function updateGuide(section) {
        guideLinks.forEach(function (link) {
            link.classList.remove("active");
            if (link.getAttribute("href") === '#' + section.id) {
                link.classList.add("active");
            }
        });
    }

    // Fire when the section's top edge enters the top half of the viewport —
    // image updates right as you start reading the new section
    const observerOptions = {
        root: null,
        rootMargin: "0px 0px -50% 0px",
        threshold: 0
    };

    const observerCallback = function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                updateMedia(entry.target);
                updateGuide(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Initialize with the first section immediately
    if (sections.length > 0) {
        const first = sections[0];
        updateGuide(first);
        if (first.dataset.media && first.dataset.src) {
            currentSrc = first.dataset.src;
            showMedia(first.dataset.media, first.dataset.src, first.dataset.caption);
        }
    }

    sections.forEach(function (section) {
        observer.observe(section);
    });

    // Guide link clicks
    guideLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: "smooth", block: "center" });
            currentSrc = null; // force update even if clicking active section
            updateMedia(targetSection);
            updateGuide(targetSection);
        });
    });

    // Back to top
    window.addEventListener("scroll", function () {
        backToTopButton.style.opacity = window.scrollY > 200 ? "1" : "0";
    });

    backToTopButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
