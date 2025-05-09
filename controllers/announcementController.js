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
    try {
        const { filter } = req.query;
        const allowedFilters = ['general', 'computer_science', 'math', 'physics', 'chemistry'];

        const query = filter && allowedFilters.includes(filter) ? { display: filter } : {};
        const announcements = await getAnnouncements(query);

        res.render('index', {
            title: 'Announcements',
            announcements,
            filter,
            user: req.user || null,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('Error loading announcements:', error);
        res.status(500).render('error', { message: 'Failed to load announcements' });
    }
});

/**
 * @desc    Create new announcement
 * @route   POST /announcements/admin
 * @access  Private/Admin
 */
const createAnnouncement = asyncHandler(async (req, res) => {
    try {
        const { title, content, display } = req.body;

        if (!title || !content || !display) {
            return res.redirect('/admin/announcements?error=Please+include+all+fields');
        }

        await Announcement.create({
            title,
            content,
            display,
            datetime: new Date()
        });

        res.redirect('/admin/announcements?success=Announcement+created+successfully');
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.redirect('/admin/announcements?error=Failed+to+create+announcement');
    }
});

/**
 * @desc    Update announcement
 * @route   POST /announcements/admin/:id
 * @access  Private/Admin
 */
const updateAnnouncement = asyncHandler(async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.redirect('/admin/announcements?error=Announcement+not+found');
        }

        await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.redirect('/admin/announcements?success=Announcement+updated+successfully');
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.redirect('/admin/announcements?error=Failed+to+update+announcement');
    }
});

/**
 * @desc    Delete announcement
 * @route   GET /announcements/admin/delete/:id
 * @access  Private/Admin
 */
const deleteAnnouncement = asyncHandler(async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.redirect('/admin/announcements?error=Announcement+not+found');
        }

        await announcement.remove();
        res.redirect('/admin/announcements?success=Announcement+deleted+successfully');
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.redirect('/admin/announcements?error=Failed+to+delete+announcement');
    }
});

/**
 * @desc    404 page
 * @route   GET /*
 * @access  Public
 */
const get404Page = asyncHandler(async (req, res) => {
    res.render('404', {
        title: '404',
        user: req.user || null
    });
});

module.exports = {
    getAnnouncements,
    getAnnouncementsPage,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    get404Page,
};