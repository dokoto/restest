'use strict';

var App = (function () {

  //*****************************************************
  // PRIVATE AND SHARED MEMORY OBJECTS
  //*****************************************************
  var path = require('path');

  //*****************************************************
  // PUBLIC
  //*****************************************************
  /*
   * collections = {collectionKey, pathConfigFile}
   */
  function app(collections) {
  }

  app.prototype.info = function() {
    var name = this._appName();
    return {
        name: name.name,
        fileName: name.file
    };
  };

  app.prototype._appName = function () {
    var appName = {};

    appName.file = process.argv[1].substr(process.argv[1].lastIndexOf(path.sep)+1);
    appName.name = appName.file.substr(0, appName.file.lastIndexOf('.'));

    return appName;
  };


  return app;

})();


module.exports = {
  create: function () {
    return new App();
  }

};
