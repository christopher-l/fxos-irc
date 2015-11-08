var Connection = require('./Connection.js').Connection;

exports.createConnection = function (options, connectListener) {
  var socket =  new Connection(options.port, options.host, false);
  socket.addListener('open', connectListener);
  return socket;
};
