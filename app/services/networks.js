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
      '$window',
      'Storage',
      'irc',
      'toast',
      'alert',
      function networksFactory(
          $q, $timeout, $window, Storage, irc, toast, alert) {

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

  Channel.prototype.send = function(text) {
    this.network.client.say('#' + this.name, text);
    var message = {
      type: 'message',
      nick: this.network.client.nick,
      time: new Date(),
      text: text,
    };
    this.messages.push(message);
  };

  Channel.prototype.receive = function(nick, text, time) {
    var self = this;
    var message = {
      type: 'message',
      nick: nick,
      time: time || new Date(),
      text: text,
    };
    $timeout(function() {
      self.messages.push(message);
      self._onReceive();
    });
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
      autoConnect: false,
      userName: this.user,
      password: this.password,
      // debug: true,
      channels: ['#chrisi-irc-test'],
      retryCount: 0,
    });
    this.client.on('connect', function(evt) {
      console.log('connect');
    });
    this.client.on('registered', function(evt) {
      console.log('registered');
      console.log(evt);
    });
  };

  function getErrorInformation(evt) {
    if (evt.name === 'SecurityUntrustedCertificateIssuerError' ||
        (evt.name === 'SecurityError' &&
         evt.message === 'SecurityCertificate')) {
      return {
        type: 'certificate',
        description: 'cannot verify certificate'
      };
    } else if (evt.name === 'ConnectionRefusedError') {
      return {
        type: 'refused',
        description: 'connection refused'
      };
    } else if (evt.name === 'NetworkTimeoutError') {
      return {
        type: 'timeout',
        description: 'connection timeout'
      };
    } else {
      return {
        type: evt.name,
        description: evt.name
      };
    }
  }

  Network.prototype.connect = function() {
    var self = this;
    if (!this.client) {
      this._setUpClient();
    }
    var deferred = $q.defer();
    this._connect().then(function() {
      self._onConnected();
      deferred.resolve();
    }, function(evt) {
      self._onConnectionError(evt);
      deferred.reject();
    });
  };

  Network.prototype._connect = function() {
    var self = this;
    var deferred = $q.defer();
    $timeout(function() {
      self.status = 'connecting';
    });
    this.client.connect(function() {
      $timeout(function() {
        self.status = 'connected';
      });
      self.client.removeListener('netError', errorListener);
      deferred.resolve();
    });
    function errorListener(evt) {
      self.client.removeListener('netError', errorListener);
      deferred.reject(evt);
    }
    this.client.on('netError', errorListener);
    return deferred.promise;
  };

  Network.prototype._onConnected = function() {
    var self = this;
    $timeout(function() {
      self.collapsed = false;
    });
    this.channels.forEach(function(channel) {
      if (channel.autoJoin) {
        channel.join();
      }
    });
    this.client.on('netError', this._onConnectionLost.bind(this));
    this.client.on('message', this._onMessage.bind(this));
  };

  Network.prototype._onConnectionError = function(evt) {
    var self = this;
    $timeout(function() {
      self.status = 'error';
    });
    this.error = getErrorInformation(evt);

    if (getErrorInformation(evt).type === 'certificate') {
      var url = 'https://' + self.host + ':' + self.port;
      var message =
          'Certificate cannot be verified. If your server uses ' +
          'a self-signed certificate, try goint to ' +
          '<a href="' + url + '" target="_blank">' + url + '</a> ' +
          'and adding a permanent exception.';
      alert(message);
      return;
    }

    toast('Connection failed: ' + evt.name + '.' +
        (evt.message ? ' ' + evt.message : ''));
  };

  Network.prototype.reconnect = function(cb) {
    var self = this;
    if (this._reconnecting) { return; }
    this._reconnecting = true;
    return this._connect().finally(function() {
      delete self._reconnecting;
    });
  };

  Network.prototype.disconnect = function() {
    this.status = 'disconnected';
    this.channels.forEach(function(channel) {
      channel.part();
    });
  };

  Network.prototype._onConnectionLost = function(evt) {
    var self = this;

    if (getErrorInformation(evt).type === 'timeout') {
      this.reconnect();
      return;
    }

    $timeout(function() {
      self.status = 'connection lost';
    });
  };

  Network.prototype._onMessage = function(nick, to, text, message) {
    // console.log('nick: ' + nick);
    // console.log('to: ' + to);
    // console.log('text: ' + text);
    // console.log('message: ' + message);

    var channel = this.channels.find(function(channel) {
      return '#' + channel.name === to;
    });

    if (channel) {
      channel.receive(nick, text);
    } else {
      this.receive(nick, to + ': ' + text);
    }

  };

  Network.prototype.receive = function(nick, text, time) {
    var self = this;
    var message = {
      type: 'message',
      nick: nick,
      time: time || new Date(),
      text: text,
    };
    $timeout(function() {
      self.messages.push(message);
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

  $window.addEventListener('online', function() {
    networks.forEach(function(network) {
      if (network.status === 'connection lost') {
        network.reconnect();
      }
    });
  });

  return networks;

}]);
