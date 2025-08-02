const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class SessionManager {
    constructor() {
        this.dbPath = path.join(__dirname, '../data/sessions.db');
        this.initializeDatabase();
    }

    initializeDatabase() {
        // Ensure data directory exists
        const dataDir = path.dirname(this.dbPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
    }

    // Clean up expired sessions
    async cleanupExpiredSessions() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            
            const currentTime = Date.now();
            
            db.run(
                `DELETE FROM sessions WHERE expired < ?`,
                [currentTime],
                function(err) {
                    if (err) {
                        console.error('Error cleaning up expired sessions:', err);
                        reject(err);
                    } else {
                        console.log(`✅ Cleaned up ${this.changes} expired sessions`);
                        resolve(this.changes);
                    }
                }
            );
            
            db.close();
        });
    }

    // Get session statistics
    async getSessionStats() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            
            db.get(
                `SELECT 
                    COUNT(*) as total_sessions,
                    COUNT(CASE WHEN expired > ? THEN 1 END) as active_sessions
                FROM sessions`,
                [Date.now()],
                (err, row) => {
                    if (err) {
                        console.error('Error getting session stats:', err);
                        reject(err);
                    } else {
                        resolve({
                            totalSessions: row.total_sessions || 0,
                            activeSessions: row.active_sessions || 0,
                            expiredSessions: (row.total_sessions || 0) - (row.active_sessions || 0)
                        });
                    }
                }
            );
            
            db.close();
        });
    }

    // Get active user sessions
    async getActiveUserSessions() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            
            db.all(
                `SELECT sess FROM sessions WHERE expired > ?`,
                [Date.now()],
                (err, rows) => {
                    if (err) {
                        console.error('Error getting active sessions:', err);
                        reject(err);
                    } else {
                        const userSessions = [];
                        
                        rows.forEach(row => {
                            try {
                                const sessionData = JSON.parse(row.sess);
                                if (sessionData.user && sessionData.user.id) {
                                    userSessions.push({
                                        userId: sessionData.user.id,
                                        email: sessionData.user.email,
                                        loginTime: sessionData.loginTime,
                                        lastActivity: sessionData.lastActivity,
                                        userAgent: sessionData.userAgent,
                                        ipAddress: sessionData.ipAddress
                                    });
                                }
                            } catch (parseError) {
                                console.error('Error parsing session data:', parseError);
                            }
                        });
                        
                        resolve(userSessions);
                    }
                }
            );
            
            db.close();
        });
    }

    // Revoke all sessions for a specific user
    async revokeUserSessions(userId) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            
            db.all(
                `SELECT sid FROM sessions WHERE expired > ?`,
                [Date.now()],
                (err, rows) => {
                    if (err) {
                        console.error('Error finding user sessions:', err);
                        reject(err);
                        return;
                    }
                    
                    let deletedCount = 0;
                    const promises = [];
                    
                    rows.forEach(row => {
                        const promise = new Promise((resolveSession) => {
                            db.get(
                                `SELECT sess FROM sessions WHERE sid = ?`,
                                [row.sid],
                                (sessErr, sessRow) => {
                                    if (sessErr) {
                                        console.error('Error checking session:', sessErr);
                                        resolveSession();
                                        return;
                                    }
                                    
                                    try {
                                        const sessionData = JSON.parse(sessRow.sess);
                                        if (sessionData.user && sessionData.user.id === userId) {
                                            db.run(
                                                `DELETE FROM sessions WHERE sid = ?`,
                                                [row.sid],
                                                (deleteErr) => {
                                                    if (!deleteErr) {
                                                        deletedCount++;
                                                    }
                                                    resolveSession();
                                                }
                                            );
                                        } else {
                                            resolveSession();
                                        }
                                    } catch (parseError) {
                                        resolveSession();
                                    }
                                }
                            );
                        });
                        promises.push(promise);
                    });
                    
                    Promise.all(promises).then(() => {
                        console.log(`✅ Revoked ${deletedCount} sessions for user ${userId}`);
                        db.close();
                        resolve(deletedCount);
                    });
                }
            );
        });
    }

    // Start automatic cleanup interval
    startCleanupInterval(intervalMinutes = 60) {
        const intervalMs = intervalMinutes * 60 * 1000;
        
        setInterval(() => {
            this.cleanupExpiredSessions().catch(console.error);
        }, intervalMs);
        
        console.log(`✅ Session cleanup scheduled every ${intervalMinutes} minutes`);
    }
}

module.exports = new SessionManager();
