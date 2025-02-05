const express = require('express');
const router = express.Router();
const PrivateMessages = require('../models/privateMessage');


// Retrieve the private messages history

router.get('/:sender/:receiver', async (req, res) => {
    try {
        const { sender, receiver } = req.params;
        const messages = await PrivateMessages.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ date_sent: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error retrieving private messages:', error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;