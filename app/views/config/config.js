'use strict';

var config = angular.module('irc.views.config', []);


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

    // Set `focused` to true just a moment after input had the focus, so it can
    // be restored after the button is clicked.
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
