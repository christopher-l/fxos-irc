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
  this.els.confirmButton = this.shadowRoot.querySelector('.confirm-button');

  this.els.cancelButton.addEventListener('click', this.close.bind(this));
  this.els.confirmButton.addEventListener('click', this.close.bind(this));
};

var inner = `
  <div class="content">
    <content></content>
  </div>
  <div class="buttons">
    <gaia-button class="cancel-button">Cancel</gaia-button>
    <gaia-button class="confirm-button" danger>Confirm</gaia-button>
  </div>
`;
var style = `
  .buttons {
    display: flex;
    margin-left: -.5rem;
    margin-right: -.5rem;
  }
  .buttons gaia-button {
    flex: 1 1 0%;
  }
  gaia-button {
    margin-left: .5rem !important;
    margin-right: .5rem !important;
    min-width: 100px !important;
  }
  .content {
    display: flex;
    align-items: center;
  }
  ::content p {
    padding: 1rem 1rem 4rem;
  }
`;

props.template = Dialog.createTemplate(inner, style);

module.exports = component.register('irc-confirm-dialog', props);

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('irc-confirm-dialog',this));
