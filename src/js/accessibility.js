function changeRootFontSize(fontSize) {
  document.body.classList.remove(
    "font-size-sm",
    "font-size-md",
    "font-size-lg"
  );
  document.body.classList.add("font-size-" + fontSize);

  var fontButtons = document.querySelectorAll("button.font-size");

  fontButtons.forEach(function (button) {
    button.classList.remove("active");
  });

  var activeButton = document.querySelector("button.font-size-" + fontSize);
  if (activeButton) {
    activeButton.classList.add("active");
  }

  jfSetCookie("fontsize", fontSize);
}

document.addEventListener("DOMContentLoaded", function () {
  /**
   * Function to allow the user to change the root font-size to increase legibility.
   */
  var fontButtons = document.querySelectorAll("button.font-size");

  fontButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var fontSize = button.classList.contains("font-size-sm")
        ? "sm"
        : button.classList.contains("font-size-md")
        ? "md"
        : button.classList.contains("font-size-lg")
        ? "lg"
        : null;

      if (fontSize) {
        changeRootFontSize(fontSize);
      }
    });
  });

  /**
   * Check for Accessibility cookies 'fontsize' and 'ui-mode' on document ready.
   * Append appropriate classes to body element.
   */
  var docFontSize = jfGetCookie("fontsize");
  switch (docFontSize) {
    case "sm":
      changeRootFontSize("sm");
      break;
    case "md":
      changeRootFontSize("md");
      break;
    case "lg":
      changeRootFontSize("lg");
      break;
    default:
      break;
  }
});
