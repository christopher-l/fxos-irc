'use strict';

describe('irc-context-menu', function() {

  var scope;
  var element;

  beforeEach(module('irc.ui'));

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

describe('irc-theme-group', function() {

  beforeEach(module('irc.ui'));

  var scope;
  var head;
  var onThemeGroupRemove;
  var onThemeColorRemove;
  var onNotThemeColorRemove;

  var updateTheme = function() {
    scope.theme = 'new-theme';
    scope.$digest();
  };

  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope.$new();
    head = $compile('<head></head>')(scope);
    var themeGroup =
        $compile('<meta content="{{theme}}" irc-theme-group>')(scope);
    var themeColor = $compile('<meta name="theme-color">')(scope);
    var notThemeColor = $compile('<meta name="not-theme-color">')(scope);
    head.append(themeGroup);
    head.append(themeColor);
    head.append(notThemeColor);
    onThemeGroupRemove = jasmine.createSpy();
    onThemeColorRemove = jasmine.createSpy();
    onNotThemeColorRemove = jasmine.createSpy();
    themeGroup.bind('$destroy', onThemeGroupRemove);
    themeColor.bind('$destroy', onThemeColorRemove);
    notThemeColor.bind('$destroy', onNotThemeColorRemove);
  }));

  it('should remove the theme group element as content changes', function() {
    expect(onThemeGroupRemove).not.toHaveBeenCalled();
    updateTheme();
    expect(onThemeGroupRemove).toHaveBeenCalled();
  });

  it('should remove the theme color element as content changes', function() {
    expect(onThemeColorRemove).not.toHaveBeenCalled();
    updateTheme();
    expect(onThemeColorRemove).toHaveBeenCalled();
  });

  it('should not remove other elements as content changes', function() {
    updateTheme();
    expect(onNotThemeColorRemove).not.toHaveBeenCalled();
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
    scope.fun = jasmine.createSpy();
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

describe('irc-switch', function() {

  var scope;
  var element;

  beforeEach(module('irc.ui'));

  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope.$new();
    element = $compile('<div irc-switch="checked"></div>')(scope);
  }));

  it('should update the model', function() {
    expect(scope.checked).toBeUndefined();
    element[0].checked = true;
    element.triggerHandler('change');
    expect(scope.checked).toBeTruthy();
  });

  it('should update the element', function() {
    expect(element[0].checked).toBeUndefined();
    scope.checked = true;
    scope.$digest();
    expect(element[0].checked).toBeTruthy();
  });

});

describe('irc-slider', function() {

  var scope;
  var slider;
  var input;

  beforeEach(module('irc.ui'));

  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope.$new();
    scope.bananas = 3;
    slider = $compile('<irc-slider min="3" max="30" unit="bananas" ' +
        'model="bananas">Bananas</irc-slider>')(scope);
    input = slider.children()[0].els.input;
    scope.$digest();
  }));

  it('should set the minimum and maximum attributes', function() {
    expect(input.getAttribute('min')).toBe('3');
    expect(input.getAttribute('max')).toBe('30');
  });

  it('should update with the model', function() {
    expect(input.value).toBe('3');
    scope.bananas = 20;
    scope.$digest();
    expect(input.value).toBe('20');
  });

  it('should update the model on input', function() {
    input.value = 10;
    angular.element(input).triggerHandler('input');
    expect(scope.bananas).toBe('10');
  });

  it('should set the label', function() {
    expect(slider.find('label').html()).toContain('Bananas');
  });

  /* No tests for "unit", as it seems to be hard to access css pseudo elements
     from javascript */

});

describe('irc-dialog', function() {

  var scope;
  var element;

  beforeEach(module('irc.ui'));

  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope.$new();
    element = $compile('<div irc-dialog open="openDialog"></div>')(scope);
    element[0].open = jasmine.createSpy();
  }));

  it('should register the open function', function() {
    expect(element[0].open).not.toHaveBeenCalled();
    scope.openDialog();
    expect(element[0].open).toHaveBeenCalled();
  });

});
