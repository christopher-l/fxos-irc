'use strict';

var data = angular.module('irc.data');

/*
 * Storage Service
 *
 * Provides a persistent key-value storage using window.localStorage.
 *
 * Items can are added to storage.items.  They are restored when the service is
 * loaded and saved before the window unloads.  Additionally, writing to
 * localStorage can be triggered with save() for single items or saveAll().
 */
data.service('storage', ['$window', function Storage($window) {
  this._hasPrefix = function(item) {
    return item.substring(0, this.prefix.length) === this.prefix;
  };
  this._removePrefix = function(item) {
    return item.substring(this.prefix.length)  ;
  };
  this.save = function(item) {
    $window.localStorage[this.prefix + item] =
        angular.toJson(this.items[item]);
  };
  this.load = function(item) {
    this.items[item] =
        angular.fromJson($window.localStorage[this.prefix + item]);
  };
  this.saveAll = function() {
    this.clear();
    for (var item in this.items) {
      this.save(item);
    }
  };
  this.loadAll = function() {
    for (var item in $window.localStorage) {
      if ($window.localStorage.hasOwnProperty(item) &&
          this._hasPrefix(item)) {
        this.load(this._removePrefix(item));
      }
    }
  };
  this.clear = function() {
    for (var item in $window.localStorage) {
      if ($window.localStorage.hasOwnProperty(item) &&
          this._hasPrefix(item)) {
        $window.localStorage.removeItem(item);
      }
    }
  };
  this.default = function(key, value) {
    if (!this.items[key]) {
      this.items[key] = value;
    }
  };

  this.prefix = 'irc-';
  this.items = {};
  this.loadAll();
  $window.addEventListener('beforeunload', () => this.saveAll());
}]);
