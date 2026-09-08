/**
 * Theme (dark / light) control.
 *
 * State lives in localStorage under "jf-theme": "dark" | "light" | absent.
 * Absent means follow the OS (prefers-color-scheme). The class .jf-dark /
 * .jf-light on <html> is what the CSS reads. Pages that care about a flash of
 * the wrong theme should also inline the tiny pre-paint snippet in <head>
 * (see getting-started.html) — it sets the class before first paint; this file
 * only needs to run once the DOM is up.
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

  // The resolved theme actually in effect right now.
  function current() {
    var pref = stored();
    if (pref === "dark" || pref === "light") {
      return pref;
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
      new CustomEvent("jfThemeChange", { detail: { theme: current() } })
    );
  }

  function set(pref) {
    var explicit = pref === "dark" || pref === "light";
    try {
      if (explicit) {
        localStorage.setItem(STORAGE_KEY, pref);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      // no persistence available — the class still applies for this page
    }
    apply(explicit ? pref : null);
  }

  function toggle() {
    set(current() === "dark" ? "light" : "dark");
  }

  // Follow the OS while no explicit preference is stored.
  mq.addEventListener("change", function () {
    if (!stored()) {
      apply(null);
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
  // inline pre-paint snippet) and fire the initial event.
  apply(stored());
})();
