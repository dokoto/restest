'use strict';


var Request = (function () {

  //*****************************************************
  // PRIVATE
  //*****************************************************

  //*****************************************************
  // PUBLIC
  //*****************************************************
  function request() {
  }


  request.prototype.decodeQueryParams = function(request) {
    var query = {};
    for (var key in request.query) {
      if (request.query.hasOwnProperty(key)) {
        query[key] = request.query[key];
      }
    }

    return query;
  }


  return request;

})();


module.exports = {
  create: function () {
    return new Request();
  }

};
