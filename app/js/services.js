'use strict';

var data = angular.module('irc.data');

/*
 * Storage Service
 *
 * Provides a persistent key-value storage using window.localStorage.
 *
 * Items can are added directly to the storage object.  They are restored when
 * the service is loaded and saved before the window unloads.  Additionally,
 * writing to * localStorage can be triggered with save() for single items or
 * saveAll().
 */
data.factory('storage', ['$window', function storageFactory($window) {
  var Storage = function() {
    this.loadAll();
    $window.addEventListener('beforeunload', () => this.saveAll());
  };

  Storage.prototype = {
    _hasPrefix: function(item) {
      return item.substring(0, this._prefix.length) === this._prefix;
    },
    _removePrefix: function(item) {
      return item.substring(this._prefix.length)  ;
    },
    save: function(item) {
      $window.localStorage[this._prefix + item] =
          angular.toJson(this[item]);
    },
    load: function(item) {
      this[item] = angular.fromJson($window.localStorage[this._prefix + item]);
    },
    saveAll: function() {
      this.clearLocalStorage();
      for (var item in this) {
        if (typeof this[item] !== 'function') {
          this.save(item);
        }
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
      for (var item in this) {
        if (typeof this[item] !== 'function') {
          delete this[item];
        }
      }
    },
    clearLocalStorage: function() {
      for (var item in $window.localStorage) {
        if ($window.localStorage.hasOwnProperty(item) &&
            this._hasPrefix(item)) {
          $window.localStorage.removeItem(item);
        }
      }
    },
    default: function(key, value) {
      if (!this[key]) {
        this[key] = value;
      }
    }
  };

  Object.defineProperty(Storage.prototype, '_prefix', {
    value: 'irc-'
  });

  return new Storage();

}]);

/*
 * Network Service
 *
 * Provides an array with saved networks.  Also provides the following method:
 *   edit()
 *     takes index: If index is given, edit an existing network, otherwise
 *         create a new one.
 *     returns network: Copy of a network instance meant to be edited.  Provides
 *         the additional method save().
 */
data.factory('networks', ['storage', function networksFactory(storage) {
  storage.default('networks', [
    {
      name: 'Foo',
      unreadCount: 0,
      status: 'connected',
      channels: [
        {name: 'channel1', unreadCount: 32, focused: true, joined: true},
        {name: 'channel2', unreadCount: 0, joined: true}
      ]
    },
    {
      name: 'Bar',
      unreadCount: 32,
      status: 'connection lost',
      channels: [
        {name: 'channel3', unreadCount: 0, autoJoin: true},
        {name: 'channel4', unreadCount: 32}
      ]
    }
  ]);

  var networks = storage.networks;

  networks.edit = function(index) {
    var network = index ? angular.copy(networks[index]) : { new: true };
    network.save = function() {
      delete this.new;
      delete this.save;
      if (index) {
        networks[index] = this;
      } else {
        networks.push(this);
      }
      storage.save('networks');
    };
    return network;
  };

  return networks;
}]);
