(function ($) {
  /**
   * Function to allow the user to change the root font-size to increase legibility.
   */
  $("button.font-size").click(function () {
    if ($(this).hasClass("font-size-sm")) {
      $(document.body)
        .removeClass("font-size-md font-size-lg")
        .addClass("font-size-sm");
      $("button.font-size").removeClass("active");
      $(this).addClass("active");
      jfSetCookie("fontsize", "sm");
    } else if ($(this).hasClass("font-size-md")) {
      $(document.body)
        .removeClass("font-size-sm font-size-lg")
        .addClass("font-size-md");
      $("button.font-size").removeClass("active");
      $(this).addClass("active");
      jfSetCookie("fontsize", "md");
    } else if ($(this).hasClass("font-size-lg")) {
      $(document.body)
        .removeClass("font-size-sm font-size-md")
        .addClass("font-size-lg");
      $("button.font-size").removeClass("active");
      $(this).addClass("active");
      jfSetCookie("fontsize", "lg");
    }
  });

  /**
   * Check for Accessibility cookies 'fontsize' and 'ui-mode' on document ready. Append appropriate classes to body element
   */
  $(document).ready(function ($) {
    var docFontSize = jfGetCookie("fontsize");
    switch (docFontSize) {
      case "sm":
        $(document.body)
          .removeClass("font-size-md font-size-lg")
          .addClass("font-size-sm");
        $("button.font-size").removeClass("active");
        $("button.font-size-sm").addClass("active");
        break;
      case "md":
        $(document.body)
          .removeClass("font-size-sm font-size-lg")
          .addClass("font-size-md");
        $("button.font-size").removeClass("active");
        $("button.font-size-md").addClass("active");
        break;
      case "lg":
        $(document.body)
          .removeClass("font-size-md font-size-md")
          .addClass("font-size-lg");
        $("button.font-size").removeClass("active");
        $("button.font-size-lg").addClass("active");
        break;
      default:
        break;
    }
  });
})(jQuery);
