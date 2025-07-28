const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dbType = process.env.DB_TYPE || 'sqlite';

let sequelize;

if (dbType === 'postgres') {
  // PostgreSQL configuration
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USER || 'user',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'nedersanders',
    ssl: process.env.POSTGRES_SSL === 'true',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // SQLite configuration (default)
  const dbPath = process.env.SQLITE_PATH || path.join(__dirname, '../database/nedersanders.db');
  
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(`✅ Database connection (${dbType}) has been established successfully.`);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
}

module.exports = {
  sequelize,
  testConnection,
  dbType
};
