const User = require('../models/User');
const crypto = require('crypto');

// Session security utilities
const generateSessionId = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Regenerate session ID for security (prevents session fixation)
const regenerateSession = (req, data = {}) => {
    return new Promise((resolve, reject) => {
        const sessionData = { ...req.session, ...data };
        req.session.regenerate((err) => {
            if (err) {
                return reject(err);
            }
            Object.assign(req.session, sessionData);
            req.session.save((saveErr) => {
                if (saveErr) {
                    return reject(saveErr);
                }
                resolve();
            });
        });
    });
};

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        // Validate session freshness (optional: check session age)
        const sessionAge = Date.now() - (req.session.loginTime || 0);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (sessionAge > maxAge) {
            req.session.destroy((err) => {
                if (err) console.error('Session destroy error:', err);
            });
            
            if (req.path.startsWith('/api/')) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Session expired' 
                });
            }
            
            req.session.returnTo = req.originalUrl;
            return res.redirect('/auth/login');
        }
        
        return next();
    }
    
    // If it's an API request, return JSON
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authentication required' 
        });
    }
    
    // Store the original URL for redirect after login
    if (req.session) {
        req.session.returnTo = req.originalUrl;
    }
    res.redirect('/auth/login');
};

// Role-based authorization middleware
const requireRole = (roles) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            if (req.path.startsWith('/api/')) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Authentication required' 
                });
            }
            req.session.returnTo = req.originalUrl;
            return res.redirect('/auth/login');
        }
        
        if (!roles.includes(req.session.user.role)) {
            if (req.path.startsWith('/api/')) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Insufficient permissions' 
                });
            }
            return res.status(403).render('error', {
                message: 'Access Denied',
                error: { status: 403, stack: '' }
            });
        }
        
        next();
    };
};

// Admin only middleware
const requireAdmin = requireRole(['admin']);

// Attach user to request with enhanced security
const attachUser = async (req, res, next) => {
    if (req.session && req.session.user && req.session.user.id) {
        try {
            // Verify user still exists and is active
            const user = await User.findById(req.session.user.id);
            if (user && user.isActive) {
                req.user = user;
                res.locals.user = user.toSafeObject();
                
                // Update last activity timestamp
                req.session.lastActivity = Date.now();
            } else {
                // User not found or inactive, clear session
                req.session.destroy((err) => {
                    if (err) console.error('Session destroy error:', err);
                });
                res.locals.user = null;
                req.user = null;
            }
        } catch (error) {
            console.error('Error attaching user:', error);
            // Don't destroy session on database errors, just log
            res.locals.user = req.session.user || null;
        }
    } else {
        res.locals.user = null;
        req.user = null;
    }

    // Handle flash messages
    res.locals.success = req.session.success;
    res.locals.error = req.session.error;
    delete req.session.success;
    delete req.session.error;

    next();
};

// Check if user is authenticated (doesn't redirect)
const isAuthenticated = (req, res, next) => {
    req.isAuthenticated = !!(req.session && req.session.user);
    res.locals.isAuthenticated = req.isAuthenticated;
    next();
};

// Redirect authenticated users (for login/register pages)
const redirectIfAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        const returnTo = req.session.returnTo || '/auth/dashboard';
        delete req.session.returnTo;
        return res.redirect(returnTo);
    }
    next();
};

// Secure login function with session regeneration
const createUserSession = async (req, user) => {
    try {
        // Regenerate session ID to prevent session fixation
        await regenerateSession(req, {
            user: user.toSafeObject(),
            loginTime: Date.now(),
            lastActivity: Date.now(),
            userAgent: req.get('User-Agent'),
            ipAddress: req.ip || req.connection.remoteAddress
        });
        
        // Update last login time in database
        await User.updateLastLogin(user.id);
        
        return true;
    } catch (error) {
        console.error('Error creating user session:', error);
        throw error;
    }
};

// Secure logout function
const destroyUserSession = (req) => {
    return new Promise((resolve) => {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Session destroy error:', err);
                }
                resolve();
            });
        } else {
            resolve();
        }
    });
};

// Session validation middleware
const validateSession = (req, res, next) => {
    if (req.session && req.session.user) {
        // Check for session hijacking indicators
        const currentUserAgent = req.get('User-Agent');
        const currentIP = req.ip || req.connection.remoteAddress;
        
        if (req.session.userAgent && req.session.userAgent !== currentUserAgent) {
            console.warn('Session security warning: User-Agent mismatch for user', req.session.user.id);
            // Optionally destroy session or require re-authentication
        }
        
        if (req.session.ipAddress && req.session.ipAddress !== currentIP) {
            console.warn('Session security warning: IP address changed for user', req.session.user.id);
            // Optionally destroy session or require re-authentication
        }
    }
    next();
};

module.exports = {
    requireAuth,
    requireRole,
    requireAdmin,
    attachUser,
    isAuthenticated,
    redirectIfAuthenticated,
    createUserSession,
    destroyUserSession,
    validateSession,
    regenerateSession
};
