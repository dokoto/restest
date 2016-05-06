'use strict';

var tpl = require('./tpl').create();
var Q = require('q');

var Response = (function () {

  //*****************************************************
  // PRIVATE
  //*****************************************************

  //*****************************************************
  // PUBLIC
  //*****************************************************
  function response() {
  }

  response.prototype.standard = function (res, status, message) {

    var params = {
      status: status,
      message: message
    };

    res.status(status).json( tpl.fromFile('../templates/responses/standard.json', params) );
  };

  response.prototype.standardWithValue = function (res, status, message, value) {
    var params = {
      status: status,
      message: message,
      value: ((value===undefined)?'null':value)
    };

    res.status(status).json( params );
  };

  response.prototype.returnJSON = function(servResponse, promise, errorMsg) {
    var self = this;
    Q.when(promise, function(responseDoc) {
      if (responseDoc) {
        var resp = {};
        if (Array.isArray(responseDoc.data) === true) {
          resp.collection = [];
          for (var i = 0; i < responseDoc.data.length; i++) {
            resp.collection.push( (responseDoc.data[i].value) ? responseDoc.data[i].value.data.toJSON() : responseDoc.data[i].toJSON() );
          }
        } else {
          resp.model = responseDoc.data.toJSON();
        }
        resp.isNew = responseDoc.isNew;
        self.standardWithValue(servResponse, '200', 'OK', resp);
      } else {
        self.standardWithValue(servResponse, '200', 'ERROR', {
          error: errorMsg
        });
      }
    }, function(error) {
      self.standardWithValue(servResponse, '200', 'ERROR', {
        error: responseDoc
      });
    });
  };


  return response;

})();


module.exports = {
  create: function () {
    return new Response();
  }

};
