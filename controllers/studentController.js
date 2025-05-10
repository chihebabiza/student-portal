const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const Wishlist = require('../models/wishlistModel');
const asyncHandler = require('express-async-handler');
const { getProjects } = require('./projectController');

/**
 * @desc    Create a student
 * @route   POST /admin/students
 * @access  Private/Admin
 */
const createStudent = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.redirect('/admin/students?error=User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'student'
    });

    if (user) {
        return res.redirect('/admin/students?success=Student created successfully');
    } else {
        return res.redirect('/admin/students?error=Invalid user data');
    }
});

/**
 * @desc    Update student
 * @route   PUT /admin/students/:id
 * @access  Private/Admin
 */
const updateStudent = asyncHandler(async (req, res) => {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    if (req.body.role && req.body.role !== 'student') {
        res.status(400);
        throw new Error('Cannot change student role through this endpoint');
    }

    const updateData = { ...req.body, role: 'student' };
    if (!req.body.password || req.body.password.trim() === '') {
        delete updateData.password;
    }

    const updatedStudent = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
    ).select('-password');

    res.redirect('/admin/students/?success=Student updated successfully');
});

/**
 * @desc    Delete student
 * @route   DELETE /admin/students/:id
 * @access  Private/Admin
 */
const deleteStudent = asyncHandler(async (req, res) => {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    await student.remove();

    res.redirect('/admin/students/?success=Student deleted successfully');
});

/**
 * @desc    Student dashboard
 * @route   GET /student/dashboard
 * @access  Private/Student
 */
const getDashboard = asyncHandler(async (req, res) => {
    const projects = await getProjects();

    const wishlist = await Wishlist.findOne({ student: req.user._id }).populate('projects');

    res.render('student/studentProjects', {
        title: 'Student Projects',
        projects,
        user: req.user,
        wishlist: wishlist || { projects: [] },  
    });
});

module.exports = {
    createStudent,
    updateStudent,
    deleteStudent,
    getDashboard,
};