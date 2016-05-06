'use strict';

var Tpl = (function() {

  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _ = require('underscore');

  //*****************************************************
  // PUBLIC
  //*****************************************************
  function tpl() {
  }

  tpl.prototype.fromString = function(template, params) {
    if (typeof template !== 'object' && typeof template !== 'string') {
      throw new Error('"template" param must be object or string');
    }

    if (typeof template === 'object') {
      template = JSON.stringify(template);
    }

    return this._compile(template, params);
  };

  tpl.prototype.fromFile = function(path, params) {
    var template = require(path);
    if (typeof template === 'object') {
      template = JSON.stringify(template);
    }
    return this._compile(template, params)
  };

  tpl.prototype._compile = function(template, params) {
    var compiled = _.template(template);
    return compiled(params);
  }

  return tpl;

})();


module.exports = {
  create: function() {
    return new Tpl();
  }

};
