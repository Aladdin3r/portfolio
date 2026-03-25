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
