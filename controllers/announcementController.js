const Announcement = require('../models/announcementModel');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Reusable function — get all announcements (optional filter)
 * @access  Public
 */
const getAnnouncements = async (filter = {}) => {
    return await Announcement.find(filter).sort('-datetime');
};

/**
 * @desc    Render announcements page (SSR)
 * @route   GET /announcements
 * @access  Public
 */
const getAnnouncementsPage = asyncHandler(async (req, res) => {
    const { filter } = req.query;
    const allowedFilters = ['general', 'computer_science', 'math', 'physics', 'chemistry'];

    const query = filter && allowedFilters.includes(filter) ? { display: filter } : {};
    const announcements = await getAnnouncements(query);

    res.render('index', {
        title: 'Announcements',
        announcements,
        filter,
        user: req.user || null
    });
});

/**
 * @desc    Create new announcement
 * @route   POST /announcements/admin
 * @access  Private/Admin
 */
const createAnnouncement = asyncHandler(async (req, res) => {
    const { title, content, display } = req.body;

    if (!title || !content || !display) {
        res.status(400);
        throw new Error('Please include all fields');
    }

    await Announcement.create({
        title,
        content,
        display,
        datetime: new Date()
    });

    res.redirect('/admin/announcements');
});

/**
 * @desc    Update announcement
 * @route   POST /announcements/admin/:id
 * @access  Private/Admin
 */
const updateAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        res.status(404);
        throw new Error('Announcement not found');
    }

    await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect('/admin/announcements');
});

/**
 * @desc    Delete announcement
 * @route   GET /announcements/admin/delete/:id
 * @access  Private/Admin
 */
const deleteAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        res.status(404);
        throw new Error('Announcement not found');
    }

    await announcement.remove();
    res.redirect('/admin/announcements');
});

module.exports = {
    getAnnouncements,
    getAnnouncementsPage,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
};