(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var component = require('gaia-component');
var ActionDialog = require('irc-action-dialog');
var ConfirmDialog = require('irc-confirm-dialog');
var GaiaButton = require('gaia-button');

const TOUCH_MOVE_THRESH = 10; // virtual pixels
const LONG_PRESS_TIME = 200;  // ms

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
  style.innerHTML = '@import url(' + baseUrl + 'network-list-entry.css);';
  this.shadowRoot.appendChild(style);

  this.registerListenerHeight();
  this.registerListenerTouch();
};

props.registerListenerHeight = function() {
  // var self = this;
  // var observer = new MutationObserver(function(mutations) {
  //   mutations.forEach(function(mutation) {
  //     if (mutation.type !== 'childList') { return; }
  //     self.updateActualHeight.bind(self);
  //   });
  // });
  // observer.observe(this.els.channelWrapper, {childList: true});
  window.addEventListener('load', this.updateActualHeight.bind(this));
};

props.registerListenerTouch = function() {
  /* hack to get long press events */
  var self = this;
  var pressing;
  var pressTimer;
  var touchX;
  var touchY;
  var mouseDisabled;

  var down = function() {
    pressing = true;
    pressTimer = window.setTimeout(function() {
      pressing = false;
      self.showDialog();
    }, LONG_PRESS_TIME);
  };

  var up = function() {
    if (pressing) {
      pressing = false;
      clearTimeout(pressTimer);
      self.toggle();
    }
  };

  var ignoreMouseEvents = function() {
    if (!mouseDisabled) {
      self.els.network.removeEventListener('mousedown', down);
      self.els.network.removeEventListener('mouseup', up);
      mouseDisabled = true;
    }
  };

  self.els.network.addEventListener('mousedown', down);
  self.els.network.addEventListener('mouseup', up);

  self.els.network.addEventListener('touchstart', function(evt) {
    ignoreMouseEvents();
    touchX = evt.changedTouches[0].screenX;
    touchY = evt.changedTouches[0].screenY;
    down();
  });

  self.els.network.addEventListener('touchend', function(evt) {
    evt.preventDefault();
    up();
  });

  self.els.network.addEventListener('touchmove', function(evt) {
    if (Math.abs(evt.changedTouches[0].screenX - touchX) >
          TOUCH_MOVE_THRESH ||
        Math.abs(evt.changedTouches[0].screenY - touchY) >
          TOUCH_MOVE_THRESH) {
      clearTimeout(pressTimer);
      pressing = false;
    }
  });
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
  var dialog = new ActionDialog();

  var header = document.createElement('h1');
  header.innerHTML = this.getAttribute('name');
  dialog.appendChild(header);

  var connectButton = new GaiaButton();
  connectButton.innerHTML = 'Connect';
  connectButton.setAttribute('recommend', '');
  dialog.appendChild(connectButton);

  var showButton = new GaiaButton();
  showButton.innerHTML = 'Show';
  showButton.addEventListener('click', this.show.bind(this));
  dialog.appendChild(showButton);

  var editButton = new GaiaButton();
  editButton.innerHTML = 'Edit';
  editButton.addEventListener('click', this.network.openConfig.bind(this.network));
  dialog.appendChild(editButton);

  var deleteButton = new GaiaButton();
  deleteButton.innerHTML = 'Delete';
  deleteButton.setAttribute('danger', '');
  deleteButton.addEventListener('click', this.confirmDeleteNetwork.bind(this));
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
  text.innerHTML = 'The Network ' + networkName + ' and all of its settings ' +
      'will be deleted.';
  dialog.appendChild(text);

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

module.exports = component.register('irc-network-list-entry', props);

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('irc-network-list-entry',this));
