window.addEventListener('load', function() {
  console.log('Hello World!');
  // localStorage.theme = "communications";
});

var header = document.querySelector('gaia-header');
var drawer = document.querySelector('gaia-drawer');
header.addEventListener('action', function() {
  drawer.toggle();
});

drawer.addEventListener('DOMAttrModified', function (event) {
  if (event.attrName !== 'open') { return; }
  var button = header.querySelector('button');
  if (event.attrChange === 2) { // open drawer
    // button.style.visibility = 'hidden';
    button.style.opacity = 0;
  } else if (event.attrChange === 3) { // close drawer
    // button.style.visibility = 'visible';
    button.style.opacity = 100;
  }
});
