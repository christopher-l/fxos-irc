'use strict';

var config = angular.module('irc.views.config', []);


// Prevent for more than 5 numbers to be typed in.
config.directive('ircPort', [function() {
  function link(scope, element, attrs) {
    var input = element[0].els.input;
    input.addEventListener('keydown', function(evt) {
      if (input.value.length >= 5 && /^[0-9]$/.test(evt.key)) {
        evt.preventDefault();
      }
    });
  }
  return {
    restrict: 'A',
    link: link
  };
}]);


// Add a show/hide button to a gaia-text-input.
config.directive('ircPassword', [function() {
  function link(scope, element, attrs) {

    var show = false;
    var focused = false;
    var input = angular.element(element[0].els.input);
    var showButton = angular.element('<button>show</button>');

    // Add button to the DOM.
    input.after(showButton);

    // Initialize to 'hide'.
    attrs.$set('type', 'password');

    showButton.css({
      'position': 'absolute',
      'right': '1rem',
      'top': '0px',
      'height': '40px',
      'color': 'var(--highlight-color)',
      'font-style': 'italic',
      'font-size': '14px',
      'background': 'none',
    });

    input.css('padding-right', '4rem');

    showButton.on('click', function() {
      show = !show;
      var start = input[0].selectionStart;
      var end = input[0].selectionEnd;
      if (show) {
        showButton.text('hide');
        attrs.$set('type', 'text');
      } else {
        showButton.text('show');
        attrs.$set('type', 'password');
      }
      if (focused) {
        input[0].focus();
      }
      // Put cursor back where it was.
      input[0].setSelectionRange(start, end);
    });

    // Set `focused` to true for just a moment after input had the focus, so it
    // can be restored after the button is clicked.
    input.on('blur', function() {
      focused = true;
      setTimeout(function() {
        focused = false;
      }, 200);
    });
  }

  return {
    restrict: 'A',
    link: link
  };
}]);


// Focus on page load if gived expression evaluates to true.  Intended for
// gaia-text-input.
config.directive('ircAutofocus', ['$parse', function($parse) {
  function link(scope, element, attrs) {
    var model = $parse(attrs.ircAutofocus);
    if (model(scope)) {
      element[0].focus();
    }
  }
  return {
    restrict: 'A',
    link: link
  };
}]);


// The Channel Config Controller forces the input field to always have a '#'
// before the actual name.  This directive compensates when the user tries to
// delete the '#' or write in front of it.
config.directive('ircChannelName', [function() {
  var BACKSPACE = 8;
  var input;
  return {
    restrict: 'A',
    link: link
  };
  function link(scope, element, attrs) {
    input = element[0].els.input;
    input.addEventListener('keydown', onInput);
  }
  function onInput(evt) {
    var start = input.selectionStart;
    var end = input.selectionEnd;
    // Don't delete it
    if (evt.keyCode === BACKSPACE && start === 1 && end === 1) {
      evt.preventDefault();
    // If parts of the name are going to be overwritten, except the '#'
    } else if (start === 0 && end > 0) {
      input.setSelectionRange(1, end);
    // If something should be done in front if the '#', move the cursor behind
    // it instead
    } else if (start === 0 && end === 0) {
      evt.preventDefault();
      input.setSelectionRange(1, 1);
    }
  }
}]);
