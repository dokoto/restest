'use strict';

var express = require('express');
var images = require('./routes/log4js/test1');

var router = express.Router();

router.use('/', images);

module.exports = router;