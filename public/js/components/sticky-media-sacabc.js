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
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.2 };

   
    const observerCallback = (entries) => {
        let visibleSections = entries.filter(entry => entry.isIntersecting);

        if (visibleSections.length > 0) {
            let topVisibleSection = visibleSections[0].target;

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