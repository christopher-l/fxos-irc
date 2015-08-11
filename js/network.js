(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var List = require('irc-list');

var Network = function() {
};

Network.prototype.openConfig = function() {
  var config = new List();
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
      <li class="ripple">
        <!-- <i data-icon="tick"></i> -->
        <label flex flexbox for="auto-connect-switch">
          <div class=gaia-item-title>
            Auto Connect
            <!-- <p></p> -->
          </div>
        </label>
        <gaia-switch id="auto-connect-switch"></gaia-switch>
      </li>
    </gaia-list>
  `;
  document.body.appendChild(config);
};

module.exports = Network;

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('irc-network',this));
