const express = require('express');
const router = express.Router();
const Group = require('../models/groupSchema');
const GroupMessage = require('../models/groupMessage');

// Fetch group messages for a specific group
router.get('/:groupId/messages', async (req, res) => {
    const { groupId } = req.params;

    try {
        const messages = await GroupMessage.find({ group: groupId }).sort({ date_sent: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching group messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Send a message in a group
router.post('/:groupId/messages', async (req, res) => {
    try {
        const { message, sender } = req.body;
        const groupId = req.params.groupId;

        const newMessage = new GroupMessage({
            from_user: sender,
            group: groupId,  // Reference to groupId instead of room
            message,
            date_sent: new Date(),
        });

        await newMessage.save();

        // Optionally update the group with the new message reference
        await Group.findByIdAndUpdate(groupId, {
            $push: { messages: newMessage._id },
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending group message:', error);
        res.status(500).json({ error: 'Error sending message' });
    }
});

module.exports = router;
