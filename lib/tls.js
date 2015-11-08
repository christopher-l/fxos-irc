var Connection = require('./Connection.js').Connection;

exports.connect = function (port, server, creds, cb) {
  return new Connection(port, server, true);
};
