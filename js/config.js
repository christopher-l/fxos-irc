(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var List = require('irc-list');

var Config = function(obj, html) {
  this.obj = obj;
  this.isNew = !obj.name;
  this.window = new List();
  this.window.innerHTML = html;
  this.window.els.doneButton.innerHTML = 'Save';
  this.window.els.header.action = 'close';
  this.window.els.header.addEventListener('action',
      this.closeButtonAction.bind(this));
  this.window.buttonAction = this.saveButtonAction.bind(this);
  this.setupItems();
};

Config.prototype.open = function () {
  document.body.appendChild(this.window);
};

Config.prototype.onItemChanged = function(item) {
  this.changed = true;
  if (item.onChanged) {
    item.onChanged(this);
  }
};

Config.prototype.setupItems = function() {
  for (var itemName in this.items) {
    if (this.items.hasOwnProperty(itemName)) {
      var item = this.items[itemName];
      mixin(item, item.base);
      delete item.base;
      item.name = itemName;
      item.element = this.window.querySelector(
          '#' + toHyphenSeparated(itemName));
      if (this.obj[itemName]) { item.value = this.obj[itemName]; }
      item.listen(this.onItemChanged.bind(this, item));
      if (item.init) { item.init(); }
    }
  }
};

Config.prototype.save = function () {
  for (var itemName in this.items) {
    if (this.items.hasOwnProperty(itemName)) {
      var item = this.items[itemName];
      this.obj[itemName] = item.value ? item.value : item.default;
    }
  }
};

Config.prototype.saveButtonAction = function () {
    if (!this.validate()) { return; }
    this.save();
    if (this.isNew) { this.obj.setup(); }
    this.obj.update();
    this.window.close();
};

Config.prototype.closeButtonAction = function () {
  this.window.close();
};

Config.itemBases = {
  textInput: {
    get value() { return this.element.value; },
    set value(value) { this.element.value = value; },
    listen: function(fun) { this.element.addEventListener('blur', fun); }
  },
  checkbox: {
    get value() { return this.element.checked; },
    set value(value) { this.element.checked = value; },
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

module.exports = Config;

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('irc-config',this));
