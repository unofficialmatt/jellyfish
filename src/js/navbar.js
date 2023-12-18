document.addEventListener("DOMContentLoaded", function () {
  var navbarHamburgers = document.querySelectorAll(".navbar .hamburger");

  navbarHamburgers.forEach(function (hamburger) {
    hamburger.addEventListener("click", function (e) {
      var navbar = this.closest(".navbar"),
        navmenu = navbar.querySelector(".navbar-menu"),
        navbarHamburgers = navbar.querySelectorAll(".hamburger");

      // Only run if navbar exists
      if (navmenu) {
        if (navmenu.classList.contains("is-off-canvas")) {
          if (navmenu.classList.contains("is-active")) {
            navmenu.classList.add("closing");
            setTimeout(function () {
              navmenu.classList.remove("closing");
            }, 550);
          }
          document.body.classList.toggle("has-active-nav");
        } else {
          navmenu.style.display =
            navmenu.style.display === "none" || navmenu.style.display === ""
              ? "block"
              : "none";
        }

        navmenu.classList.toggle("is-active");

        // Update hamburgers to reflect current state of menu
        if (navbarHamburgers.length) {
          navbarHamburgers.forEach(function (hamburger) {
            var expanded = hamburger.getAttribute("aria-expanded") === "true";
            hamburger.setAttribute(
              "aria-expanded",
              expanded ? "false" : "true"
            );
            hamburger.classList.toggle("is-active", !expanded);
          });
        }
      }
    });
  });

  // If a menu item with children is clicked...
  document.addEventListener("click", function (e) {
    var target = e.target;
    if (
      target.matches(
        "li.has-children > a:not(.clicked), li.menu-item-has-children > a:not(.clicked)"
      )
    ) {
      // ...and the window width is smaller than the breakPoints.navBar
      if (window.innerWidth < breakPoints.navBar) {
        // add .clicked class to the anchor element
        target.classList.add("clicked");
        // prevent the link from firing
        e.preventDefault();
        // add .drop-active class and aria-expanded to parent li
        target.parentElement.classList.toggle("drop-active");
        target.parentElement.setAttribute(
          "aria-expanded",
          target.parentElement.classList.contains("drop-active")
            ? "true"
            : "false"
        );
      }
    }
  });
});
