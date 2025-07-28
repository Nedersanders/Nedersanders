var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET dashboard - redirect to auth dashboard */
router.get('/dashboard', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.redirect('/auth/dashboard');
});

module.exports = router;
