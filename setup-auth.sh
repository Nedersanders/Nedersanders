#!/bin/bash

# Nedersanders Authentication System Setup Script

echo "🔧 Setting up Nedersanders Authentication System..."

# Check if we're in the right directory
if [ ! -f "app.js" ]; then
    echo "❌ Error: Please run this script from the dev_nedersanders directory"
    exit 1
fi

# Create data directory for sessions
echo "📁 Creating data directory and initializing session database..."
mkdir -p data
npm run init-sessions

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Install sqlite3 if not present
if ! npm list sqlite3 >/dev/null 2>&1; then
    echo "📦 Installing sqlite3..."
    npm install sqlite3
else
    echo "✅ sqlite3 already installed"
fi

# Check PostgreSQL connection (optional)
echo "🔍 Checking configuration..."

# Build the application
echo "🏗️  Building application..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "🔐 Authentication System Features:"
echo "   • PostgreSQL for user credentials"
echo "   • SQLite for session storage"
echo "   • bcrypt password hashing (12 rounds)"
echo "   • Session security & validation"
echo "   • Automatic session cleanup"
echo "   • Admin session management"
echo ""
echo "🚀 To start the application:"
echo "   npm run dev    # Development with auto-reload"
echo "   npm start      # Production"
echo ""
echo "📚 Documentation available in docs/authentication.md"
echo ""

# Create default admin user (optional)
read -p "🤔 Would you like to seed the database with default accounts? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npm run seed
    echo "✅ Database seeded with default accounts"
else
    echo "ℹ️  You can seed the database later with: npm run seed"
fi

echo "✨ All set!"
