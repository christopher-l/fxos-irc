'use strict';

describe('irc-theme-group', function() {

  beforeEach(module('irc.ui'));

  var scope;
  var head;
  var themeGroup;
  var themeColor;
  var notThemeColor;

  var updateTheme = function() {
    scope.theme = 'new-theme';
    scope.$digest();
  };

  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope.$new();
    head = $compile('<head></head>')(scope);
    themeGroup = $compile('<meta content="{{theme}}" irc-theme-group>')(scope);
    themeColor = $compile('<meta name="theme-color">')(scope);
    notThemeColor = $compile('<meta name="not-theme-color">')(scope);
    head.append(themeGroup);
    head.append(themeColor);
    head.append(notThemeColor);

    scope.onThemeGroupRemove = function() {};
    spyOn(scope, 'onThemeGroupRemove');
    themeGroup.bind('$destroy', scope.onThemeGroupRemove);

    scope.onThemeColorRemove = function() {};
    spyOn(scope, 'onThemeColorRemove');
    themeColor.bind('$destroy', scope.onThemeColorRemove);

    scope.onNotThemeColorRemove = function() {};
    spyOn(scope, 'onNotThemeColorRemove');
    notThemeColor.bind('$destroy', scope.onNotThemeColorRemove);
  }));

  it('should remove the theme group element as content changes', function() {
    expect(scope.onThemeGroupRemove).not.toHaveBeenCalled();
    updateTheme();
    expect(scope.onThemeGroupRemove).toHaveBeenCalled();
  });

  it('should remove the theme color element as content changes', function() {
    expect(scope.onThemeColorRemove).not.toHaveBeenCalled();
    updateTheme();
    expect(scope.onThemeColorRemove).toHaveBeenCalled();
  });

  it('should not remove other elements as content changes', function() {
    updateTheme();
    expect(scope.onNotThemeColorRemove).not.toHaveBeenCalled();
  });

  it('should append the elements again', function() {
    expect(head.children().length).toBe(3);
    updateTheme();
    expect(head.children().length).toBe(3);
  });
  
});

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
