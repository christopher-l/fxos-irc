(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var NetworkConfig = require('irc-network-config');

var Network = function() {
};

Network.prototype.openConfig = function () {
  var config = new NetworkConfig(this);
  config.open();
};

module.exports = Network;

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('irc-network',this));
