const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socket = require('socket.io');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const groupMessageRoutes = require('./routes/groupMessageRoutes');
const privateMessageRoutes = require('./routes/privateMessageRoutes');
const groupRoutes = require('./routes/groupRoutes');

const PrivateMessages = require('./models/privateMessage');
const GroupMessages = require('./models/groupMessage');
const Group = require('./models/groupSchema'); // Updated path for Group schema

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', userRoutes);
app.use('/api/group_messages', groupMessageRoutes);
app.use('/api/private_messages', privateMessageRoutes);
app.use('/api/groups', groupRoutes);

const PORT = process.env.PORT || 7000;
const dbURI = process.env.MONGO_URI;

// Database Connection
mongoose.connect(dbURI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((err) => console.error('Database connection error:', err));

// Start server and attach socket
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const io = socket(server, {
    cors: {
        origin: '*', // Allow only requests from this origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

const userSocketsPrivate = {};

// Handle new connections
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Listen for registration event to map user to socket ID
    socket.on('register', (username) => {
        userSocketsPrivate[username] = socket.id;
        console.log('User registered:', username, 'with socket ID:', socket.id);
    });

    // Private Messaging (unchanged, already implemented)
    socket.on('privateMessage', async (data) => {
        const { sender, receiver, message } = data;
        const date_sent = new Date();

        try {
            const newMessage = new PrivateMessages({ sender, receiver, message, date_sent });
            await newMessage.save();
            console.log(`Private message saved:`, newMessage);
        } catch (error) {
            console.error('Error saving private message:', error);
        }

        const receiverSocketId = userSocketsPrivate[receiver];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('privateMessage', { sender, message, date_sent });
        } else {
            console.log(`Receiver ${receiver} is not connected.`);
        }
    });

    // Group Messaging Logic (Updated)

    // Join a group
    socket.on('join_group', async (groupId) => {
        socket.join(groupId);
        console.log(`User ${socket.id} joined group ${groupId}`);

        // Fetch and send group messages to the user
        const group = await Group.findById(groupId).populate('messages');
        socket.emit('group_messages', group.messages);
    });

    // Send a group message
    socket.on('send_group_message', async (groupId, messageData) => {
        const { sender, message } = messageData;

        const newGroupMessage = new GroupMessages({
            sender,
            message,
            group: groupId,
            date_sent: new Date(),
        });

        await newGroupMessage.save();

        // Update the group with the new message
        await Group.findByIdAndUpdate(groupId, {
            $push: { messages: newGroupMessage._id },
        });

        // Emit the message to everyone in the group
        io.to(groupId).emit('group_message', newGroupMessage);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        for (const username in userSocketsPrivate) {
            if (userSocketsPrivate[username] === socket.id) {
                delete userSocketsPrivate[username];
                console.log(`Removed user ${username} from active connections`);
                break;
            }
        }
    });
});
