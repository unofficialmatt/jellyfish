// Highlight on scroll modified from @link https://codepen.io/joxmar/pen/NqqMEg
var lastId,
topMenu = $("#navbar-sticky"),
topMenuHeight = topMenu.outerHeight()+1,
// All list items
menuItems = topMenu.find("a"),
// Anchors corresponding to menu items
scrollItems = menuItems.map(function(){
  var item = $($(this).attr("href"));
    if (item.length) { return item; }
});
// Bind click handler to menu items
// so we can get a fancy scroll animation
menuItems.click(function(e){
  var href = $(this).attr("href"),
      offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight-10;
  $('html, body').stop().animate({
      scrollTop: offsetTop
  }, 0);
  e.preventDefault();
});

// Bind to scroll
$(window).scroll(function(){
  // Get container scroll position
  var fromTop = $(this).scrollTop()+topMenuHeight+topMenuHeight;
  // Get id of current scroll item
  var cur = scrollItems.map(function(){
    if ($(this).offset().top < fromTop)
      return this;
  });
  // Get the id of the current element
  cur = cur[cur.length-1];
  var id = cur && cur.length ? cur[0].id : "";
  //console.log('lastID:'+lastId);
  //console.log('id:'+id);
  if (lastId !== id) {
      lastId = id;
      // Set/remove active class
      menuItems.removeClass("active");
      menuItems.parent().end().filter("[href=\\#"+id+"]").addClass("active");
  }
});
