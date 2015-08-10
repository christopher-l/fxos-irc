(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var component = require('gaia-component');

var props = {};

props.created = function() {
  this.updateTheme();
  var shadow = this.setupShadowRoot();

  this.els = {
    inner: this.shadowRoot.querySelector('.inner'),
    title: this.shadowRoot.querySelector('.title'),
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
        this.els.statusBarColor.setAttribute('content', 'var(--background)');
      } else {
        this.removeAttribute('opened');
        // this.els.statusBarTheme
        //     .setAttribute('content', 'theme-communications');
        this.els.statusBarColor
            .setAttribute('content', 'var(--header-background)');
      }
    }
  },
  title: {
    set: function(value) {
      this.els.title.innerHTML = value;
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

props.updateTheme = function() {
  var theme = localStorage.theme === 'dark' ? 'theme-media' : 'theme-settings';
  this.setAttribute('class', theme);
};

props.template = `
  <div class="inner">
    <gaia-header>
      <h1 class="title"></h1>
      <button>Done</button>
    </gaia-header>
    <content></content>
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
      -moz-user-select: none;
    }
    ::content h2 {
      margin: 0px;
      padding: 0.3rem 2rem;
      font-size: 1rem;
      font-weight: 400;
      background-color: var(--border-color, #E7E7E7);
      color: var(--text-color);
    }
  </style>
`;

module.exports = component.register('irc-list', props);

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('irc-list',this));
