(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var List = require('irc-list');

var NetworkConfig = function(network) {
  this.network = network;
  this.window = new List();
  // this.window.theme = 'theme-communications';
  var isNew = !network.name;
  this.window.title = isNew ? 'New Network' : network.name;
  if (isNew) {
    this.window.els.doneButton.innerHTML = 'Save';
    this.window.els.header.action = 'close';
    this.window.els.header.addEventListener('action',
        this.window.close.bind(this.window));
  }
  this.window.els.doneButton.addEventListener('click', function() {
    network.updateListEntry();
    if (isNew) {network.appendListEntry(); }
  });
  this.window.innerHTML = HTML;
  this.setupItems();
};

NetworkConfig.prototype.open = function () {
  document.body.appendChild(this.window);
};

var textInput = {
  props: {
    value: {
      get: function() { return this.element.value; },
      set: function(value) { this.element.value = value; }
    }
  },
  proto: {
    listen: function(fun) { this.element.addEventListener('blur', fun); }
  }
};

var checkbox = {
  props: {
    value: {
      get: function() { return this.element.checked; },
      set: function(value) { this.element.checked = value; }
    }
  },
  proto: {
    listen: function(fun) {
      new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' &&
              mutation.attributeName === 'checked') {
            fun();
          }
        });
      }).observe(this.element, {attributes: true});
    }
  }
};


var items = {
  name: {
    proto: mixin({
      onChanged: function(network, window) {
        if (this.value) { window.title = this.value; }
      }
    }, textInput.proto),
    props: textInput.props,
  },
  server: textInput,
  port: textInput,
  tls: checkbox,
  autoConnect: checkbox,
  nick: textInput,
  user: textInput,
  password: textInput,
};

var onItemChanged = function (network, window) {
  network[this.name] = this.value;
  if (this.onChanged) {
    this.onChanged(network, window);
  }
};

NetworkConfig.prototype.setupItems = function() {
  this.items = {};
  for (var itemName in items) {
    if (items.hasOwnProperty(itemName)) {
      var item = Object.create(items[itemName].proto, items[itemName].props);
      this.items[itemName] = item;
      item.name = itemName;
      item.element = this.window.querySelector(
          '#' + toHyphenSeparated(itemName));
      item.listen(onItemChanged.bind(item, this.network, this.window));
      if (item.init) { item.init(); }
    }
  }
};

const HTML = `
  <h2>Network</h2>
  <gaia-list>
    <li>
      <div flex>
        <h3>Name</h3>
        <gaia-text-input id="name" placeholder="e.g. Freenode" required></gaia-text-input>
      </div>
    </li>
    <li>
      <div flex>
        <h3>Server</h3>
        <gaia-text-input id="server" placeholder="e.g. irc.freenode.net" required></gaia-text-input>
      </div>
    </li>
    <li flexbox>
      <label flex>
        <h3>Port</h3>
        <!-- <p>Leave empty for default</p> -->
      </label>
      <gaia-text-input id="port" type="number" maxlength="5" placeholder="6667"></gaia-text-input>
    </li>
    <li class="ripple">
      <label flex for="tls">
        <h3>Use TLS</h3>
      </label>
      <gaia-checkbox id="tls"></gaia-checkbox>
    </li>
    <li class="ripple">
      <label flex for="auto-connect">
        <h3>Auto Connect</h3>
      </label>
      <gaia-checkbox id="auto-connect"></gaia-checkbox>
    </li>
  </gaia-list>
  <h2>Identity</h2>
  <gaia-list>
    <li>
      <div flex>
        <h3>Nick</h3>
        <gaia-text-input id="nick" required></gaia-text-input>
      </div>
    </li>
    <li>
      <label flex>
        <h3>User</h3>
      </label>
      <gaia-text-input id="user" placeholder="Optional"></gaia-text-input>
    </li>
    <li>
      <label flex>
        <h3>Password</h3>
      </label>
      <gaia-text-input id="password" type="password" placeholder="Optional"></gaia-text-input>
    </li>
  </gaia-list>
  <style>
    h3, p {
      padding-left: 1rem;
    }
    gaia-text-input {
      margin: .5rem 0px !important;
    }
    #port {
      width: 5rem !important;
      margin: 0px !important;
    }
    #user, #password {
      width: calc(100% - 7rem);
      margin: 0px !important;
    }
  </style>
`;

function mixin(target, source) { // from gaia-components.js
  for (var key in source) {
    target[key] = source[key];
  }
  return target;
}

function toHyphenSeparated(string) {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

module.exports = NetworkConfig;

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('irc-network-config',this));
