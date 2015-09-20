'use strict';

describe('irc-theme-group', function() {

  beforeEach(module('irc.views.main.directives'));

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
