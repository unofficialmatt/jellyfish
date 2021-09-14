/**
 * Send interaction events to Google Analytics
 * TODO: Add Documentation
 */
(function ($) {
  if (typeof gtag == "function") {
    // Send mailto: events
    $('a[href^="mailto:"]').click(function () {
      gtag("event", "contact", {
        event_category: "Email Enquiry",
        event_action: "Mailto Click",
        event_label: $(this).attr("href"),
      });
      return true;
    });

    // Send tel: events
    $('a[href^="tel:"]').click(function () {
      gtag("event", "contact", {
        event_category: "Telephone Enquiry",
        event_action: "Tel Link Click",
        event_label: $(this).attr("href"),
      });
      return true;
    });

    // Send *.pdf download events
    $('a[href$=".pdf"]').click(function () {
      gtag("event", "contact", {
        event_category: "PDF Download",
        event_action: "Download",
        event_label: $(this).attr("href"),
      });
      return true;
    });

    // Send external link clicks
    $(
      "a:not([href*='" +
      document.domain +
      "'],[href*='mailto'],[href*='tel'],a[href$='.pdf'])"
    ).click(function (event) {
      // Prevent # and javascript links being sent
      if (
        $(this).attr("href").charAt(0) != "#" &&
        !$(this).attr("href").startsWith("javascript")
      ) {
        gtag("event", "contact", {
          event_category: "External Link",
          event_action: "Link Click",
          event_label: $(this).attr("href"),
        });
        return true;
      }
    });
  }
})(jQuery);
