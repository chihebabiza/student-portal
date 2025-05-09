const asyncHandler = require('express-async-handler');
const Announcement = require('../models/announcementModel');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const Wishlist = require('../models/wishlistModel');
const { getAnnouncements } = require('./announcementController');
const { getProjects } = require('./projectController');

/**
 * @desc    Render admin dashboard page with stats
 * @route   GET /admin/dashboard
 * @access  Private/Admin
 */
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
            stats: { announcementsCount, projectsCount, studentsCount },
            user: req.user,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).render('error', { message: 'Failed to load dashboard' });
    }
});

/**
 * @desc    Render admin announcements management page
 * @route   GET /admin/announcements
 * @access  Private/Admin
 */
const adminAnnouncements = asyncHandler(async (req, res) => {
    try {
        const announcements = await getAnnouncements();

        res.render('admin/adminAnnouncements', {
            title: 'Manage Announcements',
            announcements,
            user: req.user,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('Error loading announcements:', error);
        res.status(500).render('error', { message: 'Failed to load announcements' });
    }
});

/**
 * @desc    Render admin projects management page
 * @route   GET /admin/projects
 * @access  Private/Admin
 */
const adminProjects = asyncHandler(async (req, res) => {
    try {
        const projects = await getProjects();

        res.render('admin/adminProjects', {
            title: 'Manage Projects',
            projects,
            user: req.user,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        res.status(500).render('error', { message: 'Failed to load projects' });
    }
});

/**
 * @desc    Render admin students management page
 * @route   GET /admin/students
 * @access  Private/Admin
 */
const adminStudents = asyncHandler(async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('-password')
            .sort('-createdAt');

        res.render('admin/adminStudents', {
            title: 'Manage Students',
            students,
            user: req.user,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('Error loading students:', error);
        res.status(500).render('error', { message: 'Failed to load students' });
    }
});

/**
 * @desc    Render student wishlist
 * @route   GET /admin/wishlist/:id
 * @access  Private/Admin
 */
const viewStudentWishlist = asyncHandler(async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await User.findById(studentId).select('name email');

        if (!student) {
            return res.status(404).render('error', {
                title: 'Error',
                message: 'Student not found'
            });
        }

        const wishlist = await Wishlist.findOne({ student: studentId })
            .populate({
                path: 'projects',
                select: 'title description createdAt' // Only populate fields that exist in schema
            });

        res.render('admin/studentWishlist', {
            title: `${student.name}'s Wishlist`,
            wishlist: wishlist || { projects: [] },
            student,
            user: req.user,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('View student wishlist error:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load wishlist'
        });
    }
});

module.exports = {
    adminDashboard,
    adminAnnouncements,
    adminProjects,
    adminStudents,
    viewStudentWishlist
};
