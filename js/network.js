(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var GaiaToast = require('gaia-toast');
var Prompt = require('irc-prompt');
var NetworkConfig = require('irc-network-config');
var NetworkEntry = require('irc-network-entry');
var Channel = require('irc-channel');
var ChannelEntry = require('irc-channel-entry');

var networkList = document.querySelector('#network-list');

var Network = function() {
  this.listEntry = new NetworkEntry();
  this.listEntry.network = this;
  this.channels = {};
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

Network.prototype.addChannel = function() {
  var prompt = new Prompt();
  prompt.innerHTML = '<h1>Add a channel</h1>' +
      '<p>Add a channel to network ' + this.name + '.';
  document.body.appendChild(prompt);
  prompt.els.okButton.addEventListener('click',
      this.addChannelCB.bind(this, prompt));
};

Network.prototype.addChannelCB = function (prompt) {
  // TODO: forbid empty and malformed channel names
  var name = prompt.value;
  if (this.channels[name]) {
    toast('Channel ' + name + ' already exists.');
    return;
  }
  var channel = new Channel(name);
  this.channels[name] = channel;
  var entry = new ChannelEntry();
  entry.innerHTML = name;
  this.listEntry.appendChild(entry);
  prompt.close();
};

document.querySelector('#add-network-button')
    .addEventListener('click', function() {
      var network = new Network();
      network.openConfig();
    });


var toast = function (text) {
  var toast = new GaiaToast();
  toast.innerHTML = text;
  toast.timeout = 2000;
  document.body.appendChild(toast);
  toast.show();
  window.setTimeout(toast.remove.bind(toast), 3000);
};

module.exports = Network;

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('irc-network',this));
