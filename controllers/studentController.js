const User = require('../models/userModel');
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
        throw new Error('Please include all fields');
    }

    const studentExists = await User.findOne({ email, role: 'student' });
    if (studentExists) {
        res.status(400);
        throw new Error('Student already exists');
    }

    const student = await User.create({ name, email, password, role: 'student' });

    res.redirect('/admin/students');
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