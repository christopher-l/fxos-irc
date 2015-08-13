(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var NetworkConfig = require('irc-network-config');
var NetworkEntry = require('irc-network-entry');

var networkList = document.querySelector('#network-list');

var Network = function() {
  this.listEntry = new NetworkEntry();
  this.listEntry.network = this;
};

Network.prototype.openConfig = function () {
  var config = new NetworkConfig(this);
  config.open();
};

Network.prototype.updateListEntry = function () {
  this.listEntry.name = this.name;
};

Network.prototype.appendListEntry = function () {
  networkList.appendChild(this.listEntry);
};

Network.prototype.delete = function () {
  this.listEntry.remove();
};

document.querySelector('#add-network-button')
    .addEventListener('click', function() {
      var network = new Network();
      network.openConfig();
    });

module.exports = Network;

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('irc-network',this));
