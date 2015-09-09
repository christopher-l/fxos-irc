'use strict';

var data = angular.module('irc.data');

/*
 * Storage Service
 *
 * Provides a persistent key-value storage using window.localStorage.
 * TODO: update description
 * Items can are added directly to the storage object.  They are restored when
 * the service is loaded and saved before the window unloads.  Additionally,
 * writing to localStorage can be triggered with save() for single items or
 * saveAll().
 */
data.factory('storage', ['$window', function storageFactory($window) {

  var storage = {};

  [
    'networks',
    'settings'
  ].forEach(function(key) {
    Object.defineProperty(storage, key, {
      get: function() {
        return angular.fromJson($window.localStorage[key]);
      },
      set: function(value) {
        $window.localStorage[key] = angular.toJson(value);
      }
    });
  });

  return storage;

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


  var Network = function(storageRef) {
    this._storageRef = storageRef;
    this._config = angular.copy(storageRef);
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
      // storage.networks[this._index] = this._config;
      this._storageRef = this._config;
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

  storage.networks.forEach(function(storageRef) {
    networks.push(new Network(storageRef));
  });

  return networks;

}]);
