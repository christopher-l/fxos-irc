'use strict';

describe('irc-open', function() {

  var scope;
  var drawer;

  beforeEach(module('irc'));

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
