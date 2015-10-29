/**
 * Services:
 *   networks   Provide an array of known networks.
 *
 * Other services serve the implementation of the above and should not be used
 * publicly.
 */
'use strict';

var networks = angular.module('irc.networks', [
  'irc.storage',
]);


/**
 * netData
 *
 * Provides stored and volatile data on networks.
 *
 * The volatile array is referenced by the networks service, too.  However there
 * exists a dependency cycle: networks depends on Network and Network depends on
 * the networks array.  Hence this service.
 */
networks.service(
    'netData', [
      'Storage',
      function netDataService(Storage) {
  this.storage = new Storage('networks', []);
  this.networks = [];
}]);


/**
 * NetBase
 *
 * A base class to Network and Channel.
 */
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
    this.messages = [];
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
    getIndex: function() {
      return this._volatile.indexOf(this);
    },
    _create: function() {
      this._volatile.push(this);
      this._storage.push(this._storageRef);
      delete this.isNew;
    },
  };

  return Base;

}]);


/**
 * Channel
 *
 * Constructor of channel objects referenced by networks.
 */
networks.factory(
    'Channel', [
      '$q',
      '$timeout',
      'netData',
      'NetBase',
      function ChannelFactory($q, $timeout, netData, Base) {

  function Channel(storageRef, network) {
    Base.call(this, storageRef);
    if (network) {
      this._setNetwork(network);
    }
    // set up state
    this.unreadCount = 0;
    this.joined = false;
  }

  Channel.prototype = Object.create(Base.prototype);
  Channel.prototype.constructor = Channel;

  Channel.prototype._setNetwork = function(network) {
    this.network = network;
    this._storage = this.network._storageRef.channels;
    this._volatile = this.network.channels;
  };

  Channel.prototype.applyConfig = function(config, network) { // Override
    if (this.isNew) {
      this._setNetwork(network);
      network.collapsed = false;
    }
    Base.prototype.applyConfig.call(this, config);
  };

  Channel.prototype._configProps = [
    'name',
    'autoJoin'
  ];

  Base.defineConfigProps(Channel.prototype, Channel.prototype._configProps);

  Channel.prototype.join = function() {
    var self = this;
    var deferred = $q.defer();
    if (!this.network.online) {
      deferred.reject();
    } else {
      $timeout(function() {
        self._onJoined();
        deferred.resolve();
      }, 500);
    }
    return deferred.promise;
  };

  Channel.prototype._onJoined = function() {
    this.joined = true;
    this.users = ['Fooooo', 'bar', 'baz',
      'asdfd',
      'asdfasdfasasdfasdfasdf',
      'asdf',
      'asdfasf',
      'asdf234',
      'asdfzxc',
      'asdflkj',
      'asdfqwe',
      'asdfxzcv',
      'asdfzc'
    ];
  };

  Channel.prototype.part = function() {
    this.joined = false;
    this.users = null;
  };


  Object.defineProperty(Channel.prototype, 'online', {
    get: function() {
      return this.joined;
    }
  });

  return Channel;

}]);


/**
 * Network Service
 *
 * Constructor of network objects inside the networks array.
 */
networks.factory(
    'Network', [
      '$q',
      '$timeout',
      'netData',
      'NetBase',
      'Channel',
      function NetworkFactory($q, $timeout, netData, NetBase, Channel) {

  function Network(storageRef) {
    NetBase.call(this, storageRef);
    this._storage = netData.storage.data;
    this._volatile = netData.networks;
    // Set up state
    this.status = 'disconnected';
    this.collapsed = true;
    // Set up channels
    if (!storageRef) {
      this._storageRef.channels = [];
    }
    this.channels = [];
    var self = this;
    this._storageRef.channels.forEach(function(chan) {
      self.channels.push(new Channel(chan, self));
    });
    if (this.autoConnect) {
      this.connect();
    }
  }

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

  NetBase.defineConfigProps(Network.prototype, Network.prototype._configProps);

  Network.prototype.connect = function() {
    var self = this;
    var deferred = $q.defer();
    this.status = 'connecting';
    $timeout(function() {
      self._onConnected();
      deferred.resolve();
    }, 500);
    return deferred.promise;
  };

  Network.prototype._onConnected = function() {
    this.status = 'connected';
    this.collapsed = false;
    this.channels.forEach(function(channel) {
      if (channel.autoJoin) {
        channel.join();
      }
    });
  };

  Network.prototype.disconnect = function() {
    this.status = 'disconnected';
    this.channels.forEach(function(channel) {
      channel.part();
    });
  };

  Object.defineProperty(Network.prototype, 'online', {
    get: function() {
      return this.status === 'connected';
    }
  });

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
