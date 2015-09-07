'use strict';

var ui = angular.module('irc.ui');

/* Storage Service
 *
 * Provides a persistent key-value storage using window.localStorage.
 *
 * Items can are added to storage.items.  They are restored when the service is
 * loaded and saved before the window unloads.  Additionally, writing to
 * localStorage can be triggered with save() for single items or saveAll().
 */
ui.factory('storage', ['$window', function($window) {
  var Storage = function() {
    this.prefix = 'irc-';
    this.items = {};
    this.loadAll();
    $window.addEventListener('beforeunload', () => this.saveAll());
  };
  Storage.prototype = {
    _hasPrefix: function(item) {
      return item.substring(0, this.prefix.length) === this.prefix;
    },
    _removePrefix: function(item) {
      return item.substring(this.prefix.length)  ;
    },
    save: function(item) {
      $window.localStorage[this.prefix + item] =
          angular.toJson(this.items[item]);
    },
    load: function(item) {
      this.items[item] =
          angular.fromJson($window.localStorage[this.prefix + item]);
    },
    saveAll: function() {
      this.clear();
      for (var item in this.items) {
        this.save(item);
      }
    },
    loadAll: function() {
      for (var item in $window.localStorage) {
        if ($window.localStorage.hasOwnProperty(item) &&
            this._hasPrefix(item)) {
          this.load(this._removePrefix(item));
        }
      }
    },
    clear: function() {
      for (var item in $window.localStorage) {
        if ($window.localStorage.hasOwnProperty(item) &&
            this._hasPrefix(item)) {
          $window.localStorage.removeItem(item);
        }
      }
    },
    default: function(key, value) {
      if (!this.items[key]) {
        this.items[key] = value;
      }
    }
  };
  return new Storage();
}]);
