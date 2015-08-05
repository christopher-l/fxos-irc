(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var component = require('gaia-component');
var Dialog = require('irc-dialog');

var props = {};

props.extends = Dialog.prototype;

props.created = function() {
  Dialog.prototype.created.call(this);
};

var inner = `
  <div class="buttons">
    <gaia-button class="cancel">Cancel</gaia-button>
    <gaia-button class="confirm" danger>Confirm</gaia-button>
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
    color: var(--color-theta);
    margin: 1rem 1rem 4rem;
    font-size: 1.15rem;
    line-height: 1.5rem;
  }
`;

props.template = Dialog.createTemplate(inner, style);

module.exports = component.register('irc-confirm-dialog', props);

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('irc-confirm-dialog',this));
