(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var List = require('irc-list');
var ConfirmDialog = require('irc-confirm-dialog');

var ChannelConfig = function(channel) {
  this.channel = channel;
  this.window = new List();
  this.isNew = !channel.name;
  this.window.title = this.isNew ? 'New Channel' : '#' + channel.name;
  this.window.els.doneButton.innerHTML = this.isNew ? 'Add' : 'Done';
  this.window.els.header.action = 'close';
  this.window.els.header.addEventListener('action',
      this.closeButtonAction.bind(this));
  this.window.buttonAction = this.saveButtonAction.bind(this);
  this.window.innerHTML = HTML;
  this.window.querySelector('gaia-sub-header').innerHTML = channel.network.name;
  this.setupItems();
  var input = this.items.name.element.els.input;
  window.setTimeout(function() { input.focus(); });
};

ChannelConfig.prototype.open = function () {
  document.body.appendChild(this.window);
};

ChannelConfig.prototype.setupItems = function() {
  var self = this;
  this.items = {
    name: Object.create(Object.prototype, { // props
      element: {value: self.window.querySelector('#name')},
      value: {
        get: function() { return processName(this.element.value); },
        set: function(value) { this.element.value = value; }
      }
    }),
    autoJoin: Object.create(Object.prototype, { // props
      element: {value: self.window.querySelector('#auto-join')},
      value: {
        get: function() { return this.element.checked; },
        set: function(value) { this.element.checked = value; }
      }
    })
  };
  if (this.channel.name) {
    this.items.name.value = this.channel.name;
  }
  if (this.channel.autoJoin) {
    this.items.autoJoin.value = this.channel.autoJoin;
  }
  this.items.name.element.addEventListener('blur', function() {
    if (self.items.name.value) {
      self.window.title = '#' + self.items.name.value;
    }
    self.changed = self.items.name.value !== self.channel.name;
  });
  this.items.name.element.addEventListener('input', function() {
    if (!self.isNew) { self.window.els.doneButton.innerHTML = 'Save'; }
  });
  this.items.autoJoin.element.addEventListener('change', function() {
    self.channel.autoJoin = self.items.autoJoin.value;
  });
};

ChannelConfig.prototype.saveButtonAction = function () {
  if (this.changed) {
    if (!this.items.name.value) {
      toast('The channel name cannot be empty.', this.window);
      return;
    } else if (this.isNew &&
        this.channel.network.channels[this.items.name.value]) {
      toast('The channel already exists.', this.window);
      return;
    }
    if (this.isNew) { this.channel.appendListEntry(); }
    this.channel.updateName(this.items.name.value);
  }
  this.window.close();
};

ChannelConfig.prototype.closeButtonAction = function() {
  if (this.changed) {
    var dialog = new ConfirmDialog();
    dialog.innerHTML = this.isNew ?
        `<h1>Discard channel</h1>
         <p>The channel will <emph>not</emph> be added.</p>` :
        `<h1>Discard changes</h1>
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

const HTML = `
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
        <h3>Auto join</h3>
      </label>
      <gaia-switch id="auto-join"></gaia-switch>
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
