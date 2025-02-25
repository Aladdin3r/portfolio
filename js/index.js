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
            y: -150,
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
                element.msRequestFullscreen();
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
            y: "-20%",
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
        if (window.scrollY > 200) {
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

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".case-section");
    const mediaContainer = document.getElementById("media-content");
    const guideLinks = document.querySelectorAll(".guide-link");
    const backToTopButton = document.getElementById("back-to-top");

    // Function to update the guide links
    function updateGuide(section) {
        guideLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${section.id}`) {
                link.classList.add("active");
            }
        });
    }

    // Function to handle guide link clicks
    guideLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: "smooth", block: "center" });

            updateGuide(targetSection);
        });
    });

    // Observer to update the guide based on visible sections
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };

    const observerCallback = (entries) => {
        let visibleSections = entries.filter(entry => entry.isIntersecting);
        
        if (visibleSections.length > 0) {
            let topVisibleSection = visibleSections[0].target; 
            updateGuide(topVisibleSection);
        }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sections.forEach((section) => observer.observe(section));

    // Initialize the first section as active
    if (sections.length > 0) {
        updateGuide(sections[0]);

        guideLinks.forEach((link) => {
            if (link.getAttribute("href") === `#${sections[0].id}`) {
                link.classList.add("ready", "active");
            }
        });
    }

    // Back to top button functionality
    window.addEventListener("scroll", function () {
        if (window.scrollY > 200) {
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

document.addEventListener("DOMContentLoaded", () => {
    // Select all elements with the "popup-text" class
    const popupTextElements = document.querySelectorAll(".popup-text");
  
    // Create the image element that will be shown on hover/click
    const hoverImage = document.createElement("img");
    hoverImage.classList.add("hover-image");
    hoverImage.style.position = "absolute"; // Use absolute positioning for hover
    hoverImage.style.opacity = 0;
    hoverImage.style.pointerEvents = "none";
    hoverImage.style.zIndex = 1000;
    hoverImage.style.transition = "opacity 0.3s ease";
    hoverImage.style.maxWidth = "60%"; // Ensure the image doesn't overflow on mobile
    hoverImage.style.maxHeight = "50vh"; // Limit height for mobile
    document.body.appendChild(hoverImage);
  
    // Create the caption element
    const caption = document.createElement("div");
    caption.classList.add("hover-caption");
    caption.style.position = "absolute"; // Use absolute positioning for hover
    caption.style.opacity = 0;
    caption.style.pointerEvents = "none";
    caption.style.zIndex = 1000;
    caption.style.transition = "opacity 0.3s ease";
    caption.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    caption.style.color = "white";
    caption.style.padding = "5px 10px";
    caption.style.borderRadius = "5px";
    caption.style.fontSize = "14px";
    document.body.appendChild(caption);
  
    // Detect if the user is on a mobile device
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  
    // Function to hide the image and caption
    const hidePopup = () => {
        gsap.to([hoverImage, caption], { opacity: 0, duration: 0.3 });
    };
  
    // Function to show the image and caption
    const showPopup = (src, text, x, y) => {
        hoverImage.src = src;
        caption.textContent = text;
  
        // Position the image and caption
        hoverImage.style.left = `${x}px`;
        hoverImage.style.top = `${y}px`;
        caption.style.left = `${x}px`;
        caption.style.top = `${y + hoverImage.offsetHeight + 10}px`;
  
        // Show the image and caption
        gsap.to([hoverImage, caption], { opacity: 1, duration: 0.3 });
    };
  
    popupTextElements.forEach((element) => {
        const imageId = element.id;
  
        // Handle hover behavior for non-mobile devices
        if (!isMobile) {
            element.addEventListener("mouseenter", (e) => {
                const src = imageId === "cat-emoji" ? "public/fun-cat.jpg" : "public/photograph.jpeg";
                const text = imageId === "cat-emoji" ? "Me with my aunt's kitty" : "My favourite snap I've taken to date!";
                showPopup(src, text, e.pageX + 5, e.pageY + 5);
            });
  
            element.addEventListener("mouseleave", hidePopup);
  
            element.addEventListener("mousemove", (e) => {
                hoverImage.style.left = `${e.pageX + 5}px`;
                hoverImage.style.top = `${e.pageY + 5}px`;
                caption.style.left = `${e.pageX + 5}px`;
                caption.style.top = `${e.pageY + hoverImage.offsetHeight + 20}px`;
            });
        }
  
        // Handle click behavior for mobile devices
        if (isMobile) {
            element.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent event from bubbling up to the document
  
                const src = imageId === "cat-emoji" ? "public/fun-cat.jpg" : "public/photograph.jpeg";
                const text = imageId === "cat-emoji" ? "Me with my aunt's kitty" : "My favourite snap I've taken to date!";
  
                // Calculate position relative to the viewport
                const x = e.clientX;
                const y = e.clientY;
  
                // Change positioning to fixed for mobile
                hoverImage.style.position = "fixed";
                caption.style.position = "fixed";
  
                showPopup(src, text, x, y);
  
                // Hide the image and caption when clicking outside
                const hideOnClickOutside = (event) => {
                    if (!element.contains(event.target)) {
                        hidePopup();
                        document.removeEventListener("click", hideOnClickOutside);
                    }
                };
                document.addEventListener("click", hideOnClickOutside);
            });
        }
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".menu");
    const fullPageMenu = document.querySelector(".full-page-menu");

    menu.addEventListener("click", () => {
        console.log("Menu clicked");
        // Toggle the "open" class to animate the lines into an X
        menu.classList.toggle("open");
        // Toggle the visibility of the full-page menu
        fullPageMenu.classList.toggle("visible");
    });

    const menuLinks = document.querySelectorAll(".full-page-menu a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        fullPageMenu.classList.remove("visible");
        menu.classList.remove("open");
      });
    });
});

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

    // Optional: Delay navigation to let the animation complete
    setTimeout(() => {
        window.location.href = 'next-page.html'; // Change to the actual page URL
    }, 800); // Match the transition duration
}
