const Announcement = require('../models/announcementModel');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const asyncHandler = require('express-async-handler');
const { getAnnouncements } = require('./announcementController');
const { getProjects } = require('./projectController');

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

// @desc    Get projects page for admin (SSR)
// @route   GET /admin/projects
// @access  Private/Admin
const adminProjects = asyncHandler(async (req, res) => {
    try {
        const projects = await getProjects();
        res.render('admin/adminProjects', {
            title: 'Manage Projects',
            projects,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load projects'
        });
    }
});

// @desc    Get students page for admin (SSR)
// @route   GET /admin/students
// @access  Private/Admin
const adminStudents = asyncHandler(async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('-password') // Exclude sensitive data
            .sort('-createdAt');

        res.render('admin/adminStudents', {
            title: 'Manage Students',
            students,
            user: req.user
        });
    } catch (error) {
        console.error('Admin students page error:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load students'
        });
    }
});


module.exports = {
    adminAnnouncements,
    adminDashboard,
    adminProjects,
    adminStudents,
}