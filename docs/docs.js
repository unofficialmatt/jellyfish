jQuery(document).ready(function ($) {   
    $("#toggle-debug").click(function (e) {
        e.preventDefault();
        $("body").toggleClass('jf-debug');
    });
});