// routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

// Login Route
router.get('/login', (req, res) => {
    res.render('users/login'); // Render the login view
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).render('users/login', { error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).render('users/login', { error: 'Invalid email or password' });
        }

        // Set user session
        req.session.userId = user._id;
        req.session.userName = user.name;

        // Redirect to cars page or home page
        res.redirect('/cars');
    } catch (error) {
        console.error(error);
        res.status(500).render('users/login', { error: 'Internal server error' });
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/cars');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/login'); // Redirect to login page
    });
});

// Register route
router.get('/register', (req, res) => {
    res.render('users/register'); // Render the login view
});
module.exports = router;


