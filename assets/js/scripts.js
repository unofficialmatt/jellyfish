jQuery(document).ready(function ($) {
    $(".nav-button").click(function () {
        $(".nav-primary").toggle(); // toggle the navigation when the burger menu is clicked
        $(this).toggleClass('nav-expanded');
        
        // reset sub-navigation menus
        $('.drop-active').removeClass("drop-active");
        $('.clicked').removeClass("clicked");
    });
    $(document).on("click", 'li.menu-item-has-children > a:not(".clicked")', function (e) {
        // if user clicks on a menu item that has children, and has not been clicked before, expand the drop down and add a clicked class
        e.preventDefault();
        $(window).width() < 599 && ($(this).addClass("clicked"), $(this).parent("li").toggleClass("drop-active"))
    });
});