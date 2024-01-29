function jfGetNavbarType(navmenu) {
  if (navmenu.classList.contains("is-off-canvas")) {
    return "off-canvas";
  } else {
    return "drop-down";
  }
}

function jfToggleNavBar(navbar, navbarType) {
  // VARS
  var navmenu = navbar.querySelector(".navbar-menu"),
    navbarHamburgers = navbar.querySelectorAll(".hamburger");

  // Only run if navbar exists
  if (!navmenu) {
    return;
  }

  // If navmenu doesnt have a data-attr type,

  if (navbarType === "off-canvas") {
    if (navmenu.classList.contains("is-active")) {
      navmenu.classList.add("closing");
      setTimeout(function () {
        navmenu.classList.remove("closing");
      }, 550);
    }
    document.body.classList.toggle("has-active-nav");
  } else if (navbarType === "drop-down") {
    // Set display of navbar
    navmenu.style.display =
      navmenu.style.display === "none" || navmenu.style.display === ""
        ? "block"
        : "none";
  }

  // Update hamburgers to reflect current state of menu
  if (navbarHamburgers.length) {
    navbarHamburgers.forEach(function (hamburger) {
      var expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", expanded ? "false" : "true");
      hamburger.classList.toggle("is-active", !expanded);
    });
  }

  // Toggle active class on navbar and body
  navmenu.classList.toggle("is-active");
}

document.addEventListener("DOMContentLoaded", function () {
  var navbarHamburgers = document.querySelectorAll(".navbar .hamburger");

  navbarHamburgers.forEach(function (hamburger) {
    hamburger.addEventListener("click", function (e) {
      var navbar = this.closest(".navbar"),
        navmenu = navbar.querySelector(".navbar-menu");

      if (navmenu) {
        var navbarType = jfGetNavbarType(navmenu);
        jfToggleNavBar(navbar, navbarType);
      }
    });
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

// Listen for escape key press
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    // See if there are any .navbar-menu elements that are active
    var activeNavMenus = document.querySelectorAll(".navbar-menu.is-active");

    // If there are none, return
    if (!activeNavMenus.length) {
      return;
    }

    activeNavMenus.forEach(function (navmenu) {
      // Get the navbar
      var navbar = navmenu.closest(".navbar");

      var navbarType = jfGetNavbarType(navmenu);
      jfToggleNavBar(navbar, navbarType);
    });
  }
});

// Detect click outside of navbar and close it
document.addEventListener("click", function (e) {
  // if body doesnt have .has-active-nav, return default behavior
  if (!document.body.classList.contains("has-active-nav")) {
    return;
  }

  // Is e.target inside .navbar-menu or .hamburger, if so, return
  if (e.target.closest(".navbar-menu") || e.target.closest(".hamburger")) {
    return;
  }

  // Otherwise we need to close the navbar
  var activeNavMenus = document.querySelectorAll(".navbar-menu.is-active");

  // If there are none, return
  if (!activeNavMenus.length) {
    return;
  }

  activeNavMenus.forEach(function (navmenu) {
    // Get the navbar
    var navbar = navmenu.closest(".navbar");

    // Get the navbar type
    var navbarType;

    if (navmenu.classList.contains("is-off-canvas")) {
      navbarType = "off-canvas";
    } else {
      navbarType = "drop-down";
    }

    // Close the navbar
    jfToggleNavBar(navbar, navbarType);
  });
});
