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
            // Loop through all td/th cells inside the tr, in document order —
            // a row using <th scope="row"> for its first column needs its
            // label too, and dropping it would also shift every td's index
            // out of alignment with thsArray.
            var cells = trs[k].querySelectorAll("td, th");
            for (var l = 0; l < cells.length; l++) {
              // Add the thead th innerhtml as a data attribute to the cell
              cells[l].setAttribute("data-label", thsArray[l]);
            }
          }
        }
      }
    }
  }
});
