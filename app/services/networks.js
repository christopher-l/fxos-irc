'use strict';

var networks = angular.module('irc.networks', [
  'irc.storage',
]);


networks.factory(
    'NetBase', [
      'netData',
      function NetBaseFactory(netData) {

  var Base = function(storageRef) {
    // Set up this._config and this._storageRef.
    // this._state must be set up by implementation.
    // this._storage and this._volatile must be set before first save.
    if (storageRef) {
      this._storageRef = storageRef;
      this._config = storageRef.config;
    } else {
      this.isNew = true;
      this._config = {};
      this._storageRef = {
        config: this._config,
      };
    }
  };

  Base.defineConfigProps = function(proto, props) {
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
  };

  Base.defineStateProps = function(proto, props) {
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
  };

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
      if (this.isNew) {
        this._create();
      }
      netData.storage.save();
    },
    delete: function() {
      var index = this._volatile.indexOf(this);
      this._volatile.splice(index, 1);
      this._storage.splice(index, 1);
      netData.storage.save();
    },
    compareConfig: function(config) {
      var self = this;
      function isEqual(prop) {
        /*jshint -W018 */
        return self._config[prop] ?
            self._config[prop] === config[prop] :
            !!self._config[prop] === !!config[prop];
        /*jshint +W018 */
      }
      return this._configProps.every(isEqual);
    },
    _create: function() {
      this._volatile.push(this);
      this._storage.push(this._storageRef);
      delete this.isNew;
    },
  };

  return Base;

}]);

networks.service(
    'netData', [
      'Storage',
      function netDataService(Storage) {
  this.storage = new Storage('networks', [
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

  this.networks = [];

}]);

networks.factory(
    'Channel', [
      'netData',
      'NetBase',
      function ChannelFactory(netData, Base) {

  var Channel = function(storageRef, network) {
    Base.call(this, storageRef);
    this._state = {
      unreadCount: 0,
    };
    if (storageRef) {
      // this._state = storageRef.lastState;
      this._setNetwork(network);
    }
  };

  Channel.prototype = Object.create(Base.prototype);
  Channel.prototype.constructor = Channel;

  Channel.prototype._setNetwork = function(network) {
    this.network = network;
    this._storage = this.network._storageRef.channels;
    this._volatile = this.network.channels;
  };

  Channel.prototype.applyConfig = function(config) { // Override
    if (this.isNew) {
      var network = netData.networks[config.networkIndex];
      this._setNetwork(network);
      delete config.networkIndex;
    }
    Base.prototype.applyConfig.call(this, config);
  };

  Channel.prototype._configProps = [
    'name',
    'autoJoin'
  ];

  Channel.prototype._stateProps = [
    'focused',
    'joined',
    'unreadCount',
  ];

  Base.defineConfigProps(Channel.prototype, Channel.prototype._configProps);
  Base.defineStateProps(Channel.prototype, Channel.prototype._stateProps);

  return Channel;

}]);


/**
 * Network Service
 *
 * Provides a constructor for network objects.
 */
networks.factory(
    'Network', [
      'netData',
      'NetBase',
      'Channel',
      function NetworkFactory(netData, NetBase, Channel) {

  var Network = function(storageRef) {
    NetBase.call(this, storageRef);
    this._storage = netData.storage.data;
    this._volatile = netData.networks;
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
      self.channels.push(new Channel(chan, self));
    });
  };

  Network.prototype = Object.create(NetBase.prototype);
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

  NetBase.defineConfigProps(Network.prototype, Network.prototype._configProps);
  NetBase.defineStateProps(Network.prototype, Network.prototype._stateProps);

  return Network;

}]);


/**
 * Networks Service
 *
 * Provides an array of all known networks.
 */
networks.factory(
    'networks', [
      'netData', 'Network', 'Channel',
      function networksFactory(netData, Network, Channel) {

  var saveToDisk = netData.storage.save.bind(netData.storage);
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

  netData.storage.data.forEach(function(net) {
    netData.networks.push(new Network(net));
  });

  netData.storage.save();

  netData.networks.newNetwork = function() {
    return new Network();
  };

  netData.networks.newChannel = function() {
    return new Channel();
  };

  return netData.networks;

}]);
