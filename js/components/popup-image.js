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