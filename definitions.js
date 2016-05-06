'use strict';

var express = require('express');
var files = require('./routes/servers/files');

var router = express.Router();

router.use('/servers', files);

module.exports = router;
