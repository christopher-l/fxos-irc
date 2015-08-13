/*jshint esnext:true*/
var require = function(name) {
  return this[name];
};

window.addEventListener('load', function() {
  console.log('Hello World!');
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

var Network = require('irc-network');
var net = new Network();
net.name = 'foo';
net.server = 'bar';
net.nick = 'baz';
net.appendListEntry();
net.updateListEntry();
