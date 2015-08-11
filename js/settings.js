(function() {
/*jshint esnext:true*/
'use strict';

var List = require('irc-list');

var settings = new List();
settings.title = "IRC Settings";
settings.innerHTML = `
  <h2>Interface</h2>
  <gaia-list>
    <li class="ripple">
      <i data-icon="themes"></i>
      <label flex flexbox for="theme-switch">
        <div class=gaia-item-title>
          Dark Theme
          <!-- <p>Requires application restart</p> -->
        </div>
      </label>
      <gaia-switch id="theme-switch"></gaia-switch>
    </li>
    <li>
      <gaia-slider id="font-size-slider" flex>
        <label>Font Size</label>
        <output></output>
      </gaia-slider>
    </li>
  </gaia-list>
  <style>
    gaia-slider {
      margin: 0px !important;
    }
    gaia-slider output::after {
      content: 'pt' !important;
    }
  </style>
`;

var items = {
  theme: {
    _body: document.querySelector('body'),
    _statusBarTheme: document.head.querySelector('meta[name=theme-group]'),
    _statusBarColor: document.head.querySelector('meta[name=theme-color]'),
    _themes: {
      'light': 'theme-communications',
      'dark': 'theme-media'
    },
    element: settings.querySelector('#theme-switch'),
    default: 'light',
    set: function(value) {
      this.element.checked = value === 'dark';
    },
    get: function() {
      return this.element.checked ? 'dark' : 'light';
    },
    listen: function(fun) {
      this.element.addEventListener('change', fun);
    },
    apply: function(value) {
      settings.updateTheme();
      var newTheme = this._themes[value];
      this._statusBarTheme.setAttribute('content', newTheme);
      // Force update of statusbar color
      document.head.removeChild(this._statusBarTheme);
      document.head.removeChild(this._statusBarColor);
      document.head.appendChild(this._statusBarTheme);
      document.head.appendChild(this._statusBarColor);
      this._body.setAttribute('class', newTheme);
    }
  },
  fontSize: {
    _content: document.querySelector('#content'),
    element: settings.querySelector('#font-size-slider'),
    default: '12',
    init: function() {
      this.element.els.input.min = 6;
      this.element.els.input.max = 20;
    },
    set: function(value) {
      this.element.els.input.value = value;
      this.element.updateOutput();
    },
    get: function() {
      return this.element.els.input.value;
    },
    listen: function(fun) {
      this.element.els.input.addEventListener('input', fun);
    },
    apply: function(value) {
      this._content.style = 'font-size: ' + value + 'pt;';
    }
  }
};


var updateItem = function(itemName) {
  var item = items[itemName];
  var value = item.get();
  localStorage[itemName] = value;
  item.apply(value);
};

var registerItems = function() {
  for (var itemName in items) {
    if (items.hasOwnProperty(itemName)) {
      var item = items[itemName];
      item.listen(updateItem.bind(this, itemName));
    }
  }
};

var initSettings = function(storage) {
  for (var itemName in items) {
    if (items.hasOwnProperty(itemName)) {
      var item = items[itemName];
      var value = storage[itemName] ? storage[itemName] : item.default;
      if (item.init) { item.init(); }
      item.set(value);
      item.apply(value);
    }
  }
};

initSettings(localStorage);
registerItems();

function openSettings() {
  document.body.appendChild(settings);
}

var settingsButton = document.querySelector('#settings-button');
settingsButton.addEventListener('click', openSettings);

})();
