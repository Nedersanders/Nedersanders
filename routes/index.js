var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nedersanders Festival 2025' });
});

/* GET tickets page. */
router.get('/tickets', function(req, res, next) {
  res.render('tickets', { title: 'Tickets - Nedersanders Festival 2025' });
});

/* GET dashboard - redirect to auth dashboard */
router.get('/dashboard', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.redirect('/auth/dashboard');
});

module.exports = router;
