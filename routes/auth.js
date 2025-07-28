const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { comparePassword } = require('../utils/auth');
const { authLimiter } = require('../config/security');

// Apply rate limiting to all auth routes
router.use(authLimiter);

/* GET login page */
router.get('/login', function(req, res, next) {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  
  res.render('auth/login', { 
    title: 'Inloggen - Nedersanders.nl',
    error: null
  });
});

/* POST login */
router.post('/login', async function(req, res, next) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.render('auth/login', {
        title: 'Inloggen - Nedersanders.nl',
        error: 'Email en wachtwoord zijn verplicht'
      });
    }
    
    const user = await User.findByEmail(email);
    if (!user) {
      return res.render('auth/login', {
        title: 'Inloggen - Nedersanders.nl',
        error: 'Ongeldige inloggegevens'
      });
    }
    
    if (user.isLocked()) {
      return res.render('auth/login', {
        title: 'Inloggen - Nedersanders.nl',
        error: 'Account is tijdelijk vergrendeld. Probeer het later opnieuw.'
      });
    }
    
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      // Increment login attempts
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
      }
      await user.save();
      
      return res.render('auth/login', {
        title: 'Inloggen - Nedersanders.nl',
        error: 'Ongeldige inloggegevens'
      });
    }
    
    // Successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = new Date();
    await user.save();
    
    // Set session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.getFullName()
    };
    
    res.redirect('/dashboard');
    
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', {
      title: 'Inloggen - Nedersanders.nl',
      error: 'Er is een fout opgetreden. Probeer het opnieuw.'
    });
  }
});

/* GET logout */
router.get('/logout', function(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }
    res.redirect('/');
  });
});

/* GET dashboard (protected route) */
router.get('/dashboard', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  
  res.render('auth/dashboard', {
    title: 'Dashboard - Nedersanders.nl',
    user: req.session.user
  });
});

module.exports = router;
