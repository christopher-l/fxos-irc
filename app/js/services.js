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
 * provides the methods:
 *   save():  Write settings to localStorage.
 *   apply(): Apply changes and save.
 */
data.factory('settings', ['$rootScope', 'Storage',
    function settingsFactory($rootScope, Storage) {

  var settings = new Storage('settings', {
    darkTheme: false,
    fontSize: 12,
    onStartup: 'Reset State',
  });

  var listeners = {};
  for (var prop in settings.data) {
    listeners[prop] = [];
  }

  settings.apply = function(newVal, oldVal, scope) {
    for (var prop in listeners) {
      if (newVal[prop] !== oldVal[prop]) {
        listeners[prop].forEach(fn => fn(newVal[prop], scope));
      }
    }
    settings.save();
  };

  settings.register = function(prop, fn) {
    listeners[prop].push(fn);
    fn(settings.data[prop]);
  };

  return settings;

}]);


data.service('theme', ['settings', function Theme(settings) {

  var self = this;

  var lightTheme = {
    main: 'theme-communications',
    settings: 'theme-settings'
  };

  var darkTheme = {
    main: 'theme-media',
    settings: 'theme-media'
  };

  var currentTheme;
  var themeClass;

  settings.register('darkTheme', function(value, scope) {
    currentTheme = value ? darkTheme : lightTheme;
    if (self.titleScope) {
      setTimeout(() => self.titleScope.$digest());
    }
  });

  this.setThemeClass = function(value) {
    themeClass = value;
  };

  Object.defineProperties(this, {
    'group': {
      get: function() {
        return currentTheme[themeClass];
      }
    },
    'color': {
      value: 'var(--header-background)'
    }
  });

}]);


data.factory('Channel', [function ChannelFactory() {

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
        throw new Error('Tried to write access channel config.');
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

  return Channel;

}]);


/**
 * Network Service
 *
 * Provides a constructor for network objects.
 */
data.factory('Network', [
    'Channel', 'settings',
    function NetworkFactory(Channel, settings) {

  var Network = function(storageRef) {
    // Set up state
    this._state = {
      status: 'disconnected',
      unreadCount: 0,
      focused: false,
    };
    if (settings.onStartup === 'Restore Last State' && storageRef) {
      if (storageRef.lastState.focused) {
        this.focus();
      }
    }
    // Set up storageRef
    if (storageRef) {
      this._storageRef = storageRef;
      this._config = storageRef.config;
    } else { // Network is new
      this.new = true;
      this._config = {};
      this._storageRef = {
        config: this._config,
        channels: []
      };
    }
    this._storageRef.lastState = this._state;
    // Set up channels
    this.channels = [];
    var self = this;
    this._storageRef.channels.forEach(function(chan) {
      self.channels.push(new Channel(chan));
    });
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
    },
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
    'status',
    'unreadCount',
    'focused',
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
    'Storage', 'Network', 'Channel',
    function networksFactory(Storage, Network, Channel) {

  var storage = new Storage('networks', [
    {
      config: {
        name: 'Foo',
        autoConnect: true,
      },
      lastState: {
        status: 'connected',
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
        status: 'connection lost',
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
  Channel.prototype._storage = storage;
  Channel.prototype._networks = networks;

  var focus =  function() {
    if (networks.current) {
      networks.current.focused = false;
    }
    this.focused = true;
    networks.current = this;
  };

  Network.prototype.focus = focus;
  Channel.prototype.focus = focus;

  storage.data.forEach(function(net) {
    networks.push(new Network(net));
  });

  networks.new = function() {
    return new Network();
  };

  return networks;

}]);
