jQuery(document).ready(function ($) {

    var navPoint = '600'; // px value at which the navigation should change from a burger menu to inline list

    // Expand and Collapse .nav-bar when clicking #nav-hamburger
    $("#nav-hamburger").click(function () {
        $(".nav-bar").slideToggle();

        // Toggle the state of the aria-expanded attribute for screen readers
        var menuItem = $(e.currentTarget);
            if (menuItem.attr( 'aria-expanded') === 'true') {
                $(this).attr( 'aria-expanded', 'false');
            }
            else {
                $(this).attr( 'aria-expanded', 'true');
            }

    });

    // If a menu item with children is clicked...
    $(document).on("click", 'li.has-children > a:not(".clicked"), li.menu-item-has-children > a:not(".clicked")', function (e) {
        // ...and the window width is smaller than the navPoint
        if ($(window).width() < (navPoint - 1)) {
            // add .clicked class to the anchor element
            ($(this).addClass("clicked"));
            // prevent the link from firing
            e.preventDefault();
            // add .drop-active class to parent li
            $(this).parent("li").toggleClass("drop-active");
        }
    });

});

function jfdebug() {
  // Trigger debug mode by applying .jf-debug to document
  var docBody = document.getElementsByTagName('body')[0];
  docBody.classList.toggle('jf-debug');
}

// TODO: Can I remove dependency on jQuery?
