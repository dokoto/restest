'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var response = require('../../../utils/response').create();

router.get('/', function(req, res) {
  console.log('IN : /');
  response.standard(res, 200, 'NOTHING TO SAID');
});

router.get('/auth/google/noauth', function(req, res) {
  console.log('IN : /noauth');
  response.standard(res, 401, 'NO AUTH');
});

router.get('/auth/google/authenticated', function(req, res) {
  console.log('Google callback ejecutado..');
  response.standard(res, 200, 'LOGIN OK');
});

router.get('/auth/google/login',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
  }));

router.get(Config.fetch('connection', 'google.callback'),
  passport.authenticate('google', {
    successRedirect: '/auth/google/authenticated',
    failureRedirect: '/auth/google/noauth'
  }));

router.get('/logout', function(req, res) {
  req.logout();
  response.standard(res, 200, 'LOGOUT OK');
});

module.exports = router;
