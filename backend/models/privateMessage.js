const mongoose = require('mongoose');

const privateMessages = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
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
module.exports = mongoose.model('PrivateMessages', privateMessages);