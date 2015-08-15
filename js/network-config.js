(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var Config = require('irc-config');
var ConfirmDialog = require('irc-confirm-dialog');

var NetworkConfig = function(network) {
  Config.call(this, network, HTML);
  this.window.title = this.isNew ? 'New network' : network.name;
};

NetworkConfig.prototype = Object.create(Config.prototype);
NetworkConfig.prototype.constructor = NetworkConfig;

NetworkConfig.prototype.setupItems = function() {
  var self = this;
  var textInput = Config.itemBases.textInput;
  var checkbox = Config.itemBases.checkbox;
  this.items = {
    name: {
      base: textInput,
      get default() { return self.items.host.value; },
      onChanged: function() {
        if (this.value) { self.window.title = this.value; }
      }
    },
    autoConnect: {base: checkbox},
    host: {base: textInput},
    port: {
      base: textInput,
      get default() { return self.items.tls.value ? 6697 : 6667; },
      updatePlaceholder: function() {
        this.element.setAttribute('placeholder', this.default);
      }
    },
    tls: {
      base: checkbox,
      onChanged: function() { self.items.port.updatePlaceholder(); }
    },
    nick: {base: textInput},
    user: {base: textInput},
    password: {base: textInput},
  };
  Config.prototype.setupItems.apply(this);
};

NetworkConfig.prototype.validate = function() {
  if (!this.items.host.value) {
    toast('Host cannot be empty.', this.window);
    return false;
  }
  return true;
};

NetworkConfig.prototype.closeButtonAction = function () { // override
  if (this.changed) {
    var dialog = new ConfirmDialog();
    dialog.innerHTML = this.isNew ?
        `<h1>Discard network</h1>
         <p>The network will <emph>not</emph> be created.</p>` :
        `<h1>Discard changes</h1><p>The network will not be changed.</p>`;
    document.body.appendChild(dialog);
    dialog.els.confirmButton.addEventListener('click',
        this.window.close.bind(this.window));
    return;
  }
  this.window.close();
};

var HTML = `
  <gaia-list>
    <li>
      <div flex>
        <h3>Name</h3>
        <gaia-text-input id="name" placeholder="E.g. Freenode (optional)"></gaia-text-input>
      </div>
    </li>
    <li class="ripple">
      <label flex for="auto-connect">
        <h3>Auto connect</h3>
      </label>
      <gaia-checkbox id="auto-connect"></gaia-checkbox>
    </li>
  </gaia-list>
  <h2>Server</h2>
  <gaia-list>
    <li>
      <div flex>
        <h3>Host</h3>
        <gaia-text-input id="host" placeholder="E.g. irc.freenode.net" required></gaia-text-input>
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
  </gaia-list>
  <h2>Identity</h2>
  <gaia-list>
    <li>
      <div flex>
        <h3>Nick</h3>
        <gaia-text-input id="nick"></gaia-text-input>
      </div>
    </li>
    <li>
      <label flex>
        <h3>User</h3>
      </label>
      <gaia-text-input id="user" placeholder="(Optional)"></gaia-text-input>
    </li>
    <li>
      <label flex>
        <h3>Password</h3>
      </label>
      <gaia-text-input id="password" type="password" placeholder="(Optional)"></gaia-text-input>
    </li>
  </gaia-list>
  <style>
    h3, p {
      padding-left: 1rem;
    }
    emph {
      font-weight: bold;
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

module.exports = NetworkConfig;

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('irc-network-config',this));
