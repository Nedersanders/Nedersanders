const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../data/profile_images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with original extension
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${uuidv4()}${ext}`;
        cb(null, uniqueName);
    }
});

// File filter for image validation
const fileFilter = (req, file, cb) => {
    // Check if file is an image
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Alleen afbeeldingen zijn toegestaan'), false);
    }

    // Check allowed file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Alleen JPG, PNG, WebP en GIF bestanden zijn toegestaan'), false);
    }

    cb(null, true);
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
        files: 1 // Only allow 1 file
    }
});

// Middleware for single profile image upload
const uploadProfileImage = upload.single('profileImage');

// Wrapper to handle multer errors
const handleProfileImageUpload = (req, res, next) => {
    uploadProfileImage(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                req.session.error = 'Bestand is te groot. Maximum grootte is 2MB';
            } else if (err.code === 'LIMIT_FILE_COUNT') {
                req.session.error = 'Te veel bestanden. Selecteer slechts één afbeelding';
            } else {
                req.session.error = 'Er is een fout opgetreden bij het uploaden';
            }
            return res.redirect('/profile');
        } else if (err) {
            req.session.error = err.message;
            return res.redirect('/profile');
        }
        next();
    });
};

// Function to delete old profile image
const deleteOldProfileImage = (profileImageUrl) => {
    if (!profileImageUrl) return;
    
    try {
        // Extract filename from URL (assuming URL format is /images/profile/filename.ext)
        const urlParts = profileImageUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        
        if (filename && filename !== 'default-avatar.png') {
            const filePath = path.join(uploadDir, filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    } catch (error) {
        console.error('Error deleting old profile image:', error);
    }
};

module.exports = {
    handleProfileImageUpload,
    deleteOldProfileImage
};
