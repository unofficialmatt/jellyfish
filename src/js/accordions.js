/**
 * Accordion enhancement layer.
 *
 * Accordions are native <details> / <summary> — open/close, keyboard and ARIA
 * need no script. This file only adds two conveniences:
 *
 *  1. Analytics — on every toggle it pushes `accordionOpened` /
 *     `accordionClosed` to the GTM dataLayer (a no-op unless the page already
 *     has GTM) and fires a matching `jfAccordionOpened` / `jfAccordionClosed`
 *     CustomEvent on `document`. Mirrors the modal `modalOpened` pushes.
 *
 *  2. Deep linking — opens the item a URL fragment points into, on same-page
 *     link clicks and on load / hashchange / back-forward. Chromium already
 *     does this (and find-in-page, and `#:~:text=` scroll-to-text) for
 *     <details> natively; this covers Firefox and Safari for plain `#id`.
 */
(function () {
  "use strict";

  function itemTitle(details) {
    if (details.dataset.title) return details.dataset.title.trim();
    var summary = details.querySelector("summary");
    return summary ? summary.textContent.trim() : "";
  }

  function report(details) {
    var isOpen = details.open;
    var detail = {
      id: details.id || "",
      title: itemTitle(details),
      open: isOpen,
    };

    document.dispatchEvent(
      new CustomEvent(isOpen ? "jfAccordionOpened" : "jfAccordionClosed", {
        detail: detail,
      }),
    );

    console.log(detail);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: isOpen ? "accordionOpened" : "accordionClosed",
      accordionId: detail.id ? "#" + detail.id : "",
      accordionTitle: detail.title,
    });
  }

  function elementFor(hash) {
    if (!hash || hash === "#") return null;
    try {
      return document.querySelector(hash);
    } catch (e) {
      return null; // not a valid selector
    }
  }

  // Open the enclosing accordion item and scroll it into view. We scroll the
  // <details> itself, not the fragment target: the target may sit inside the
  // still-`content-visibility: hidden` panel (scrollIntoView there is a no-op
  // until the flip resolves a frame later), whereas the <details> is always
  // visible and its top edge (the summary) doesn't move as the panel expands.
  function reveal(target) {
    var details = target.closest("details.accordion-item");
    if (!details) {
      target.scrollIntoView({ block: "start" });
      return;
    }
    details.open = true;
    details.scrollIntoView({ block: "start" });
  }

  // Intercept same-page fragment clicks so we open before the browser scrolls
  // (its default jumps to the still-collapsed panel). Works even when the hash
  // is already current, which fires no hashchange.
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    var link = e.target.closest('a[href*="#"]');
    if (!link || link.pathname !== location.pathname || link.host !== location.host) {
      return;
    }

    var target = elementFor(link.hash);
    if (!target || !target.closest("details.accordion-item")) return;

    e.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, "", link.hash);
    reveal(target);
  });

  // Cold load with a fragment, manual URL edit, back / forward.
  function revealFromHash() {
    var target = elementFor(location.hash);
    if (target && target.closest("details.accordion-item")) reveal(target);
  }
  window.addEventListener("hashchange", revealFromHash);

  document.addEventListener("DOMContentLoaded", function () {
    document
      .querySelectorAll("details.accordion-item")
      .forEach(function (details) {
        details.addEventListener("toggle", function () {
          report(details);
        });
      });

    revealFromHash();
  });
})();
