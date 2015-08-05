(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var component = require('gaia-component');

var props = {};

// var baseUrl = '/components/dialog/';

props.created = function() {
  var self = this;
  var shadow = this.setupShadowRoot();

  this.els = {
    inner: this.shadowRoot.querySelector('.inner'),
    buttons: this.shadowRoot.querySelectorAll('gaia-button'),
    statusBarColor: document.head.querySelector('meta[name=theme-color]')
  };

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

props.attached = function() {
  window.setTimeout(this.open.bind(this), 0);
};

props.attrs = {
  opened: {
    get: function() { return this.getAttribute('opened'); },
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

props.open = function() {
  this.opened = true;
  this.els.statusBarColor.setAttribute('content', 'var(--color-alpha)');
};

props.close = function() {
  this.opened = false;
  window.setTimeout(this.removeChild.bind(this.parentNode, this), 200);
  this.els.statusBarColor.setAttribute('content', 'var(--header-background)');
};


var baseInner = `
  <content select="h1"></content>
  <div class="content">
    <content></content>
  </div>
`;

var baseStyle = `
  :host {
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

  .content {
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
`;

module.exports = component.register('irc-dialog', props);

module.exports.createTemplate = function(inner, style) {
  return '<div class="inner">' + baseInner + inner + '</div>' +
      '<style>' + baseStyle + style + '</style>';
};

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('irc-dialog',this));
