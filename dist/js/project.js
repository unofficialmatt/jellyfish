  /**
   * forEach implementation for Objects/NodeLists/Arrays, automatic type loops and context options
   *
   * @private
   * @author Todd Motto
   * @link https://github.com/toddmotto/foreach
   * @param {Array|Object|NodeList} collection - Collection of items to iterate, could be an Array, Object or NodeList
   * @callback requestCallback      callback   - Callback function for each iteration.
   * @param {Array|Object|NodeList} scope=null - Object/NodeList/Array that forEach is iterating over, to use as the this value when executing callback.
   * @returns {}
   */
    var forEach=function(t,o,r){if("[object Object]"===Object.prototype.toString.call(t))for(var c in t)Object.prototype.hasOwnProperty.call(t,c)&&o.call(r,t[c],c,t);else for(var e=0,l=t.length;l>e;e++)o.call(r,t[e],e,t)};

    var hamburgers = document.querySelectorAll(".hamburger");
    if (hamburgers.length > 0) {
      forEach(hamburgers, function(hamburger) {
        hamburger.addEventListener("click", function() {
          this.classList.toggle("is-active");
        }, false);
      });
    }
;
/**
 * Function to allow the user to change the root font-size to increase legibility.
 */
$('button.font-size').click(function () {
  if ($(this).hasClass('font-size-sm')) {
    $(document.body).removeClass('font-size-md font-size-lg').addClass('font-size-sm');
    $('button.font-size').removeClass('active');
    $(this).addClass('active');
    jfCreateCookie('fontsize', 'sm');
  }
  else if ($(this).hasClass('font-size-md')) {
    $(document.body).removeClass('font-size-sm font-size-lg').addClass('font-size-md');
    $('button.font-size').removeClass('active');
    $(this).addClass('active');
    jfCreateCookie('fontsize', 'md');
  }
  else if ($(this).hasClass('font-size-lg')) {
    $(document.body).removeClass('font-size-sm font-size-md').addClass('font-size-lg');
    $('button.font-size').removeClass('active');
    $(this).addClass('active');
    jfCreateCookie('fontsize', 'lg');
  };
});

/**
 * Function to allow the user to change the contrast mode.
 */
$('button.toggle-contrast').click(function () {
  if ($(this).hasClass('active')) {
    $(document.body).removeClass('dark-ui');
    $(this).removeClass('active');
    jfCreateCookie('ui-mode', 'light');
  }
  else {
    $(document.body).addClass('dark-ui');
    $(this).addClass('active');
    jfCreateCookie('ui-mode', 'dark');
  }
});

/**
 * Check for Accessibility cookies 'fontsize' and 'ui-mode' on document ready. Append appropriate classes to body element
 */
$(document).ready(function() {
  var docFontSize = jfReadCookie('fontsize');
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
  var docUiMode = jfReadCookie('ui-mode');
  switch (docUiMode) {
    case 'dark' :
      $(document.body).addClass('dark-ui');
      $('button.toggle-contrast').addClass('active');
      break;
  }
});

;
;
/**
 * Creates a cookie
 * @param {string} name
 * @param {string} value
 * @param {number} days before expiry (optional)
 */
function jfCreateCookie(name, value, days) {
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
function jfReadCookie(cookiename) {
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

// todo; add destroy
;
function jfdebug() {
  // Trigger debug mode by applying .jf-debug to document
  var docBody = document.getElementsByTagName('body')[0];
  docBody.classList.toggle('jf-debug');
};
;
jQuery(document).ready(function ($) {
  var navPoint = '900'; // px value at which the navigation should change from a burger menu to inline list

  // Expand and Collapse .navbar-menu when clicking .hamburger
  $(".hamburger").on('click touch', function (e) {
    // Search the parent .navbar for the .navbar-menu and store as a variable
    var navmenu = $(this).parents('.navbar').find('.navbar-menu');
    // Slide the navmenu into view
    $(navmenu).slideToggle();
    // Toggle the state of the aria-expanded attribute for screen readers
    var menuItem = $(e.currentTarget);
    if (menuItem.attr('aria-expanded') === 'true') {
      $(this).attr('aria-expanded', 'false');
    } else {
      $(this).attr('aria-expanded', 'true');
    }
  });

  // If a menu item with children is clicked...
  $(document).on("click", 'li.has-children > a:not(".clicked"), li.menu-item-has-children > a:not(".clicked")', function (e) {
    // ...and the window width is smaller than the navPoint
    if ($(window).width() < (navPoint)) {
      // add .clicked class to the anchor element
      ($(this).addClass("clicked"));
      // prevent the link from firing
      e.preventDefault();
      // add .drop-active class and aria-expanded to parent li
      $(this).parent("li").toggleClass("drop-active").attr('aria-expanded', 'true');
    }
  });
});
