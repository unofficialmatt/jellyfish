/**
 * User text-size preference. Any `<button data-font-size="smaller|default|
 * larger|largest">` sets the matching `.font-size-*` class on <html> (a
 * relative multiplier on --jf-root-font-size — consumed on <html>, so the
 * rem-based type scale scales with it). "default" = no class. The choice is
 * stored in localStorage under "jf-font-size". Delegated, CSP-safe.
 */
(function () {
  var STORAGE_KEY = "jf-font-size";
  var VALID = ["smaller", "default", "larger", "largest"];
  var CLASSES = ["smaller", "larger", "largest"]; // "default" adds no class

  function apply(size) {
    var root = document.documentElement;
    CLASSES.forEach(function (c) {
      root.classList.toggle("font-size-" + c, c === size);
    });
    document.querySelectorAll("button[data-font-size]").forEach(function (btn) {
      btn.setAttribute(
        "aria-pressed",
        String(btn.getAttribute("data-font-size") === size)
      );
    });
  }

  function setRootFontSize(size) {
    if (VALID.indexOf(size) === -1) size = "default";
    apply(size);
    try {
      localStorage.setItem(STORAGE_KEY, size);
    } catch (e) {
      /* private mode / storage disabled */
    }
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("button[data-font-size]");
    if (trigger) setRootFontSize(trigger.getAttribute("data-font-size"));
  });

  document.addEventListener("DOMContentLoaded", function () {
    var stored;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    apply(VALID.indexOf(stored) !== -1 ? stored : "default");
  });

  // Exposed for script callers.
  window.setRootFontSize = setRootFontSize;
})();
