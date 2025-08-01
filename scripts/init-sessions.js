#!/usr/bin/env node

/**
 * Session Database Initialization Script
 * 
 * This script creates the SQLite session database if it doesn't exist.
 * Run with: node scripts/init-sessions.js
 */

require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

async function initSessionDatabase() {
    console.log('🗃️  Initializing session database...');
    
    try {
        // Ensure data directory exists
        const dataDir = path.join(__dirname, '../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
            console.log('✅ Created data directory');
        }
        
        const dbPath = path.join(dataDir, 'sessions.db');
        
        // Check if database already exists
        if (fs.existsSync(dbPath)) {
            console.log('✅ Session database already exists');
            
            // Check if it has the sessions table
            const db = new sqlite3.Database(dbPath);
            
            return new Promise((resolve, reject) => {
                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='sessions'", (err, row) => {
                    if (err) {
                        console.error('❌ Error checking sessions table:', err);
                        reject(err);
                        return;
                    }
                    
                    if (row) {
                        console.log('✅ Sessions table exists');
                        
                        // Get session count
                        db.get("SELECT COUNT(*) as count FROM sessions", (countErr, countRow) => {
                            if (countErr) {
                                console.error('❌ Error counting sessions:', countErr);
                            } else {
                                console.log(`📊 Current sessions in database: ${countRow.count}`);
                            }
                            db.close();
                            resolve();
                        });
                    } else {
                        console.log('⚠️  Database exists but sessions table missing - will be created automatically');
                        db.close();
                        resolve();
                    }
                });
            });
        } else {
            // Create the database with the sessions table
            const db = new sqlite3.Database(dbPath);
            
            return new Promise((resolve, reject) => {
                // Let connect-sqlite3 create its own table structure
                // Just create an empty database file, the store will handle table creation
                console.log('✅ Session database created successfully');
                console.log('ℹ️  Table structure will be created by connect-sqlite3 on first session');
                console.log(`📍 Database location: ${dbPath}`);
                
                db.close();
                resolve();
            });
        }
    } catch (error) {
        console.error('❌ Session database initialization failed:', error);
        throw error;
    }
}

// Only run if called directly
if (require.main === module) {
    initSessionDatabase()
        .then(() => {
            console.log('🎉 Session database initialization completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Initialization failed:', error);
            process.exit(1);
        });
}

module.exports = initSessionDatabase;
