const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await db.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Fetch a single user by ID
router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await db.getUserById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
});

// Update user profile
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    try {
        const updatedUser = await db.updateUser(userId, userData);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
});

module.exports = router;