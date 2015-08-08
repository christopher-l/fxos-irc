var require = function(name) {
  return this[name];
};

var Settings = require('irc-settings');

window.addEventListener('load', function() {
  console.log('Hello World!');
  // localStorage.theme = "communications";
});

var header = document.querySelector('gaia-header');
var drawer = document.querySelector('gaia-drawer');
header.addEventListener('action', function() {
  drawer.toggle();
});

new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type !== 'attributes' || mutation.attributeName !== 'open') {
      return;
    }
    var isOpen = drawer.hasAttribute('open');
    var button = header.querySelector('button');
    if (isOpen) {
      button.style.opacity = 0;
    } else {
      button.style.opacity = 100;
    }
  });
}).observe(drawer, {attributes: true});

drawer.querySelector('#settings-button').addEventListener('click', function() {
  var settings = new Settings();
  document.body.appendChild(settings);
});
