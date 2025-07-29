# Database Seeding Summary

## ✅ Default Admin Account Setup

The database initialization now automatically creates a default admin account with the following credentials:

### Admin Account
- **Email**: `admin@nedersanders.nl`
- **Password**: `AdminSander2025!`
- **Role**: `admin`
- **Full Name**: `System Administrator`
- **Username**: `admin`
- **Status**: `Active`

### Development Demo Account
When `NODE_ENV=development`, an additional demo user is created:

- **Email**: `demo@nedersanders.nl`
- **Password**: `Demo2025!`
- **Role**: `user`
- **Full Name**: `Demo User`
- **Username**: `demo`
- **Status**: `Active`

## 🔧 How It Works

1. **Automatic Seeding**: When the application starts, `initDatabase()` is called
2. **Check for Existing**: The system checks if accounts already exist to prevent duplicates
3. **Secure Hashing**: Passwords are hashed with bcrypt (12 salt rounds) before storage
4. **Safe Initialization**: If accounts exist, seeding is skipped with a friendly message

## 📋 Manual Seeding Options

### Via npm script:
```bash
npm run seed
```

### Direct execution:
```bash
node scripts/seed.js
```

### Via setup script:
```bash
./setup-auth.sh
# Choose 'y' when prompted about seeding
```

## 🗃️ Session Database Initialization

The SQLite session database is automatically created when needed, but you can also initialize it manually:

```bash
# Using npm script
npm run init-sessions

# Or directly
node scripts/init-sessions.js
```

The session database (`./data/sessions.db`) stores:
- Session IDs and expiration times
- User session data (login time, IP, User-Agent)
- Automatic cleanup of expired sessions

## 🔒 Security Notes

- **⚠️ IMPORTANT**: Change the default admin password after first login!
- The demo user is only created in development mode
- All passwords are securely hashed before database storage
- Duplicate accounts are prevented by email uniqueness constraints

## 🎯 Quick Start

1. Ensure PostgreSQL is running
2. Run `npm run seed` to create default accounts
3. Start the application with `npm run dev`
4. Navigate to `/auth/login`
5. Login with admin credentials shown above
6. **Immediately change the default password!**

## 📁 Files Modified

- `config/database.js` - Added `seedDatabase()` function
- `scripts/seed-db.js` - Standalone seeding script
- `package.json` - Added `seed` npm script
- `setup-auth.sh` - Updated to include seeding option
- `docs/authentication.md` - Updated with seeding information

The system is now ready for immediate use with secure default accounts! 🚀
