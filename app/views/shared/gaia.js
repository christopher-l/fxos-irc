'use strict';
/* global MutationObserver */

var gaia = angular.module('irc.views.gaia', []);


// Evaluate a given expression when the "action" event is fired by the
// object.
gaia.directive('ircAction', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('action', function() {
        scope.$apply(attrs.ircAction);
      });
    }
  };
});


// Like ngOpen, but also update the module, as the attribute changes.
gaia.directive('ircOpen', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      // This is what ngOpen does: update the open attribute
      var model = $parse(attrs.ircOpen);
      scope.$watch(model, function(value) {
        if (value) {
          element[0].setAttribute('open', '');
        } else {
          element[0].removeAttribute('open');
        }
      });
      // Bind to our own event
      element.bind('changed', function() {
        scope.$apply(function() {
          model.assign(scope, element[0].hasAttribute('open'));
        });
      });
      // Trigger the event
      new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' &&
              mutation.attributeName === 'open') {
            var oldValue = model(scope);
            var newValue = element[0].hasAttribute('open');
            if (oldValue !== newValue) {
              element.triggerHandler('changed');
            }
          }
        });
      }).observe(element[0], {attributes: true});
    }
  };
}]);


// Bind a gaia-switch element to a model.
gaia.directive('ircSwitch', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.ircSwitch);
      element.bind('change', function() {
        var value = element[0].checked;
        model.assign(scope, value);
        try {
          scope.$digest();
        } catch (e) {
          // We are already digesting when updated by model
        }
      });
      scope.$watch(model, function(value) {
        element[0].checked = value;
      });
    }
  };
}]);


// Wrap gaia-slider to include further attributes:
//   model: Passed as ngModel to the input
//   min:   The minimum input value
//   max:   The maximum input value
//   unit:  The unit appended to output field when shown to the user
gaia.directive('ircSlider', ['$compile', '$parse',
    function($compile, $parse) {
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
      // Update the output field
      var model = $parse(attrs.model);
      scope.$parent.$watch(model, function() {
        slider.updateOutput();
      });
    }
  };
}]);


// Bind a gaia-text-input to a model with the "model" attribute.
gaia.directive('ircTextInput', ['$compile', function($compile) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var input = angular.element(element[0].els.input);
      input.attr('ng-model', attrs.model);
      input.attr('name', attrs.name);
      element[0].required = !!(attrs.required === '' || attrs.required);
      input.attr('pattern', attrs.pattern);
      input.attr('minlength', attrs.minlength);
      input.attr('maxlength', attrs.maxlength);
      $compile(input)(scope);
    }
  };
}]);


// Bind a gaia-text-input-multiline to a model with the "model" attribute.
gaia.directive('ircTextInputMultiline', ['$compile', function($compile) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var input = angular.element(element[0].els.field);
      input.attr('ng-model', attrs.model);
      $compile(input)(scope);
    }
  };
}]);


// Bind a gaia-checkbox to a model with the "model" attribute.
gaia.directive('ircCheckbox', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.model);
      scope.$watch(model, function(value) {
        if (value) {
          element[0].setAttribute('checked', '');
        } else {
          element[0].removeAttribute('checked');
        }
      });
      element.bind('changed', function() {
        scope.$apply(function() {
          model.assign(scope, element[0].hasAttribute('checked'));
        });
      });
      new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' &&
              mutation.attributeName === 'checked') {
            var oldValue = model(scope);
            var newValue = element[0].hasAttribute('checked');
            if (oldValue !== newValue) {
              element.triggerHandler('changed');
            }
          }
        });
      }).observe(element[0], {attributes: true});
    }
  };
}]);


// Assign a model to a gaia-dialog, defining the following properties:
//   open():      Open the dialog
//   close():     Close the dialog
//   onConfirm(): Gets called when user confirms
//   onClose():   Gets called after the dialog closed
//   currentText: Text of current selection for gaia-dialog-select
// Provide an additional attribute 'model', that binds the selection of a
// gaia-dialog-select.
gaia.directive('ircDialog', ['$parse','$timeout', function($parse, $timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.ircDialog);
      if (!model(scope)) { model.assign(scope, {}); }
      model(scope).open = () => element[0].open();
      model(scope).close = () => element[0].close();
      // onConfirm
      if (element[0].els && element[0].els.submit) {
        angular.element(element[0].els.submit).bind('click', function() {
          scope.$apply(model(scope).onConfirm);
        });
      }
      // onClose
      if (model(scope).onClose) {
        element.on('closed', function() {
          scope.$apply(model(scope).onClose);
        });
      }
      // Bindings for gaia-dialog-select
      function updateView(value) {
        element[0].clearSelected();
        [].forEach.call(element.find('li'), function(item) {
          if (item.getAttribute('value') === value) {
            item.setAttribute('aria-selected', true);
            model(scope).currentText = item.innerHTML;
          }
        });
      }
      if (attrs.model) {
        var selectModel = $parse(attrs.model);
        element.bind('change', function(evt) {
          scope.$apply(function() {
            selectModel.assign(scope, element[0].value);
            model(scope).currentText = evt.detail.value;
          });
        });
        scope.$watch(selectModel, updateView);
        // Hack to initially update after ngRepeat finished
        $timeout(function() {
          var value = selectModel(scope);
          updateView(value);
        });
      }
    }
  };
}]);

// Provide additional attribute:
//   ircDisabled    Works like ngDisabled
gaia.directive(
    'ircValueSelector', [
      '$parse',
      function($parse) {

  function disable(element) {
    element.css({
      color: 'var(--text-color)',
      opacity: '0.5',
      cursor: 'default',
      pointerEvents: 'none',
    });
  }

  function enable(element) {
    element.css({
      color: '',
      opacity: '',
      cursor: '',
      pointerEvents: '',
    });
  }

  function link(scope, element, attrs) {
    var disabledModel = $parse(attrs.ircDisabled);
    scope.$watch(disabledModel, function(value) {
      if (value) {
        disable(element);
      } else {
        enable(element);
      }
    });
  }

  return {
    restrict: 'A',
    link: link
  };
}]);


// Tell gaia-icons not to complain about missing screen reader support for now
gaia.directive('i', [function() {
  return function(scope, element, attrs) {
    attrs.$set('aria-hidden', true);
  };
}]);
