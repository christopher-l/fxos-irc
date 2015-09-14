'use strict';

describe('storage', function() {

  var Storage;
  var mock;

  beforeEach(module('irc.data'));

  beforeEach(function() {
    mock = {
      localStorage: {}
    };
    module(function($provide) {
      $provide.value('$window', mock);
    });
    inject(function($injector) {
      Storage = $injector.get('Storage');
    });
  });

  it('should restore nothing', function() {
    var storage = new Storage('foo', {});
    expect(storage.data).toEqual({});
  });

  it('should set the default value', function() {
    var storage = new Storage('foo', 'bar');
    expect(storage.data).toEqual('bar');
  });

  it('should take a string', function() {
    var storage = new Storage('foo', {});
    storage.data = 'bar';
    expect(storage.data).toEqual('bar');
    storage.save();
    expect(storage.data).toEqual('bar');
  });

  it('should keep its data when calling save()', function() {
    var storage = new Storage('foo', {});
    storage.data = 'bar';
    storage.save();
    expect(storage.data).toEqual('bar');
  });

  it('should save a string to localStorage', function() {
    var storage = new Storage('foo', {});
    storage.data = 'bar';
    storage.save();
    expect(mock.localStorage.foo).toEqual('"bar"');
  });

  it('should load a string from localStorage', function() {
    mock.localStorage.foo = '"bar"';
    var storage = new Storage('foo', {});
    expect(storage.data).toEqual('bar');
  });

  it('should take objects', function() {
    var storage = new Storage('foo', {});
    var obj = {foo: 'foo!', bar: 'bar!'};
    storage.data = obj;
    expect(storage.data).toEqual(obj);
    storage.data.baz = 'baz!';
    expect(storage.data.baz).toEqual('baz!');
  });

  it('should save objects to localStorage', function() {
    var storage = new Storage('foo', {});
    var obj = {foo: 'foo!', bar: 'bar!'};
    storage.data = obj;
    storage.save();
    expect(mock.localStorage.foo).toEqual(angular.toJson(obj));
    storage.data.baz = 'baz!';
    storage.save();
    expect(mock.localStorage.foo).toEqual(angular.toJson(obj));
  });

  it('should load objects from localStorage', function() {
    mock.localStorage.foo = '{"foo":"foo!","bar":"bar!"}';
    var storage = new Storage('foo', {});
    expect(storage.data).toEqual({foo: 'foo!', bar: 'bar!'});
  });

});

describe('settings', function() {

  var settings;
  var mock;

  beforeEach(module('irc.data'));

  beforeEach(function() {
    mock = {
      localStorage: {}
    };
    module(function($provide) {
      $provide.value('$window', mock);
    });
  });

  var load = function() {
    inject(function($injector) {
      settings = $injector.get('settings');
    });
  };

  it('should load the defaults', function() {
    load();
    expect(settings.darkTheme).toBe(false);
    expect(settings.fontSize).toBe(12);
  });

  it('should save to localStorage', function() {
    load();
    settings.darkTheme = true;
    settings.fontSize = 17;
    settings.save();
    expect(mock.localStorage.settings).toBe(angular.toJson(settings));
  });

  it('should load from localStorage', function() {
    mock.localStorage.settings = '{"darkTheme":true,"fontSize":17}';
    load();
    expect(settings.darkTheme).toBe(true);
    expect(settings.fontSize).toBe(17);
  });

});

describe('Network', function() {

  var network;
  var storageRef;
  var networks;
  var storage;

  beforeEach(module('irc.data'));

  describe('from storage', function() {

    beforeEach(inject(function(Network) {
      storageRef = {
        config: {
          name: 'Foo',
          autoConnect: true,
        },
        lastState: {
          unreadCount: 0,
          status: 'connected',
        },
        channels: []
      };
      network = new Network(storageRef);
      networks = ['fooo', network, 'baar'];
      storage = {
        data: ['foo', storageRef, 'bar'],
        save: jasmine.createSpy('storage.save')
      };
      Network.prototype._networks = networks;
      Network.prototype._storage = storage;
    }));

    it('should have the correct properties', function() {
      expect(Object.keys(network)).toEqual([
        '_state',
        '_storageRef',
        '_config',
        'channels'
      ]);
    });

    it('should read the config', function() {
      expect(network.name).toBe('Foo');
      expect(network.autoConnect).toBe(true);
    });

    it('should initialize a new state', function() {
      expect(network.status).toBe('disconnected');
    });

    it('should set up an empty channel list', function() {
      expect(network.channels).toEqual([]);
      expect(network.channels).not.toBe(storageRef.channels);
    });

    it('should link to storageRef', function() {
      expect(network._storageRef).toBe(storageRef);
    });

    it('should set up its storage reference', function() {
      expect(Object.keys(storageRef).length).toBe(3);
      expect(storageRef.config).toBe(network._config);
      expect(storageRef.lastState).toBe(network._state);
      expect(storageRef.channels).toEqual([]);
    });

    it('should not allow to change the config directly', function() {
      expect(function() {network.name = 'Bar';}).toThrow();
    });

    it('should allow to change the state', function() {
      network.status = 'connected';
      expect(network._state.status).toBe('connected');
    });

    it('should save the changed state', function() {
      network.status = 'connected';
      expect(network._storage.save).toHaveBeenCalled();
    });

    it('should give a copy of the config', function() {
      var config = network.getConfig();
      expect(config).not.toBe(network._config);
      expect(config).toEqual(network._config);
    });

    it('should apply a changed config', function() {
      var config = network.getConfig();
      config.name = 'Bar';
      config.autoConnect = false;
      network.applyConfig(config);
      expect(network.name).toBe('Bar');
      expect(network.autoConnect).toBe(false);
    });

    it('should save when applying a config', function() {
      var config = network.getConfig();
      expect(network._storage.save).not.toHaveBeenCalled();
      network.applyConfig(config);
      expect(network._storage.save).toHaveBeenCalled();
    });

    it('should save to storage', function() {
      var config = network.getConfig();
      network.applyConfig(config);
      expect(network._storageRef.config).toBe(network._config);
    });

    it('should delete the network from networks', function() {
      network.delete();
      expect(networks).toEqual(['fooo', 'baar']);
    });

    it('should delete the network from storage', function() {
      network.delete();
      expect(storage.data).toEqual(['foo', 'bar']);
      expect(storage.save).toHaveBeenCalled();
    });

  });

  describe('newly created', function() {

    beforeEach(inject(function(Network) {
      network = new Network();
      networks = ['fooo', 'baar'];
      storage = {
        data: ['foo', 'bar'],
        save: jasmine.createSpy('storage.save')
      };
      Network.prototype._networks = networks;
      Network.prototype._storage = storage;
    }));

    it('should have the correct properties', function() {
      expect(Object.keys(network)).toEqual([
        '_state',
        'new',
        '_config',
        '_storageRef',
        'channels'
      ]);
    });

    it('should set up its storage reference', function() {
      expect(Object.keys(network._storageRef).length).toBe(3);
      expect(network._storageRef.config).toBe(network._config);
      expect(network._storageRef.lastState).toBe(network._state);
      expect(network._storageRef.channels).toEqual([]);
    });

    it('should be marked new', function() {
      expect(network.new).toBe(true);
    });

    it('should initialize its state', function() {
      expect(network.status).toBe('disconnected');
    });

    it('should have an empty channel list', function() {
      expect(network.channels).toEqual([]);
    });

    it('should not yet be in the networks list', function() {
      expect(networks.length).toBe(2);
    });

    it('should be pushed to the networks list when saved', function() {
      network.save();
      expect(networks[2]).toBe(network);
    });

    it('should lose its new property when saved', function() {
      network.save();
      expect(network.new).toBeUndefined();
    });

  });

});

describe('networks', function() {

  var networks;
  var Network;
  var mock;

  beforeEach(module('irc.data'));

  beforeEach(function() {
    mock = {
      localStorage: {
        networks: '[]' // While other default for debugging
      }
    };
    module(function($provide) {
      $provide.value('$window', mock);
    });
    inject(function($injector) {
      networks = $injector.get('networks');
      Network = $injector.get('Network');
    });
  });

  it('should load empty netork list', function() {
    expect(networks instanceof Array).toBe(true);
    expect(networks.length).toBe(0);
  });

  it('should add networks', function() {
    networks.new().save();
    expect(networks.length).toBe(1);
    networks.new().save();
    expect(networks.length).toBe(2);
  });

  it('should focus networks', function() {
    networks.new().save();
    networks.new().save();
    expect(networks[0].focused).toBe(false);
    expect(networks[1].focused).toBe(false);
    networks[1].focus();
    expect(networks[0].focused).toBe(false);
    expect(networks[1].focused).toBe(true);
    networks[0].focus();
    expect(networks[0].focused).toBe(true);
    expect(networks[1].focused).toBe(false);
  });

  describe('new network', function() {

    var network;

    beforeEach(inject(function(_Network_) {
      network = networks.new();
    }));

    it('should be a new instance of Network', function() {
      expect(network).toBeDefined();
      expect(network).toEqual(new Network());
      expect(network instanceof Network).toBe(true);
    });

    it('should be pushed to the storage when saved', function() {
      var storage = angular.fromJson(mock.localStorage.networks);
      expect(storage.length).toBe(0);
      network.save();
      storage = angular.fromJson(mock.localStorage.networks);
      expect(storage.length).toBe(1);
      expect(storage[0].config).toEqual({});
      expect(storage[0].channels).toEqual([]);
      expect(storage[0].lastState).toEqual(network._state);
    });

  });

});
