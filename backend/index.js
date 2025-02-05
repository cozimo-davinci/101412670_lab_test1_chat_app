const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socket = require('socket.io');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const groupMessageRoutes = require('./routes/groupMessageRoutes');
const privateMessageRoutes = require('./routes/privateMessageRoutes');

const PrivateMessages = require('./models/privateMessage');
const GroupMessages = require('./models/groupMessage');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', userRoutes);
app.use('/api/group_messages', groupMessageRoutes);
app.use('/api/private_messages', privateMessageRoutes);

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

const io = socket(server);

const userSocketsPrivate = {};

// Handle new connections
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Listen for registration event to map user to socket ID
    socket.on('register', (username) => {
        userSocketsPrivate[username] = socket.id;
        console.log('User registered:', username, 'with socket ID:', socket.id);
    });

    // Private Messaging
    socket.on('privateMessage', async (data) => {
        const { sender, receiver, message } = data;
        const date_sent = new Date(); // Corrected timestamp

        // Save the private message to the database
        try {
            const newMessage = new PrivateMessages({
                sender,
                receiver,
                message,
                date_sent
            });
            await newMessage.save();
            console.log(`Private message from ${sender} to ${receiver} saved: ${message}`);
        } catch (error) {
            console.error('Error saving private message:', error);
        }

        // Send the message to the receiver if they are connected
        const receiverSocketId = userSocketsPrivate[receiver];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('privateMessage', {
                sender,
                message,
                date_sent
            });
            console.log(`Private message from ${sender} to ${receiver} sent: ${message}`);
        } else {
            console.log(`Receiver ${receiver} is not connected.`);
        }
    });

    // Fetch message history for private messages
    socket.on('fetchPrivateMessages', async ({ sender, receiver }) => {
        try {
            const messages = await PrivateMessages.find({
                $or: [
                    { sender, receiver },
                    { sender: receiver, receiver: sender }
                ]
            }).sort({ date_sent: 1 });

            socket.emit('privateMessagesHistory', messages);
        } catch (error) {
            console.error('Error fetching private messages:', error);
        }
    });

    // Group Messaging

    // Join a group
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined group ${room}`);

        // Fetch and send group message history when a user joins
        GroupMessages.find({ room }).sort({ date_sent: 1 }).then((messages) => {
            socket.emit('groupMessagesHistory', messages);
        }).catch((error) => {
            console.error('Error fetching group messages:', error);
        });
    });

    // Leave a group
    socket.on('leave_room', (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left group ${room}`);
    });

    // Handle sending group messages
    socket.on('group_message', async (data) => {
        const { from_user, room, message } = data;
        const date_sent = new Date();

        try {
            const newGroupMessage = new GroupMessages({
                from_user,
                room,
                message,
                date_sent
            });
            await newGroupMessage.save();
            console.log(`Group message from ${from_user} in room ${room} saved: ${message}`);
        } catch (error) {
            console.error('Error saving group message:', error);
        }

        // Emit the group message to all users in the room
        io.to(room).emit('group_message', {
            from_user,
            message,
            date_sent
        });
        console.log(`Group message from ${from_user} in room ${room} sent: ${message}`);
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
