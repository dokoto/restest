'use strict';

var configurator = require('./configurator').create();
var restful = configurator.generate();
var ip = Config.fetch('connection', 'service.ip');
var app = require('./utils/app').create();
var appInfo = app.info();

function httpsServer() {
  var https = require('https');
  https.createServer(restful.options, restful.app).listen(Config.fetch('connection', 'service.port'), function () {
    var address = this.address();
    Logger.trace(appInfo.name + ' service listening connections at https://%s:%s with pid: ', ip, address.port, process.pid);
    console.log(appInfo.name + ' service listening connections at https://%s:%s with pid: ', ip, address.port, process.pid);
  });
}

function httpServer() {
  restful.app.listen(Config.fetch('connection', 'service.port'), function () {
    var address = this.address();
    Logger.trace(appInfo.name + ' service listening connections at http://%s:%s with pid: ', ip, address.port, process.pid);
    console.log(appInfo.name + '  service listening connections at http://%s:%s with pid: ', ip, address.port, process.pid);
  });
}

if (restful.options.nocluster === true) {
  if (restful.options.nohttps === true) {
    httpServer();
  } else {
    httpsServer();
  }
} else {
  var cluster = require('express-cluster');
  cluster(function () {
    if (restful.options.nohttps === true) {
      httpServer();
    } else {
      httpsServer();
    }
  });
}
