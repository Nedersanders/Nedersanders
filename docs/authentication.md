# Authentication System Documentation

## Overview

This authentication system provides a robust, secure authentication mechanism using:

- **PostgreSQL** for storing user credentials and profile data
- **# Or directly
node scripts/seed.js
```

### Session Database Initialization

Initialize the SQLite session database:

```bash
# Using npm script
npm run init-sessions

# Or directly
node scripts/init-sessions.js
```

The session database is also automatically initialized when the application starts.ite** for fast session storage and management
- **bcrypt** for password hashing with 12 salt rounds
- **Session-based authentication** with security features

## Architecture

### Database Schema

#### PostgreSQL - Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    username VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

#### SQLite - Sessions Database
- Managed by `connect-sqlite3` with custom session management utilities
- Stored in `./data/sessions.db` (auto-created on first run)
- Schema: `sessions(sid PRIMARY KEY, expired INTEGER, sess TEXT)`
- Includes session expiration, user data, and security metadata
- Automatic cleanup of expired sessions

## Security Features

### Session Security
- **Session ID Regeneration**: New session ID on each login to prevent session fixation
- **Session Validation**: Checks for User-Agent and IP address changes
- **Automatic Expiration**: Sessions expire after 24 hours of inactivity
- **Secure Cookies**: HttpOnly, SameSite=lax, secure in production

### Password Security
- **bcrypt Hashing**: 12 salt rounds for password storage
- **Password Requirements**: Minimum 8 characters (configurable)
- **Account Lockout**: Can be implemented using rate limiting

### Session Management
- **Automatic Cleanup**: Expired sessions cleaned up every 60 minutes
- **Admin Monitoring**: View active sessions and user activity
- **Session Revocation**: Admins can revoke all sessions for a user

## Middleware Components

### Core Middleware

#### `requireAuth`
- Validates user session
- Redirects unauthenticated users to login
- Returns JSON errors for API requests
- Stores return URL for post-login redirect

#### `requireRole(roles)`
- Role-based access control
- Supports single role or array of roles
- Returns 403 for insufficient permissions

#### `requireAdmin`
- Shorthand for `requireRole(['admin'])`
- Restricts access to admin users only

#### `attachUser`
- Attaches user object to request and response locals
- Validates user still exists and is active
- Cleans up sessions for deleted/inactive users

#### `isAuthenticated`
- Sets authentication status flags
- Doesn't redirect, just provides status
- Used for conditional rendering

#### `redirectIfAuthenticated`
- Prevents authenticated users from accessing login/register
- Redirects to dashboard or return URL

#### `validateSession`
- Security validation for existing sessions
- Checks for User-Agent and IP changes
- Logs potential security warnings

### Security Utilities

#### `createUserSession(req, user)`
- Secure session creation with regeneration
- Updates last login timestamp
- Stores security metadata (IP, User-Agent)

#### `destroyUserSession(req)`
- Secure session destruction
- Promise-based for error handling

#### `regenerateSession(req, data)`
- Regenerates session ID safely
- Preserves session data

## Usage Examples

### Basic Route Protection
```javascript
router.get('/dashboard', requireAuth, (req, res) => {
    res.render('dashboard', { user: req.user });
});
```

### Admin-Only Routes
```javascript
router.get('/admin', requireAdmin, (req, res) => {
    res.render('admin');
});
```

### Role-Based Access
```javascript
router.get('/editor', requireRole(['admin', 'editor']), (req, res) => {
    res.render('editor');
});
```

### Login Implementation
```javascript
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.verifyPassword(email, password);
        if (!user) {
            return res.redirect('/auth/login?error=invalid');
        }
        
        await createUserSession(req, user);
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.redirect('/auth/login?error=server');
    }
});
```

## Session Management

### For Administrators

#### View Active Sessions
- **Route**: `GET /auth/sessions`
- **Access**: Admin only
- **Description**: View all active user sessions with statistics

#### Manual Session Cleanup
- **Route**: `POST /auth/sessions/cleanup`
- **Access**: Admin only
- **Description**: Manually clean up expired sessions

#### Revoke User Sessions
- **Route**: `POST /auth/sessions/revoke/:userId`
- **Access**: Admin only
- **Description**: Revoke all sessions for a specific user

### API Endpoints

#### Session Statistics
```javascript
GET /auth/api/sessions/stats
// Returns: { success: true, stats: { totalSessions, activeSessions, expiredSessions } }
```

#### Active Sessions
```javascript
GET /auth/api/sessions/active
// Returns: { success: true, sessions: [{ userId, email, loginTime, lastActivity, ... }] }
```

## Configuration

### Default Admin Account

The system automatically creates a default admin account during database initialization:

- **Email**: `admin@nedersanders.nl`
- **Password**: `AdminSander2025!`
- **Role**: `admin`

**⚠️ Important**: Change this password immediately after first login!

### Manual Database Seeding

You can manually seed the database with default accounts:

```bash
# Using npm script
npm run seed

# Or directly
node scripts/seed-db.js
```

### Development Mode
In development mode (`NODE_ENV=development`), an additional demo user is created:

- **Email**: `demo@nedersanders.nl`
- **Password**: `Demo2025!`
- **Role**: `user`

### Environment Variables
```bash
# PostgreSQL Configuration
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=nedersanders
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# Session Configuration
SESSION_SECRET=your-super-secret-key
NODE_ENV=production  # for secure cookies
```

### Session Configuration (app.js)
```javascript
app.use(session({
    store: new SQLiteStore({
        db: 'sessions.db',
        dir: './data'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    },
    name: 'nedersanders.sid'
}));
```

## Security Best Practices

### Implemented
- ✅ Session ID regeneration on login
- ✅ Secure password hashing (bcrypt, 12 rounds)
- ✅ HttpOnly cookies
- ✅ Session expiration
- ✅ Rate limiting (express-rate-limit)
- ✅ Helmet.js for security headers
- ✅ CSRF protection via SameSite cookies
- ✅ User-Agent and IP validation
- ✅ Automatic session cleanup

### Recommended Additional Measures
- 🔄 Account lockout after failed attempts
- 🔄 Email verification for new accounts
- 🔄 Password strength validation
- 🔄 Two-factor authentication
- 🔄 Password reset functionality
- 🔄 Audit logging for security events

## Error Handling

The system provides consistent error handling:

- **Authentication Errors**: Redirect to login with error messages
- **Authorization Errors**: 403 status with error page
- **API Errors**: JSON responses with error details
- **Session Errors**: Automatic cleanup and re-authentication

## Monitoring and Logging

- Session statistics tracking
- Security event logging
- Failed login attempt logging
- Automatic cleanup reporting
- Database connection monitoring

## File Structure

```
middleware/
├── auth.js                 # Main authentication middleware
models/
├── User.js                 # User model with PostgreSQL operations
utils/
├── sessionManager.js       # Session management utilities
routes/
├── auth.js                 # Authentication routes
config/
├── database.js             # Database configuration
data/
├── sessions.db             # SQLite session storage
```

This authentication system provides enterprise-grade security while maintaining ease of use and excellent performance through the PostgreSQL + SQLite combination.
