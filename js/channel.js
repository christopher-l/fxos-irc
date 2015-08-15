(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var ChannelConfig = require('irc-channel-config');
var ChannelEntry = require('irc-channel-entry');

var Channel = function(network) {
  this.network = network;
};

Channel.prototype.openConfig = function() {
  var config = new ChannelConfig(this);
  config.open();
};

Channel.prototype.updateName = function(name) {
  if (this.name) { delete this.network.channels[this.name]; }
  this.name = name;
  this.network.channels[name] = this;
  this.entry.innerHTML = name;
};

Channel.prototype.appendListEntry = function() {
  this.entry = new ChannelEntry();
  this.network.listEntry.appendChild(this.entry);
};

module.exports = Channel;

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('irc-channel',this));
