document.addEventListener("DOMContentLoaded", function () {
  var tables = document.querySelectorAll(".is-responsive");
  if (tables.length > 0) {
    // Loop through them
    for (var i = 0; i < tables.length; i++) {
      var thead = tables[i].querySelector("thead");
      var tbody = tables[i].querySelector("tbody");
      if (thead && tbody) {
        // Get the innerhtml of all th elements inside the thead into an array
        var ths = thead.querySelectorAll("th");
        var thsArray = [];
        for (var j = 0; j < ths.length; j++) {
          thsArray.push(ths[j].innerHTML);
        }
        if (thsArray.length > 0) {
          // Loop through all tr elements inside the tbody
          var trs = tbody.querySelectorAll("tr");
          for (var k = 0; k < trs.length; k++) {
            // Loop through all td elements inside the tr
            var tds = trs[k].querySelectorAll("td");
            for (var l = 0; l < tds.length; l++) {
              // Add the th innerhtml as a data attribute to the td
              tds[l].setAttribute("data-label", thsArray[l]);
            }
          }
        }
      }
    }
  }
});
