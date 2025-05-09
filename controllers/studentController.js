const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
const getStudents = asyncHandler(async (req, res) => {
    const students = await User.find({ role: 'student' })
        .select('-password') // Exclude password field
        .sort('-createdAt');

    res.status(200).json(students);
});

// @desc    Create a student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please include all fields');
    }

    // Check if user exists
    const studentExists = await User.findOne({ email, role: 'student' });

    if (studentExists) {
        res.status(400);
        throw new Error('Student already exists');
    }

    const student = await User.create({
        name,
        email,
        password,
        role: 'student'
    });

    if (student) {
        res.status(201).json({
            _id: student._id,
            name: student.name,
            email: student.email,
            role: student.role,
            createdAt: student.createdAt
        });
    } else {
        res.status(400);
        throw new Error('Invalid student data');
    }
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = asyncHandler(async (req, res) => {
    const student = await User.findOne({
        _id: req.params.id,
        role: 'student'
    });

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    // Prevent changing role to admin through this route
    if (req.body.role && req.body.role !== 'student') {
        res.status(400);
        throw new Error('Cannot change student role through this endpoint');
    }

    const updatedStudent = await User.findByIdAndUpdate(
        req.params.id,
        { ...req.body, role: 'student' }, // Ensure role remains student
        { new: true }
    ).select('-password');

    res.status(200).json(updatedStudent);
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
    const student = await User.findOne({
        _id: req.params.id,
        role: 'student'
    });

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    await student.remove();

    res.status(200).json({
        success: true,
        message: 'Student removed'
    });
});

module.exports = {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
};