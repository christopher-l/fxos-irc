'use strict';

var data = angular.module('irc.data');

/*
 * Storage Service
 *
 * Provides a persistent key-value storage using window.localStorage.
 * Items must be declared in the array below.  They can then be accessed
 * on the storage object.  They are restored when the service is loaded
 * and saved automatically.
 */
data.factory('storage', ['$window', function storageFactory($window) {

  var storage = {};
  var volatile = {};

  [
    'networks',
    'settings'
  ].forEach(function(key) {
    Object.defineProperty(storage, key, {
      get: function() {
        // In case a property of an object is changed, get will be called
        // instead of set, so we write to storage in both cases.
        $window.localStorage[key] = angular.toJson(volatile[key]);
        return volatile[key];
      },
      set: function(value) {
        $window.localStorage[key] = angular.toJson(value);
        volatile[key] = value;
      }
    });
    // Read from storage only one time.
    volatile[key] = angular.fromJson($window.localStorage[key]);
  });

  return storage;

}]);

/*
 * Network Service  //TODO update description
 *
 * Provides an array with saved networks.  Also provides the following method:
 *   edit()
 *     takes index: If index is given, edit an existing network, otherwise
 *         create a new one.
 *     returns network: Copy of a network instance meant to be edited.  Provides
 *         the additional method save().
 */
data.factory('networks', ['storage', function networksFactory(storage) {
  if (!storage.networks) {storage.networks = [
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
  ];}


  var Network = function(config, index) {
    this._index = index;
    this._config = angular.copy(config);
  };

  Network.prototype = {
    getConfig: function() {
      return angular.copy(this._config);
    },
    applyConfig: function(config) {
      this._config = config;
      this.save();
    },
    save: function() {
      storage.networks[this._index] = this._config;
    },
    delete: function() {
      networks.splice(this._index, 1);
      storage.networks.splice(this._index, 1);
      for (var i = this._index; i < networks.length; i++) {
        networks[i]._index--;
      }
    }
  };

  [
    'name',
    'autoConnect'
  ].forEach(function(key) {
    Object.defineProperty(Network.prototype, key, {
      get: function() {
        return this._config[key];
      },
      set: function(value) {
        this._config[key] = value;
      }
    });
  });

  var networks = [];

  storage.networks.forEach(function(config, index) {
    networks.push(new Network(config, index));
  });

  return networks;

}]);
