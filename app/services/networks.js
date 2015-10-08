'use strict';

var networks = angular.module('irc.networks', [
  'irc.storage'
]);


var Base = function(storageRef, storage, volatile) {
  if (storageRef) {
    this._storageRef = storageRef;
    this._config = storageRef.config;
  } else { // Network / Channel is new
    this.new = true;
    this._config = {};
    this._storageRef = {
      config: this._config,
    };
  }
  this._storage = storage;
  this._volatile = volatile;
};

function defineConfigProps(proto, props) {
  props.forEach(function(key) {
    Object.defineProperty(proto, key, {
      get: function() {
        return this._config[key];
      },
      set: function(value) {
        throw new Error('Tried to write access config.');
      }
    });
  });
}

function defineStateProps(proto, props) {
  props.forEach(function(key) {
    Object.defineProperty(proto, key, {
      get: function() {
        return this._state[key];
      },
      set: function(value) {
        this._state[key] = value;
        this.save();
      }
    });
  });
}

Base.prototype = {
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
      this._volatile.push(this);
      this._storage.data.push(this._storageRef);
      delete this.new;
    }
    this._saveToDisk();
  },
  delete: function() {
    var index = this._volatile.indexOf(this);
    this._volatile.splice(index, 1);
    this._storage.data.splice(index, 1);
    this._saveToDisk();
  },
  compareConfig: function(config) {
    var self = this;
    function isEqual(prop) {
      return self._config[prop] ?
          self._config[prop] === config[prop] :
          !!self._config[prop] === !!config[prop];
    }
    return this._configProps.every(isEqual);
  },
};

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
networks.factory(
    'Network', [
      'Channel',
      function NetworkFactory(Channel) {

  var Network = function(storageRef, storage, volatile) {
    Base.call(this, storageRef, storage, volatile);
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
    this._storageRef.lastState = this._state;
    // Set up channels
    if (!storageRef) {
      this._storageRef.channels = [];
    }
    this.channels = [];
    var self = this;
    this._storageRef.channels.forEach(function(chan) {
      self.channels.push(new Channel(chan));
    });
  };

  Network.prototype = Object.create(Base.prototype);
  Network.prototype.constructor = Network;

  Network.prototype._configProps = [
    'name',
    'autoConnect',
    'host',
    'port',
    'tls',
    'nick',
    'user',
    'password',
  ];

  Network.prototype._stateProps = [
    'status',
    'unreadCount',
    'focused',
    'collapsed',
  ];

  defineConfigProps(Network.prototype, Network.prototype._configProps);
  defineStateProps(Network.prototype, Network.prototype._stateProps);

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

  var saveToDisk = storage.save.bind(storage);
  Network.prototype._saveToDisk = saveToDisk;
  Channel.prototype._saveToDisk = saveToDisk;

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
    networks.push(new Network(net, storage, networks));
  });

  storage.save();

  networks.new = function() {
    return new Network(null, storage, networks);
  };

  return networks;

}]);
