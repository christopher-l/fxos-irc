(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

/*
 * The object representing a channel is defined here.
 */

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
    this._name = value;
  }
});

Channel.prototype.update = function() {
  this.entry.remove();
  this.entry.name = this.name;
  var channels = this.network.channels;
  channels.sort(function(a, b) {
    if (a.name < b.name) { return -1; }
    else if (a.name > b.name) { return 1; }
    else { return 0; }
  });
  var pos = channels.indexOf(this);
  if (pos + 1 === channels.length) {
    this.network.listEntry.appendChild(this.entry);
  } else {
    this.network.listEntry.insertBefore(this.entry, channels[pos+1].entry);
  }
};

Channel.prototype.setup = function() {
  this.network.channels.push(this);
  this.entry = new ChannelEntry();
  this.entry.channel = this;
  this.network.listEntry.appendChild(this.entry);
};

Channel.prototype.remove = function() {
  var pos = this.network.channels.indexOf(this);
  this.network.channels.splice(pos, 1);
  this.entry.remove();
};

module.exports = Channel;

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('irc-channel',this));
