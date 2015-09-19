'use strict';
/* global MutationObserver */

var adapters = angular.module('irc.adapters');

// Bind to a long touch on mobile and right click on desktop.
// From https://stackoverflow.com/a/15732476
adapters.directive('ircContextMenu', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var fn = $parse(attrs.ircContextMenu);
      element.bind('contextmenu', function(event) {
        scope.$apply(function() {
          event.preventDefault();
          fn(scope, {$event: event});
        });
      });
    }
  };
}]);


// Whenever "theme-group" changes, remove and reappend the "theme-group" and
// "theme-color" meta tags to force the statusbar to apply the new colors.
adapters.directive('ircThemeGroup',[function() {
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

// Evaluate a given expression when the "action" event is fired by the
// object.
adapters.directive('ircAction', function() {
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
adapters.directive('ircOpen', ['$parse', function($parse) {
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

// Bind the client-height property to a given scope variable.
adapters.directive('ircClientHeight', ['$parse', function($parse) {
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

// Bind a gaia-switch element to a model.
adapters.directive('ircSwitch', ['$parse', function($parse) {
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
adapters.directive('ircSlider', ['$compile', '$parse',
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
adapters.directive('ircTextInput', ['$compile', function($compile) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var input = angular.element(element[0].els.input);
      input.attr('ng-model', attrs.model);
      $compile(input)(scope);
    }
  };
}]);

// Add a show/hide button to a gaia-text-input.
adapters.directive('ircPassword', [function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var show = false;
      function onShowButton() {
        var start = input[0].selectionStart;
        var end = input[0].selectionEnd;
        show = !show;
        if (show) {
          showButton.text('hide');
          attrs.$set('type', 'text');
        } else {
          showButton.text('show');
          attrs.$set('type', 'password');
        }
        input[0].focus();
        input[0].setSelectionRange(start, end);
      }
      var input = angular.element(element[0].els.input);
      attrs.$set('type', 'password');
      var showButton = angular.element('<button>show</button>');
      showButton.css({
        'position': 'absolute',
        'right': '1rem',
        'top': '0px',
        'height': '40px',
        'justify-content': 'center',
        'color': 'var(--highlight-color)',
        'font-style': 'italic',
        'font-size': '14px',
        'background': 'none',
      });
      input.css('padding-right', '4rem');
      input.after(showButton);
      showButton.on('click', onShowButton);
    }
  };
}]);

adapters.directive('ircComplete', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var completions = $parse(attrs.ircComplete)(scope);
      function complete() {
        var oldStr = input[0].value;
        var str = oldStr.toLowerCase();
        var pos = input[0].selectionStart;
        str = str.slice(0, pos);
        var left = str.search(/\S+$/);
        str = str.slice(left);

        completions.some(function(user) {
          var partUser = user.slice(0, str.length).toLowerCase();
          if (partUser === str) {
            var suffix = '';
            if (left === 0) {
              suffix += ',';
            }
            if (oldStr.slice(pos, pos+1) !== ' ') {
              suffix += ' ';
            }
            var newStr = [
              oldStr.slice(0, left),
              user,
              suffix,
              oldStr.slice(pos)
            ].join('');
            input[0].value = newStr;
            var newPos = left + user.length + suffix.length;
            input[0].setSelectionRange(newPos, newPos);
            input[0].focus();
            return true;
          }
        });
      }
      var input = angular.element(element[0].els.input);
      var completeButton =
          angular.element('<button>&#8677;</button>');
      completeButton.css({
        'position': 'absolute',
        'left': '.2rem',
        'top': '0px',
        'height': '38px',
        'padding-bottom': '2px',
        'font-size': '20px',
        'font-family': 'droid sans fallback',
        'background': 'none',
      });
      input.css('padding-left', '2rem');
      input.after(completeButton);
      completeButton.on('click', complete);
    }
  };
}]);

// Bind a gaia-checkbox to a model with the "model" attribute.
adapters.directive('ircCheckbox', ['$parse', function($parse) {
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
//   currentText: Text of current selection for gaia-dialog-select
// Provide an additional attribute 'model', that binds the selection of a
// gaia-dialog-select.
adapters.directive('ircDialog', ['$parse', function($parse) {
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
      // Bindings for gaia-dialog-select
      if (attrs.model) {
        var selectModel = $parse(attrs.model);
        element.bind('change', function(evt) {
          scope.$apply(function() {
            selectModel.assign(scope, element[0].value);
            model(scope).currentText = evt.detail.value;
          });
        });
        scope.$watch(selectModel, function(value) {
          element[0].clearSelected();
          [].forEach.call(element.find('li'), function(item) {
            if (item.getAttribute('value') === value) {
              item.setAttribute('aria-selected', true);
              model(scope).currentText = item.innerHTML;
            }
          });
        });
      }
    }
  };
}]);
