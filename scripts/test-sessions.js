#!/usr/bin/env node

/**
 * Session Store Test Script
 * 
 * This script tests if the SQLite session store is working properly
 */

require('dotenv').config();
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

async function testSessionStore() {
    console.log('🧪 Testing SQLite session store...');
    
    try {
        // Create a session store instance
        const store = new SQLiteStore({
            db: 'sessions.db',
            dir: './data'
        });
        
        console.log('✅ Session store created');
        
        // Test storing a session
        const testSessionId = 'test-session-' + Date.now();
        const testSessionData = {
            cookie: {
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                httpOnly: true,
                secure: false
            },
            user: {
                id: 1,
                email: 'test@example.com',
                role: 'user'
            },
            loginTime: Date.now(),
            lastActivity: Date.now()
        };
        
        return new Promise((resolve, reject) => {
            store.set(testSessionId, testSessionData, (err) => {
                if (err) {
                    console.error('❌ Error storing session:', err);
                    reject(err);
                    return;
                }
                
                console.log('✅ Test session stored successfully');
                
                // Try to retrieve the session
                store.get(testSessionId, (getErr, retrievedData) => {
                    if (getErr) {
                        console.error('❌ Error retrieving session:', getErr);
                        reject(getErr);
                        return;
                    }
                    
                    if (retrievedData) {
                        console.log('✅ Test session retrieved successfully');
                        console.log('📄 Session data:', JSON.stringify(retrievedData, null, 2));
                        
                        // Clean up test session
                        store.destroy(testSessionId, (destroyErr) => {
                            if (destroyErr) {
                                console.warn('⚠️  Warning: Could not clean up test session:', destroyErr);
                            } else {
                                console.log('🧹 Test session cleaned up');
                            }
                            resolve();
                        });
                    } else {
                        console.error('❌ Session data not found after storage');
                        reject(new Error('Session not found'));
                    }
                });
            });
        });
        
    } catch (error) {
        console.error('❌ Session store test failed:', error);
        throw error;
    }
}

// Run test if called directly
if (require.main === module) {
    testSessionStore()
        .then(() => {
            console.log('🎉 Session store test completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Session store test failed:', error);
            process.exit(1);
        });
}

module.exports = testSessionStore;
