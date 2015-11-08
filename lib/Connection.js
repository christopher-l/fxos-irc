function emit (evt) {
  if (evt === 'connect') {
    evt = 'open';
  }
  //console.log('trying to emit ' + evt);
  var args = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
  var e = new CustomEvent(evt, { detail: args });
  this.eventEmitter.dispatchEvent(e);
};

function once (evt, cb) {
  var handler = (function (data) {
    //console.log('once listener for ' + evt);
    this.eventEmitter.removeEventListener(evt, handler);
    cb.call(this, data);
  }).bind(this);
  this.eventEmitter.addEventListener(evt, handler);
};

function Connection (port, server, useSSL) {
  if (typeof useSSL === "undefined") {
    useSSL = false;
  }
  this._conn = navigator.mozTCPSocket.open(server, port, { useSecureTransport: useSSL, useSSL: useSSL });
  this.eventEmitter = document.createDocumentFragment();
  this.connected = false;
  this.authorized = useSSL;
  this.authorizationError = null;
};

Connection.prototype = {
  addListener: function (evt, cb) {
    if (evt === 'connect') {
      evt = 'open';
    } else if (evt === 'end') {
      evt = 'close';
    }
    //console.log('trying to set on' + evt + ' on the connection');
    this._conn['on' + evt] = function (msg) {
      //console.log('connection got an on' + evt + ' event');
      if(msg && 'data' in msg) {
        cb(msg.data);
      } else {
        cb();
      }
    };
  },
  once: once,
  emit: emit,
  write: function (data) {
    //console.log('sending: ' + data);
    this._conn.send(data);
  },
  end: function () {
    this._conn.close();
    this.emit('end');
  },
  setTimeout: function () {},
  setEncoding: function () {},
};

exports.Connection = Connection;
