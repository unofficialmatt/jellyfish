/**
 * Lazy Load of BG Images
 * Forked from @link https://web.dev/lazy-loading-images/
 * TODO: Add Documentation
 */

function jfLazyLoadBackgroundImage(element) {
  var bgImage = element.getAttribute('data-bg-img');
  element.style.backgroundImage = "url(" + bgImage + ")";
  element.removeAttribute('data-bg-img');
}
document.addEventListener("DOMContentLoaded", function () {
  var lazyBackgroundElements = [].slice.call(document.querySelectorAll(".has-bg-img"));

  if ("IntersectionObserver" in window) {
    let lazyBackgroundObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          jfLazyLoadBackgroundImage(entry.target);
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px 300px 0px" }); // Pre-empt by loading 300px early

    lazyBackgroundElements.forEach(function (lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  }
  else {
    // For browsers that don't support intersection observer, load all images straight away
    lazyBackgroundElements.forEach(function (lazyBackground) {
      jfLazyLoadBackgroundImage(lazyBackground);
    });
  }
});
