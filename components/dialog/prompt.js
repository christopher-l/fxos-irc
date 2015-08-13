(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var component = require('gaia-component');
var Dialog = require('irc-dialog');

var props = {};

props.extends = Dialog.prototype;

props.created = function() {
  Dialog.prototype.created.call(this);
  this.els.textInput = this.shadowRoot.querySelector('gaia-text-input');
  this.els.okButton = this.shadowRoot.querySelector('.ok');
  this.els.textInput.focus();
};

props.attrs = mixin({
  value: {
    get: function() {
      return this.els.textInput.value;
    },
    set: function(value) {
      this.els.textInput.value = value;
    }
  }
}, Dialog.prototype.attrs);

var inner = `
  <div class="spacer"></div>
  <div class="content">
    <content></content>
  </div>
  <gaia-text-input focus placeholder="Channel name"></gaia-text-input>
  <div class="buttons">
    <gaia-button class="cancel">Cancel</gaia-button>
    <gaia-button class="ok" recommend>Ok</gaia-button>
  </div>
`;

var style = `
  .content {
    flex: 0 1 auto;
  }
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
  gaia-text-input {
    margin: 1rem !important;
  }
  .spacer {
    flex: 1 1 0%;
  }
  ::content p {
    padding-bottom: 0px;
  }
`;

props.template = Dialog.createTemplate(inner, style);

module.exports = component.register('irc-prompt', props);

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('irc-prompt',this));
