(function ($) {

  $('.navbar .hamburger').on('click touch', function (e) {
    var $navbar = $(this).parents('.navbar'),
      $navmenu = $navbar.find('.navbar-menu'),
      $navbarHamburgers = $navbar.find('.hamburger');

    // Only run if navbar exists
    if ($navmenu.length) {

      if ($navmenu.hasClass('is-off-canvas')) {
        if ($navmenu.hasClass('is-active')) {
          $navmenu.addClass('closing');
          setTimeout(function () {
            $navmenu.removeClass('closing');
          }, 550);
        }
        $('body').toggleClass('has-active-nav');
      }

      else {
        // Slide the navmenu into view
        $navmenu.slideToggle();
      }

      $navmenu.toggleClass('is-active');

      // Update hamburgers to reflect current state of menu
      if ($navbarHamburgers.length) {

        if ($navmenu.hasClass('is-off-canvas')) {
          $navbarHamburgers.first().toggle(); // Show and hide the first hamburger (usually in .navbar-brand)
        }

        // Toggle Attributes
        $navbarHamburgers.each(function () {
          if ($(this).attr('aria-expanded') === 'true') {
            $(this).attr('aria-expanded', 'false');
            $(this).removeClass('is-active');
          }
          else {
            $(this).attr('aria-expanded', 'true');
            $(this).addClass('is-active');
          }
        });
      }

    }

  });

  // If a menu item with children is clicked...
  $(document).on(
    'click',
    'li.has-children > a:not(".clicked"), li.menu-item-has-children > a:not(".clicked")',
    function (e) {
      // ...and the window width is smaller than the breakPoints.navBar
      if ($(window).width() < breakPoints.navBar) {
        // add .clicked class to the anchor element
        $(this).addClass('clicked');
        // prevent the link from firing
        e.preventDefault();
        // add .drop-active class and aria-expanded to parent li
        $(this)
          .parent('li')
          .toggleClass('drop-active')
          .attr('aria-expanded', 'true');
      }
    }
  );
})(jQuery);
