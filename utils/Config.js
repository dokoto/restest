'use strict';

var Config = (function () {

  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;
  var _collections = null;
  
  function _resolveComplexVal (funcNode) {
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

        return dFunc.apply(_collections, funcDeps);
      } else {        
        return funcNode;
      }
    } catch (error) {
      console.error(error);
    }
  }

  function _loadCollections(collections) {    
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
  }

  function _getValue(collection, key) {
    try {
      return _collections[collection][key].value;
    } catch(error){
      console.error('Error trying to fetch collection: ' + collection + '[' + key + ']');
      console.error(error.message);
    }
  }

  //*****************************************************
  // PUBLIC
  //*****************************************************
  /*
   * collections = {collectionKey, pathConfigFile}
   */
  function config(collections) {
    _self = this;
    _collections = _loadCollections(collections);
  }

  config.prototype.fetch = function (collection, key) {
    return _resolveComplexVal(_getValue(collection, key));
  };


  return config;

})();


module.exports = {
  create: function (collections) {
    return new Config(collections);
  }

};