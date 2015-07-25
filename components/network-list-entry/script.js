(function(define){define(function(require,exports,module){
'use strict';

var proto = Object.create(HTMLElement.prototype);

var baseUrl = '/components/network-list-entry/';

proto.createdCallback = function() {
  var tmpl = template.content.cloneNode(true);
  var shadow = this.createShadowRoot();
  shadow.appendChild(tmpl);

  var style = document.createElement('style');
  style.setAttribute('scoped', '');
  style.innerHTML = '@import url(' + baseUrl + 'style.css);';
  shadow.appendChild(style);
};

var template = document.createElement('template');
template.innerHTML = `
  <div class="inner">
    <span class="collapse-indicator">&#9660;</span>
    <p class="network">
      <span class="network-name"><content select="span"></content></span>
      <span class="counter"></span>
    </p>
    <div class="channel-list">
      <content></content>
    </div>
  </div>
`;

module.exports = document.registerElement('network-list-entry', { prototype: proto });

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('network-list-entry',this));
