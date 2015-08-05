(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var component = require('gaia-component');
var GaiaButton = require('gaia-button');

var proto = {};

// var baseUrl = '/components/dialog/';

proto.created = function() {
  var self = this;
  var shadow = this.setupShadowRoot();

  this.els = {
    inner: this.shadowRoot.querySelector('.inner'),
    cancel: this.shadowRoot.querySelector('.cancel'),
    buttons: this.querySelectorAll('gaia-button')
  };

  this.els.cancel.addEventListener('click', this.close.bind(this));
  Array.prototype.forEach.call(this.els.buttons, function(button) {
    button.addEventListener('click', self.close.bind(self));
  });

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === "childList") {
        [].forEach.call(mutation.addedNodes, function(node) {
          if (node.nodeName === 'GAIA-BUTTON') {
            node.addEventListener('click', self.close.bind(self));
          }
        });
      }
    });
  });
  observer.observe(this, { childList: true });
};

proto.attached = function() {
  window.setTimeout(this.open.bind(this), 0);
};

proto.attrs = {
  opened: {
    get: function() { return this.getAttribute('open'); },
    set: function(value) {
      value = !!(value === '' || value);
      if (value) {
        this.setAttribute('opened', '');
      } else {
        this.removeAttribute('opened');
      }
    }
  }
};

proto.open = function() {
  this.opened = true;
};

proto.close = function() {
  this.opened = false;
  window.setTimeout(this.removeChild.bind(this.parentNode, this), 200);
};

proto.template = `
  <div class="inner">
    <content select="h1"></content>
    <div class="actions">
      <content></content>
    </div>
    <gaia-button class="cancel">Cancel</gaia-button>
  </div>

  <style>
    irc-dialog {
      position: absolute;
      width: 100%;
      height: 100%;
      padding: 1rem 1rem 0 1rem;
      z-index: 100;
      background-color: var(--color-alpha);
      opacity: 0;
      transition: opacity 200ms 0ms;
      -moz-user-select: none;
    }

    :host([opened]) {
      opacity: 1;
    }

    .inner {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    .actions {
      flex: 1 1 0%;
      overflow-y: auto;
      border-bottom: solid 1px var(--color-delta);
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
