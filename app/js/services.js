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


/**
 * Network Service
 *
 * Provides a constructor for network objects.
 */
data.factory('Network', [function NetworkFactory() {

  var Channel = function(storageRef) {
    this._storageRef = storageRef;
    this._config = storageRef.config;
    this._state = storageRef.lastState;
  };

  Channel.prototype = {
    save: angular.noop,
  };

  [
    'name',
    'autoJoin'
  ].forEach(function(key) {
    Object.defineProperty(Channel.prototype, key, {
      get: function() {
        return this._config[key];
      },
      set: function(value) {
        throw new Error('Tried to write access network config.');
      }
    });
  });

  [
    'focused',
    'joined',
    'unreadCount',
  ].forEach(function(key) {
    Object.defineProperty(Channel.prototype, key, {
      get: function() {
        return this._state[key];
      },
      set: function(value) {
        this._state[key] = value;
        this.save();
      }
    });
  });

  var Network = function(storageRef) {
    this._state = {
      connection: 'disconnected',
      unreadCount: 0,
    };
    if (storageRef) {
      this._storageRef = storageRef;
      this._config = storageRef.config;
    } else {
      this.new = true;
      this._config = {};
      this._storageRef = {
        config: this._config,
        channels: []
      };
    }
    this.channels = [];
    var self = this;
    this._storageRef.channels.forEach(function(chan) {
      self.channels.push(new Channel(chan));
    });
    this._storageRef.lastState = this._state;
  };

  Network.prototype = {
    getConfig: function() {
      return angular.copy(this._config);
    },
    applyConfig: function(config) {
      this._config = config;
      this._storageRef.config = config;
      this.save();
    },
    save: function() {
      if (this.new) {
        this._networks.push(this);
        this._storage.data.push(this._storageRef);
        delete this.new;
      }
      this._storage.save();
    },
    delete: function() {
      var index = this._networks.indexOf(this);
      this._networks.splice(index, 1);
      this._storage.data.splice(index, 1);
      this._storage.save();
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
    'connection',
    'unreadCount',
  ].forEach(function(key) {
    Object.defineProperty(Network.prototype, key, {
      get: function() {
        return this._state[key];
      },
      set: function(value) {
        this._state[key] = value;
        this.save();
      }
    });
  });

  return Network;

}]);


/**
 * Networks Service
 *
 * Provides an array of all known networks.
 */
data.factory('networks', [
    'Storage', 'Network',
    function networksFactory(Storage, Network) {

  var storage = new Storage('networks', [
    {
      config: {
        name: 'Foo',
        autoConnect: true,
      },
      lastState: {
        connection: 'connected',
        unreadCount: 0,
      },
      channels: [
        {
          config: {
            name: 'channel1',
          },
          lastState: {
            joined: true,
            unreadCount: 0,
            focused: true,
          }
        },
        {
          config: {
            name: 'channel2',
          },
          lastState : {
            unreadCount: 23,
            joined: true,
          }
        }
      ]
    },
    {
      config: {
        name: 'Bar',
      },
      lastState: {
        connection: 'connection lost',
        unreadCount: 32,
      },
      channels: [
        {
          config: {
            name: 'channel3',
            autoJoin: true,
          },
          lastState: {
            unreadCount: 0,
          }
        },
        {
          config: {
            name: 'channel4',
          },
          lastState: {
            unreadCount: 0,
          }
        }
      ]
    }
  ]);

  var networks = [];

  Network.prototype._storage = storage;
  Network.prototype._networks = networks;

  storage.data.forEach(function(net) {
    networks.push(new Network(net));
  });

  networks.new = function() {
    return new Network();
  };

  return networks;

}]);
