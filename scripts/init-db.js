const { sequelize, testConnection } = require('../config/database');
const User = require('../models/User');

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Test the connection
    await testConnection();
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized successfully');
    
    // Create default admin user if it doesn't exist
    const adminExists = await User.findByEmail('admin@nedersanders.nl');
    if (!adminExists) {
      const adminUser = await User.create({
        username: 'admin',
        email: 'admin@nedersanders.nl',
        password: 'AdminSander2025!', // Change this in production!
        firstName: 'Admin',
        lastName: 'Sander',
        role: 'admin'
      });
      console.log('✅ Default admin user created:', adminUser.email);
    }
    
    console.log('✅ Database initialization completed');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
