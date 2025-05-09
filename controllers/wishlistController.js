const Wishlist = require('../models/wishlistModel');
const Project = require('../models/projectModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Get wishlist page for student
// @route   GET /student/wishlist
// @access  Private (Student)
const getWishlist = asyncHandler(async (req, res) => {
    try {
        // Get student's wishlist with populated projects
        const wishlist = await Wishlist.findOne({ student: req.user._id })
            .populate('projects', 'title description');

        // Get available projects not already in wishlist
        const availableProjects = await Project.find({
            _id: { $nin: wishlist?.projects.map(p => p._id) || [] },
            status: 'available'
        }).select('title description');

        res.render('student/studentWishlist', {
            title: 'My Wishlist',
            wishlist: wishlist || { projects: [] }, // Handle case when no wishlist exists
            availableProjects,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load wishlist'
        });
    }
});

// @desc    Add project to wishlist (AJAX)
// @route   POST /student/wishlist/add
// @access  Private (Student)
const addProjectToWishlist = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.body;
        const studentId = req.user._id;

        // Validate input
        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: 'Project ID is required'
            });
        }

        // Check if project exists and is available
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

        // Find or create wishlist
        let wishlist = await Wishlist.findOne({ student: studentId });

        if (wishlist) {
            // Check for duplicate
            if (wishlist.projects.some(p => p.toString() === projectId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Project already in wishlist'
                });
            }
            wishlist.projects.push(projectId);
        } else {
            // Create new wishlist
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
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error adding to wishlist'
        });
    }
});

const removeProjectFromWishlist = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;

        console.log(`Attempting to remove project ${projectId} from wishlist for student ${req.user._id}`);

        // Validate projectId format
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            console.log('Invalid project ID format:', projectId);
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID format'
            });
        }

        // Find the wishlist and populate projects for debugging
        const wishlist = await Wishlist.findOne({ student: req.user._id })
            .populate('projects', '_id');

        if (!wishlist) {
            console.log('No wishlist found for student:', req.user._id);
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        console.log('Current projects in wishlist:', wishlist.projects.map(p => p._id));

        // Convert both IDs to strings for reliable comparison
        const projectIdStr = projectId.toString();
        const initialCount = wishlist.projects.length;

        // Filter out the project
        wishlist.projects = wishlist.projects.filter(
            p => p._id.toString() !== projectIdStr
        );

        if (wishlist.projects.length === initialCount) {
            console.log(`Project ${projectId} not found in wishlist`);
            return res.status(404).json({
                success: false,
                message: 'Project not found in wishlist'
            });
        }

        await wishlist.save();
        console.log(`Successfully removed project ${projectId}`);

        res.json({
            success: true,
            message: 'Project removed from wishlist',
            remainingProjects: wishlist.projects.length
        });

    } catch (error) {
        console.error('Error in removeProjectFromWishlist:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing from wishlist',
            error: error.message
        });
    }
});

// @desc    Clear entire wishlist
// @route   DELETE /student/wishlist/clear
// @access  Private (Student)
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
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error clearing wishlist'
        });
    }
});

module.exports = {
    getWishlist,
    addProjectToWishlist,
    removeProjectFromWishlist,
    clearWishlist,
};