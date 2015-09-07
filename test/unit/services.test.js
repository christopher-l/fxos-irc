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

  var reload = function() {
    storage.items = {};
    storage.loadAll();
  };

  beforeEach(function() {
    mock = {localStorage: mockLocalStorage({})};
    mock.addEventListener = angular.noop;
    module(function($provide) {
      $provide.value('$window', mock);
    });
    inject(function($injector) {
      storage = $injector.get('storage');
    });
  });

  it('should restore nothing', function() {
    expect(storage.items).toEqual({});
  });

  it('should take a string', function() {
    storage.items.foo = 'bar';
    expect(storage.items).toEqual({foo: 'bar'});
  });

  it('should clear on reload if not saved', function() {
    storage.items.foo = 'bar';
    expect(storage.items).toEqual({foo: 'bar'});
    reload();
    expect(storage.items).toEqual({});
  });

  it('should be persistent', function() {
    storage.items.foo = 'bar';
    storage.saveAll();
    reload();
    expect(storage.items).toEqual({foo: 'bar'});
  });

  it('should be persistent with multiple strings', function() {
    storage.items.foo = 'foo!';
    storage.items.bar = 'bar!';
    storage.items.baz = 'baz!';
    storage.saveAll();
    reload();
    expect(storage.items).toEqual({foo: 'foo!', bar: 'bar!', baz: 'baz!'});
  });

  it('should clear localStorage', function() {
    storage.items.foo = 'bar';
    expect(storage.items).toEqual({foo: 'bar'});
    storage.saveAll();
    storage.clear();
    expect(mock.localStorage).toEqual(mockLocalStorage({}));
  });

  it('should clear localStorage with multiple strings', function() {
    storage.items.foo = 'foo!';
    storage.items.bar = 'bar!';
    storage.items.baz = 'baz!';
    expect(storage.items).toEqual({foo: 'foo!', bar: 'bar!', baz: 'baz!'});
    storage.saveAll();
    storage.clear();
    expect(mock.localStorage).toEqual(mockLocalStorage({}));
  });

  it('should work with objects', function() {
    var obj = {foo: 'foo!', bar: 'bar!'};
    storage.items.obj = obj;
    storage.saveAll();
    reload();
    expect(storage.items).toEqual({obj: obj});
  });

  it('should not clear data that is not prefixed', function() {
    mock.localStorage.foo = 'bar';
    storage.clear();
    expect(mock.localStorage.foo).toEqual('bar');
  });

  it('should save individual items', function() {
    storage.items.foo = 'foo!';
    storage.items.bar = 'bar!';
    storage.save('foo');
    reload();
    expect(storage.items).toEqual({foo: 'foo!'});
  });

});
