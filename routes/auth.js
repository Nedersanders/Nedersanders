const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sessionManager = require('../utils/sessionManager');
const { 
    requireAuth, 
    requireAdmin, 
    redirectIfAuthenticated,
    createUserSession,
    destroyUserSession 
} = require('../middleware/auth');

// GET /auth/login
router.get('/login', redirectIfAuthenticated, (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    
    res.render('auth/login', { 
        title: 'Inloggen - Nedersanders.nl',
        error: error || null
    });
});

// POST /auth/login
router.post('/login', redirectIfAuthenticated, async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        if (req.session) req.session.error = 'Email en wachtwoord zijn verplicht';
        return res.redirect('/auth/login');
    }
    
    try {
        const user = await User.verifyPassword(email, password);
        console.log('🔍 User object type:', typeof user);
        console.log('🔍 User object:', user);
        console.log('🔍 User has toSafeObject method:', typeof user?.toSafeObject);
        
        if (!user) {
            if (req.session) req.session.error = 'Ongeldig email adres of wachtwoord';
            return res.redirect('/auth/login');
        }
        
        // Create secure session with regeneration
        console.log('🔐 Creating session for user:', user.email);
        await createUserSession(req, user);
        console.log('✅ Session created, session ID:', req.sessionID);
        console.log('📄 Session data:', JSON.stringify(req.session, null, 2));
        
        // Redirect to return URL or dashboard
        const returnTo = req.session.returnTo || '/auth/dashboard';
        delete req.session.returnTo;
        
        res.redirect(returnTo);
        
    } catch (error) {
        console.error('Login error:', error);
        if (req.session) req.session.error = 'Er is een fout opgetreden. Probeer het opnieuw.';
        res.redirect('/auth/login');
    }
});

// GET /auth/logout
router.get('/logout', async (req, res) => {
    try {
        await destroyUserSession(req);
        res.redirect('/');
    } catch (error) {
        console.error('Logout error:', error);
        res.redirect('/');
    }
});

// POST /auth/logout
router.post('/logout', async (req, res) => {
    try {
        await destroyUserSession(req);
        res.redirect('/');
    } catch (error) {
        console.error('Logout error:', error);
        res.redirect('/');
    }
});

// GET /auth/dashboard
router.get('/dashboard', requireAuth, (req, res) => {
    res.render('auth/dashboard', {
        title: 'Dashboard - Nedersanders.nl',
        user: req.session.user
    });
});

// GET /auth/register (admin only)
router.get('/register', requireAdmin, (req, res) => {
    const error = req.session.error;
    const success = req.session.success;
    delete req.session.error;
    delete req.session.success;
    
    res.render('auth/register', {
        title: 'Gebruiker Registreren - Nedersanders.nl',
        error: error || null,
        success: success || null
    });
});

// POST /auth/register (admin only)
router.post('/register', requireAdmin, async (req, res) => {
    const { email, password, fullName, username, role = 'user' } = req.body;
    
    if (!email || !password || !fullName) {
        req.session.error = 'Email, wachtwoord en volledige naam zijn verplicht';
        return res.redirect('/auth/register');
    }
    
    if (password.length < 8) {
        req.session.error = 'Wachtwoord moet minimaal 8 karakters lang zijn';
        return res.redirect('/auth/register');
    }
    
    try {
        const user = await User.create({
            email,
            password,
            fullName,
            username,
            role
        });
        
        req.session.success = `Gebruiker ${user.email} is succesvol aangemaakt`;
        res.redirect('/auth/register');
        
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.message === 'Email already exists') {
            req.session.error = 'Dit email adres is al in gebruik';
        } else {
            req.session.error = 'Er is een fout opgetreden. Probeer het opnieuw.';
        }
        
        res.redirect('/auth/register');
    }
});

// GET /auth/users (admin only)
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('auth/users', {
            title: 'Gebruikersbeheer - Nedersanders.nl',
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.render('error', {
            message: 'Er is een fout opgetreden bij het ophalen van gebruikers',
            error: { status: 500, stack: '' }
        });
    }
});

// Session Management Routes (Admin only)

// GET /auth/sessions - View active sessions
router.get('/sessions', requireAdmin, async (req, res) => {
    try {
        const [stats, activeSessions] = await Promise.all([
            sessionManager.getSessionStats(),
            sessionManager.getActiveUserSessions()
        ]);
        
        res.render('auth/sessions', {
            title: 'Sessie Beheer - Nedersanders.nl',
            stats,
            activeSessions
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.render('error', {
            message: 'Er is een fout opgetreden bij het ophalen van sessie informatie',
            error: { status: 500, stack: '' }
        });
    }
});

// POST /auth/sessions/cleanup - Manual session cleanup
router.post('/sessions/cleanup', requireAdmin, async (req, res) => {
    try {
        const deletedCount = await sessionManager.cleanupExpiredSessions();
        req.session.success = `${deletedCount} verlopen sessies zijn opgeruimd`;
        res.redirect('/auth/sessions');
    } catch (error) {
        console.error('Error cleaning up sessions:', error);
        req.session.error = 'Er is een fout opgetreden bij het opruimen van sessies';
        res.redirect('/auth/sessions');
    }
});

// POST /auth/sessions/revoke/:userId - Revoke all sessions for a user
router.post('/sessions/revoke/:userId', requireAdmin, async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const deletedCount = await sessionManager.revokeUserSessions(userId);
        req.session.success = `${deletedCount} sessies zijn ingetrokken voor gebruiker ${userId}`;
        res.redirect('/auth/sessions');
    } catch (error) {
        console.error('Error revoking user sessions:', error);
        req.session.error = 'Er is een fout opgetreden bij het intrekken van sessies';
        res.redirect('/auth/sessions');
    }
});

module.exports = router;
