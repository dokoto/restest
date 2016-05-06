'use strict';

var Net = (function () {

  //*****************************************************
  // PRIVATE
  //*****************************************************

  //*****************************************************
  // PUBLIC
  //*****************************************************

  function net() {
  }

  net.prototype.convProxyToBasicAuthorization = function () {
    var proxy = {
      user: Config.fetch('connection', 'proxy.user'),
      password: Config.fetch('connection', 'proxy.password')
    };

    return 'Basic ' + new Buffer(proxy.user + ':' + proxy.password).toString("base64");
  };

  net.prototype.convProxyToUrlWithCredentials = function () {
    var proxy = {
      url: Config.fetch('connection', 'proxy.url'),
      port: Config.fetch('connection', 'proxy.port'),
      user: Config.fetch('connection', 'proxy.user'),
      password: Config.fetch('connection', 'proxy.password')
    };

    var sep = '://',
      result = '';
    if (proxy.user !== '' && proxy.password !== '') {
      result = proxy.url.substr(0, proxy.url.indexOf(sep) + sep.length) + proxy.user + ':' + proxy.password + '@' + proxy.url.substr(proxy.url.indexOf(sep) + sep.length) + ':' + proxy.port;
    } else {
      result = proxy.url + ':' + proxy.port;
    }

    return result;
  }


  return net;

})();


module.exports = {
  create: function () {
    return new Net();
  }

};
