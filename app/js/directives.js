'use strict';

var ui = angular.module('irc.ui');

ui.directive('ircContextMenu', ['$parse', function($parse) {
  /* Binds to a long touch on mobile and right click on desktop. */
  /* from https://stackoverflow.com/a/15732476 */
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var fn = $parse(attrs.ircContextMenu);
      element.bind('contextmenu', function(event) {
        scope.$apply(function() {
          event.preventDefault();
          fn(scope, {$event:event});
        });
      });
    }
  };
}]);


ui.directive('ircThemeGroup',[function() {
  /* Whenever "theme-group" changes, remove and reappend the "theme-group" and
     "theme-color" meta tags to force the statusbar to apply the new colors. */
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      attrs.$observe('content', function() {
        var parent = element.parent();
        if (!parent[0]) { return; }
        var themeColor = angular.element(
            parent[0].querySelector('meta[name=theme-color]'));
        element.remove();
        themeColor.remove();
        parent.append(element);
        parent.append(themeColor);
      });
    }
  };
}]);

ui.directive('ircAction', function() {
  /* Evaluate a given expression when the "action" event is fired by the
     object. */
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('action', function() {
        scope.$apply(attrs.ircAction);
      });
    }
  };
});

ui.directive('ircOpen', ['$parse', function($parse) {
  /* Like ngOpen, but has further features. */
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      /* This is what ngOpen does: update the open attribute. */
      var model = $parse(attrs.ircOpen);
      scope.$watch(model, function(value) {
        if (value) {
          element[0].setAttribute('open', '');
        } else {
          element[0].removeAttribute('open');
        }
      });
      /* We additionally update the module. */
      scope.$watch(function() {
        return element[0].hasAttribute('open');
      }, function(value) {
        model.assign(scope, value);
      });
      /* We have to notify angular of any attribute updates from outside. */
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

ui.directive('ircClientHeight', ['$parse', function($parse) {
  /* Bind the client-height property to a given scope variable. */
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

ui.directive('ircSwitch', ['$parse', function($parse) {
  /* Bind a gaia-switch element to a model. */
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.ircSwitch);
      element.bind('change', function() {
        var value = element[0].checked;
        model.assign(scope, value);
        try {
          scope.$digest();
        } catch(e) {} // We are already digesting when updated by model.
      });
      scope.$watch(model, function(value) {
        element[0].checked = value;
      });
    }
  };
}]);

ui.directive('ircSlider', ['$compile', '$parse', function($compile, $parse) {
  /* Wrap gaia-slider to include further attributes:
       model: passed as ngModel to the input
       min:   the minimum input value
       max:   the maximum input value
       unit:  the unit appended to output field when shown to the user */
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
        irc-slider > gaia-slider > output[unit={{unit}}]::after {
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
      /* Update the output field. */
      var model = $parse(attrs.model);
      scope.$parent.$watch(model, function() {
        slider.updateOutput();
      });
    }
  };
}]);

ui.directive('ircTextInput', ['$compile', function($compile) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var input = angular.element(element[0].els.input);
      input.attr('ng-model', attrs.model);
      $compile(input)(scope);
    }
  };
}]);

ui.directive('ircDialog', ['$parse', function($parse) {
  /* Assign a model to a gaia-dialog, defining the following properties:
       open:  function to open the dialog
       close: function to close the dialog */
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.ircDialog);
      if (!model(scope)) { model.assign(scope, {}); }
      model(scope).open = () => element[0].open();
      model(scope).close = () => element[0].close();
      if (element[0].els && element[0].els.submit) {
        angular.element(element[0].els.submit).bind('click', function() {
          scope.$apply(model(scope).onConfirm);
        });
      }
    }
  };
}]);
