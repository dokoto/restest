'use strict';

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  log4js = require('log4js'),
  fs = require('fs'),
  path = require('path');


var Configurator = (function () {

  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;

  function _Global() {
    global.Base = process.cwd();
    global.Config = require('./utils/Config').create([{
      collectionKey: 'connection',
      pathConfigFile: '/config/connection.json'
    }, {
      collectionKey: 'https',
      pathConfigFile: '/config/https.json'
    }]);
  }

  function _Options() {
    /*
     * ALERTA !!! HAY QUE REGENERAR LAS KEYS
     * - openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
     * - openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
     */
    _self.options.key = fs.readFileSync(path.join(Base, Config.fetch('https', 'https.pathToKey')));
    _self.options.cert = fs.readFileSync(path.join(Base, Config.fetch('https', 'https.pathToCert')));

    // ARGUMENTS
    if (process.argv.indexOf("--help") != -1) {
      _showHelp();
      process.exit();
    }

    _self.options.nocluster = false;
    if (process.argv.indexOf("--nocluster") != -1) {
      _self.options.nocluster = true;
    }

    // Take value from argument key=val :. -c paco
    //city = process.argv[process.argv.indexOf("-c") + 1];
  }

  function _showHelp() {
    console.log('$> restestd [options]');
    console.log('--nocluster [default cluster is on]');
  }

  function _log4js() {
    var log4js = require('log4js');
    fs.existsSync('log') || fs.mkdirSync('log')
    log4js.configure('./config/log4js.json');

    global.Logger = log4js.getLogger("OWL");

  }

  function _Express() {
    _self.rest = express();

    _self.rest.use(bodyParser.urlencoded({
      extended: true
    }));
    _self.rest.use(methodOverride('X-HTTP-Method-Override'));
    _self.rest.use(express.static(__dirname + '/public'));
  }

  function _Definitions() {
    var definitions = require('./definitions');
    _self.rest.use('/', definitions);
  }

  //*****************************************************
  // PUBLIC
  //*****************************************************
  /*
   * collections = {collectionKey, pathConfigFile}
   */
  function configurator(collections) {
    _self = this;
    this.rest = null;
    this.options = {};
    this.store = null;
    _Global();
  }

  configurator.prototype.generate = function () {
    _Options();
    _Express();
    _log4js();
    _Definitions();

    return {
      app: this.rest,
      options: this.options
    }
  };


  return configurator;

})();


module.exports = {
  create: function () {
    return new Configurator();
  }

};