require('dotenv').config();
const { initDatabase, testConnection } = require('../config/database');
const User = require('../models/User');

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Test connection first
        await testConnection();
        
        // Initialize database tables
        await initDatabase();
        
        // Check if admin user already exists
        const existingAdmin = await User.findByEmail('admin@nedersanders.nl');
        
        if (existingAdmin) {
            console.log('✅ Admin user already exists');
        } else {
            // Create admin user
            const adminUser = await User.create({
                email: 'admin@nedersanders.nl',
                password: 'AdminSander2025!',
                fullName: 'System Administrator',
                username: 'admin',
                role: 'admin'
            });
            
            console.log('✅ Admin user created:', adminUser.email);
            console.log('📧 Email: admin@nedersanders.nl');
            console.log('🔐 Password: AdminSander2025!');
        }
        
        // Check if test user already exists
        const existingTest = await User.findByEmail('test@nedersanders.nl');
        
        if (existingTest) {
            console.log('✅ Test user already exists');
        } else {
            // Create a test user
            const testUser = await User.create({
                email: 'test@nedersanders.nl',
                password: 'TestUser2025!',
                fullName: 'Test User',
                username: 'testuser',
                role: 'user'
            });
            
            console.log('✅ Test user created:', testUser.email);
            console.log('📧 Email: test@nedersanders.nl');
            console.log('🔐 Password: TestUser2025!');
        }
        
        // Create demo user only in development
        if (process.env.NODE_ENV === 'development') {
            const existingDemo = await User.findByEmail('demo@nedersanders.nl');
            
            if (existingDemo) {
                console.log('✅ Demo user already exists');
            } else {
                const demoUser = await User.create({
                    email: 'demo@nedersanders.nl',
                    password: 'Demo2025!',
                    fullName: 'Demo User',
                    username: 'demo',
                    role: 'user'
                });
                
                console.log('✅ Demo user created (development mode):', demoUser.email);
                console.log('📧 Email: demo@nedersanders.nl');
                console.log('🔐 Password: Demo2025!');
            }
        }
        
        console.log('🎉 Database seeding completed successfully!');
        
    } catch (error) {
        console.error('❌ Database seeding failed:', error.message);
        process.exit(1);
    }
}

// Run seeding if this file is executed directly
if (require.main === module) {
    seedDatabase().then(() => {
        process.exit(0);
    }).catch((error) => {
        console.error('Seeding error:', error);
        process.exit(1);
    });
}

module.exports = { seedDatabase };
