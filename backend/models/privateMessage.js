const mongoose = require('mongoose');

const privateMessageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },
    date_sent: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PrivateMessage', privateMessageSchema);
