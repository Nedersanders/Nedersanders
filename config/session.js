const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
require('dotenv').config();

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-this',
  name: process.env.SESSION_NAME || 'nedersanders_session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production (HTTPS)
    httpOnly: true, // Prevent XSS attacks
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // CSRF protection
  }
};

// Always use SQLite store for sessions
const dbPath = process.env.SQLITE_SESSION_PATH || path.join(__dirname, '../database/sessions.db');

sessionConfig.store = new SQLiteStore({
  db: 'sessions.db',
  dir: path.dirname(dbPath),
  table: 'sessions',
  ttl: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000
});

module.exports = sessionConfig;
