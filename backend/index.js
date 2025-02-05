const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socket = require('socket.io');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const groupMessageRoutes = require('./routes/groupMessageRoutes');
const privateMessageRoutes = require('./routes/privateMessageRoutes');

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

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
