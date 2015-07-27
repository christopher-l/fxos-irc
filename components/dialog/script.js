(function(define){define(function(require,exports,module){
'use strict';

var component = require('gaia-component');
var GaiaButton = require('gaia-button');

var proto = {};

// var baseUrl = '/components/dialog/';

proto.created = function() {
  // var self = this;
  var shadow = this.setupShadowRoot();

  this.els = {
    inner: this.shadowRoot.querySelector('.inner')
  };

  // var style = document.createElement('style');
  // style.setAttribute('scoped', '');
  // style.innerHTML = '@import url(' + baseUrl + 'style.css);';
  // this.shadowRoot.appendChild(style);
};

proto.attrs = {
  open: {
    get: function() { return this.getAttribute('open'); },
    set: function(value) {
      value = !!(value === '' || value);
      if (value) {
        this.setAttribute('open', '');
      } else {
        this.removeAttribute('open');
      }
    }
  }
};

proto.template = `
  <div class="inner">
    <content select="h1"></content>
    <div class="actions">
      <content></content>
    </div>
    <gaia-button>Cancel</gaia-button>
  </div>

  <style>
    irc-dialog {
      position: absolute;
      width: 100%;
      height: 100%;
      padding: 1rem;
      z-index: 100;
      background-color: var(--color-alpha);
      transform: translateY(100%);
      transition: transform 200ms 0ms ease;
    }

    :host([open]) {
      transform: none;
    }

    .inner {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    .actions {
      flex: 1 1 0%;
      overflow-y: scroll
    }

    ::content h1 {
      font-size: 1.6rem;
      color: var(--color-theta);
      padding: 1rem;
      border-bottom: solid 1px var(--color-delta);
    }

    ::content gaia-button {
      box-shadow: none !important;
    }

    ::content gaia-button[danger] {
      background: #e51e1e !important;
      color: white !important;
    }

    ::content gaia-button[recommend] {
      background: #00caf2 !important;
      color: white !important;
    }
  </style>
`;

module.exports = component.register('irc-dialog', proto);

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('irc-dialog',this));
