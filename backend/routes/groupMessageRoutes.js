const express = require('express');
const router = express.Router();
const GroupMessages = require('../models/groupMessage');

//Get the group messages history by room name
router.get('/:room', async (req, res) => {
    try {
        const { room } = req.params;
        const messages = await GroupMessages.find({ room }).sort({ date_sent: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error retrieving group messages:', error);
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;