#!/usr/bin/env node

/**
 * Session Check Script
 * 
 * This script checks what sessions are currently in the database
 */

require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function checkSessions() {
    console.log('🔍 Checking current sessions in database...');
    
    const dbPath = path.join(__dirname, '../data/sessions.db');
    
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        
        // Get all sessions
        db.all('SELECT sid, expired, sess FROM sessions', (err, rows) => {
            if (err) {
                console.error('❌ Error reading sessions:', err);
                reject(err);
                return;
            }
            
            console.log(`📊 Total sessions in database: ${rows.length}`);
            
            if (rows.length === 0) {
                console.log('📪 No sessions found in database');
            } else {
                rows.forEach((row, index) => {
                    console.log(`\n📋 Session ${index + 1}:`);
                    console.log(`   SID: ${row.sid}`);
                    console.log(`   Expired: ${new Date(row.expired).toLocaleString()}`);
                    
                    try {
                        const sessionData = JSON.parse(row.sess);
                        console.log(`   User: ${sessionData.user ? sessionData.user.email : 'No user'}`);
                        console.log(`   Login Time: ${sessionData.loginTime ? new Date(sessionData.loginTime).toLocaleString() : 'N/A'}`);
                        console.log(`   Last Activity: ${sessionData.lastActivity ? new Date(sessionData.lastActivity).toLocaleString() : 'N/A'}`);
                        console.log(`   IP: ${sessionData.ipAddress || 'N/A'}`);
                    } catch (parseError) {
                        console.log(`   Session Data: ${row.sess.substring(0, 100)}...`);
                    }
                });
            }
            
            db.close();
            resolve(rows.length);
        });
    });
}

// Run check if called directly
if (require.main === module) {
    checkSessions()
        .then((count) => {
            console.log(`\n✅ Session check completed. Found ${count} sessions.`);
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Session check failed:', error);
            process.exit(1);
        });
}

module.exports = checkSessions;
