jQuery(document).ready(function ($) {

    var navPoint = '600'; // px value at which the navigation should change from a burger menu to inline list

    // Expand and Collapse .nav-bar when clicking #nav-hamburger
    $("#nav-hamburger").click(function () {
        $(".nav-bar").slideToggle();
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
