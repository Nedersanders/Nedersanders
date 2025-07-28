# Authentication System Documentation

## Overview
This document describes the authentication system implemented in the Nedersanders.nl development environment. The system provides secure user authentication, session management, and access control with modern security practices.

## 🔐 Authentication Features

### Core Features
- **User Registration & Login**: Secure user authentication with bcrypt password hashing
- **Session Management**: SQLite-based session storage with configurable expiration
- **Account Security**: Account lockout protection against brute force attacks
- **Rate Limiting**: Protection against authentication abuse
- **Role-Based Access**: Support for different user roles (user, admin, moderator)
- **Password Security**: Strong password validation and hashing

### Security Measures
- **Password Hashing**: bcrypt with 12 salt rounds
- **Session Security**: HTTP-only, secure, same-site strict cookies
- **Rate Limiting**: 5 login attempts per 15 minutes per IP
- **Account Lockout**: Temporary lockout after 5 failed attempts
- **CSRF Protection**: Same-site cookie policy
- **XSS Protection**: HTTP-only session cookies

## 📁 File Structure

```
routes/
└── auth.js                 # Authentication routes

config/
├── database.js            # Database configuration
├── session.js             # Session management setup
└── security.js            # Security middleware

models/
└── User.js                # User data model

utils/
└── auth.js                # Authentication utilities

scripts/
└── init-db.js             # Database initialization
```

## 🛠️ API Routes

### Authentication Routes (Base: `/auth`)

#### `GET /auth/login`
**Description**: Display the login form
- **Access**: Public
- **Redirects**: Authenticated users to `/dashboard`
- **Template**: `auth/login`
- **Parameters**: None

**Response Data**:
```javascript
{
  title: 'Inloggen - Nedersanders.nl',
  error: null | string
}
```

#### `POST /auth/login`
**Description**: Process user login
- **Access**: Public
- **Rate Limited**: 5 attempts per 15 minutes
- **Body Parameters**:
  - `email` (string, required): User email address
  - `password` (string, required): User password

**Success Response**:
- **Redirect**: `/dashboard`
- **Session**: Creates user session with user data

**Error Responses**:
- Missing credentials: "Email en wachtwoord zijn verplicht"
- Invalid credentials: "Ongeldige inloggegevens"
- Account locked: "Account is tijdelijk vergrendeld. Probeer het later opnieuw."
- Server error: "Er is een fout opgetreden. Probeer het opnieuw."

**Security Features**:
- Increments login attempts on failure
- Locks account after 5 failed attempts for 15 minutes
- Resets attempts counter on successful login
- Updates last login timestamp

#### `GET /auth/logout`
**Description**: Log out current user
- **Access**: Public
- **Action**: Destroys user session
- **Redirect**: `/` (home page)

#### `GET /auth/dashboard`
**Description**: Protected dashboard page
- **Access**: Authenticated users only
- **Redirects**: Unauthenticated users to `/auth/login`
- **Template**: `auth/dashboard`

**Response Data**:
```javascript
{
  title: 'Dashboard - Nedersanders.nl',
  user: {
    id: number,
    username: string,
    email: string,
    role: string,
    fullName: string
  }
}
```

## 👤 User Model

### Database Schema
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  isActive BOOLEAN DEFAULT true,
  role ENUM('user', 'admin', 'moderator') DEFAULT 'user',
  lastLogin DATETIME,
  loginAttempts INTEGER DEFAULT 0,
  lockUntil DATETIME,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  deletedAt DATETIME
);
```

### Model Properties
- **id**: Auto-incrementing primary key
- **username**: Unique username (3-30 alphanumeric characters)
- **email**: Unique email address with validation
- **password**: Bcrypt hashed password (8-255 characters)
- **firstName/lastName**: Optional name fields
- **isActive**: Account status flag
- **role**: User role (user, admin, moderator)
- **lastLogin**: Timestamp of last successful login
- **loginAttempts**: Failed login attempt counter
- **lockUntil**: Account lockout expiration time

### Instance Methods
```javascript
// Get full name
user.getFullName() // Returns "firstName lastName"

// Check if account is locked
user.isLocked() // Returns boolean
```

### Class Methods
```javascript
// Find user by email
const user = await User.findByEmail('user@example.com');

// Find user by username
const user = await User.findByUsername('username');
```

### Automatic Password Hashing
Passwords are automatically hashed using bcrypt hooks:
- **beforeCreate**: Hash password before creating new user
- **beforeUpdate**: Hash password when password field is updated

## 🔧 Utility Functions

### Password Management (`utils/auth.js`)

#### `hashPassword(password)`
Hash a plain text password using bcrypt
```javascript
const hashedPassword = await hashPassword('plainTextPassword');
```

#### `comparePassword(password, hashedPassword)`
Compare plain text password with hashed password
```javascript
const isValid = await comparePassword('plainText', hashedPassword);
```

#### `generatePassword(length = 12)`
Generate a random secure password
```javascript
const randomPassword = generatePassword(16);
```

#### `validatePassword(password)`
Validate password strength
```javascript
const validation = validatePassword('myPassword123!');
// Returns: { isValid: boolean, errors: string[] }
```

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## ⚙️ Configuration

### Environment Variables

#### Session Configuration
```bash
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
SESSION_NAME=nedersanders_session
SESSION_MAX_AGE=86400000  # 24 hours in milliseconds
```

#### Database Configuration
```bash
# Main database
DB_TYPE=sqlite
SQLITE_PATH=./database/nedersanders.db

# Session storage (always SQLite)
SQLITE_SESSION_PATH=./database/sessions.db
```

#### Security Configuration
```bash
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Session Store Configuration
Sessions are always stored in SQLite regardless of main database type:
```javascript
sessionConfig.store = new SQLiteStore({
  db: 'sessions.db',
  dir: path.dirname(dbPath),
  table: 'sessions',
  ttl: 24 * 60 * 60 * 1000  // 24 hours
});
```

## 🚀 Usage Examples

### Protecting Routes
```javascript
// Middleware to check authentication
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

// Use in routes
router.get('/protected', requireAuth, (req, res) => {
  res.render('protected-page', { user: req.session.user });
});
```

### Role-Based Access Control
```javascript
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
      return res.status(403).render('error', { 
        message: 'Access denied' 
      });
    }
    next();
  };
}

// Admin only route
router.get('/admin', requireRole('admin'), (req, res) => {
  res.render('admin-panel');
});
```

### Creating New Users
```javascript
const newUser = await User.create({
  username: 'newsander',
  email: 'new@nedersanders.nl',
  password: 'SecurePassword123!',
  firstName: 'New',
  lastName: 'Sander',
  role: 'user'
});
```

## 🛡️ Security Best Practices

### Password Security
1. **Strong Hashing**: Uses bcrypt with 12 rounds
2. **Validation**: Enforces strong password requirements
3. **No Plain Text**: Passwords never stored in plain text

### Session Security
1. **Secure Cookies**: HTTPS-only in production
2. **HTTP-Only**: Prevents XSS access to cookies
3. **Same-Site**: CSRF protection
4. **Expiration**: Configurable session timeout

### Attack Prevention
1. **Rate Limiting**: Prevents brute force attacks
2. **Account Lockout**: Temporary lockout after failed attempts
3. **Input Validation**: Validates all user inputs
4. **CORS Protection**: Configured allowed origins

## 🔄 Database Management

### Initialize Database
Create database and default admin user:
```bash
npm run db:init
```

### Reset Database
Remove all data and reinitialize:
```bash
npm run db:reset
```

### Default Admin Account
After initialization, a default admin account is created:
- **Email**: `admin@nedersanders.nl`
- **Password**: `AdminSander2025!`
- **Role**: `admin`

**⚠️ Important**: Change the default admin password in production!

## 🐛 Error Handling

### Common Error Scenarios
1. **Invalid Credentials**: User provides wrong email/password
2. **Account Locked**: Too many failed login attempts
3. **Session Expired**: Session timeout or invalid session
4. **Database Error**: Connection or query issues
5. **Validation Error**: Invalid input data

### Error Response Format
All authentication errors are handled gracefully with user-friendly Dutch messages:
```javascript
{
  title: 'Page Title',
  error: 'User-friendly error message in Dutch'
}
```

## 📊 Monitoring & Logging

### Login Attempts Tracking
- Failed attempts are logged to user record
- Account lockout events are logged
- Last login timestamps are recorded

### Security Events
- Rate limit violations
- Session creation/destruction
- Authentication failures

### Database Queries
- User lookup queries
- Session management operations
- Account status updates

## 🔮 Future Enhancements

### Planned Features
1. **Password Reset**: Email-based password reset flow
2. **Email Verification**: Account verification via email
3. **OAuth Integration**: Login with Google, GitHub, etc.

---

*Last updated: July 28, 2025*  
*Version: 1.0*
