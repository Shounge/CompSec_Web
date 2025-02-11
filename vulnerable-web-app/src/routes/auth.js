const express = require('express');
const router = express.Router();
const db = require('../database/db');

// User registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.addUser(username, password);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// User login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.findUser(username, password);
        if (user) {
            req.session.userId = user.id; // Assuming session management is set up
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// User logout route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out', err });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});

module.exports = router;