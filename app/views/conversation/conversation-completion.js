'use strict';

var completion = angular.module('irc.views.conversation.completion', []);


completion.factory('completeString', [function() {
  var lastHit; // Last word that was successfully completed
  var part;    // Part of the user input to be completed
  var left;    // Left bound position of part inside the string

  function complete(str, pos, completions, cycling) {
    if (!cycling) {
      // Set up lastHit, part, left and complete first match
      return completeNew();
    } else if (lastHit) {
      // Cycle through matches, updating lastHit
      return completeCycle();
    } else {
      // If no hit, leave the string as it is
      return str;
    }

    // Return true if part matches entry
    function matches(entry, part) {
      var partEntry = entry.slice(0, part.length).toLowerCase();
      return partEntry === part;
    }

    // Return next match, given that at least one entry matches part
    function cycle(current) {
      var index = completions.indexOf(current);
      for (var i = 1; i <= completions.length; i++) {
        var entry = completions[(i + index) % completions.length];
        if (matches(entry, part)) {
          lastHit = entry;
          return entry;
        }
      }
    }

    // Check a candidate and return completed string if successfull
    function completeEntry(entry, part) {
      if (!matches(entry, part)) {
        return false;
      }
      lastHit = entry;
      var suffix = '';
      if (left <= 0) {
        suffix += ',';
        if (str.slice(pos, pos+1) !== ' ') {
          suffix += ' ';
        }
      }
      return [
        str.slice(0, left),
        entry,
        suffix,
        str.slice(pos)
      ].join('');
    }

    // Return initial completion
    function completeNew() {
      part = str.toLowerCase();
      part = part.slice(0, pos);
      left = part.search(/\S+$/);
      part = part.slice(left);

      var newStr;
      completions.some(function(entry) {
        newStr = completeEntry(entry, part);
        if (newStr) { return true; }
      });
      if (!newStr) {
        lastHit = false;
        return str;
      }
      return newStr;
    }

    // Return completion after first call in a row
    function completeCycle() {
      if (pos >= 2 && str.slice(pos-2, pos) === ', ') {
        left = 0;
        pos = pos - 2;
      }
      return [
        str.slice(0, left),
        cycle(lastHit),
        str.slice(pos)
      ].join('');
    }
  }
  return complete;
}]);


completion.directive('ircComplete', [
    '$parse', 'completeString',
    function($parse, completeString) {

  function link(scope, element, attrs) {

    function complete() {
      var oldStr = input[0].value;
      var oldPos = input[0].selectionStart;
      var newStr = completeString(oldStr, oldPos, completions, cycling);
      var newPos = oldPos + newStr.length - oldStr.length;
      input[0].value = newStr;
      input[0].setSelectionRange(newPos, newPos);
      input[0].focus();
      cycling = true;
      input.triggerHandler('input');
    }

    var completions = $parse(attrs.ircComplete)(scope);
    var input = angular.element(element[0].els.field);
    var cycling = false;

    var completeButton =
        angular.element('<button>&#8677;</button>');
    completeButton.css({
      'position': 'absolute',
      'top': '0px',
      'height': '38px',
      'width': '40px',
      'padding-bottom': '2px',
      'font-size': '20px',
      'font-family': 'droid sans fallback',
      'background': 'none',
      'border': 'none',
    });
    input.css('padding-left', '40px');

    input.after(completeButton);

    completeButton.on('click', complete);
    input[0].addEventListener('keydown', function(evt) {
      var TABKEY = 9;
      if (evt.keyCode === TABKEY) {
        complete(input[0].value);
        evt.preventDefault();
      } else {
        cycling = false;
      }
    });
  }

  return {
    restrict: 'A',
    link: link
  };
}]);
