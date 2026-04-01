document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".menu");
    const fullPageMenu = document.querySelector(".full-page-menu");

    menu.addEventListener("click", () => {
        // Toggle the "open" class to animate the lines into an X
        menu.classList.toggle("open");

        // Toggle the visibility of the full-page menu
        const isVisible = fullPageMenu.classList.toggle("visible");

        // In desktop mode, hide the background blob animation when full-page menu is open
        if (window.dynamicGradientInstance && typeof window.dynamicGradientInstance.setVisible === 'function') {
            window.dynamicGradientInstance.setVisible(!isVisible);
        }
    });

    const menuLinks = document.querySelectorAll(".full-page-menu a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        fullPageMenu.classList.remove("visible");
        menu.classList.remove("open");

        if (window.dynamicGradientInstance && typeof window.dynamicGradientInstance.setVisible === 'function') {
          window.dynamicGradientInstance.setVisible(true);
        }
      });
    });
});
