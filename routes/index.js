var express = require('express');
var router = express.Router();
const Event = require('../models/Event');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Nedersanders Festival 2025' });
});

/* GET tickets page. */
router.get('/tickets', function (req, res, next) {
  res.render('tickets', { title: 'Tickets - Nedersanders Festival 2025' });
});

/* GET dashboard - redirect to auth dashboard */
router.get('/dashboard', function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.redirect('/auth/dashboard');
});

/* GET evenementen page. */
router.get('/evenementen', async function (req, res, next) {
  try {
    const events = await Event.findAll();
    res.render('evenementen', { title: 'Evenementen', events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.render('evenementen', { title: 'Evenementen', events: [] });
  }
});
module.exports = router;
