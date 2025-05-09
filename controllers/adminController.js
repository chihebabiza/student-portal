const Announcement = require('../models/announcementModel');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const asyncHandler = require('express-async-handler');
const { getAnnouncements } = require('./announcementController');

// @desc    Get announcements page (SSR)
// @route   GET /announcements
// @access  Public
const adminAnnouncements = asyncHandler(async (req, res) => {
    try {
        const announcements = await getAnnouncements();
        res.render('admin/adminAnnouncements', {
            title: 'Manage Announcements',
            announcements,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Failed to load announcements' });
    }
});

// @desc    Get announcements page (SSR)
// @route   GET /announcements
// @access  Public
const adminDashboard = asyncHandler(async (req, res) => {
    try {
        const [announcements, announcementsCount, projectsCount, studentsCount] = await Promise.all([
            Announcement.find().sort('-datetime').limit(5),
            Announcement.countDocuments(),
            Project.countDocuments(),
            User.countDocuments({ role: 'student' })
        ]);

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            announcements,
            stats: {
                announcementsCount,
                projectsCount,
                studentsCount
            },
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Failed to load dashboard' });
    }
});


module.exports = {
    adminAnnouncements,
    adminDashboard
}