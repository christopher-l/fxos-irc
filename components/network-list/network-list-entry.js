(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var Dialog = require('irc-dialog');
var GaiaButton = require('gaia-button');

const TOUCH_MOVE_THRESH = 10; // virtual pixels
const LONG_PRESS_TIME = 200;  // ms

var proto = Object.create(HTMLElement.prototype);

var baseUrl = '/components/network-list/';
var name = 'network-list-entry';

proto.createdCallback = function() {
  var tmpl = template.content.cloneNode(true);
  var shadow = this.createShadowRoot();

  this.els = {};
  this.els.inner = tmpl.querySelector('.inner');
  this.els.network = tmpl.querySelector('.network');
  this.els.channelList = tmpl.querySelector('.channel-list');
  this.els.channelWrapper = tmpl.querySelector('.channel-wrapper');

  shadow.appendChild(tmpl);

  var style = document.createElement('style');
  style.setAttribute('scoped', '');
  style.innerHTML = '@import url(' + baseUrl + name + '.css);';
  shadow.appendChild(style);

  this.registerListenerHeight();
  this.registerListenerTouch();
};

proto.registerListenerHeight = function() {
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

proto.registerListenerTouch = function() {
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

  self.els.network.addEventListener('touchend', up);

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

proto.attributeChangedCallback = function(attr, oldVal, newVal) {
  if (attr == 'collapsed') {
    this.collapse(newVal !== null);
  }
};

proto.updateActualHeight = function() {
  var height = this.els.channelWrapper.clientHeight;
  this.els.channelList.style.setProperty('--actual-height', height);
};

/*
 * @private
 */
proto.collapse = function(value) {
  if (value === false) { return this.expand(); }
  this.els.inner.setAttribute('collapsed', '');
};

/*
 * @private
 */
proto.expand = function() {
  this.els.inner.removeAttribute('collapsed');
};

proto.toggle = function () {
  if (this.hasAttribute('collapsed')) {
    this.removeAttribute('collapsed');
  } else {
    this.setAttribute('collapsed', '');
  }
};

proto.showDialog = function () {
  var dialog = new Dialog();
  // var showButton = new GaiaButton();
  document.body.appendChild(dialog);
  window.setTimeout(dialog.open.bind(dialog), 0);
};

var template = document.createElement('template');
template.innerHTML = `
  <div class="inner">
    <p class="network">
      <span class="collapse-indicator">&#9660;</span>
      <span class="network-name"><content select="span"></content></span>
      <span class="counter">42</span>
    </p>
    <div class="channel-list">
      <div class="channel-wrapper">
        <content></content>
      </div>
    </div>
  </div>
`;

module.exports = document.registerElement('irc-network-list-entry', { prototype: proto });

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('irc-network-list-entry',this));
