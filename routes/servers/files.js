var router = require('express').Router();
var tools = {
  response: require('../../utils/response').create(),
  request: require('../../utils/request').create()
};


/*
 * GET /servers/files/info
 */
router.get('/files/info', function(request, response) {
  var queryParams = tools.request.decodeQueryParams(request);
  tools.response.standardWithValue(response, 'Hi, world', 'hi');
});

/*
 * POST  /gotchi/model
 */
router.post('/files/info', function(request, response) {
  tools.response.standardWithValue(response, 200, 'Hi, world', 'hi');
});


module.exports = router;
