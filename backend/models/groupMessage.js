const mongoose = require('mongoose');

const groupMessages = new mongoose.Schema({
    from_user: {
        type: String,
        required: true
    },
    to_user: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date_sent: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('GroupMessages', groupMessages);