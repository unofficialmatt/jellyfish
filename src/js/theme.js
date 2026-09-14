/**
 * Theme (dark / light) control.
 *
 * Precedence: the visitor's stored choice, then the site's declared default,
 * then the OS.
 *
 *   localStorage "jf-theme": "dark" | "light" | "system" | absent
 *     The visitor's choice. "system" is an explicit "follow my OS" and outranks
 *     the site default; absent means they haven't chosen.
 *   <html data-default-theme="dark|light|system">
 *     The site's default, used when nothing is stored. "dark" / "light" ignore
 *     the OS entirely; "system" (or no attribute) leaves it to the OS.
 *
 * Public API: window.JellyfishTheme.get() / .set('dark'|'light'|'system') / .toggle()
 * Controls: any [data-theme-toggle] (toggles) or [data-theme-set="dark|light|system"].
 * Event: "jfThemeChange" on <html>, detail: { theme: 'dark' | 'light' }.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "jf-theme";
  var root = document.documentElement;
  var mq = window.matchMedia("(prefers-color-scheme: dark)");

  function stored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  // The site's declared default. Anything but "dark" / "light" means the OS.
  function siteDefault() {
    var value = root.getAttribute("data-default-theme");
    return value === "dark" || value === "light" ? value : null;
  }

  // The resolved theme actually in effect right now.
  function current() {
    var pref = stored();
    if (pref === "dark" || pref === "light") {
      return pref;
    }
    // "system" is the visitor explicitly asking for the OS, so it skips the
    // site default. Nothing stored falls through to it.
    if (pref !== "system") {
      var declared = siteDefault();
      if (declared) {
        return declared;
      }
    }
    return mq.matches ? "dark" : "light";
  }

  // Write the class from an explicit preference (or null to follow the OS).
  function apply(pref) {
    root.classList.remove("jf-dark", "jf-light");
    if (pref === "dark" || pref === "light") {
      root.classList.add("jf-" + pref);
    }
    root.dispatchEvent(
      new CustomEvent("jfThemeChange", { detail: { theme: current() } }),
    );
  }

  function osClass() {
    return siteDefault() ? (mq.matches ? "dark" : "light") : null;
  }

  function set(pref) {
    var explicit = pref === "dark" || pref === "light";
    try {
      localStorage.setItem(STORAGE_KEY, explicit ? pref : "system");
    } catch (e) {
      // no persistence available — the class still applies for this page
    }
    apply(explicit ? pref : osClass());
  }

  function toggle() {
    set(current() === "dark" ? "light" : "dark");
  }

  mq.addEventListener("change", function () {
    var pref = stored();
    if (pref === "dark" || pref === "light") {
      return; // an explicit choice ignores the OS
    }
    if (pref === "system" || !siteDefault()) {
      apply(osClass());
    }
  });

  // Delegated control wiring.
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-theme-toggle], [data-theme-set]");
    if (!el) {
      return;
    }
    e.preventDefault();
    if (el.hasAttribute("data-theme-set")) {
      var value = el.getAttribute("data-theme-set");
      set(value === "dark" || value === "light" ? value : null);
    } else {
      toggle();
    }
  });

  // Reflect state onto toggle buttons for styling / assistive tech.
  root.addEventListener("jfThemeChange", function (e) {
    var isDark = e.detail.theme === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(isDark));
    });
  });

  window.JellyfishTheme = { get: current, set: set, toggle: toggle };

  // Reconcile the class with stored state on load (covers pages without the
  // inline pre-paint snippet) and fire the initial event. With nothing stored
  // there's nothing to stamp — the CSS already resolves the default and the OS.
  var initial = stored();
  apply(
    initial === "dark" || initial === "light"
      ? initial
      : initial === "system"
        ? osClass()
        : null,
  );
})();
