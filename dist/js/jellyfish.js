// Note: These should match the values set in scss. Currently it is a manual process to keep them in sync
var breakPoints = {
  navBar: 900, // TODO: Check how to override this on a project
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1800,
};
;
(function ($) {
  /**
   * Function to allow the user to change the root font-size to increase legibility.
   */
  $('button.font-size').click(function () {
    if ($(this).hasClass('font-size-sm')) {
      $(document.body).removeClass('font-size-md font-size-lg').addClass('font-size-sm');
      $('button.font-size').removeClass('active');
      $(this).addClass('active');
      jfSetCookie('fontsize', 'sm');
    }
    else if ($(this).hasClass('font-size-md')) {
      $(document.body).removeClass('font-size-sm font-size-lg').addClass('font-size-md');
      $('button.font-size').removeClass('active');
      $(this).addClass('active');
      jfSetCookie('fontsize', 'md');
    }
    else if ($(this).hasClass('font-size-lg')) {
      $(document.body).removeClass('font-size-sm font-size-md').addClass('font-size-lg');
      $('button.font-size').removeClass('active');
      $(this).addClass('active');
      jfSetCookie('fontsize', 'lg');
    };
  });

  /**
   * Function to allow the user to change the contrast mode.
   */
  $('button.toggle-contrast').click(function () {
    if ($(this).hasClass('active')) {
      $(document.body).removeClass('dark-ui');
      $(this).removeClass('active');
      jfSetCookie('ui-mode', 'light');
    }
    else {
      $(document.body).addClass('dark-ui');
      $(this).addClass('active');
      jfSetCookie('ui-mode', 'dark');
    }
  });

  /**
   * Check for Accessibility cookies 'fontsize' and 'ui-mode' on document ready. Append appropriate classes to body element
   */
  $(document).ready(function ($) {
    var docFontSize = jfGetCookie('fontsize');
    switch (docFontSize) {
      case 'sm':
        $(document.body).removeClass('font-size-md font-size-lg').addClass('font-size-sm');
        $('button.font-size').removeClass('active');
        $('button.font-size-sm').addClass('active');
        break;
      case 'md':
        $(document.body).removeClass('font-size-sm font-size-lg').addClass('font-size-md');
        $('button.font-size').removeClass('active');
        $('button.font-size-md').addClass('active');
        break;
      case 'lg':
        $(document.body).removeClass('font-size-md font-size-md').addClass('font-size-lg');
        $('button.font-size').removeClass('active');
        $('button.font-size-lg').addClass('active');
        break;
      default:
        break;
    };
    var docUiMode = jfGetCookie('ui-mode');
    switch (docUiMode) {
      case 'dark':
        $(document.body).addClass('dark-ui');
        $('button.toggle-contrast').addClass('active');
        break;
    }
  });
})(jQuery);
;
/**
 * Creates a cookie
 * @param {string} name
 * @param {string} value
 * @param {number} days before expiry (optional)
 */
function jfSetCookie(name, value, days) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = ";expires=" + date.toUTCString();
  }
  else {
    expires = "";
  }
  // Sets the cookie site-wide with path=/
  document.cookie = name + "=" + encodeURIComponent(value) + expires + ";path=/";
}

/**
 * Reads and returns the value of a cookie
 * @param {string} cookiename
 */
function jfGetCookie(cookiename) {
  var name = cookiename + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Destroys a cookie
 */
function jfDestroyCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
;
function jfdebug() {
  // Trigger debug mode by applying .jf-debug to document
  var docBody = document.getElementsByTagName('body')[0];
  docBody.classList.toggle('jf-debug');
};
;
/**
 * Send interaction events to Google Analytics
 */
(function ($) {
  if (typeof gtag == "function") {
    // Send mailto: events
    $('a[href^="mailto:"]').click(function () {
      gtag("event", "contact", {
        event_category: "Email Enquiry",
        event_action: "Mailto Click",
        event_label: $(this).attr("href"),
      });
      return true;
    });

    // Send tel: events
    $('a[href^="tel:"]').click(function () {
      gtag("event", "contact", {
        event_category: "Telephone Enquiry",
        event_action: "Tel Link Click",
        event_label: $(this).attr("href"),
      });
      return true;
    });

    // Send *.pdf download events
    $('a[href$=".pdf"]').click(function () {
      gtag("event", "contact", {
        event_category: "PDF Download",
        event_action: "Download",
        event_label: $(this).attr("href"),
      });
      return true;
    });

    // Send external link clicks
    $(
      "a:not([href*='" +
        document.domain +
        "'],[href*='mailto'],[href*='tel'],a[href$='.pdf'])"
    ).click(function (event) {
      // Prevent # and javascript links being sent
      if (
        $(this).attr("href").charAt(0) != "#" &&
        !$(this).attr("href").startsWith("javascript")
      ) {
        gtag("event", "contact", {
          event_category: "External Link",
          event_action: "Link Click",
          event_label: $(this).attr("href"),
        });
        return true;
      }
    });
  }
})(jQuery);
;
/**
 * Lazy Load of BG Images
 * Forked from @link https://web.dev/lazy-loading-images/
 */

function jfLazyLoadBackgroundImage(element) {
  var bgImage = element.getAttribute('data-bg-img');
  element.style.backgroundImage = "url("+bgImage+")";
  element.removeAttribute('data-bg-img');
}
document.addEventListener("DOMContentLoaded", function() {
  var lazyBackgroundElements = [].slice.call(document.querySelectorAll(".has-bg-img"));

  if("IntersectionObserver" in window) {
    let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          jfLazyLoadBackgroundImage(entry.target);
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    }, {rootMargin: "0px 0px 300px 0px"}); // Pre-empt by loading 300px early

    lazyBackgroundElements.forEach(function(lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  }
  else {
    // For browsers that don't support intersection observer, load all images straight away
    lazyBackgroundElements.forEach(function(lazyBackground){
      jfLazyLoadBackgroundImage(lazyBackground);
    });
  }
});
;
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