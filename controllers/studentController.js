const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { getProjects } = require('./projectController');

/**
 * @desc    Create a student
 * @route   POST /admin/students
 * @access  Private/Admin
 */
const createStudent = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
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
        res.redirect('/admin/students')
    } else {
        res.status(400);
        throw new Error('Invalid user data');
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

    const updatedStudent = await User.findByIdAndUpdate(
        req.params.id,
        { ...req.body, role: 'student' },
        { new: true }
    ).select('-password');

    res.redirect('/admin/students');
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

    res.redirect('/admin/students');
});

/**
 * @desc    Student dashboard
 * @route   GET /student/dashboard
 * @access  Private/Student
 */
const getDashboard = asyncHandler(async (req, res) => {
    const projects = await getProjects();

    res.render('student/studentProjects', {
        title: 'Student Projects',
        projects,
        user: req.user,
    });
});

module.exports = {
    createStudent,
    updateStudent,
    deleteStudent,
    getDashboard,
};