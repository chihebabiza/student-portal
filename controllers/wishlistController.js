const Wishlist = require('../models/wishlistModel');
const asyncHandler = require('express-async-handler');

// @desc    Get wishlist by student ID
// @route   GET /api/wishlists/student/:id
// @access  Private
const getWishlistByStudent = asyncHandler(async (req, res, next) => {
    let studentId;

    // Handle both direct calls (with studentId) and route calls (with req.params.id)
    if (typeof req === 'string') {
        // Called directly with studentId string
        studentId = req;
    } else {
        // Called via route handler
        studentId = req.params.id || req.user._id;
        if (!studentId) {
            res.status(400);
            throw new Error('Student ID not provided');
        }
    }

    const wishlist = await Wishlist.findOne({ student: studentId })
        .populate('student', 'name email')
        .populate('projects', 'title description');

    // If called via route handler, send response
    if (res) {
        res.status(200).json(wishlist || {
            student: studentId,
            projects: [],
            submittedAt: null,
            _id: null
        });
    }
    // Otherwise return the data
    else {
        return wishlist || {
            student: studentId,
            projects: [],
            submittedAt: null,
            _id: null
        };
    }
});

// @desc    Add project to wishlist (create wishlist if not exists)
// @route   POST /api/wishlists
// @access  Private
const addProjectToWishlist = asyncHandler(async (req, res) => {
    const { student, projectId } = req.body;

    if (!student || !projectId) {
        res.status(400);
        throw new Error('Please include student ID and project ID');
    }

    let wishlist = await Wishlist.findOne({ student });

    if (wishlist) {
        // Avoid duplicates
        if (!wishlist.projects.includes(projectId)) {
            wishlist.projects.push(projectId);
            await wishlist.save();
        }
    } else {
        // Create new wishlist
        wishlist = await Wishlist.create({
            student,
            projects: [projectId],
            submittedAt: Date.now()
        });
    }

    const populatedWishlist = await Wishlist.findById(wishlist._id)
        .populate('student', 'name email')
        .populate('projects', 'title description');

    res.status(200).json(populatedWishlist);
});

// @desc    Remove project from wishlist
// @route   DELETE /api/wishlists/:id/projects/:projectId
// @access  Private
const removeProjectFromWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findById(req.params.id);

    if (!wishlist) {
        res.status(404);
        throw new Error('Wishlist not found');
    }

    wishlist.projects = wishlist.projects.filter(
        project => project.toString() !== req.params.projectId
    );

    await wishlist.save();

    res.status(200).json({
        success: true,
        message: 'Project removed from wishlist'
    });
});

module.exports = {
    getWishlistByStudent,
    addProjectToWishlist,
    removeProjectFromWishlist,
};
