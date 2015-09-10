'use strict';

describe('storage', function() {

  var storage;
  var mock;

  beforeEach(module('irc.data'));

  var removeItem = function(item) {
    delete mock.localStorage[item];
  };

  var mockLocalStorage = function(localStorage) {
    localStorage.removeItem = removeItem;
    return localStorage;
  };

  var load = function() {
    inject(function($injector) {
      storage = $injector.get('storage');
    });
  };

  beforeEach(function() {
    mock = {localStorage: mockLocalStorage({})};
    mock.addEventListener = angular.noop;
    module(function($provide) {
      $provide.value('$window', mock);
    });
  });

  it('should restore nothing', function() {
    load();
    expect(storage).toEqual({});
  });

  it('should take a string', function() {
    load();
    storage.settings = 'bar';
    expect(storage.settings).toEqual('bar');
  });

  it('should save a string to localStorage', function() {
    load();
    storage.settings = 'bar';
    expect(mock.localStorage.settings).toEqual('"bar"');
  });

  it('should load a string from localStorage', function() {
    mock.localStorage.settings = '"bar"';
    load();
    expect(storage.settings).toEqual('bar');
  });

  it('should take objects', function() {
    load();
    var obj = {foo: 'foo!', bar: 'bar!'};
    storage.networks = obj;
    expect(storage.networks).toEqual(obj);
    storage.networks.baz = 'baz!';
    expect(storage.networks.baz).toEqual('baz!');
  });

  it('should save objects to localStorage', function(done) {
    load();
    var obj = {foo: 'foo!', bar: 'bar!'};
    storage.networks = obj;
    expect(mock.localStorage.networks).toEqual(angular.toJson(obj));
    storage.networks.baz = 'baz!';
    /* global setTimeout */
    setTimeout(function() {
      expect(mock.localStorage.networks).toEqual(angular.toJson(obj));
      done();
    });
  });

  it('should load objects from localStorage', function() {
    mock.localStorage.settings = '{"foo":"foo!","bar":"bar!"}';
    load();
    expect(storage.settings).toEqual({foo: 'foo!', bar: 'bar!'});
  });

});
