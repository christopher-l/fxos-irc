(function(define){define(function(require,exports,module){
'use strict';

var proto = Object.create(HTMLElement.prototype);

var baseUrl = '/components/network-list-entry/';

proto.createdCallback = function() {
  var self = this;
  var tmpl = template.content.cloneNode(true);
  var shadow = this.createShadowRoot();

  this.els = {};
  this.els.inner = tmpl.querySelector('.inner');
  this.els.network = tmpl.querySelector('.network');
  this.els.channelList = tmpl.querySelector('.channel-list');
  this.els.channelWrapper = tmpl.querySelector('.channel-wrapper');

  this.els.network.onclick = this.toggle.bind(this);

  shadow.appendChild(tmpl);

  var style = document.createElement('style');
  style.setAttribute('scoped', '');
  style.innerHTML = '@import url(' + baseUrl + 'style.css);';
  shadow.appendChild(style);

  // var observer = new MutationObserver(function(mutations) {
  //   mutations.forEach(function(mutation) {
  //     if (mutation.type !== 'childList') { return; }
  //     self.updateActualHeight.bind(self);
  //   });
  // });
  // observer.observe(this.els.channelWrapper, {childList: true});

  window.addEventListener('load', this.updateActualHeight.bind(this));
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
  if (value == false) { return this.expand(); }
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

var template = document.createElement('template');
template.innerHTML = `
  <div class="inner">
    <p class="network">
      <span class="collapse-indicator">&#9660;</span>
      <span class="network-name"><content select="span"></content></span>
      <span class="counter"></span>
    </p>
    <div class="channel-list">
      <div class="channel-wrapper">
        <content></content>
      </div>
    </div>
  </div>
`;

module.exports = document.registerElement('network-list-entry', { prototype: proto });

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('network-list-entry',this));
