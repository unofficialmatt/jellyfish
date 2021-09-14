/**
 * Creates a cookie
 * @param {string} name
 * @param {string} value
 * @param {number} days before expiry (optional)
 */
function jfSetCookie(name, value, days) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = ";expires=" + date.toUTCString();
  }
  else {
    expires = "";
  }
  // Sets the cookie site-wide with path=/
  document.cookie = name + "=" + encodeURIComponent(value) + expires + ";path=/";
}

/**
 * Reads and returns the value of a cookie
 * @param {string} cookiename
 */
function jfGetCookie(cookiename) {
  var name = cookiename + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Destroys a cookie
 */
function jfDestroyCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
