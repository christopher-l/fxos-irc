(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var component = require('gaia-component');

var props = {};

props.created = function() {
  var self = this;
  var shadow = this.setupShadowRoot();

  this.classList.add('theme-media');

  this.els = {
    inner: this.shadowRoot.querySelector('.inner'),
    statusBarColor: document.head.querySelector('meta[name=theme-color]')
  };
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
        this.prevSBColor = this.els.statusBarColor.getAttribute('content');
        this.els.statusBarColor.setAttribute('content', 'var(--color-alpha)');
      } else {
        this.removeAttribute('opened');
        this.els.statusBarColor.setAttribute('content', this.prevSBColor);
      }
    }
  }
};

props.open = function() {
  this.opened = true;
};

props.close = function() {
  this.opened = false;
  window.setTimeout(this.removeChild.bind(this.parentNode, this), 200);
};


var baseInner = `
  <content select="h1"></content>
`;

var baseStyle = `
  * {
    box-sizing: border-box;
  }

  :host {
    position: absolute;
    width: 100%;
    height: 100%;
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
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .content {
    padding: 0px 1rem;
    flex: 1 1 0%;
    overflow-y: auto;
  }

  ::content h1 {
    font-size: 1.6rem;
    color: var(--color-theta);
    padding: 1rem;
    margin: 0px 1rem;
    border-bottom: solid 1px var(--color-delta);
  }

  ::content gaia-button {
    box-shadow: none !important;
    color: var(--color-gamma) !important;
    background-color: var(--color-theta) !important;
  }

  gaia-button {
    box-shadow: none !important;
    margin: 0px;
    color: var(--color-gamma) !important;
    background-color: var(--color-theta) !important;
  }

  ::content gaia-button[danger] {
    background: #e51e1e !important;
    color: white !important;
  }

  gaia-button[danger] {
    background: #e51e1e !important;
    color: white !important;
  }

  ::content gaia-button[recommend] {
    background: #00caf2 !important;
    color: white !important;
  }

  gaia-button[recommend] {
    background: #00caf2 !important;
    color: white !important;
  }

  ::content p {
    padding: 1rem;
    color: var(--color-theta);
    font-size: 1.15rem;
    line-height: 1.5rem;
  }

  .buttons {
    background-color: var(--color-gamma);
    padding: 1rem;
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
