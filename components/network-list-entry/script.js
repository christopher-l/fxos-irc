(function(define){define(function(require,exports,module){
'use strict';

var proto = Object.create(HTMLElement.prototype);

var baseUrl = '/components/network-list-entry/';

proto.createdCallback = function() {
  var tmpl = template.content.cloneNode(true);
  var shadow = this.createShadowRoot();

  this.els = {};
  this.els.inner = tmpl.querySelector('.inner');
  this.els.channelList = tmpl.querySelector('.channel-list');
  this.els.channelWrapper = tmpl.querySelector('.channel-wrapper');
  this.collapse();

  shadow.appendChild(tmpl);

  var style = document.createElement('style');
  style.setAttribute('scoped', '');
  style.innerHTML = '@import url(' + baseUrl + 'style.css);';
  shadow.appendChild(style);
};

proto.attributeChangedCallback = function(attr, oldVal, newVal) {
  if (attr == 'collapsed') {
    this.collapse(newVal !== null);
  }
};

proto.collapse = function(value) {
  if (value == false) { return this.expand(); }
  var height = this.els.channelWrapper.clientHeight;
  this.els.channelList.style.height = '0px';
  this.els.channelList.style.zIndex = '0';
  this.els.channelList.style.transform = 'translateY(-' + height + 'px)';
  this.els.inner.setAttribute('collapsed', '');
  if (!this.hasAttribute('collapsed')) { this.setAttribute('collapsed', ''); }
};

proto.expand = function() {
  var height = this.els.channelWrapper.clientHeight;
  this.els.channelList.style.height = height + 'px';
  this.els.channelList.style.zIndex = '';
  this.els.channelList.style.transform = '';
  this.els.inner.removeAttribute('collapsed');
  if (this.hasAttribute('collapsed')) { this.removeAttribute('collapsed'); }
};

proto.toggle = function () {
  this.collapse(!this.hasAttribute('collapsed'));
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
