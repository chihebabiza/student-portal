const Announcement = require('../models/announcementModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all announcements (Reusable function)
// @access  Public
const getAnnouncements = async (filter = {}) => {
    return await Announcement.find(filter).sort('-datetime');
};

// @desc    Get announcements page (SSR)
// @route   GET /announcements
// @access  Public
const getAnnouncementsPage = asyncHandler(async (req, res) => {
    try {
        const { filter } = req.query;
        const allowedFilters = ['general', 'computer_science', 'math', 'physics', 'chemistry'];
        const query = filter && allowedFilters.includes(filter) ? { display: filter } : {};

        const announcements = await getAnnouncements(query);

        res.render('index', {
            title: 'Announcements',
            announcements,
            filter: filter,
            user: req.user || null
        });
    } catch (error) {
        console.error('Announcements page error:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load announcements'
        });
    }
});

// @desc    Create new announcement (SSR form)
// @route   GET /announcements/new
// @access  Private/Admin
const getNewAnnouncementPage = (req, res) => {
    res.render('announcements/new', {
        title: 'Create Announcement',
        user: req.user
    });
};

// @desc    Create new announcement (SSR form)
// @route   GET /announcements/new
// @access  Private/Admin
const getUpdateAnnouncementPage = (req, res) => {
    res.render('announcements/new', {
        title: 'Update Announcement',
        user: req.user
    });
};

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = asyncHandler(async (req, res) => {
    const { title, content, display } = req.body;

    if (!title || !content || !display) {
        res.status(400);
        throw new Error('Please include all fields');
    }

    const announcement = await Announcement.create({
        title,
        content,
        display,
        datetime: new Date()
    });

    res.status(201).json(announcement);
});

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
const updateAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        res.status(404);
        throw new Error('Announcement not found');
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedAnnouncement);
});

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        res.status(404);
        throw new Error('Announcement not found');
    }

    await announcement.remove();
    res.status(200).json({ success: true });
});

module.exports = {
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getNewAnnouncementPage,
    getUpdateAnnouncementPage,
    getAnnouncementsPage,
};