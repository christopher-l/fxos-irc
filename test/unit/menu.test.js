'use strict';

describe('irc-context-menu', function() {

  var scope;
  var element;

  beforeEach(module('irc.views.menu'));

  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope.$new();
    scope.fun = jasmine.createSpy();
    element = $compile('<div irc-context-menu="fun()"></div>')(scope);
  }));

  it('should evaluate its expression when "contextmenu" is fired', function() {
    expect(scope.fun).not.toHaveBeenCalled();
    element.triggerHandler('contextmenu');
    expect(scope.fun).toHaveBeenCalled();
  });

});


describe('irc-client-height', function() {

  var scope;
  var outer;
  var inner;

  beforeEach(module('irc.views.menu'));

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
