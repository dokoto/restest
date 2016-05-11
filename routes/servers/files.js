var router = require('express').Router();
var tools = {
  response: require('../../utils/response').create(),
  request: require('../../utils/request').create()
};
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
})
var upload = multer({ "storage": storage });


/*
 * GET /servers/files/info
 */
router.get('/files/info', function(request, response) {
  console.log('[files/info] Connexion request ...');
  var queryParams = tools.request.decodeQueryParams(request);
  tools.response.standardWithValue(response, 200, 'OK', 'Hi, RESTFUL for tests');
});

/*
 * POST  /servers/files/upload
 */
router.post('/files/upload', upload.array('file', 10), function(request, response, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
  console.log('[files/upload] Connexion request ...');
  var responseJSON = {
  	'fileUrl' : ( (process.argv.indexOf("--nohttps") !== -1)?'http://':'https://'  )  + Config.fetch('connection', 'service.ip') + '/public/file/' + request.files.filename,
  	'files' : request.files
  };
  tools.response.standardWithValue(response, 200, 'OK', responseJSON);
});


module.exports = router;
