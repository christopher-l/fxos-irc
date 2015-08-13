(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

var Channel = function(name) {
  this.name = name;
};

module.exports = Channel;

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('irc-channel',this));
