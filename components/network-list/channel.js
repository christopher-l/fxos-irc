(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var proto = Object.create(HTMLElement.prototype);

var baseUrl = '/components/network-list/';
var component = 'channel';

proto.createdCallback = function() {
  var tmpl = template.content.cloneNode(true);
  var shadow = this.createShadowRoot();
  shadow.appendChild(tmpl);

  var style = document.createElement('style');
  style.setAttribute('scoped', '');
  style.innerHTML = '@import url(' + baseUrl + component + '.css);';
  shadow.appendChild(style);
};

var template = document.createElement('template');
template.innerHTML = `
  <div class="inner">
    <span class="channel-name"><content></content></span>
    <span class="counter">23</span>
  </div>
`;

module.exports = document.registerElement('irc-channel', { prototype: proto });

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('irc-channel',this));
