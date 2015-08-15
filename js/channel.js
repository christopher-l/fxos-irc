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

Object.defineProperty(Channel.prototype, 'name', {
  get: function() { return this._name; },
  set: function(value) {
    if (this._name) { delete this.network.channels[this._name]; }
    this._name = value;
  }
});

Channel.prototype.update = function() {
  if (this.name) { delete this.network.channels[this.name]; }
  this.network.channels[this.name] = this;
  this.entry.name = this.name;
};

Channel.prototype.setup = function() {
  this.entry = new ChannelEntry();
  this.entry.channel = this;
  this.network.listEntry.appendChild(this.entry);
};

Channel.prototype.remove = function() {
  delete this.network.channels[this.name];
  this.entry.remove();
};

module.exports = Channel;

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('irc-channel',this));
