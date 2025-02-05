const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userSchema');

//User signup
router.post('/signup', async (req, res) => {
    const { username, password, email, firstname, lastname } = req.body;

    // Simple validation
    if (!username || !password || !email || !firstname || !lastname) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const user = new User({ username, password: hashedPassword, email, firstname, lastname });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


module.exports = router;