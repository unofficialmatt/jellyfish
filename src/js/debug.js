function jfDebug() {
  // Trigger debug mode by applying .jf-debug to document
  var docBody = document.getElementsByTagName("body")[0];
  docBody.classList.toggle("jf-debug");
}
