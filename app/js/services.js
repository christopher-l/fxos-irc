'use strict';

var data = angular.module('irc.data');

/**
 * Storage Service
 *
 * Provides a persistent key-value storage using window.localStorage.
 *
 * An instance is created with `new Storage` and the following arguments:
 *   name:         The identifier used as key for localStorage.
 *   defaultValue: If there are no stored data by the identifier 'name',
 *                 take this value.
 *
 * The created instance has the following properties:
 *   data:         The data read from and written to localStorage.
 *   save():       Save data to localStorage.
 */
data.factory('Storage', ['$window', function StorageFactory($window) {

  var Storage = function(name, defaultValue) {
    this._name = name;

    if (typeof $window.localStorage[name] === 'undefined') {
      this.data = defaultValue;
      return;
    }

    try {
      this.data = angular.fromJson($window.localStorage[name]);
    } catch (e) {
      this.data = defaultValue;
    }
  };

  Storage.prototype = {
    save: function() {
      $window.localStorage[this._name] = angular.toJson(this.data);
    },
  };

  return Storage;

}]);


/**
 * Settings Service
 *
 * Provides an object on which settings are stored as properties.  Also
 * provides the method:
 *   save():  Write settings to localStorage.
 */
data.factory('settings', ['Storage', function settingsFactory(Storage) {

  var settings = new Storage('settings', {
    darkTheme: false,
    fontSize: 12
  });

  settings.data.save = function() {
    settings.save();
  };

  return settings.data;

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
data.factory('networks', ['Storage', function networksFactory(Storage) {

  var storage = new Storage('networks', [
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

  var Channel = function(storageChan) {
    this._storageChan = storageChan;
  };

  var Network = function(storageNet) {
    this._state = {
      connection: 'disconnected'
    };
    if (storageNet) {
      this._storageNet = storageNet;
      this._config = storageNet.config;
    } else {
      this.new = true;
      this._config = {};
      this._storageNet = {
        config: this._config,
        channels: []
      };
    }
    this.channels = [];
    var self = this;
    this._storageNet.channels.forEach(function(storageChan) {
      self.channels.push(new Channel(storageChan));
    });
    this._storageNet.lastState = this._state;
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
      if (this.new) {
        networks.push(this);
        storage.data.push(this._storageNet);
        delete this.new;
      }
      storage.save();
    },
    delete: function() {
      var index = networks.indexOf(this);
      networks.splice(index, 1);
      storage.data.splice(index, 1);
      storage.save();
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
        throw new Error('Tried to write access network config.');
      }
    });
  });

  [
    'connection'
  ].forEach(function(key) {
    Object.defineProperty(Network.prototype, key, {
      get: function() {
        return this._state[key];
      },
      set: function(value) {
        this._state[key] = value;
      }
    });
  });

  var networks = [];

  storage.data.forEach(function(storageNet) {
    networks.push(new Network(storageNet));
  });

  networks.new = function() {
    return new Network();
  };

  return networks;

}]);
