(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

/*
 * To be used inside irc-network-entry.
 */

var component = require('gaia-component');
var ActionDialog = require('irc-action-dialog');
var ConfirmDialog = require('irc-confirm-dialog');
var GaiaButton = require('gaia-button');

var props = {};

var baseUrl = '/components/network-list/';

props.created = function(channel) {
  this.setupShadowRoot();

  this.els = {
    inner: this.shadowRoot.querySelector('.inner')
  };

  var style = document.createElement('style');
  style.setAttribute('scoped', '');
  style.innerHTML = '@import url(' + baseUrl + 'channel-entry.css);';
  this.shadowRoot.appendChild(style);

  addLongPressListener(this.els.inner,
      function() { this.channel.show(); },
      this.showDialog.bind(this));
};

props.attrs = {
  name: {
    get: function() { return this.innerHTML; },
    set: function(value) { this.innerHTML = value; }
  }
};

props.showDialog = function() {
  var self = this;
  var dialog = new ActionDialog();
  var closeDialog = dialog.close.bind(dialog);
  var closeDialogDelayed = window.setTimeout.bind(window, closeDialog, 200);

  var header = document.createElement('h1');
  header.innerHTML = '#' + this.name;
  dialog.appendChild(header);

  var joinButton = new GaiaButton();
  joinButton.innerHTML = 'Join';
  joinButton.setAttribute('recommend', '');
  joinButton.addEventListener('click', closeDialog);
  dialog.appendChild(joinButton);

  var showButton = new GaiaButton();
  showButton.innerHTML = 'Show';
  showButton.addEventListener('click', closeDialog);
  showButton.addEventListener('click', this.show.bind(this));
  dialog.appendChild(showButton);

  var editButton = new GaiaButton();
  editButton.innerHTML = 'Edit';
  editButton.addEventListener('click', function() {
    dialog.style.zIndex = 5;
    self.channel.openConfig();
    closeDialogDelayed();
  });
  dialog.appendChild(editButton);

  var removeButton = new GaiaButton();
  removeButton.innerHTML = 'Remove';
  removeButton.setAttribute('danger', '');
  removeButton.addEventListener('click',
      this.channel.remove.bind(this.channel));
  removeButton.addEventListener('click', closeDialog);
  dialog.appendChild(removeButton);

  document.body.appendChild(dialog);
};

props.show = function() {
  document.querySelector('gaia-drawer').close();
};

props.template = `
  <div class="inner">
    <span class="channel-name"><content></content></span>
    <span class="counter">23</span>
  </div>
`;

module.exports = component.register('irc-channel-entry', props);

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('irc-channel-entry',this));
