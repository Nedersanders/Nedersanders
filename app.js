require('./scripts/instrument.js');
require('dotenv').config();

const Sentry = require('@sentry/node');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// Import configurations
const sessionConfig = require('./config/session');
const { helmetConfig, corsConfig, limiter } = require('./config/security');
const { testConnection } = require('./config/database');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

var app = express();

// Test database connection on startup
testConnection();

// Security middleware
app.use(helmetConfig);
app.use(corsConfig);
app.use(limiter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());

// Session middleware
app.use(session(sessionConfig));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);

// Initialize Sentry after the routes are set up
Sentry.setupExpressErrorHandler(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
