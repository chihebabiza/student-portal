const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    display: {
        type: String,
        enum: ['general', 'computer_science', 'physics', 'chemistry', 'math'],
        required: true
    },
    datetime: { type: Date, required: true }
});

module.exports = mongoose.model('Announcement', announcementSchema);
