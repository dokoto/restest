'use strict';

var Configurator = (function() {

  //*****************************************************
  // PRIVATE AND SHARED MEMORY OBJECTS
  //*****************************************************
  var express = require('express'),
    passport = require('passport'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    googleStrategy = require('passport-google-oauth2').Strategy,
    mongoDBStore = require('connect-mongodb-session')(session),
    log4js = require('log4js'),
    fs = require('fs'),
    path = require('path'),
    app = require('./utils/app').create();


  //*****************************************************
  // PUBLIC
  //*****************************************************
  /*
   * collections = {collectionKey, pathConfigFile}
   */
  function configurator(collections) {
    this._rest = null;
    this._options = {};
    this._Global();
    this._store = null;
  };

  configurator.prototype.generate = function() {
    this._Options();
    //this._SessionStorage();
    if (this._options.noAuth === false) {
      this._Passport();
    }
    this._Express();
    this._log4js();
    this._Definitions();

    return {
      app: this._rest,
      options: this._options
    }
  };

  configurator.prototype._Global = function() {
    global.Base = process.cwd();
    global.Config = require('./utils/Config').create([{
      collectionKey: 'connection',
      pathConfigFile: '/config/connection.json'
    }, {
      collectionKey: 'https',
      pathConfigFile: '/config/https.json'
    }, {
      collectionKey: 'db',
      pathConfigFile: '/config/db.json'
    }]);

    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed.  Otherwise, the user will be redirected to the
    //   login page.
    global.ensureAuthenticated = function(req, res, next) {
      if (req.isAuthenticated()) {
        Logger.info('User authenticated');
        return next();
      }
      Logger.info('User not authenticated');
      res.redirect('/noauth')
    };

  };

  configurator.prototype._Options = function() {
    /*
     * ALERTA !!! HAY QUE REGENERAR LAS KEYS
     * - openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
     * - openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
     */
    this._options.key = fs.readFileSync(path.join(Base, Config.fetch('https', 'https.pathToKey')));
    this._options.cert = fs.readFileSync(path.join(Base, Config.fetch('https', 'https.pathToCert')));

    // ARGUMENTS
    if (process.argv.indexOf("--help") != -1) {
      this._showHelp();
      process.exit();
    }

    this._options.nocluster = false;
    if (process.argv.indexOf("--nocluster") !== -1) {
      this._options.nocluster = true;
    }

    this._options.nohttps = false;
    if (process.argv.indexOf("--nohttps") !== -1) {
      this._options.nohttps = true;
    }

    this._options.noAuth = false;
    if (process.argv.indexOf("--noauth") !== -1) {
      this._options.noAuth = true;
    }

    this._options.debug = false;
    if (process.argv.indexOf("--debug") !== -1) {
      this._options.noAuth = true;
      this._options.nohttps = true;
      this._options.nocluster = true;
    }
  }

  configurator.prototype._showHelp = function() {
    console.log('$> restestd [options]');
    console.log('--nocluster [default cluster is on]');
    console.log('--nohttps [default is https]');
    console.log('--noauth [default is oAuth is on]');
    console.log('--debug [default is debug off] Set --noauth, --nohttps, --nocluster ON');
  };


/*
  configurator.prototype._SessionStorage = function() {
    this._store = new mongoDBStore({
      uri: Config.fetch('db', 'db.mongo.restest.uri'),
      collection: Config.fetch('db', 'db.mongo.restest.collections.sessions')
    });

    this._store.on('error', function(error) {
      assert.ifError(error);
      assert.ok(false);
    });
  };*/


  configurator.prototype._Passport = function() {
    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete GitHub profile is serialized
    //   and deserialized.
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });

    // https://console.developers.google.com/project
    passport.use(new googleStrategy({
        clientID: Config.fetch('connection', 'google.clientID'),
        clientSecret: Config.fetch('connection', 'google.clientSecret'),
        callbackURL: Config.fetch('connection', 'service.url') + Config.fetch('connection', 'google.callback'),
        passReqToCallback: true
      },
      function(request, accessToken, refreshToken, profile, done) {
        User.findOrCreate({
          googleId: profile.id
        }, function(err, user) {
          return done(err, user);
        });
      }
    ));
  };

  configurator.prototype._log4js = function() {
    var log4js = require('log4js');
    fs.existsSync('log') || fs.mkdirSync('log')
    log4js.configure('./config/log4js.json');

    global.Logger = log4js.getLogger(app.info().name.toUpperCase());

  };

  configurator.prototype._Express = function() {
    this._rest = express();

    this._rest.use(bodyParser.urlencoded({
      extended: true
    }));
    this._rest.use(methodOverride('X-HTTP-Method-Override'));
    this._rest.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      },
      store: this._store
    }));
    this._rest.use(passport.initialize());
    this._rest.use(passport.session());
    this._rest.use(express.static(__dirname + '/public'));

  };

  configurator.prototype._Definitions = function() {
    var definitions = require('./definitions');
    this._rest.use('/', definitions);
  };

  return configurator;

})();


module.exports = {
  create: function() {
    return new Configurator();
  }

};
