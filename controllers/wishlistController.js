const Wishlist = require('../models/wishlistModel');
const Project = require('../models/projectModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

/**
 * @desc    Get wishlist page for student
 * @route   GET /student/wishlist
 * @access  Private (Student)
 */
const getWishlist = asyncHandler(async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ student: req.user._id })
            .populate('projects', 'title description');

        const availableProjects = await Project.find({
            _id: { $nin: wishlist?.projects.map(p => p._id) || [] },
            status: 'available'
        }).select('title description');

        res.render('student/studentWishlist', {
            title: 'My Wishlist',
            wishlist: wishlist || { projects: [] },
            availableProjects,
            user: req.user,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('Error loading wishlist:', error);
        res.redirect('/student/wishlist?error=Failed+to+load+wishlist');
    }
});

/**
 * @desc    Add project to wishlist (AJAX)
 * @route   POST /student/wishlist/add
 * @access  Private (Student)
 */
const addProjectToWishlist = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.body;
        const studentId = req.user._id;

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: 'Project ID is required'
            });
        }

        const project = await Project.findOne({
            _id: projectId,
            status: 'available'
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or not available'
            });
        }

        let wishlist = await Wishlist.findOne({ student: studentId });

        if (wishlist) {
            if (wishlist.projects.some(p => p.toString() === projectId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Project already in wishlist'
                });
            }
            wishlist.projects.push(projectId);
        } else {
            wishlist = new Wishlist({
                student: studentId,
                projects: [projectId]
            });
        }

        await wishlist.save();

        res.json({
            success: true,
            message: 'Project added to wishlist'
        });
    } catch (error) {
        console.error('Error adding project to wishlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add project to wishlist'
        });
    }
});

/**
 * @desc    Remove project from wishlist (AJAX)
 * @route   DELETE /student/wishlist/remove/:projectId
 * @access  Private (Student)
 */
const removeProjectFromWishlist = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID format'
            });
        }

        const wishlist = await Wishlist.findOne({ student: req.user._id });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        const projectIdStr = projectId.toString();
        const initialCount = wishlist.projects.length;

        wishlist.projects = wishlist.projects.filter(
            p => p.toString() !== projectIdStr
        );

        if (wishlist.projects.length === initialCount) {
            return res.status(404).json({
                success: false,
                message: 'Project not found in wishlist'
            });
        }

        await wishlist.save();

        res.json({
            success: true,
            message: 'Project removed from wishlist',
            remainingProjects: wishlist.projects.length
        });

    } catch (error) {
        console.error('Error removing project from wishlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove project from wishlist'
        });
    }
});

/**
 * @desc    Clear entire wishlist (AJAX)
 * @route   DELETE /student/wishlist/clear
 * @access  Private (Student)
 */
const clearWishlist = asyncHandler(async (req, res) => {
    try {
        const wishlist = await Wishlist.findOneAndUpdate(
            { student: req.user._id },
            { $set: { projects: [] } },
            { new: true }
        );

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        res.json({
            success: true,
            message: 'Wishlist cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing wishlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear wishlist'
        });
    }
});

module.exports = {
    getWishlist,
    addProjectToWishlist,
    removeProjectFromWishlist,
    clearWishlist
};