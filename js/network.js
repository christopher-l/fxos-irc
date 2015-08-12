(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var List = require('irc-list');

var Network = function() {
};

Network.prototype.openConfig = function() {
  var config = new List();
  config.theme = 'theme-communications';
  var isNew = !this.name;
  config.title = isNew ? 'New Network' : this.name;
  if (isNew) {
    config.els.header.action = 'close';
    config.els.header.addEventListener('action', function() {
      config.close();
    });
  }
  config.innerHTML = CONFIG_HTML;
  document.body.appendChild(config);
  var nameInput = config.querySelector('#name');
  nameInput.els.input.addEventListener('input', function() {
    config.title = nameInput.value;
  });
};

const CONFIG_HTML = `
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
    }
  </style>
`;

module.exports = Network;

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('irc-network',this));
