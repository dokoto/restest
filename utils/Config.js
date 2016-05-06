'use strict';

var Config = (function () {

  //*****************************************************
  // PRIVATE
  //*****************************************************


  //*****************************************************
  // PUBLIC
  //*****************************************************
  /*
   * collections = {collectionKey, pathConfigFile}
   */
  function config(collections) {
    this._collections = this._loadCollections(collections);
  }

  config.prototype.fetch = function (collection, key) {
    return this._resolveComplexVal(this._getValue(collection, key));
  };


  config.prototype._resolveComplexVal = function (funcNode) {
    try {

      if (funcNode === undefined) {
        throw 'funcNode is undefined';
      }

      if (typeof funcNode === 'object') {
        var dFunc, i;
        var funcDeps = [];
        var funcDepsTxt = [];

        for (i = 0; i < funcNode.nodeLibs.length; i++) {
          funcDeps.push(require(funcNode.nodeLibs[i]));
          funcDepsTxt.push(funcNode.nodeLibs[i]);
        }
        funcDepsTxt.push(funcNode.code);
        dFunc = Function.apply(null, funcDepsTxt);

        return dFunc.apply(this._collections, funcDeps);
      } else {
        return funcNode;
      }
    } catch (error) {
      console.error(error);
    }
  };

  config.prototype._loadCollections = function(collections) {
    if (Array.isArray(collections) === false) {
      console.error('collections must be an Array');
      return [];
    }
    var path = require('path');
    var loadedCols = {};
    for(var collection in collections) {
      if(collections.hasOwnProperty(collection)) {
        //console.log('[utils.Conf] Adding Key : "' + collections[collection].collectionKey + '" from : ' + collections[collection].pathConfigFile);
        loadedCols[collections[collection].collectionKey] = require(path.join(Base, collections[collection].pathConfigFile) );
      }
    }
    //console.log('Collections added: ');
    //console.log(JSON.stringify(loadedCols));

    return loadedCols;
  };

  config.prototype._getValue = function(collection, key) {
    try {
      return this._collections[collection][key].value;
    } catch(error){
      console.error('Error trying to fetch collection: ' + collection + '[' + key + ']');
      console.error(error.message);
    }
  };


  return config;

})();


module.exports = {
  create: function (collections) {
    return new Config(collections);
  }

};
