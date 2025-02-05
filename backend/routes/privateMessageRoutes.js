const express = require('express');
const router = express.Router();
const PrivateMessage = require('../models/privateMessage');

// Fetch private messages between two users
router.get('/:sender/:receiver', async (req, res) => {
    const { sender, receiver } = req.params;

    try {
        const messages = await PrivateMessage.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ date_sent: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching private messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
