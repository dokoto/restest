var express = require('express');
var router = express.Router();
var utils = {
  response: require('../../utils/response').create()
};


/*
 * GET /log4js/test1/
 */
router.get('/log4js/test1/', function (request, response) {
	utils.response.standard(response, '200', 'hello');    
});

module.exports = router;