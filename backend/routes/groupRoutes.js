// groupRoutes.js (or a new file for group-related routes)
const express = require('express');
const Group = require('../models/groupSchema');
const router = express.Router();
const User = require('../models/userSchema');

// Create a new group
router.post('/create', async (req, res) => {
    try {
        const { name, members } = req.body;

        // Find the users by their usernames
        const userObjects = await User.find({ username: { $in: members } });

        // Check if all members exist in the database
        if (userObjects.length !== members.length) {
            return res.status(400).json({ error: 'One or more users not found' });
        }

        // Get their ObjectIds
        const memberIds = userObjects.map(user => user._id);

        // Create the group with member IDs
        const newGroup = new Group({ name, members: memberIds });
        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Error creating group' });
    }
});


// Fetch all groups
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find().populate('members', 'username').populate('messages');
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Error fetching groups' });
    }
});


router.put('/:groupId/members', async (req, res) => {
    try {
        const { action, memberId } = req.body;  // action: 'add' or 'remove'
        const groupId = req.params.groupId;
        const updateAction = action === 'add' ? '$push' : '$pull';

        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            { [updateAction]: { members: memberId } },
            { new: true }
        ).populate('members', 'username');

        res.status(200).json(updatedGroup);
    } catch (error) {
        console.error('Error updating group members:', error);
        res.status(500).json({ error: 'Error updating group members' });
    }
});
module.exports = router;
