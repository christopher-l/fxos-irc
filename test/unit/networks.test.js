'use strict';

describe('networks', function() {

  var networks;
  var Network;
  var mock;

  beforeEach(module('irc.networks'));

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
