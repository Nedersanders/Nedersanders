const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, requireAdmin, requireRole } = require('../middleware/auth');
const { handleProfileImageUpload, deleteOldProfileImage } = require('../middleware/upload');

router.get('/account', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        if(!user) {
            req.flash('error', 'Gebruiker niet gevonden');
            return res.status(404).render('error', {
                message: 'User not found',
                error: { status: 404, stack: '' }
            });
        }
        res.render('profile', { user });   
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: { message: error.message, stack: error.stack }
        });
    }
});

// POST /profile/update - Update user profile
router.post('/account/update', requireAuth, async (req, res) => {
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
        res.redirect('/user/account');
    } catch (error) {
        console.error('Error updating profile:', error);
        req.session.error = 'Er is een fout opgetreden bij het bijwerken van uw profiel';
        res.redirect('/user/account');
    }
});

// Upload / change profile picture
router.post('/account/picture', requireAuth, handleProfileImageUpload, async (req, res) => {
    try {
        if (!req.file) {
            if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
                return res.status(400).json({ success: false, message: 'Geen bestand geüpload' });
            }
            req.session.error = 'Geen bestand geüpload';
            return res.redirect('/user/account');
        }

        const user = await User.findById(req.session.user.id);
        if (!user) {
            if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
                return res.status(404).json({ success: false, message: 'Gebruiker niet gevonden' });
            }
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

        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({ success: true, imageUrl, message: 'Profiel foto succesvol bijgewerkt' });
        }
        req.session.success = 'Profiel foto succesvol bijgewerkt';
        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating profile picture:', error);
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.status(500).json({ success: false, message: 'Er is een fout opgetreden bij het bijwerken van uw profiel foto' });
        }
        req.session.error = 'Er is een fout opgetreden bij het bijwerken van uw profiel foto';
        res.redirect('/profile');
    }
});

module.exports = router;