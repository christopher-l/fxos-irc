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

  var networks = storage.items.networks;

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
