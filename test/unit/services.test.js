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

describe('networks', function() {

  var networks;
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
  });

  var load = function() {
    inject(function($injector) {
      networks = $injector.get('networks');
    });
  };

  it('should load empty netork list', function() {
    mock.localStorage.networks = '[]';
    load();
    expect(networks instanceof Array).toBe(true);
    expect(networks.length).toBe(0);
  });

  describe('new network', function() {

    var network;

    beforeEach(function() {
      mock.localStorage.networks = '[]';
      load();
      network = networks.new();
    });

    it('should be defined', function() {
      expect(network).toBeDefined();
    });

    it('should have the correct properties', function() {
      expect(Object.keys(network)).toEqual([
        '_state',
        'new',
        '_config',
        '_storageNet',
        'channels'
      ]);
    });

    it('should be marked new', function() {
      expect(network.new).toBe(true);
    });

    it('should initialize its state', function() {
      expect(network.connection).toBe('disconnected');
    });

    it('should have an empty channel list', function() {
      expect(network.channels).toEqual([]);
    });

    it('should set up its storage reference', function() {
      expect(Object.keys(network._storageNet).length).toBe(3);
      expect(network._storageNet.config).toBe(network._config);
      expect(network._storageNet.lastState).toBe(network._state);
      expect(network._storageNet.channels).toEqual([]);
    });

    it('should not yet be in the networks list', function() {
      expect(networks.length).toBe(0);
    });

    it('should be pushed to the networks list when saved', function() {
      network.save();
      expect(networks[0]).toBe(network);
    });

    it('should lose its new property when saved', function() {
      network.save();
      expect(network.new).toBeUndefined();
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
