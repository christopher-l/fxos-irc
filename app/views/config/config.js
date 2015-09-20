'use strict';

var config = angular.module('irc.views.config', []);


// Add a show/hide button to a gaia-text-input.
config.directive('ircPassword', [function() {
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
