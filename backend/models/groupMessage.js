const mongoose = require('mongoose');

const groupMessageSchema = new mongoose.Schema({
    from_user: { type: String, required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true }, // Updated to reference Group
    message: { type: String, required: true },
    date_sent: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroupMessage', groupMessageSchema);
