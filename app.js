window.addEventListener("load", function() {
  console.log("Hello World!");
  // localStorage.theme = "communications";
});

var header = document.querySelector("gaia-header");
var drawer = document.querySelector("gaia-drawer");
header.addEventListener('action', function() {
  drawer.toggle();
});
