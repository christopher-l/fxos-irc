(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var component = require('gaia-component');

var props = {};

props.created = function() {
  this.setAttribute('class', 'theme-settings');
  var shadow = this.setupShadowRoot();

  this.els = {
    inner: this.shadowRoot.querySelector('.inner'),
    doneButton: this.shadowRoot.querySelector('gaia-header button'),
    statusBarColor: document.head.querySelector('meta[name=theme-color]')
    // statusBarTheme: document.head.querySelector('meta[name=theme-group]')
  };

  this.els.doneButton.addEventListener('click', this.close.bind(this));
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
        // this.els.statusBarTheme.setAttribute('content', 'theme-settings');
        this.els.statusBarColor .setAttribute('content', 'var(--background)');
      } else {
        this.removeAttribute('opened');
        // this.els.statusBarTheme
        //     .setAttribute('content', 'theme-communications');
        this.els.statusBarColor
            .setAttribute('content', 'var(--header-background)');
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

props.template = `
  <div class="inner theme-settings">
    <gaia-header>
      <h1>IRC Settings</h1>
      <button>Done</button>
    </gaia-header>
  </div>
  <style>
    :host {
      position: absolute;
      z-index: 10;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 200ms 0ms;
    }
    :host([opened]) {
      opacity: 1;
    }
    .inner {
      width: 100%;
      height: 100%;
      background-color: var(--background);
    }
  </style>
`;

module.exports = component.register('irc-settings', props);

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('irc-settings',this));
