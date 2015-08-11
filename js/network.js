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
  config.innerHTML = `
    <gaia-list>
      <li>
        <div flex>
          <h3>Name</h3>
          <gaia-text-input id="name" placeholder="e.g. Freenode" required></gaia-text-input>
        </div>
      </li>
      <li>
        <div flex>
          <h3>URL</h3>
          <gaia-text-input id="url" placeholder="e.g. irc.freenode.net" required></gaia-text-input>
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
    </style>
  `;
  document.body.appendChild(config);
};

module.exports = Network;

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('irc-network',this));
