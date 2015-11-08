'use strict';

var networks = angular.module('irc.networks', [
  'irc.storage',
  'irc.lib',
]);

/**
 * Networks Service
 *
 * Provides an array of all known networks.
 */
networks.factory(
    'networks', [
      '$q',
      '$timeout',
      'Storage',
      'irc',
      function networksFactory($q, $timeout, Storage, irc) {

  /**
   * Base Class
   */
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
      storage.save();
    },
    delete: function() {
      var index = this._volatile.indexOf(this);
      this._volatile.splice(index, 1);
      this._storage.splice(index, 1);
      storage.save();
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


  /**
   * Channel Class
   */
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

  defineConfigProps(Channel.prototype, Channel.prototype._configProps);

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

  Channel.prototype.send = function(content) {
    var message = {
      type: 'message',
      user: this.network.nick,
      time: new Date(),
      content: content,
    };
    this.messages.push(message);
  };

  Channel.prototype.receive = function(user, content, time) {
    var message = {
      type: 'message',
      user: user,
      time: time || new Date(),
      content: content,
    };
    this.messages.push(message);
    this._onReceive();
  };

  Channel.prototype._onReceive = function() {
    if (!this.focused) {
      this.unreadCount++;
    }
  };


  /**
   * Network Class
   */
  function Network(storageRef) {
    Base.call(this, storageRef);
    this._storage = storage.data;
    this._volatile = networks;
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

  defineConfigProps(Network.prototype, Network.prototype._configProps);

  Network.prototype._setUpClient = function() {
    this.client = new irc.Client(this.host, this.nick, {
      port: this.port,
      secure: this.tls,
      selfSigned: true,
      autoConnect: false,
      userName: this.user,
      password: this.password,
      debug: true,
      channels: ['#chrisi-irc-test'],
    });
    console.log(this.client)
  };

  Network.prototype.connect = function() {
    var self = this;
    var deferred = $q.defer();
    this.status = 'connecting';
    var fail = $timeout(function() {
      deferred.reject();
      self.status = 'connection lost';
    }, 2000);
    this._setUpClient();
    this.client.connect(function() {
      self._onConnected();
      deferred.resolve();
      $timeout.cancel(fail);
    });
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


  /**
   * Set up networks
   */
  var storage = new Storage('networks', []);
  var networks = [];

  var saveToDisk = storage.save.bind(storage);
  Network.prototype._saveToDisk = saveToDisk;
  Channel.prototype._saveToDisk = saveToDisk;

  storage.data.forEach(function(net) {
    networks.push(new Network(net));
  });

  storage.save();

  networks.newNetwork = function() {
    return new Network();
  };

  networks.newChannel = function() {
    return new Channel();
  };

  return networks;

}]);
