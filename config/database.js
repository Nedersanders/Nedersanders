const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// PostgreSQL connection for user data
const pgPool = new Pool({
    host: process.env.POSTGRES_HOST || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB || 'nedersanders',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '1f069e2ec79d6c608b9bd40a9c5c5f6e',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test PostgreSQL connection
async function testConnection() {
    try {
        const client = await pgPool.connect();
        console.log('✅ PostgreSQL connected successfully');
        client.release();
    } catch (err) {
        console.error('❌ PostgreSQL connection error:', err.message);
    }
}

// Initialize database tables
async function initDatabase() {
    try {
        await pgPool.query(`
            CREATE TABLE IF NOT EXISTS users (
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
            )
        `);

        await pgPool.query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                event_date TIMESTAMP,
                location VARCHAR(255),
                price DECIMAL(10, 2) DEFAULT 0.00,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                official_event BOOLEAN DEFAULT false
            )
        `);

        // Create trigger for updated_at
        await pgPool.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        await pgPool.query(`
            DROP TRIGGER IF EXISTS update_users_updated_at ON users;
          CREATE TRIGGER update_users_updated_at
                BEFORE UPDATE ON users
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        `);

        await pgPool.query(`
            DROP TRIGGER IF EXISTS update_events_updated_at ON events;
            CREATE TRIGGER update_events_updated_at
                BEFORE UPDATE ON events
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        `);

        console.log('✅ Database tables initialized');

        // Note: Use 'npm run seed' to seed database with default accounts
    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
    }
}

module.exports = {
    pgPool,
    testConnection,
    initDatabase
};
