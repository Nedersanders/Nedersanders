require('./scripts/instrument.js');

const Sentry = require('@sentry/node');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/user');
var apiRouter = require('./routes/api');

// Import middleware
const { attachUser, isAuthenticated, validateSession } = require('./middleware/auth');

// Import database
const { testConnection, initDatabase } = require('./config/database');

// Import session manager
const sessionManager = require('./utils/sessionManager');
const initSessionDatabase = require('./scripts/init-sessions');

var app = express();

// Configure Express to trust proxy for X-Forwarded-For headers
app.set('trust proxy', true);

// Test database connection and initialize on startup
testConnection();
initDatabase();

// Initialize session database
initSessionDatabase().catch(console.error);

// Start session cleanup
sessionManager.startCleanupInterval(60); // Clean up every 60 minutes

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Session configuration with SQLite store
const sessionStore = new SQLiteStore({
    db: 'sessions.db',
    dir: './data'
});

// Add debugging for session store
sessionStore.on('connect', () => {
    console.log('✅ Session store connected to SQLite database');
});

sessionStore.on('disconnect', () => {
    console.log('⚠️  Session store disconnected from SQLite database');
});

app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'nedersanders-session-secret-2025',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset expiration on activity
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    },
    name: 'nedersanders.sid'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve profile images
app.use('/images/profile', express.static(path.join(__dirname, 'data/profile_images')));

// Authentication middleware
app.use(validateSession);
app.use(isAuthenticated);
app.use(attachUser);

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/api', apiRouter);

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
