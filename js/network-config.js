(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var List = require('irc-list');
var ConfirmDialog = require('irc-confirm-dialog');
var GaiaToast = require('gaia-toast');

var NetworkConfig = function(network) {
  this.network = network;
  this.window = new List();
  // this.window.theme = 'theme-communications';
  this.isNew = !network.name;
  this.window.title = this.isNew ? 'New Network' : network.name;
  this.window.els.doneButton.innerHTML = 'Save';
  this.window.els.header.action = 'close';
  this.window.els.header.addEventListener('action',
      this.closeButtonAction.bind(this));
  this.window.buttonAction = this.saveButtonAction.bind(this);
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
      onChanged: function(config) {
        if (this.value) { config.window.title = this.value; }
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

var onItemChanged = function(item) {
  this.changed = true;
  if (item.onChanged) {
    item.onChanged(this);
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
      if (this.network[itemName]) { item.value = this.network[itemName]; }
      item.listen(onItemChanged.bind(this, item));
      if (item.init) { item.init(); }
    }
  }
};

NetworkConfig.prototype.saveButtonAction = function () {
    if (!this.isValid()) {
      this.showToast();
      return;
    }
    this.save();
    this.network.updateListEntry();
    if (this.isNew) { this.network.appendListEntry(); }
    this.window.close();
};

NetworkConfig.prototype.closeButtonAction = function () {
  if (!this.isNew && this.changed) {
    var dialog = new ConfirmDialog();
    dialog.innerHTML = `<h1>Discard Changes</h1>
        <p>The network will not be changed.</p>`;
    document.body.appendChild(dialog);
    dialog.els.confirmButton.addEventListener('click',
        this.window.close.bind(this.window));
    return;
  }
  this.window.close();
};

NetworkConfig.prototype.isValid = function() {
  for (var itemName in this.items) {
    if (this.items.hasOwnProperty(itemName)) {
      var item = this.items[itemName];
      if (item.element.hasAttribute('required') && !item.value) {
        this.missing = itemName;
        return false;
      }
    }
  }
  return true;
};

NetworkConfig.prototype.save = function () {
  for (var itemName in this.items) {
    if (this.items.hasOwnProperty(itemName)) {
      this.network[itemName] = this.items[itemName].value;
    }
  }
};

NetworkConfig.prototype.showToast = function () {
  var toast = new GaiaToast();
  toast.innerHTML = 'Cannot leave field "' + this.missing + '" empty.';
  this.window.appendChild(toast);
  toast.show();
  window.setTimeout(toast.remove.bind(toast), 2000);
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
