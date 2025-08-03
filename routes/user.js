const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, requireAdmin, requireRole } = require('../middleware/auth');
const { handleProfileImageUpload, deleteOldProfileImage } = require('../middleware/upload');

router.get('/profile', requireAuth, async (req, res) => {
    try {
        console.log('🔍 Fetching user profile for user ID:', req.session.user.id);
        const user = await User.findById(req.session.user.id);
        res.render('profile', { user: user.toSafeObject() });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).render('error', {
            message: 'Internal Server Error',
            error: { status: 500, stack: error.stack }
        });
    }
});

// POST /profile/update - Update user profile
router.post('/profile/update', requireAuth, async (req, res) => {
    try {
        const { full_name, username } = req.body;
        const user = await User.findById(req.session.user.id);

        if (!user) {
            return res.status(404).render('error', {
                message: 'User not found',
                error: { status: 404, stack: '' }
            });
        }

        await user.update({ full_name, username });

        req.session.user = user.toSafeObject();
        req.session.success = 'Profiel succesvol bijgewerkt';
        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating profile:', error);
        req.session.error = 'Er is een fout opgetreden bij het bijwerken van uw profiel';
        res.redirect('/profile');
    }
});

// Upload / change profile picture
router.post('/profile/picture', requireAuth, handleProfileImageUpload, async (req, res) => {
    try {
        if (!req.file) {
            req.session.error = 'Geen bestand geüpload';
            return res.redirect('/profile');
        }

        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.status(404).render('error', {
                message: 'User not found',
                error: { status: 404, stack: '' }
            });
        }

        // Delete old profile image if it exists
        if (user.profileImageUrl) {
            deleteOldProfileImage(user.profileImageUrl);
        }

        // Generate URL for the uploaded image
        const imageUrl = `/images/profile/${req.file.filename}`;
        
        // Update user profile image in database
        await user.updateProfileImage(imageUrl);

        // Update session with new user data
        req.session.user = user.toSafeObject();
        req.session.success = 'Profiel foto succesvol bijgewerkt';
        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating profile picture:', error);
        req.session.error = 'Er is een fout opgetreden bij het bijwerken van uw profiel foto';
        res.redirect('/profile');
    }
});

module.exports = router;