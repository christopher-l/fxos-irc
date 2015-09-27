'use strict';

var networks = angular.module('irc.networks', [
  'irc.storage'
]);


networks.factory('Channel', [function ChannelFactory() {

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
networks.factory('Network', [
    'Channel',
    function NetworkFactory(Channel) {

  var Network = function(storageRef) {
    // Set up state
    this._state = {
      status: 'disconnected',
      unreadCount: 0,
      focused: false,
      collapsed: false,
    };
    if (storageRef) {
      this._state.collapsed = storageRef.lastState.collapsed;
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
    compareConfig: function(config) {
      var self = this;
      function isEqual(prop) {
        return self._config[prop] ?
            self._config[prop] === config[prop] :
            !!self._config[prop] === !!config[prop];
      }
      return configProps.every(isEqual);
    },
  };

  var configProps = [
    'name',
    'autoConnect',
    'host',
    'port',
    'tls',
    'nick',
    'user',
    'password',
  ];

  configProps.forEach(function(key) {
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
    'collapsed',
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
networks.factory('networks', [
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

  storage.save();

  networks.new = function() {
    return new Network();
  };

  return networks;

}]);
