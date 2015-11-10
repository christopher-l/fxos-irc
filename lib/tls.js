var Connection = require('./Connection.js').Connection;

exports.connect = function (options, connectListener) {
  var socket =  new Connection(options.port, options.host, true);
  socket.addListener('open', connectListener);
  return socket;
};
