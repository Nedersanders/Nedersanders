const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const sessionManager = require('../utils/sessionManager');
const {
    requireAuth,
    requireAdmin
} = require('../middleware/auth');

// API Routes for Authentication

// GET /api/me - Get current user info
router.get('/me', requireAuth, (req, res) => {
    res.json({
        success: true,
        user: req.session.user
    });
});

// GET /api/users - Get all users (admin only)
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({
            success: true,
            users: users.map(user => user.toSafeObject())
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Er is een fout opgetreden bij het ophalen van gebruikers'
        });
    }
});

// Session Management API Routes (Admin only)

// GET /api/sessions/stats - Get session statistics
router.get('/sessions/stats', requireAdmin, async (req, res) => {
    try {
        const stats = await sessionManager.getSessionStats();
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Error fetching session stats:', error);
        res.status(500).json({
            success: false,
            message: 'Er is een fout opgetreden bij het ophalen van sessie statistieken'
        });
    }
});

// GET /api/sessions/active - Get active sessions
router.get('/sessions/active', requireAdmin, async (req, res) => {
    try {
        const activeSessions = await sessionManager.getActiveUserSessions();
        res.json({
            success: true,
            sessions: activeSessions
        });
    } catch (error) {
        console.error('Error fetching active sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Er is een fout opgetreden bij het ophalen van actieve sessies'
        });
    }
});

// POST /api/sessions/cleanup - Clean up expired sessions
router.post('/sessions/cleanup', requireAdmin, async (req, res) => {
    try {
        const deletedCount = await sessionManager.cleanupExpiredSessions();
        res.json({
            success: true,
            message: `${deletedCount} verlopen sessies zijn opgeruimd`,
            deletedCount
        });
    } catch (error) {
        console.error('Error cleaning up sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Er is een fout opgetreden bij het opruimen van sessies'
        });
    }
});

// POST /api/sessions/revoke/:userId - Revoke all sessions for a user
router.post('/sessions/revoke/:userId', requireAdmin, async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Ongeldig gebruiker ID'
            });
        }

        const deletedCount = await sessionManager.revokeUserSessions(userId);
        res.json({
            success: true,
            message: `${deletedCount} sessies zijn ingetrokken voor gebruiker ${userId}`,
            deletedCount,
            userId
        });
    } catch (error) {
        console.error('Error revoking user sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Er is een fout opgetreden bij het intrekken van sessies'
        });
    }
});

// POST /api/logout - API logout endpoint
router.post('/logout', requireAuth, async (req, res) => {
    try {
        const { destroyUserSession } = require('../middleware/auth');
        await destroyUserSession(req);
        res.json({
            success: true,
            message: 'Succesvol uitgelogd'
        });
    } catch (error) {
        console.error('API logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Er is een fout opgetreden bij het uitloggen'
        });
    }
});

// GET /api/status - Check authentication status
router.get('/status', (req, res) => {
    const isAuthenticated = !!(req.session && req.session.user);
    res.json({
        success: true,
        authenticated: isAuthenticated,
        user: isAuthenticated ? req.session.user : null
    });
});

// GET /api/events - Get all events
router.get('/events', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json({
            success: true,
            events: events.map(ev => ev.toSafeObject())
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            success: false,
            message: 'Er is een fout opgetreden bij het ophalen van evenementen'
        });
    }
});

router.get('/events/:id', async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        if (isNaN(eventId)) {
            return res.status(400).json({
                success: false,
                message: 'Ongeldig evenement ID'
            });
        }
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Evenement niet gevonden'
            });
        }
        res.json({
            success: true,
            event: event.toSafeObject()
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({
            success: false,
            message: 'Er is een fout opgetreden bij het ophalen van het evenement'
        });
    }
});

module.exports = router;
