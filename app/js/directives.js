'use strict';

var irc = angular.module('irc');

irc.directive('ircAction', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('action', function() {
        scope.$apply(attrs.ircAction);
      });
    }
  };
});

irc.directive('ircOpen', ['$parse', function($parse) {
  return {
    restrict: 'A',
    priority: 100,
    link: function(scope, element, attrs) {
      var model = $parse(attrs.ircOpen);
      scope.$watch(model, function(value) {
        if (value) {
          element[0].setAttribute('open', '');
        } else {
          element[0].removeAttribute('open');
        }
      });
      scope.$watch(function() {
        return element[0].hasAttribute('open');
      }, function(value) {
        model.assign(scope, value);
      });
      new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' &&
              mutation.attributeName === 'open') {
            scope.$digest();
          }
        });
      }).observe(element[0], {attributes: true});
    }
  };
}]);

irc.directive('ircClientHeight', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.ircClientHeight);
      scope.$watch(function() {
        return element.prop('clientHeight');
      }, function(value) {
        model.assign(scope, value);
      });
    }
  };
}]);

irc.directive('ircMin', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element[0].els.input.min = attrs.ircMin;
    }
  };
});

irc.directive('ircMax', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element[0].els.input.max = attrs.ircMax;
    }
  };
});

irc.directive('ircSlider', ['$compile', '$parse', function($compile, $parse) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      unit: '@'
    },
    template: `
      <gaia-slider>
        <label ng-transclude></label>
        <output unit="{{unit}}"></output>
      </gaia-slider>
      <style>
        output[unit={{unit}}]::after {
          content: '{{unit}}' !important;
        }
      </style>`,
    link: function(scope, element, attrs) {
      var slider = element.children('gaia-slider')[0];
      var input = angular.element(slider.els.input);
      input[0].min = attrs.min;
      input[0].max = attrs.max;
      input.attr('ng-model', attrs.model);
      $compile(input)(scope.$parent);

      var model = $parse(attrs.model);
      scope.$parent.$watch(model, function() {
        slider.updateOutput();
      });
    }
  };
}]);
