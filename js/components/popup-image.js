document.addEventListener("DOMContentLoaded", () => {
    // Select all elements with the "popup-text" class
    const popupTextElements = document.querySelectorAll(".popup-text");
  
    // Create the image element that will be shown on hover/click
    const hoverImage = document.createElement("img");
    hoverImage.classList.add("hover-image");
    hoverImage.style.position = "absolute";
    hoverImage.style.opacity = 0;
    hoverImage.style.pointerEvents = "none";
    hoverImage.style.zIndex = 1000;
    hoverImage.style.transition = "opacity 0.3s ease";
    document.body.appendChild(hoverImage);
  
    // Create the caption element
    const caption = document.createElement("div");
    caption.classList.add("hover-caption");
    caption.style.position = "absolute";
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
  
    popupTextElements.forEach((element) => {
      const imageId = element.id;
  
      // Handle hover behavior for non-mobile devices
      if (!isMobile) {
        element.addEventListener("mouseenter", () => {
          if (imageId === "cat-emoji") {
            hoverImage.src = "public/fun-cat.jpg";
            hoverImage.style.height = "70%";
          } else {
            hoverImage.src = "public/photograph.jpeg";
            hoverImage.style.height = "150px";
          }
  
          caption.textContent =
            imageId === "cat-emoji"
              ? "Me with my aunt's kitty"
              : "My favourite snap I've taken to date!";
  
          gsap.to([hoverImage, caption], { opacity: 1, duration: 0.3 });
        });
  
        element.addEventListener("mouseleave", () => {
          gsap.to([hoverImage, caption], { opacity: 0, duration: 0.3 });
        });
  
        element.addEventListener("mousemove", (e) => {
          hoverImage.style.left = `${e.pageX + 15}px`;
          hoverImage.style.top = `${e.pageY + 15}px`;
  
          caption.style.left = `${e.pageX + 15}px`;
          caption.style.top = `${e.pageY + hoverImage.offsetHeight + 20}px`;
        });
      }
  
      // Handle click behavior for mobile devices
      if (isMobile) {
        element.addEventListener("click", (e) => {
          if (imageId === "cat-emoji") {
            hoverImage.src = "public/fun-cat.jpg";
            hoverImage.style.height = "70%";
          } else {
            hoverImage.src = "public/photograph.jpeg";
            hoverImage.style.height = "150px";
          }
  
          caption.textContent =
            imageId === "cat-emoji"
              ? "Me with my aunt's kitty"
              : "My favourite snap I've taken to date!";
  
          // Position the image and caption on click
          hoverImage.style.left = `${e.pageX + 15}px`;
          hoverImage.style.top = `${e.pageY + 15}px`;
          caption.style.left = `${e.pageX + 15}px`;
          caption.style.top = `${e.pageY + hoverImage.offsetHeight + 20}px`;
  
          // Show the image and caption
          gsap.to([hoverImage, caption], { opacity: 1, duration: 0.3 });
  
          // Hide the image and caption on a second click
          const hideOnClick = () => {
            gsap.to([hoverImage, caption], { opacity: 0, duration: 0.3 });
            document.removeEventListener("click", hideOnClick);
          };
          document.addEventListener("click", hideOnClick, { once: true });
        });
      }
    });
  });
  