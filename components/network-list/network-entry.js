(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var component = require('gaia-component');
var ActionDialog = require('irc-action-dialog');
var ConfirmDialog = require('irc-confirm-dialog');
var GaiaButton = require('gaia-button');

var props = {};

var baseUrl = '/components/network-list/';

props.created = function() {
  this.setupShadowRoot();

  this.els = {};
  this.els.inner = this.shadowRoot.querySelector('.inner');
  this.els.network = this.shadowRoot.querySelector('.network');
  this.els.networkName = this.shadowRoot.querySelector('.network-name');
  this.els.channelList = this.shadowRoot.querySelector('.channel-list');
  this.els.channelWrapper = this.shadowRoot.querySelector('.channel-wrapper');

  this.name = this.getAttribute('name');

  var style = document.createElement('style');
  style.setAttribute('scoped', '');
  style.innerHTML = '@import url(' + baseUrl + 'network-entry.css);';
  this.shadowRoot.appendChild(style);

  this.registerListenerHeight();
  addLongPressListener(this.els.network,
      this.toggle.bind(this), this.showDialog.bind(this));
};

props.registerListenerHeight = function() {
  var self = this;
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type !== 'childList') { return; }
      self.updateActualHeight();
    });
  });
  observer.observe(this, {childList: true});
  window.addEventListener('load', this.updateActualHeight.bind(this));
};

props.attrs = {
  collapsed: {
    get: function() {
      return this.hasAttribute('collapsed');
    },
    set: function(value) {
      value = !!(value === '' || value);
      if (value) {
        this.setAttribute('collapsed', '');
        this.els.inner.setAttribute('collapsed', '');
      } else {
        this.removeAttribute('collapsed');
        this.els.inner.removeAttribute('collapsed');
      }
    }
  },
  name: {
    get: function() {
      return this.getAttribute('name');
    },
    set: function(value) {
      this.setAttribute('name', value);
      this.els.networkName.innerHTML = value;
    }
  }
};

props.updateActualHeight = function() {
  var height = this.els.channelWrapper.clientHeight;
  this.els.channelList.style.setProperty('--actual-height', height);
};

props.toggle = function () {
  this.collapsed = !this.collapsed;
};

props.showDialog = function() {
  var self = this;
  var dialog = new ActionDialog();
  var closeDialog = dialog.close.bind(dialog);
  var closeDialogDelayed = window.setTimeout.bind(window, closeDialog, 200);

  var header = document.createElement('h1');
  header.innerHTML = this.getAttribute('name');
  dialog.appendChild(header);

  var connectButton = new GaiaButton();
  connectButton.innerHTML = 'Connect';
  connectButton.setAttribute('recommend', '');
  connectButton.addEventListener('click', closeDialog);
  dialog.appendChild(connectButton);

  var showButton = new GaiaButton();
  showButton.innerHTML = 'Show';
  showButton.addEventListener('click', closeDialog);
  showButton.addEventListener('click', this.show.bind(this));
  dialog.appendChild(showButton);

  var addChannelButton = new GaiaButton();
  addChannelButton.innerHTML = 'Add Channel';
  addChannelButton.addEventListener('click',
      this.network.addChannel.bind(this.network));
  addChannelButton.addEventListener('click', closeDialogDelayed);
  dialog.appendChild(addChannelButton);

  var editButton = new GaiaButton();
  editButton.innerHTML = 'Edit';
  editButton.addEventListener('click', function() {
    dialog.style.zIndex = 5;
    self.network.openConfig();
    closeDialogDelayed();
  });
  dialog.appendChild(editButton);

  var deleteButton = new GaiaButton();
  deleteButton.innerHTML = 'Delete';
  deleteButton.setAttribute('danger', '');
  deleteButton.addEventListener('click', this.confirmDeleteNetwork.bind(this));
  deleteButton.addEventListener('click', closeDialogDelayed);
  dialog.appendChild(deleteButton);

  document.body.appendChild(dialog);
};

props.confirmDeleteNetwork = function() {
  var networkName = this.getAttribute('name');

  var dialog = new ConfirmDialog();

  var header = document.createElement('h1');
  header.innerHTML = 'Delete ' + networkName;
  dialog.appendChild(header);

  var text = document.createElement('p');
  text.innerHTML = 'The network ' + networkName + ' and all of its settings ' +
      'will be deleted.';
  dialog.appendChild(text);

  dialog.els.confirmButton.addEventListener('click',
      this.network.delete.bind(this.network));

  document.body.appendChild(dialog);
};

props.show = function() {
  document.querySelector('gaia-drawer').close();
};

props.template = `
  <div class="inner">
    <p class="network">
      <span class="collapse-indicator">&#9660;</span>
      <span class="network-name"></span>
      <span class="counter">42</span>
    </p>
    <div class="channel-list">
      <div class="channel-wrapper">
        <content></content>
      </div>
    </div>
  </div>
`;

module.exports = component.register('irc-network-entry', props);

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('irc-network-entry',this));
