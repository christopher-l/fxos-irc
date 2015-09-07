'use strict';

describe('irc-action', function() {

  var scope;
  var element;

  beforeEach(module('irc.ui'));

  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope.$new();
    scope.fun = function() {};
    spyOn(scope, 'fun');
    element = $compile('<div irc-action="fun()"></div>')(scope);
  }));

  it('should not do anything when no event is fired', function() {
    expect(scope.fun).not.toHaveBeenCalled();
  });

  it('should evaluate its value when action event is fired', function() {
    element.triggerHandler('action');
    // equivalent to element[0].dispatchEvent(new CustomEvent('action'));
    expect(scope.fun).toHaveBeenCalled();
  });

});

describe('irc-open', function() {

  var scope;
  var drawer;

  beforeEach(module('irc.ui'));

  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope.$new();
    scope.drawerOpen = false;
    drawer = $compile('<div irc-open="drawerOpen"></div>')(scope);
    scope.$digest();
  }));

  it('should update the attribute when the module changes', function() {
    expect(drawer[0].hasAttribute('open')).toBe(false);
    scope.drawerOpen = true;
    scope.$digest();
    expect(drawer[0].hasAttribute('open')).toBe(true);
    scope.drawerOpen = false;
    scope.$digest();
    expect(drawer[0].hasAttribute('open')).toBe(false);
  });

  it('should update the module when the attribute changes', function() {
    expect(scope.drawerOpen).toBe(false);
    drawer[0].setAttribute('open', '');
    scope.$digest();
    expect(scope.drawerOpen).toBe(true);
    drawer[0].removeAttribute('open');
    scope.$digest();
    expect(scope.drawerOpen).toBe(false);
  });

  it('should not change the attribute on its own', function() {
    expect(drawer[0].hasAttribute('open')).toBe(false);
    drawer[0].setAttribute('open', '');
    scope.$digest();
    expect(drawer[0].hasAttribute('open')).toBe(true);
    drawer[0].removeAttribute('open');
    scope.$digest();
    expect(drawer[0].hasAttribute('open')).toBe(false);
  });

});

describe('irc-client-height', function() {

  var scope;
  var outer;
  var inner;

  beforeEach(module('irc.ui'));

  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope.$new();
    outer = $compile('<div irc-client-height="clientHeight"></div>')(scope);
    inner = angular.element('<div></div>');
    outer.append(inner);
    scope.$digest();
  }));

  it('should initially have a height of 0', function() {
    expect(scope.clientHeight).toBe(0);
  });

  /* It seems the geometry is not calculated here */
  // it('should update the module', function() {
  //   inner.css('height', '100px');
  //   scope.$digest();
  //   expect(scope.clientHeight).toBe(100);
  // });

});
