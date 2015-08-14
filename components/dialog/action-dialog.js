(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var component = require('gaia-component');
var Dialog = require('irc-dialog');

var props = {};

props.extends = Dialog.prototype;

props.created = function() {
  Dialog.prototype.created.call(this);
  this.els.cancelButton = this.shadowRoot.querySelector('.cancel-button');
  this.els.cancelButton.addEventListener('click', this.close.bind(this));
};

props.registerButtons = function() {
  var self = this;
  var buttons = this.querySelectorAll('gaia-button');
  Array.prototype.forEach.call(buttons, function(button) {
    button.addEventListener('click', self.close.bind(self));
  });
};

var inner = `
  <div class="content">
    <content></content>
  </div>
  <div class="buttons">
    <gaia-button class="cancel-button">Cancel</gaia-button>
  </div>
`;
var style = '';

props.template = Dialog.createTemplate(inner, style);

module.exports = component.register('irc-action-dialog', props);

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('irc-action-dialog',this));
