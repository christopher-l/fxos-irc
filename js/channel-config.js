(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

/*
 * The config of a channel is encapsulated in the object defined here.
 * It is not a web component itself but uses irc-list.  It is derived
 * from irc-config and closely interacts with its baseclass.
 */

var Config = require('irc-config');
var ConfirmDialog = require('irc-confirm-dialog');

var ChannelConfig = function(channel) {
  Config.call(this, channel, HTML);
  this.window.title = this.isNew ? 'New Channel' : '#' + channel.name;
  this.window.querySelector('gaia-sub-header').innerHTML = channel.network.name;
  var input = this.items.name.element.els.input;
  window.setTimeout(function() { input.focus(); });
};

ChannelConfig.prototype = Object.create(Config.prototype);
ChannelConfig.prototype.constructor = ChannelConfig;

ChannelConfig.prototype.setupItems = function() {
  var self = this;
  var textInput = Config.itemBases.textInput;
  var checkbox = Config.itemBases.checkbox;
  this.items = {
    name: {
      base: textInput,
      get value() { return processName(this.element.value); },
      set value(value) { this.element.value = value; },
      onChanged: function() {
        if (this.value) { self.window.title = '#' + this.value; }
      }
    },
    autoJoin: {base: checkbox},
  };
  Config.prototype.setupItems.apply(this);
};

ChannelConfig.prototype.validate = function() {
  if (!this.items.name.value) {
    toast('The channel name cannot be empty.', this.window);
    return false;
  } else if (this.isNew &&
      this.obj.network.channels[this.items.name.value]) {
    toast('The channel already exists.', this.window);
    return false;
  }
  return true;
};

ChannelConfig.prototype.closeButtonAction = function() { // override
  if (this.changed) {
    var dialog = new ConfirmDialog();
    dialog.innerHTML = this.isNew ?
        `<h1>Discard Channel</h1>
         <p>The channel will <emph>not</emph> be added.</p>` :
        `<h1>Discard Changes</h1>
         <p>The channel will <emph>not</emph> be changed.</p>`;
    document.body.appendChild(dialog);
    dialog.els.confirmButton.addEventListener('click',
        this.window.close.bind(this.window));
    return;
  }
  this.window.close();
};

var processName = function(name) {
  return name[0] === '#' ? name.substr(1) : name;
};

var HTML = `
  <gaia-sub-header></gaia-sub-header>
  <gaia-list>
    <li>
      <div flex>
        <h3>Name</h3>
        <gaia-text-input id="name" required></gaia-text-input>
      </div>
    </li>
    <li class="ripple">
      <label flex for="auto-join">
        <h3>Auto Join</h3>
      </label>
      <gaia-checkbox id="auto-join"></gaia-checkbox>
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
  </style>
`;

module.exports = ChannelConfig;

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('irc-channel-config',this));
