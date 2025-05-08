const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);